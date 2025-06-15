import logger from "@/utils/logger";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { LRUCache } from "lru-cache";
import { z } from "zod";

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
  max: 100, // Store up to 100 results
  ttl: 1000 * 60 * 60 * 24, // Cache for 24 hours
  allowStale: false,
  updateAgeOnGet: true,
});

// Rate limiting configuration
const rateLimiter = {
  maxRequests: 50, // Maximum requests per time window
  timeWindow: 60 * 1000, // Time window in milliseconds (1 minute)
  requestCount: 0, // Current request count
  windowStart: Date.now(), // Start of the current time window
  queue: [] as { resolve: Function, reject: Function }[],
  processing: false
};

// Retry configuration
const retryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
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

// Metrics tracking
interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalResponseTime: number;
  cacheHits: number;
  cacheMisses: number;
  normalizationSuccesses: number;
  normalizationFailures: number;
  lastReset: Date;
}

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
  lastReset: new Date()
};

/**
 * Records a metric for API monitoring
 * @param metricName Name of the metric to update
 * @param value Value to add (default: 1)
 */
function recordMetric(metricName: keyof ApiMetrics, value: number = 1): void {
  if (metricName in metrics && typeof metrics[metricName] === 'number') {
    (metrics[metricName] as number) += value;
  }
}

/**
 * Gets current API metrics
 * @returns Copy of current metrics
 */
export function getApiMetrics(): ApiMetrics {
  return { ...metrics };
}

/**
 * Resets API metrics
 */
export function resetApiMetrics(): void {
  Object.keys(metrics).forEach(key => {
    if (key !== 'lastReset') {
      (metrics as any)[key] = 0;
    }
  });
  metrics.lastReset = new Date();
}

/**
 * Tracks performance of an API call
 * @param fn Function to track
 * @param cacheKey Cache key to check for cache hits
 * @returns Result of the function
 */
async function trackApiPerformance<T>(
  fn: () => Promise<T>,
  options: { 
    cacheKey?: string, 
    operation: string 
  }
): Promise<T> {
  const startTime = Date.now();
  recordMetric('totalRequests');
  
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
    recordMetric('totalResponseTime', Date.now() - startTime);
    
    return result;
  } catch (error) {
    // Record failure
    recordMetric('failedRequests');
    logger.error(`API operation failed: ${options.operation}`, { error, duration: Date.now() - startTime });
    throw error;
  }
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
    try {
      // Wait for rate limit slot before making request
      await acquireRateLimit();
      
      // Make the request
      const response = await fetch(url, options);
      
      // If successful, return response
      if (response.ok) {
        return response;
      }
      
      // If rate limited (429) or server error (5xx), retry
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      // For other error codes, don't retry
      return response;
      
    } catch (error: any) {
      lastError = error;
      
      // Don't retry if it's not a retryable error
      if (error.name !== 'AbortError' && 
          !error.message.includes('API returned status') &&
          !error.message.includes('network')) {
        throw error;
      }
      
      // If max retries reached, throw the error
      if (retries >= retryConfig.maxRetries) {
        logger.error("Max retries reached for API call", { url, retries, error });
        throw error;
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
  throw lastError || new Error("Unknown error in fetchWithRetry");
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
  if (!input || input.trim().length < 2) {
    logger.warn("Input too short for normalization", { input });
    return { make: "", model: "", year: null, confidence: 0 };
  }
  
  // Create cache key
  const cacheKey = `normalize:${input.toLowerCase().trim()}`;
  
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
Extract car make, model and year from this text: "${input}"

Return ONLY a JSON object with this exact format:
{
  "make": "brand name in English (e.g., toyota)",
  "model": "model name in English (e.g., camry)",
  "year": "year if present, or empty string",
  "confidence": number from 0-100 indicating confidence level
}

DO NOT include any explanations or text outside the JSON object.
`;

        logger.debug("Sending car data normalization request to OpenRouter", {
          inputLength: input.length,
        });

        try {
          // Try with streamText first
          const result = await streamText({
            model: openAI("anthropic/claude-3-haiku"),
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
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
              
              const normalizedData = {
                make: parsedData.make?.toLowerCase().trim() || "",
                model: parsedData.model?.toLowerCase().trim() || "",
                year: parsedData.year ? parsedData.year.trim() : null,
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
    'jeep': ['جيب', 'jeep']
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
 * Helper function to convert Arabic/Persian digits to English digits
 */
function convertArabicDigitsToEnglish(str: string): string {
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  const englishDigits = '0123456789';
  
  return str.split('').map(c => {
    const index = arabicDigits.indexOf(c);
    return index !== -1 ? englishDigits[index] : c;
  }).join('');
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
        const baseUrl = "https://www.carqueryapi.com/api/0.3/";
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

  // Handle specific makes and models
  if (specs.model.toLowerCase().includes('camry') && 
      parseInt(specs.year || '0') >= 2018) {
    // For modern Toyota Camry (2018+)
    recommendedViscosity = '0W-20';
    oilQuality = 'Full Synthetic';
    reason = 'Toyota Camry 2018+ requires 0W-20 for optimal fuel efficiency';
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
  // Handle stressed engines with poor fuel economy
  else if (specs.cityFuelConsumption > 0 && specs.cityFuelConsumption < 8) {
    oilQuality = 'Premium Synthetic';
    reason = 'Engine under stress due to poor fuel economy';
  }

  // Climate considerations for Iraq
  reason += '. Iraqi climate requires heat-resistant formula.';
  
  // Calculate approximate oil capacity based on engine size
  // This is an estimate - actual capacity should be verified with manufacturer specs
  let oilCapacity = '4.0';
  if (specs.engineCC > 0) {
    if (specs.engineCC <= 1500) oilCapacity = '3.5';
    else if (specs.engineCC <= 2500) oilCapacity = '4.5';
    else if (specs.engineCC <= 3500) oilCapacity = '5.7';
    else oilCapacity = '6.5';
  }
  
  return {
    viscosity: recommendedViscosity,
    quality: oilQuality,
    reason: reason.trim(),
    capacity: `${oilCapacity} لتر`
  };
} 