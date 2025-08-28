import logger from "@/utils/logger";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { LRUCache } from "lru-cache";
import { z } from "zod";

/**
 * Configuration for the CarQuery API module
 * Values are loaded from environment variables with defaults
 */
const config = {
  cache: {
    maxSize: parseInt(process.env.CARQUERY_CACHE_MAX_SIZE || '100'),
    defaultTtl: parseInt(process.env.CARQUERY_CACHE_TTL || '86400000') // 24 hours
  },
  rateLimit: {
    global: {
      maxRequests: parseInt(process.env.CARQUERY_RATE_LIMIT_MAX || '50'),
      window: parseInt(process.env.CARQUERY_RATE_LIMIT_WINDOW || '60000') // 1 minute
    },
    perUser: {
      maxRequests: parseInt(process.env.CARQUERY_USER_RATE_LIMIT_MAX || '20'),
      window: parseInt(process.env.CARQUERY_USER_RATE_LIMIT_WINDOW || '60000') // 1 minute
    }
  },
  retry: {
    maxRetries: parseInt(process.env.CARQUERY_MAX_RETRIES || '3'),
    initialDelay: parseInt(process.env.CARQUERY_RETRY_INITIAL_DELAY || '1000'),
    maxDelay: parseInt(process.env.CARQUERY_RETRY_MAX_DELAY || '10000')
  },
  api: {
    baseUrl: process.env.CARQUERY_API_URL || 'https://www.carqueryapi.com/api/0.3/',
    timeout: parseInt(process.env.CARQUERY_API_TIMEOUT || '10000'),
    userAgent: process.env.CARQUERY_USER_AGENT || 'CarsiqAi/1.0'
  }
};

// Validate configuration
(function validateConfig() {
  if (config.cache.maxSize <= 0) config.cache.maxSize = 100;
  if (config.cache.defaultTtl <= 0) config.cache.defaultTtl = 86400000;
  
  if (config.rateLimit.global.maxRequests <= 0) config.rateLimit.global.maxRequests = 50;
  if (config.rateLimit.global.window <= 0) config.rateLimit.global.window = 60000;
  
  if (config.rateLimit.perUser.maxRequests <= 0) config.rateLimit.perUser.maxRequests = 20;
  if (config.rateLimit.perUser.window <= 0) config.rateLimit.perUser.window = 60000;
  
  if (config.retry.maxRetries < 0) config.retry.maxRetries = 3;
  if (config.retry.initialDelay <= 0) config.retry.initialDelay = 1000;
  if (config.retry.maxDelay <= 0) config.retry.maxDelay = 10000;
  
  if (config.api.timeout <= 0) config.api.timeout = 10000;
})();

/**
 * Custom error class for CarQuery API operations
 */
class CarQueryError extends Error {
  constructor(message: string, public code: string, public statusCode?: number) {
    super(message);
    this.name = 'CarQueryError';
  }
}

interface CarQueryTrim {
  model_id: string;
  model_trim: string;
  model_engine_cc: string;
  model_engine_fuel: string;
  model_fuel_cap_l: string;
  model_year: string;
  model_engine_power_ps: string;
  model_transmission_type?: string;
  model_engine_torque_nm?: string;
  model_engine_position?: string;
  model_engine_type?: string;
  model_make_display?: string;
  model_display?: string;
  // Additional fields for oil recommendations
  model_engine_compression?: string;
  model_weight_kg?: string;
  model_lkm_city?: string;
  model_lkm_hwy?: string;
  model_drive?: string;
  model_engine_oil?: string;
}

interface CarQueryResponse {
  Trims: CarQueryTrim[];
}

// LRU Cache for API results to reduce redundant requests
const carQueryCache = new LRUCache<string, any>({
  max: config.cache.maxSize, 
  ttl: config.cache.defaultTtl,
  allowStale: false,
  updateAgeOnGet: true,
});

// Rate limiting configuration
const rateLimiter = {
  maxRequests: config.rateLimit.global.maxRequests,
  timeWindow: config.rateLimit.global.window,
  requestCount: 0, // Current request count
  windowStart: Date.now(), // Start of the current time window
  queue: [] as { resolve: Function, reject: Function }[],
  processing: false
};

// Per-user rate limiting
const userRateLimits = new Map<string, { count: number; reset: number }>();

/**
 * Checks if a user has exceeded their rate limit
 * @param userId User identifier (can be IP address or actual user ID)
 * @returns Whether the request can proceed (true) or is rate limited (false)
 */
function checkUserRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = userRateLimits.get(userId);
  
  // If no limit exists or the time window has passed, initialize or reset
  if (!userLimit || now > userLimit.reset) {
    userRateLimits.set(userId, { 
      count: 1, 
      reset: now + 60000 // 1 minute window
    });
    return true;
  }
  
  // If user exceeds limit, reject the request
  if (userLimit.count >= 20) { // 20 requests per minute per user
    logger.warn(`Rate limit exceeded for user: ${userId}`);
    return false;
  }
  
  // Increment count and allow
  userLimit.count++;
  return true;
}

/**
 * Cleans up expired user rate limits to prevent memory leaks
 */
function cleanupUserRateLimits(): void {
  const now = Date.now();
  // Use Array.from to avoid iterator compatibility issues
  Array.from(userRateLimits.entries()).forEach(([userId, limit]) => {
    if (now > limit.reset) {
      userRateLimits.delete(userId);
    }
  });
}

// Run cleanup periodically
setInterval(cleanupUserRateLimits, 60000); // Clean up every minute

// Retry configuration
const retryConfig = {
  maxRetries: config.retry.maxRetries,
  initialDelay: config.retry.initialDelay,
  maxDelay: config.retry.maxDelay
};

// Input validation schemas
const CarQueryInputSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().nullable().optional()
});

const MakeInputSchema = z.object({
  make: z.string().min(1, "Make is required"),
  year: z.string().optional()
});

const YearInputSchema = z.object({
  year: z.string().optional()
});

// Enhanced metrics tracking with more detailed information
interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalResponseTime: number;
  cacheHits: number;
  cacheMisses: number;
  normalizationSuccesses: number;
  normalizationFailures: number;
  errorsByType: Record<string, number>;
  rateLimit: {
    blocked: number;
    queued: number;
  };
  lastReset: Date;
}

// Class for tracking response time percentiles
class ResponseTimeTracker {
  private times: number[] = [];
  private maxSamples: number = 1000;
  
  /**
   * Record a new response time
   * @param time Response time in milliseconds
   */
  record(time: number): void {
    this.times.push(time);
    if (this.times.length > this.maxSamples) {
      this.times = this.times.slice(-this.maxSamples); // Keep last 1000
    }
  }
  
  /**
   * Get percentile values from recorded times
   * @returns Object with p50, p95, p99 percentiles
   */
  getPercentiles(): { p50: number; p95: number; p99: number } {
    if (this.times.length === 0) {
      return { p50: 0, p95: 0, p99: 0 };
    }
    
    const sorted = [...this.times].sort((a, b) => a - b);
    return {
      p50: sorted[Math.floor(sorted.length * 0.5)] || 0,
      p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
      p99: sorted[Math.floor(sorted.length * 0.99)] || 0
    };
  }
  
  /**
   * Get the average response time
   * @returns Average response time in milliseconds
   */
  getAverage(): number {
    if (this.times.length === 0) return 0;
    const sum = this.times.reduce((acc, time) => acc + time, 0);
    return Math.round(sum / this.times.length);
  }
  
  /**
   * Clear recorded times
   */
  clear(): void {
    this.times = [];
  }
}

// Initialize response time tracker
const responseTimeTracker = new ResponseTimeTracker();

// Initialize metrics
const metrics: ApiMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  totalResponseTime: 0,
  cacheHits: 0,
  cacheMisses: 0,
  normalizationSuccesses: 0,
  normalizationFailures: 0,
  errorsByType: {},
  rateLimit: {
    blocked: 0,
    queued: 0
  },
  lastReset: new Date()
};

// Enhanced cache configuration for different types of data
interface CacheConfig {
  ttl: number;
  priority: 'high' | 'medium' | 'low';
}

const cacheConfigs: Record<string, CacheConfig> = {
  'normalize': { ttl: 1000 * 60 * 60 * 24 * 7, priority: 'high' }, // 7 days
  'models': { ttl: 1000 * 60 * 60 * 12, priority: 'medium' }, // 12 hours
  'available': { ttl: 1000 * 60 * 60 * 24, priority: 'medium' }, // 24 hours
  'makes': { ttl: 1000 * 60 * 60 * 24 * 3, priority: 'medium' }, // 3 days
  'image': { ttl: 1000 * 60 * 60 * 24 * 30, priority: 'low' } // 30 days
};

/**
 * Gets appropriate TTL for a specific cache key type
 * @param key Cache key
 * @returns TTL value in milliseconds
 */
function getCacheTTL(key: string): number {
  // Determine key type from prefix
  const keyType = key.split(':')[0];
  
  // Return appropriate TTL based on key type
  return (keyType && cacheConfigs[keyType]?.ttl) || 
         1000 * 60 * 60 * 24; // Default 24 hours
}

/**
 * Warms up the cache with popular car models
 * This helps reduce API load and improve response times
 * @returns Promise that resolves when warming is complete
 */
export async function warmCache(): Promise<void> {
  logger.info("Starting cache warming process");
  
  try {
    // List of popular models to pre-cache
    const popularModels = [
      { make: 'toyota', model: 'camry', year: '2024' },
      { make: 'toyota', model: 'corolla', year: '2024' },
      { make: 'honda', model: 'accord', year: '2024' },
      { make: 'honda', model: 'civic', year: '2024' },
      { make: 'hyundai', model: 'elantra', year: '2024' },
      { make: 'hyundai', model: 'tucson', year: '2024' },
      { make: 'kia', model: 'k5', year: '2024' },
      { make: 'kia', model: 'sportage', year: '2024' },
      { make: 'jeep', model: 'compass', year: '2024' },
      { make: 'jeep', model: 'grand cherokee', year: '2024' }
    ];
    
    // Warm up car models data
    await getMultipleCarModels(popularModels);
    
    // Get all popular makes
    await getAvailableMakes('2024');
    
    logger.info("Cache warming completed successfully");
  } catch (error) {
    logger.error("Error during cache warming", { error });
  }
}

/**
 * Cleanup function to prevent memory leaks and release resources
 */
export function cleanup(): void {
  carQueryCache.clear();
  rateLimiter.queue.forEach(({ reject }) => 
    reject(new Error('Service shutting down'))
  );
  rateLimiter.queue = [];
  logger.info("CarQueryApi resources cleaned up");
}

/**
 * Records a metric for API monitoring
 * @param metricName Name of the metric to update
 * @param value Value to add (default: 1)
 */
function recordMetric(metricName: keyof Omit<ApiMetrics, 'errorsByType' | 'rateLimit' | 'lastReset'>, value: number = 1): void {
  if (metricName in metrics && typeof metrics[metricName] === 'number') {
    (metrics[metricName] as number) += value;
  }
}

/**
 * Records an error by type for monitoring
 * @param errorType Type of error
 */
function recordErrorByType(errorType: string): void {
  if (!metrics.errorsByType[errorType]) {
    metrics.errorsByType[errorType] = 0;
  }
  metrics.errorsByType[errorType]++;
}

/**
 * Gets current API metrics with percentiles
 * @returns Enhanced metrics with calculated values
 */
export function getApiMetrics(): ApiMetrics & { 
  responseTimePercentiles: { p50: number; p95: number; p99: number };
  averageResponseTime: number;
  cacheEfficiency: number;
  uptime: number;
} {
  const baseMetrics = { ...metrics };
  const percentiles = responseTimeTracker.getPercentiles();
  const avgTime = responseTimeTracker.getAverage();
  
  // Calculate cache efficiency
  const totalCacheOperations = baseMetrics.cacheHits + baseMetrics.cacheMisses;
  const cacheEfficiency = totalCacheOperations > 0 
    ? (baseMetrics.cacheHits / totalCacheOperations) * 100 
    : 0;
    
  // Calculate uptime in seconds
  const uptime = (Date.now() - metrics.lastReset.getTime()) / 1000;
  
  return {
    ...baseMetrics,
    responseTimePercentiles: percentiles,
    averageResponseTime: avgTime,
    cacheEfficiency: Math.round(cacheEfficiency * 100) / 100,
    uptime
  };
}

/**
 * Resets API metrics
 */
export function resetApiMetrics(): void {
  Object.keys(metrics).forEach(key => {
    if (key === 'errorsByType') {
      metrics.errorsByType = {};
    } else if (key === 'rateLimit') {
      metrics.rateLimit = { blocked: 0, queued: 0 };
    } else if (key !== 'lastReset') {
      (metrics as any)[key] = 0;
    }
  });
  
  metrics.lastReset = new Date();
  responseTimeTracker.clear();
  logger.info("API metrics reset completed");
}

/**
 * Implements rate limiting for API calls
 * @returns Promise that resolves when the request can proceed
 */
async function acquireRateLimit(): Promise<void> {
  // Reset rate limiter if time window has passed
  const now = Date.now();
  if (now - rateLimiter.windowStart > rateLimiter.timeWindow) {
    rateLimiter.requestCount = 0;
    rateLimiter.windowStart = now;
  }

  // If under rate limit, allow request immediately
  if (rateLimiter.requestCount < rateLimiter.maxRequests) {
    rateLimiter.requestCount++;
    return Promise.resolve();
  }

  // Otherwise, queue the request
  return new Promise((resolve, reject) => {
    rateLimiter.queue.push({ resolve, reject });
    
    // Process queue if not already processing
    if (!rateLimiter.processing) {
      processRateLimitQueue();
    }
  });
}

/**
 * Processes the rate limit queue
 */
function processRateLimitQueue() {
  if (rateLimiter.queue.length === 0) {
    rateLimiter.processing = false;
    return;
  }

  rateLimiter.processing = true;
  
  // Wait until the next time window
  const timeToNextWindow = rateLimiter.timeWindow - (Date.now() - rateLimiter.windowStart);
  
  setTimeout(() => {
    // Reset for new time window
    rateLimiter.requestCount = 0;
    rateLimiter.windowStart = Date.now();
    
    // Process queued requests (up to the limit)
    const requestsToProcess = Math.min(rateLimiter.queue.length, rateLimiter.maxRequests);
    
    for (let i = 0; i < requestsToProcess; i++) {
      const request = rateLimiter.queue.shift();
      rateLimiter.requestCount++;
      request?.resolve();
    }
    
    // Continue processing if there are more requests
    if (rateLimiter.queue.length > 0) {
      processRateLimitQueue();
    } else {
      rateLimiter.processing = false;
    }
  }, Math.max(timeToNextWindow, 100)); // Ensure minimum delay
}

/**
 * Performs a fetch with retry logic using exponential backoff
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise with the fetch response
 */
async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
  let retries = 0;
  let lastError: Error | null = null;
  
  while (retries <= retryConfig.maxRetries) {
    // Create AbortController for this request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);
    
    try {
      // Wait for rate limit slot before making request
      await acquireRateLimit();
      
      // Make the request with timeout
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      // Clear the timeout as soon as we get a response
      clearTimeout(timeoutId);
      
      // If successful, return response
      if (response.ok) {
        return response;
      }
      
      // If rate limited (429) or server error (5xx), retry
      if (response.status === 429 || response.status >= 500) {
        throw new CarQueryError(
          `API returned status ${response.status}`,
          'SERVER_ERROR',
          response.status
        );
      }
      
      // For other error codes, don't retry
      return response;
      
    } catch (error: any) {
      // Clear timeout in case of error
      clearTimeout(timeoutId);
      lastError = error;
      
      // Convert to CarQueryError if it's not already
      if (!(error instanceof CarQueryError)) {
        if (error.name === 'AbortError') {
          lastError = new CarQueryError('Request timeout exceeded', 'TIMEOUT');
        } else {
          lastError = new CarQueryError(
            `Fetch error: ${error.message}`, 
            'NETWORK_ERROR'
          );
        }
      }
      
      // Don't retry if it's not a retryable error
      const isRetryable = error.name === 'AbortError' || 
                         error.message.includes('API returned status') ||
                         error.message.includes('network');
                         
      if (!isRetryable) {
        throw lastError;
      }
      
      // If max retries reached, throw the error
      if (retries >= retryConfig.maxRetries) {
        logger.error("Max retries reached for API call", { 
          url, 
          retries, 
          errorCode: lastError instanceof CarQueryError ? lastError.code : 'UNKNOWN',
          error: lastError ? lastError.message : 'Unknown error' 
        });
        throw lastError || new CarQueryError("Max retries reached", "MAX_RETRIES");
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        retryConfig.initialDelay * Math.pow(2, retries) * (0.5 + Math.random() * 0.5),
        retryConfig.maxDelay
      );
      
      logger.warn(`Retrying API call (${retries + 1}/${retryConfig.maxRetries}) after ${delay}ms`, { url });
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
  
  // This should never happen, but TypeScript needs it
  throw lastError || new CarQueryError("Unknown error in fetchWithRetry", "UNKNOWN_ERROR");
}

/**
 * Normalizes user input to a standardized car query format using AI
 * @param input User's car input in any format (Arabic, misspelled, etc.)
 * @returns Standardized car data with make, model, year
 */
export async function normalizeArabicCarInput(
  input: string
): Promise<{ make: string; model: string; year: string | null; confidence: number }> {
  // Validate input
  if (!input || (input?.trim?.() || '').length < 2) {
    logger.warn("Input too short for normalization", { input });
    return { make: "", model: "", year: null, confidence: 0 };
  }
  
  // Create cache key
  const cacheKey = `normalize:${(input?.toLowerCase?.()?.trim?.()) || ''}`;
  
  // Use trackApiPerformance to monitor this operation
  return trackApiPerformance(
    async () => {
      try {
        // Check cache first
        const cached = carQueryCache.get(cacheKey);
        if (cached) {
          logger.debug("Using cached normalization result", { input: input.length });
          return cached;
        }

        // First sanitize the input
        const sanitizedInput = sanitizeInput(input);
        
        // Use the OpenRouter integration
        const openAI = createOpenAI({
          apiKey: process.env.OPENROUTER_API_KEY || "",
          baseURL: "https://openrouter.ai/api/v1",
          headers: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "X-Title": "Car Service Chat - Enhanced",
          },
        });
        
        const prompt = `
You are a car data extraction expert. Extract make, model, and year from: "${sanitizedInput}"

Context: This is for Iraqi car market. Common brands include Toyota, Hyundai, Kia, Jeep, etc.

Special cases:
- "جيب كومباس" = "Jeep Compass"
- "جيب لاريدو" = "Jeep Grand Cherokee Laredo"
- "جيب شيروكي" = "Jeep Cherokee"
- "جيب رانجلر" = "Jeep Wrangler"
- "جيب" = "Jeep"
- "كرايسلر c300" = "Chrysler 300"
- "كرايسلر ٣٠٠" = "Chrysler 300"
- "كرايسلر سي ٣٠٠" = "Chrysler 300"
- "كرايسلر" = "Chrysler"
- Handle Arabic numerals: ٢٠٢٠ = 2020, ٣٠٠ = 300

Confidence scoring:
- 90-100: Exact match with known model
- 70-89: Good match with minor variations
- 50-69: Partial match or spelling variations
- Below 50: Uncertain match

Return JSON only: {"make": "string", "model": "string", "year": "string|null", "confidence": number}
`;

        logger.debug("Sending car data normalization request to OpenRouter", {
          inputLength: input.length,
        });

        try {
          // Try with streamText first
          const result = await streamText({
            model: openAI("anthropic/claude-3-haiku"),
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1, // Lower temperature for more deterministic results
            maxTokens: 300,
          });
          
          const textContent = await result.toString();
          logger.debug("AI response received", { responseLength: textContent.length });
          
          // Try to extract JSON using multiple patterns
          let extractedJson: string | null = null;
          
          // Try standard JSON pattern
          const jsonMatch = textContent.match(/\{[\s\S]*?\}/);
          if (jsonMatch) {
            extractedJson = jsonMatch[0];
          }
          
          // If no JSON found, try fallback extraction
          if (!extractedJson) {
            // Try to find make, model, year and confidence lines separately
            const makeMatch = textContent.match(/make["']?\s*:["']?\s*["']?([^"',}\s]+)/i);
            const modelMatch = textContent.match(/model["']?\s*:["']?\s*["']?([^"',}\s]+)/i);
            const yearMatch = textContent.match(/year["']?\s*:["']?\s*["']?([^"',}\s]+)/i);
            const confidenceMatch = textContent.match(/confidence["']?\s*:["']?\s*(\d+)/i);
            
            if (makeMatch || modelMatch || yearMatch) {
              // Construct a JSON object
              const make = makeMatch ? makeMatch[1].toLowerCase() : "";
              const model = modelMatch ? modelMatch[1].toLowerCase() : "";
              const year = yearMatch ? yearMatch[1] : "";
              const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 70;
              
              extractedJson = JSON.stringify({ make, model, year, confidence });
              logger.debug("Constructed JSON from partial matches", { make, model, year, confidence });
            }
          }
          
          if (extractedJson) {
            try {
              const parsedData = JSON.parse(extractedJson);
              
              // Special case handling for Jeep Compass
              if (input.toLowerCase().includes("جيب كومباس") || 
                  input.toLowerCase().includes("jeep compass")) {
                parsedData.make = "jeep";
                parsedData.model = "compass";
                parsedData.confidence = 95;
              }
              
              const normalizedData = {
                make: parsedData.make?.toLowerCase?.()?.trim?.() || "",
                model: parsedData.model?.toLowerCase?.()?.trim?.() || "",
                year: parsedData.year ? (parsedData.year?.trim?.() || parsedData.year) : null,
                confidence: parsedData.confidence || 80
              };
              
              logger.info("Successfully normalized car input", {
                originalInput: input,
                normalizedData,
              });
              
              // Store in cache
              carQueryCache.set(cacheKey, normalizedData);
              
              // Record successful normalization
              recordMetric('normalizationSuccesses');
              
              return normalizedData;
            } catch (parseError) {
              logger.error("Failed to parse extracted JSON", { extractedJson, error: parseError });
              recordMetric('normalizationFailures');
            }
          }
        } catch (aiError) {
          logger.error("Error getting AI response", { error: aiError });
          recordMetric('normalizationFailures');
        }
        
        // If we reach this point, AI processing failed, use fallback
        logger.info("Using fallback extraction method for car data");
        const fallbackResult = extractCarBasicInfo(input);
        
        // Store fallback result in cache too
        carQueryCache.set(cacheKey, fallbackResult);
        
        return fallbackResult;
      } catch (error) {
        logger.error("Error normalizing car input", { input, error });
        return extractCarBasicInfo(input);
      }
    },
    { cacheKey, operation: 'normalizeArabicCarInput' }
  );
}

/**
 * Simple fallback extraction of car info from user input without AI
 */
function extractCarBasicInfo(
  input: string
): { make: string; model: string; year: string | null; confidence: number } {
  const lowercaseInput = input.toLowerCase();
  
  // Basic brand detection
  let make = "";
  let confidence = 40; // Base confidence for fallback method
  
  // Enhanced brand mappings with more brands and variations
  const brandMappings: Record<string, string[]> = {
    'toyota': ['تويوتا', 'toyota', 'تويتا'],
    'hyundai': ['هيونداي', 'هيوندا', 'hyundai', 'هيونداى', 'هونداي'],
    'kia': ['كيا', 'kia'],
    'nissan': ['نيسان', 'nissan', 'نيسن'],
    'honda': ['هوندا', 'honda'],
    'mercedes': ['مرسيدس', 'mercedes', 'بنز', 'مرسدس', 'mercedes-benz', 'مرسيدس بنز'],
    'bmw': ['بي ام دبليو', 'bmw', 'بمو', 'بي ام'],
    'lexus': ['لكزس', 'lexus'],
    'genesis': ['جينيسيس', 'genesis', 'جنسس'],
    'volkswagen': ['فولكس واجن', 'فولكسفاجن', 'volkswagen', 'vw', 'فلكس'],
    'audi': ['اودي', 'audi', 'أودي'],
    'mazda': ['مازدا', 'mazda'],
    'mitsubishi': ['ميتسوبيشي', 'mitsubishi', 'متسوبيشي'],
    'chevrolet': ['شيفروليت', 'chevrolet', 'شيفروليه', 'شفر', 'شيفي'],
    'ford': ['فورد', 'ford'],
    'jeep': ['جيب', 'jeep', 'جب', 'جيـب', 'جيـــب', 'جييب'] // Enhanced Jeep variations
  };
  
  for (const [brandKey, variations] of Object.entries(brandMappings)) {
    for (const variation of variations) {
      if (lowercaseInput.includes(variation)) {
        make = brandKey;
        confidence += 15;
        break;
      }
    }
    if (make) break;
  }
  
  // Enhanced model detection with more models and variations
  let model = "";
  const modelMappings: Record<string, string[]> = {
    'camry': ['كامري', 'camry', 'كمري'],
    'corolla': ['كورولا', 'corolla', 'كرولا'],
    'rav4': ['راف4', 'راف 4', 'rav4', 'rav 4'],
    'elantra': ['النترا', 'elantra', 'النتره', 'النتراء'],
    'sonata': ['سوناتا', 'sonata'],
    'tucson': ['توسان', 'توسون', 'tucson'],
    'santa fe': ['سنتافي', 'سنتا في', 'santa fe'],
    'cerato': ['سيراتو', 'cerato'],
    'optima': ['أوبتيما', 'اوبتيما', 'optima'],
    'sportage': ['سبورتاج', 'سبورتج', 'sportage'],
    'sunny': ['صني', 'sunny'],
    'altima': ['التيما', 'altima'],
    'civic': ['سيفيك', 'civic'],
    'accord': ['اكورد', 'accord'],
    'crv': ['سي ار في', 'crv', 'cr-v'],
    'land cruiser': ['لاند كروزر', 'لاندكروزر', 'land cruiser'],
    'prado': ['برادو', 'prado'],
    // Enhanced Jeep model detection with more variations
    'compass': ['كومباس', 'compass', 'كمباس', 'كومبس', 'كمبس', 'كومباص'],
    'grand cherokee': ['جراند شيروكي', 'grand cherokee', 'جراند شروكي', 'جرند شيروكي', 'لاريدو', 'laredo'],
    'cherokee': ['شيروكي', 'cherokee', 'شروكي', 'شيروكى'],
    'wrangler': ['رانجلر', 'رانقلر', 'wrangler', 'رانجلار'],
    'renegade': ['رينيجيد', 'renegade', 'رينجيد']
  };
  
  for (const [modelKey, variations] of Object.entries(modelMappings)) {
    for (const variation of variations) {
      if (lowercaseInput.includes(variation)) {
        model = modelKey;
        confidence += 15;
        break;
      }
    }
    if (model) break;
  }
  
  // Special case for Jeep Compass - look for the combination
  if (make === "jeep" && !model) {
    // If "compass" wasn't directly found but we have Jeep and some similar text
    const compassPatterns = ['كومب', 'كمب', 'comp'];
    for (const pattern of compassPatterns) {
      if (lowercaseInput.includes(pattern)) {
        model = 'compass';
        confidence += 10; // Lower confidence since it's a partial match
        break;
      }
    }
  }
  
  // Special case for Jeep Grand Cherokee (Laredo) - look for the combination
  if (make === "jeep" && !model) {
    // If "grand cherokee" or "laredo" wasn't directly found but we have Jeep and some similar text
    const grandCherokeePatterns = ['جراند', 'grand', 'لاريد', 'laredo'];
    for (const pattern of grandCherokeePatterns) {
      if (lowercaseInput.includes(pattern)) {
        model = 'grand cherokee';
        confidence += 10; // Lower confidence since it's a partial match
        break;
      }
    }
  }
  
  // Enhanced year extraction with improved patterns for Arabic text
  // Look for 4-digit years (1980-2029) in various formats
  const yearPatterns = [
    // Standard year format (2020, 1999, etc.)
    /\b(20[0-2][0-9]|19[8-9][0-9])\b/g,
    
    // Arabic text with year (موديل 2020, سنة 2018, etc.)
    /موديل\s+(\d{4})/i,
    /سنة\s+(\d{4})/i,
    /عام\s+(\d{4})/i,
    /ماركة\s+(\d{4})/i,
    
    // Year followed by descriptive text
    /(\d{4})\s+model/i,
    /(\d{4})\s+موديل/i,
    
    // Year with Arabic digits (٢٠٢٠)
    /[\u0660-\u0669]{4}/g,
  ];
  
  let year: string | null = null;
  let maxConfidence = 0;
  
  // Try each pattern and keep the result with highest confidence
  for (const pattern of yearPatterns) {
    const matches = lowercaseInput.match(pattern);
    if (matches && matches.length > 0) {
      for (const match of matches) {
        // Extract the year from the match
        const extractedYear = match.match(/\d{4}/) ? 
                             match.match(/\d{4}/)![0] : 
                             convertArabicDigitsToEnglish(match);
        
        // Validate the year is within reasonable range
        const yearNum = parseInt(extractedYear);
        if (yearNum >= 1980 && yearNum <= new Date().getFullYear() + 1) {
          // Calculate confidence based on position in text and format
          const positionInText = lowercaseInput.indexOf(match) / lowercaseInput.length;
          const patternConfidence = 15 + (positionInText < 0.5 ? 5 : 0);
          
          if (patternConfidence > maxConfidence) {
            year = extractedYear;
            maxConfidence = patternConfidence;
          }
        }
      }
    }
  }
  
  // Add the year confidence to total confidence
  if (year) {
    confidence += maxConfidence;
    logger.debug("Extracted year from text", { year, confidence: maxConfidence });
  }
  
  if (make && model) {
    confidence += 15; // Bonus for having both make and model
  }
  
  return { make, model, year, confidence };
}

/**
 * Sanitizes user input to prevent security issues
 * @param input User input string
 * @returns Sanitized string
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/[^\u0600-\u06FF\u0750-\u077F\w\s\-\.]/g, '') // Allow Arabic, English, numbers, spaces, hyphens, dots
    ?.trim?.() || ''
    .substring(0, 200); // Limit length
}

/**
 * Normalizes Arabic text for better matching
 * @param text Arabic text
 * @returns Normalized text
 */
function normalizeArabicText(text: string): string {
  return text
    // Normalize Arabic letters
    .replace(/[أإآا]/g, 'ا')
    .replace(/[ىي]/g, 'ي')
    .replace(/ة/g, 'ه')
    // Remove diacritics
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    ?.trim?.() || '';
}

/**
 * Enhanced Arabic number conversion with full mapping
 */
const arabicToEnglishDigits: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
};

/**
 * Convert Arabic/Persian numbers to English numbers more comprehensively
 * @param str String containing Arabic/Persian numbers
 * @returns String with converted numbers
 */
function convertArabicDigitsToEnglish(str: string): string {
  return str.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, match => 
    arabicToEnglishDigits[match] || match
  );
}

/**
 * Gets car models from CarQuery API
 * @param make Car manufacturer
 * @param model Car model
 * @param year Car year
 * @returns Array of car trims with specifications
 */
export async function getCarModels(make: string, model: string, year?: string | null): Promise<CarQueryTrim[]> {
  // Validate inputs
  const validationResult = CarQueryInputSchema.safeParse({ make, model, year });
  if (!validationResult.success) {
    logger.error("Invalid input for getCarModels", { 
      errors: validationResult.error.errors,
      make,
      model,
      year
    });
    return [];
  }
  
  // Create cache key
  const cacheKey = `models:${make}:${model}:${year || ''}`;
  
  // Use trackApiPerformance to monitor this operation
  return trackApiPerformance(
    async () => {
      try {
        // Check cache first
        const cached = carQueryCache.get(cacheKey);
        if (cached) {
          logger.debug("Using cached CarQuery result", { make, model, year });
          return cached;
        }
        
        // Common parameters for the request
        const baseUrl = config.api.baseUrl;
        let queryParams = `?callback=?&cmd=getTrims&make=${encodeURIComponent(make)}`;
        
        // Add model and year if available
        if (model) {
          queryParams += `&model=${encodeURIComponent(model)}`;
        }
        
        // Always include year parameter when available to get more accurate results
        // and reduce data size and processing requirements
        if (year) {
          queryParams += `&year=${encodeURIComponent(year)}`;
        }
        
        const url = `${baseUrl}${queryParams}`;
        
        logger.debug("Querying CarQuery API", { url });
        
        try {
          // Use fetchWithRetry instead of direct fetch with manual timeout
          const res = await fetchWithRetry(url, {
            headers: {
              'User-Agent': 'CarsiqAi/1.0'
            }
          });
          
          if (!res.ok) {
            throw new Error(`CarQuery API returned ${res.status}`);
          }
          
          const text = await res.text();
          
          // CarQuery API returns JSONP - convert to JSON
          const jsonStr = text.replace(/^\?\((.*)\);$/, '$1');
          const data = JSON.parse(jsonStr) as CarQueryResponse;
          
          // Check if we have actual results
          if (!data.Trims || data.Trims.length === 0) {
            logger.warn("No car trims found from CarQuery API", { make, model, year });
            return [];
          }
          
          logger.info(`Found ${data.Trims.length} car trims from CarQuery API`, { 
            make, 
            model,
            year,
            count: data.Trims.length 
          });
          
          // Store in cache
          carQueryCache.set(cacheKey, data.Trims);
          
          return data.Trims;
        } catch (fetchError: any) {
          logger.error("Error fetching car data from CarQuery API", { 
            make, 
            model, 
            year, 
            error: fetchError.message 
          });
          throw fetchError;
        }
      } catch (error) {
        logger.error("Error getting car models from CarQuery API", { make, model, year, error });
        return [];
      }
    },
    { cacheKey, operation: 'getCarModels' }
  );
}

/**
 * Gets available car models for a specific make and year
 * @param make Car manufacturer
 * @param year Car year
 * @returns Array of model names
 */
export async function getAvailableModels(make: string, year?: string): Promise<string[]> {
  // Validate inputs
  const validationResult = MakeInputSchema.safeParse({ make, year });
  if (!validationResult.success) {
    logger.error("Invalid input for getAvailableModels", { 
      errors: validationResult.error.errors,
      make,
      year
    });
    return [];
  }
  
  // Create cache key
  const cacheKey = `available:${make}:${year || ''}`;
  
  // Use trackApiPerformance to monitor this operation
  return trackApiPerformance(
    async () => {
      try {
        // Check cache first
        const cached = carQueryCache.get(cacheKey);
        if (cached) {
          logger.debug("Using cached available models", { make, year });
          return cached;
        }
        
        const baseUrl = "https://www.carqueryapi.com/api/0.3/";
        let queryParams = `?callback=?&cmd=getModels&make=${encodeURIComponent(make)}`;
        
        if (year) {
          queryParams += `&year=${encodeURIComponent(year)}`;
        }
        
        const url = `${baseUrl}${queryParams}`;
        
        try {
          // Use fetchWithRetry instead of direct fetch with manual timeout
          const res = await fetchWithRetry(url, {
            headers: {
              'User-Agent': 'CarsiqAi/1.0'
            }
          });
          
          if (!res.ok) {
            throw new Error(`CarQuery API returned ${res.status}`);
          }
          
          const text = await res.text();
          const jsonStr = text.replace(/^\?\((.*)\);$/, '$1');
          const data = JSON.parse(jsonStr);
          
          const modelNames = (data.Models || []).map((model: any) => model.model_name);
          
          // Store in cache
          carQueryCache.set(cacheKey, modelNames);
          
          return modelNames;
        } catch (fetchError: any) {
          logger.error("Error fetching available models from CarQuery API", { 
            make, 
            year, 
            error: fetchError.message 
          });
          throw fetchError;
        }
      } catch (error) {
        logger.error("Error getting available models from CarQuery API", { make, year, error });
        return [];
      }
    },
    { cacheKey, operation: 'getAvailableModels' }
  );
}

/**
 * Gets all available makes for a specific year
 * @param year Car year
 * @returns Array of make names
 */
export async function getAvailableMakes(year?: string): Promise<string[]> {
  // Validate inputs
  const validationResult = YearInputSchema.safeParse({ year });
  if (!validationResult.success) {
    logger.error("Invalid input for getAvailableMakes", { 
      errors: validationResult.error.errors,
      year
    });
    return [];
  }
  
  // Create cache key
  const cacheKey = `makes:${year || ''}`;
  
  // Use trackApiPerformance to monitor this operation
  return trackApiPerformance(
    async () => {
      try {
        // Check cache first
        const cached = carQueryCache.get(cacheKey);
        if (cached) {
          logger.debug("Using cached available makes", { year });
          return cached;
        }
        
        const baseUrl = "https://www.carqueryapi.com/api/0.3/";
        let queryParams = `?callback=?&cmd=getMakes`;
        
        if (year) {
          queryParams += `&year=${encodeURIComponent(year)}`;
        }
        
        const url = `${baseUrl}${queryParams}`;
        
        try {
          // Use fetchWithRetry instead of direct fetch with manual timeout
          const res = await fetchWithRetry(url, {
            headers: {
              'User-Agent': 'CarsiqAi/1.0'
            }
          });
          
          if (!res.ok) {
            throw new Error(`CarQuery API returned ${res.status}`);
          }
          
          const text = await res.text();
          const jsonStr = text.replace(/^\?\((.*)\);$/, '$1');
          const data = JSON.parse(jsonStr);
          
          const makes = (data.Makes || []).map((make: any) => make.make_display);
          
          // Store in cache
          carQueryCache.set(cacheKey, makes);
          
          return makes;
        } catch (fetchError: any) {
          logger.error("Error fetching available makes from CarQuery API", { 
            year, 
            error: fetchError.message 
          });
          throw fetchError;
        }
      } catch (error) {
        logger.error("Error getting available makes from CarQuery API", { year, error });
        return [];
      }
    },
    { cacheKey, operation: 'getAvailableMakes' }
  );
}

/**
 * Gets a representative car image URL based on make, model and year
 * @param make Car manufacturer
 * @param model Car model 
 * @param year Car year
 * @returns URL to car image
 */
export async function getCarImageUrl(make: string, model: string, year?: string | null): Promise<string> {
  try {
    // Check cache first
    const cacheKey = `image:${make}:${model}:${year || ''}`;
    const cached = carQueryCache.get(cacheKey);
    if (cached) {
      logger.debug("Using cached car image URL", { make, model, year });
      return cached;
    }
    
    // Fallback to a generic car image if no parameters
    if (!make || !model) {
      return "https://img.freepik.com/free-vector/car-icon-side-view_23-2147501694.jpg";
    }
    
    // Try to get a free, non-copyrighted car image
    const searchQuery = `${make} ${model} ${year || ''} car transparent`;
    
    try {
      // Use Unsplash API if available
      if (process.env.UNSPLASH_ACCESS_KEY) {
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1`;
        const res = await fetch(unsplashUrl, {
          headers: {
            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.small;
            carQueryCache.set(cacheKey, imageUrl);
            return imageUrl;
          }
        }
      }
      
      // Fallback to a generic model-based URL
      const fallbackUrl = `https://www.carlogos.org/car-models/${make.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-logo.png`;
      carQueryCache.set(cacheKey, fallbackUrl);
      return fallbackUrl;
      
    } catch (error) {
      logger.error("Error fetching car image", { make, model, year, error });
      // Return a generic car icon
      return "https://img.freepik.com/free-vector/car-icon-side-view_23-2147501694.jpg";
    }
  } catch (error) {
    logger.error("Error in getCarImageUrl", { make, model, year, error });
    return "https://img.freepik.com/free-vector/car-icon-side-view_23-2147501694.jpg";
  }
}

/**
 * Extracts important specifications for oil recommendation
 * @param trim Car trim data from CarQuery API
 * @returns Object with critical specs for oil recommendation
 */
export function extractOilRecommendationData(trim: CarQueryTrim) {
  return {
    engineCC: parseInt(trim.model_engine_cc || '0'),
    engineType: trim.model_engine_type || 'Unknown',
    fuelType: trim.model_engine_fuel || 'Unknown',
    compression: parseFloat(trim.model_engine_compression || '0'),
    weight: parseInt(trim.model_weight_kg || '0'),
    fuelTank: parseFloat(trim.model_fuel_cap_l || '0'),
    cityFuelConsumption: parseFloat(trim.model_lkm_city || '0'),
    driveSystem: trim.model_drive || 'Unknown',
    model: trim.model_display || '',
    year: trim.model_year || '',
    oilSpec: trim.model_engine_oil || ''
  };
}

/**
 * Suggests oil based on car specifications
 * @param specs Car specifications 
 * @returns Recommended oil type and viscosity
 */
export function suggestOil(specs: ReturnType<typeof extractOilRecommendationData>) {
  let recommendedViscosity = '5W-30'; // Default viscosity
  let oilQuality = 'Synthetic';
  let reason = '';
  let capacity = '4.5'; // Default capacity

  // Extract model and make information
  const modelLower = specs.model.toLowerCase();
  const makeMatch = modelLower.match(/^([a-z]+)/);
  const make = makeMatch ? makeMatch[1] : '';
  
  // Calculate approximate oil capacity based on engine size if available
  if (specs.engineCC > 0) {
    if (specs.engineCC <= 1500) capacity = '3.5';
    else if (specs.engineCC <= 2000) capacity = '4.0';
    else if (specs.engineCC <= 2500) capacity = '4.5';
    else if (specs.engineCC <= 3000) capacity = '5.0';
    else if (specs.engineCC <= 3500) capacity = '5.7';
    else capacity = '6.5';
  }
  
  // Look for specific car makes and models
  
  // Toyota models
  if (modelLower.includes('toyota') || make === 'toyota') {
    if (modelLower.includes('camry') && parseInt(specs.year || '0') >= 2018) {
    recommendedViscosity = '0W-20';
    oilQuality = 'Full Synthetic';
    reason = 'Toyota Camry 2018+ requires 0W-20 for optimal fuel efficiency';
      capacity = '4.8';
    } else if (modelLower.includes('corolla') && parseInt(specs.year || '0') >= 2020) {
      // تم تحديث المواصفات بناءً على التصحيحات
      recommendedViscosity = '0W-16'; // الأفضل للمحرك 2.0L
      oilQuality = 'Full Synthetic';
      reason = 'Toyota Corolla 2020+ 2.0L engine prefers 0W-16, 1.6L engine uses 0W-20';
      capacity = '4.6'; // تم التصحيح للمحرك 2.0L، 4.2L للمحرك 1.6L
    }
  }
  
  // Jeep models - comprehensive handling for all Jeep models
  else if (modelLower.includes('jeep') || make === 'jeep') {
    if (modelLower.includes('compass') && parseInt(specs.year || '0') >= 2017) {
      recommendedViscosity = '0W-20';
      oilQuality = 'Full Synthetic';
      reason = 'Jeep Compass 2017+ requires 0W-20 for optimal performance';
      capacity = '5.2'; // Exact specification for Jeep Compass
    }
    else if (modelLower.includes('cherokee') && parseInt(specs.year || '0') >= 2019) {
      recommendedViscosity = '0W-20';
      oilQuality = 'Full Synthetic';
      reason = 'Jeep Cherokee 2019+ requires 0W-20 for optimal performance';
      capacity = '5.6';
    }
    else if (modelLower.includes('grand cherokee') || modelLower.includes('laredo') || modelLower.includes('grand') && modelLower.includes('cherokee')) {
      // Check for specific engine types
      if (specs.engineCC >= 3500 && specs.engineCC < 5000) {
        // 3.6L V6 Pentastar engine
        recommendedViscosity = '0W-20';
        oilQuality = 'Full Synthetic';
        reason = 'Jeep Grand Cherokee with 3.6L V6 engine requires 0W-20';
        capacity = '5.7';
      } else if (specs.engineCC >= 5000) {
        // 5.7L V8 HEMI engine
        recommendedViscosity = '5W-20';
        oilQuality = 'Full Synthetic';
        reason = 'Jeep Grand Cherokee with 5.7L V8 HEMI engine requires 5W-20';
        capacity = '6.6';
      } else {
        // Default for Grand Cherokee if engine size unknown
        recommendedViscosity = '0W-20';
        oilQuality = 'Full Synthetic';
        reason = 'Jeep Grand Cherokee requires 0W-20 for optimal performance';
        capacity = '5.7'; // Default to V6 capacity
      }
    }
    else if (modelLower.includes('wrangler') && parseInt(specs.year || '0') >= 2018) {
      recommendedViscosity = '5W-30';
      oilQuality = 'Full Synthetic';
      reason = 'Jeep Wrangler 2018+ with 2.0L turbo engine requires 5W-30';
      capacity = '5.0';
    }
    else if (modelLower.includes('renegade') && parseInt(specs.year || '0') >= 2015) {
      recommendedViscosity = '5W-40';
      oilQuality = 'Full Synthetic';
      reason = 'Jeep Renegade requires 5W-40 for optimal performance in hot climates';
      capacity = '4.7';
    }
    else if (modelLower.includes('grand')) {
      recommendedViscosity = '5W-30';
      oilQuality = 'Full Synthetic';
      reason = 'Jeep Grand Cherokee requires 5W-30 for optimal performance';
      capacity = '6.2';
    }
  }
  
  // Honda models
  else if (modelLower.includes('honda') || make === 'honda') {
    if (modelLower.includes('accord') && parseInt(specs.year || '0') >= 2018) {
      recommendedViscosity = '0W-20';
      oilQuality = 'Full Synthetic';
      reason = 'Honda Accord 2018+ requires 0W-20 for optimal fuel efficiency';
      capacity = '4.6';
    } else if (modelLower.includes('civic') && parseInt(specs.year || '0') >= 2016) {
      recommendedViscosity = '0W-20';
      oilQuality = 'Full Synthetic';
      reason = 'Honda Civic 2016+ requires 0W-20 for optimal fuel efficiency';
      capacity = '3.7';
    }
  }
  
  // Hyundai models
  else if (modelLower.includes('hyundai') || make === 'hyundai') {
    if (modelLower.includes('elantra') && parseInt(specs.year || '0') >= 2017) {
      recommendedViscosity = '5W-30';
      oilQuality = 'Full Synthetic';
      reason = 'Hyundai Elantra 2017+ performs best with 5W-30 in hot climates';
      capacity = '4.0';
    } else if (modelLower.includes('tucson') && parseInt(specs.year || '0') >= 2016) {
      recommendedViscosity = '5W-30';
      oilQuality = 'Full Synthetic';
      reason = 'Hyundai Tucson 2016+ requires 5W-30 for optimal engine protection';
      capacity = '4.8';
    }
  }
  
  // Kia models
  else if (modelLower.includes('kia') || make === 'kia') {
    if (modelLower.includes('sportage') && parseInt(specs.year || '0') >= 2017) {
      recommendedViscosity = '5W-30';
      oilQuality = 'Full Synthetic';
      reason = 'Kia Sportage 2017+ requires 5W-30 for optimal performance';
      capacity = '4.8';
    } else if (modelLower.includes('optima') && parseInt(specs.year || '0') >= 2016) {
      recommendedViscosity = '5W-20';
      oilQuality = 'Full Synthetic';
      reason = 'Kia Optima 2016+ performs best with 5W-20 synthetic oil';
      capacity = '4.8';
    }
  }
  
  // Handle diesel engines
  else if (specs.fuelType.toLowerCase().includes('diesel')) {
    oilQuality = 'Diesel-specific Synthetic';
    reason = 'Diesel engine requires special oil formula';
    
    // Adjust viscosity for diesel engines
    if (specs.engineCC > 2500) {
      recommendedViscosity = '5W-40';
    }
  }
  
  // Handle high compression engines
  else if (specs.compression > 10.5) {
    oilQuality = 'High-performance Synthetic';
    reason = 'High compression ratio requires heat-resistant oil';
    
    // Modern high-compression engines often use thinner oils
    if (parseInt(specs.year || '0') >= 2018) {
      recommendedViscosity = '0W-20';
    } else {
      recommendedViscosity = '5W-30';
    }
  }
  
  // Handle large engines or heavy vehicles
  else if (specs.engineCC > 3000 || specs.weight > 2000) {
    recommendedViscosity = '5W-40';
    reason = 'Large engine or heavy vehicle needs thicker oil';
  }
  
  // If the API provided oil spec information, use it
  if (specs.oilSpec) {
    const apiOilInfo = parseApiOilSpec(specs.oilSpec);
    if (apiOilInfo.viscosity) {
      recommendedViscosity = apiOilInfo.viscosity;
      reason = 'Using manufacturer-specified oil viscosity';
    }
    if (apiOilInfo.capacity) {
      capacity = apiOilInfo.capacity;
      reason += ' with exact manufacturer-specified capacity';
    }
  }

  // Climate considerations for Iraq
  reason += '. Iraqi climate requires heat-resistant formula.';
  
  return {
    viscosity: recommendedViscosity,
    quality: oilQuality,
    reason: reason?.trim?.() || reason || '',
    capacity: `${capacity} لتر`
  };
}

/**
 * Try to parse oil specifications from API data
 * Format might be like "5W-30, 4.5L" or varied
 */
function parseApiOilSpec(spec: string): { viscosity?: string, capacity?: string } {
  const result: { viscosity?: string, capacity?: string } = {};
  
  if (!spec) return result;
  
  const lowerSpec = spec.toLowerCase();
  
  // Viscosity patterns
  const viscosityPatterns = [
    /(\d+w-\d+)/i,
    /sae\s+(\d+w-\d+)/i,
    /oil\s+grade\s+(\d+w-\d+)/i,
    /grade\s+(\d+w-\d+)/i,
    /viscosity\s+(\d+w-\d+)/i
  ];
  
  for (const pattern of viscosityPatterns) {
    const match = lowerSpec.match(pattern);
    if (match) {
      result.viscosity = match[1].toUpperCase();
      break;
    }
  }
  
  // Capacity patterns
  const capacityPatterns = [
    /(\d+\.?\d*)\s*liters?/i,
    /(\d+\.?\d*)\s*l\b/i,
    /(\d+\.?\d*)\s*quarts?/i,
    /(\d+\.?\d*)\s*qt/i,
    /oil\s+capacity\s*:?\s*(\d+\.?\d*)/i,
    /capacity\s*:?\s*(\d+\.?\d*)/i
  ];
  
  for (const pattern of capacityPatterns) {
    const match = lowerSpec.match(pattern);
    if (match) {
      let capacity = parseFloat(match[1]);
      
      // Convert quarts to liters if needed
      if (match[0].toLowerCase().includes('quart')) {
        capacity = Math.round((capacity * 0.946353) * 10) / 10; // Round to 1 decimal place
      }
      
      result.capacity = capacity.toString();
      break;
    }
  }

  // Special case for Jeep Compass to ensure accuracy
  if ((lowerSpec.includes('jeep') && lowerSpec.includes('compass')) ||
     (lowerSpec.includes('جيب') && lowerSpec.includes('كومباس'))) {
    
    // 2017+ Jeep Compass uses 0W-20 with 5.2L capacity
    const year = spec.match(/(20\d\d)/);
    if (year && parseInt(year[1]) >= 2017) {
      result.viscosity = '0W-20';
      result.capacity = '5.2';
    }
  }
  
  // Special case for Jeep Grand Cherokee (including Laredo trim)
  if ((lowerSpec.includes('jeep') && lowerSpec.includes('grand') && lowerSpec.includes('cherokee')) ||
      (lowerSpec.includes('jeep') && lowerSpec.includes('laredo')) ||
      (lowerSpec.includes('جيب') && lowerSpec.includes('لاريدو'))) {
    
    // Check for engine size indicators
    const isV8 = lowerSpec.includes('5.7') || lowerSpec.includes('v8') || lowerSpec.includes('hemi');
    const isV6 = lowerSpec.includes('3.6') || lowerSpec.includes('v6') || lowerSpec.includes('pentastar');
    
    if (isV8) {
      // V8 HEMI engine
      result.viscosity = '5W-20';
      result.capacity = '6.6';
    } else if (isV6 || !isV8) {
      // V6 engine (default for most Grand Cherokees)
      result.viscosity = '0W-20';
      result.capacity = '5.7';
    }
  }
  
  return result;
}

/**
 * Processes multiple car queries in an efficient batched manner
 * @param queries Array of car queries with make, model, and optional year
 * @returns Array of car trim arrays for each query
 */
export async function getMultipleCarModels(
  queries: Array<{make: string, model: string, year?: string}>
): Promise<Array<CarQueryTrim[]>> {
  const batchSize = 5; // Process up to 5 queries at once
  const results: Array<CarQueryTrim[]> = [];
  
  // Validate inputs
  const validatedQueries = queries.filter(q => {
    if (!q.make || !q.model) {
      logger.warn("Invalid query in batch request", { query: q });
      return false;
    }
    return true;
  });
  
  logger.info(`Processing ${validatedQueries.length} car queries in batches of ${batchSize}`);
  
  try {
    // Process queries in batches to prevent overloading the API
    for (let i = 0; i < validatedQueries.length; i += batchSize) {
      const batch = validatedQueries.slice(i, i + batchSize);
      
      // Create batch of promises
      const batchPromises = batch.map(q => 
        getCarModels(q.make, q.model, q.year)
          .catch(error => {
            // Log error but continue with empty result
            logger.error(`Error in batch query for ${q.make} ${q.model}`, { error });
            return [];
          })
      );
      
      // Wait for all promises in this batch to settle
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Extract values from results
      const batchData = batchResults.map(r => 
        r.status === 'fulfilled' ? r.value : []
      );
      
      // Add batch results to overall results
      results.push(...batchData);
      
      // Add small delay between batches to be nice to the API
      if (i + batchSize < validatedQueries.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return results;
  } catch (error) {
    logger.error("Error in batch processing", { error });
    return results; // Return partial results if available
  }
}

/**
 * Tracks performance of an API call
 * @param fn Function to track
 * @param options Options including cache key and operation name
 * @returns Result of the function
 */
async function trackApiPerformance<T>(
  fn: () => Promise<T>,
  options: { 
    cacheKey?: string, 
    operation: string,
    context?: Record<string, any>,
    userId?: string
  }
): Promise<T> {
  const startTime = Date.now();
  recordMetric('totalRequests');
  
  // Check user rate limit if userId is provided
  if (options.userId && !checkUserRateLimit(options.userId)) {
    metrics.rateLimit.blocked++;
    throw new CarQueryError(
      `Rate limit exceeded for user: ${options.userId}`,
      'RATE_LIMIT_EXCEEDED'
    );
  }
  
  try {
    // Check if this is a cache hit
    if (options.cacheKey && carQueryCache.has(options.cacheKey)) {
      recordMetric('cacheHits');
    } else if (options.cacheKey) {
      recordMetric('cacheMisses');
    }
    
    // Execute the function
    const result = await fn();
    
    // Record success and timing
    recordMetric('successfulRequests');
    const duration = Date.now() - startTime;
    recordMetric('totalResponseTime', duration);
    
    // Track response time for percentiles
    responseTimeTracker.record(duration);
    
    return result;
  } catch (error: any) {
    // Record failure
    recordMetric('failedRequests');
    const duration = Date.now() - startTime;
    
    // Create contextual error with additional information
    const contextualError = error instanceof CarQueryError 
      ? error 
      : new CarQueryError(
          `Failed to perform ${options.operation}: ${error.message}`,
          'OPERATION_FAILED'
        );
        
    // Record error by type
    recordErrorByType(contextualError.code);
    
    // Log error with context
    logger.error(`API operation failed: ${options.operation}`, { 
      error: contextualError,
      code: contextualError.code,
      duration,
      context: options.context
    });
    
    throw contextualError;
  }
} 