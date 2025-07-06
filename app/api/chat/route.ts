import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import CarAnalyzer from "@/utils/carAnalyzer"
import logger from "@/utils/logger"
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { z } from 'zod'
import { normalizeArabicCarInput, getCarModels, extractOilRecommendationData, suggestOil } from '@/utils/carQueryApi'

// Input validation schemas
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, "Message content cannot be empty")
})

const RequestBodySchema = z.object({
  messages: z.array(MessageSchema).min(1, "At least one message is required")
})

// Enhanced car data extraction with better validation
interface ExtractedCarData {
  carBrand: string;
  carModel: string;
  year?: number;
  mileage?: number;
  engineSize?: string;
  fuelType?: string;
  transmission?: string;
  isValid: boolean;
  confidence: number;
}

// Enhanced oil recommendation interface
interface OilRecommendation {
  primaryOil: string[];
  alternativeOil?: string[];
  viscosity: string;
  capacity: string;
  brand: string;
  specification: string;
  reason: string;
  priceRange?: string;
  changeInterval: string;
  climateConsiderations: string;
}

// API status tracking for token limits
interface ApiStatus {
  isTokenLimitReached: boolean;
  errorCount: number;
  lastError?: string;
  lastErrorTime?: Date;
}

// Initialize API status
const apiStatus: ApiStatus = {
  isTokenLimitReached: false,
  errorCount: 0
}

/**
 * Enhanced OpenRouter configuration with fallback options
 */
const openRouter = {
  baseURL: "https://openrouter.ai/api/v1",
  key: process.env.OPENROUTER_API_KEY || '',
  primaryModel: "anthropic/claude-3-haiku",
  fallbackModel: "anthropic/claude-instant-v1",
  mistralModel: "mistralai/mistral-nemo:free",
  maxRetries: 3,
  timeout: 30000,
  systemPrompt: `أنت مساعد متخصص بالسيارات وزيوت المحركات، خبرتك في السيارات عالية جداً.
أنت تعمل في متجر "هندسة السيارات" لبيع قطع غيار السيارات، وتقدم الخدمة الافتراضية عبر الإنترنت.

**مبادئ التشغيل الأساسية:**
1. الدقة في المعلومات أولوية قصوى
2. الاعتماد على بيانات الشركات المصنعة الرسمية فقط
3. ترشيح زيت واحد أمثل مع بديل واحد فقط
4. مراعاة الظروف المناخية العراقية القاسية

**معلومات هامة عن مناخ العراق:**
- درجة حرارة عالية (تصل إلى 50°م صيفاً)
- مستويات غبار وأتربة عالية
- ظروف قيادة قاسية (طرق وازدحام)
- ضرورة استخدام زيوت مقاومة للحرارة العالية

**التوكيلات المعتمدة المتاحة:**
Castrol, Mobil 1, Liqui Moly, Meguin, Valvoline, Motul, Hanata

**تنسيق الإجابات:**
- استخدم الأرقام مع الرموز التعبيرية (1️⃣, 2️⃣)
- فقرات قصيرة مع عناوين واضحة
- رموز تعبيرية مناسبة (🚗, 🛢️, ⚙️, 🔧, 🔍)

**قاعدة إلزامية:**
يجب ذكر سعة الزيت الدقيقة من مواصفات الشركة المصنعة بالضبط دون تغيير.
مثال: إذا كانت سعة جينيسيس G70 هي 5.7 لتر، اذكرها هكذا حرفياً.

**التوصية النهائية:**
يجب إنهاء كل رد بـ "التوصية النهائية:" متبوعة باسم الزيت واللزوجة والكمية.
مثال: التوصية النهائية: Castrol EDGE 5W-40 (5.7 لتر)`,
  headers: {
    "HTTP-Referer": "https://car-service-chat.vercel.app/",
    "X-Title": "Car Service Chat - Enhanced",
  },
}

// Enhanced OpenRouter client with retry logic
const createOpenRouterClient = () => {
  return createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Car Service Chat - Enhanced"
    }
  })
}

// Check if error message indicates token limit reached
function isTokenLimitError(error: any): boolean {
  if (!error || !error.message) return false
  
  const errorMsg = error.message.toLowerCase()
  return (
    errorMsg.includes('token') && 
    (errorMsg.includes('limit') || errorMsg.includes('exceeded') || errorMsg.includes('quota')) ||
    errorMsg.includes('billing') ||
    errorMsg.includes('payment required') ||
    errorMsg.includes('insufficient funds')
  )
}

// Reset API status if enough time has passed
function checkAndResetTokenLimitStatus(): void {
  if (apiStatus.isTokenLimitReached && apiStatus.lastErrorTime) {
    // Reset after 24 hours
    const resetTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    if (Date.now() - apiStatus.lastErrorTime.getTime() > resetTime) {
      console.log('Resetting token limit status after 24 hours')
      apiStatus.isTokenLimitReached = false
      apiStatus.errorCount = 0
      apiStatus.lastError = undefined
      apiStatus.lastErrorTime = undefined
    }
  }
}

/**
 * Enhanced car data extraction with better accuracy
 */
function enhancedExtractCarData(query: string): ExtractedCarData {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Enhanced brand detection with common Arabic variations
  const brandMappings = {
    'تويوتا': ['تويوتا', 'toyota'],
    'هيونداي': ['هيونداي', 'هيوندا', 'hyundai'],
    'كيا': ['كيا', 'kia'],
    'نيسان': ['نيسان', 'nissan'],
    'هوندا': ['هوندا', 'honda'],
    'مرسيدس': ['مرسيدس', 'mercedes', 'بنز'],
    'بي ام دبليو': ['بي ام دبليو', 'bmw', 'بمو'],
    'لكزس': ['لكزس', 'lexus'],
    'جينيسيس': ['جينيسيس', 'genesis'],
    'فولكس واجن': ['فولكس واجن', 'volkswagen', 'vw'],
    'اودي': ['اودي', 'audi'],
    'مازدا': ['مازدا', 'mazda'],
    'سوزوكي': ['سوزوكي', 'suzuki'],
    'ميتسوبيشي': ['ميتسوبيشي', 'mitsubishi'],
    'شيفروليت': ['شيفروليت', 'chevrolet', 'شفروليه', 'شيفي', 'شيفي', 'شيفروليه'],
    'فورد': ['فورد', 'ford'],
    'بيجو': ['بيجو', 'peugeot'],
    'رينو': ['رينو', 'renault'],
    'جيب': ['جيب', 'jeep']
  }
  
  let detectedBrand = ''
  let confidence = 0
  
  for (const [brand, variations] of Object.entries(brandMappings)) {
    for (const variation of variations) {
      if (normalizedQuery.includes(variation)) {
        detectedBrand = brand
        confidence += 30
        break
      }
    }
    if (detectedBrand) break
  }
  
  // Enhanced model detection
  const commonModels = [
    'كامري', 'كورولا', 'rav4', 'هايلندر', 'برادو', 'لاند كروزر',
    'النترا', 'سوناتا', 'توسان', 'سنتافي', 'أكسنت', 'i10', 'i20', 'i30',
    'سيراتو', 'اوبتيما', 'سورنتو', 'كادينزا', 'ريو',
    'التيما', 'سنترا', 'اكس تريل', 'باترول', 'مورانو',
    'سيفيك', 'اكورد', 'crv', 'hrv', 'بايلوت',
    'c200', 'c300', 'e200', 'e300', 's500', 'glc', 'gle',
    '320i', '330i', '520i', '530i', 'x3', 'x5',
    'es300', 'is300', 'rx350', 'lx570',
    'g70', 'g80', 'g90', 'gv70', 'gv80',
    'كومباس', 'compass', 'شيروكي', 'cherokee', 'رانجلر', 'wrangler', 'رينيجيد', 'renegade',
    'كامارو', 'camaro', 'كمارو', 'كمارو', 'كامرو', 'كامارو',
    'كروز', 'cruze', 'ماليبو', 'malibu', 'سيلفرادو', 'silverado', 'تاهو', 'tahoe'
  ]
  
  let detectedModel = ''
  for (const model of commonModels) {
    if (normalizedQuery.includes(model)) {
      detectedModel = model
      confidence += 25
      
      // Special handling for Camaro model
      if (model === 'كامارو' || model === 'camaro' || model === 'كمارو' || model === 'كامرو') {
        detectedModel = 'camaro'
        confidence += 5 // Extra confidence for this specific model
      }
      
      break
    }
  }
  
  // Enhanced year extraction with multiple patterns
  let year: number | undefined
  let maxConfidence = 0
  
  // Array of regex patterns to try for year extraction
  const yearPatterns = [
    /\b(20[0-2][0-9])\b/, // Standard 20XX format
    /\bموديل\s+(\d{4})\b/, // "موديل YYYY"
    /\bmodel\s+(\d{4})\b/i, // "model YYYY"
    /\b(\d{4})\s+model\b/i, // "YYYY model"
    /\b(\d{4})\s+موديل\b/ // "YYYY موديل"
  ]
  
  // Helper function to convert Arabic digits to English
  function convertDigitsToEnglish(str: string): string {
    return str.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632));
  }
  
  // Try each pattern and keep the result with highest confidence
  for (const pattern of yearPatterns) {
    const matches = normalizedQuery.match(pattern);
    if (matches && matches.length > 0) {
      for (const match of matches) {
        // Extract the year from the match
        const extractedYear = match.match(/\d{4}/) ? 
                            match.match(/\d{4}/)![0] : 
                            convertDigitsToEnglish(match);
        
        // Validate the year is within reasonable range
        const yearNum = parseInt(extractedYear);
        if (yearNum >= 1980 && yearNum <= new Date().getFullYear() + 1) {
          // Calculate confidence based on position in text and format
          const positionInText = normalizedQuery.indexOf(match) / normalizedQuery.length;
          const patternConfidence = 15 + (positionInText < 0.5 ? 5 : 0);
          
          if (patternConfidence > maxConfidence) {
            year = yearNum;
            maxConfidence = patternConfidence;
          }
        }
      }
    }
  }
  
  // Specific handling for Camaro 2016
  if (detectedModel === 'camaro' && !year) {
    // Look for "16" or "2016" patterns that might indicate a 2016 Camaro
    const camaroYearMatches = normalizedQuery.match(/\b(16|2016)\b/);
    if (camaroYearMatches) {
      const extractedYear = camaroYearMatches[1];
      year = extractedYear === '16' ? 2016 : parseInt(extractedYear);
      maxConfidence = 15;
      logger.debug("Extracted year from text", { year, confidence: maxConfidence });
    }
  }
  
  // Add the year confidence to total confidence
  if (year) {
    confidence += maxConfidence;
  }
  
  // Enhanced mileage extraction
  const mileagePatterns = [
    /(\d+)\s*ألف/,
    /(\d+)\s*الف/,
    /(\d+)\s*k/i,
    /(\d+)\s*km/i,
    /(\d+)\s*كيلو/,
    /ماشية\s+(\d+)/,
    /قاطع\s+(\d+)/,
    /عداد\s+(\d+)/,
    /(\d+)\s*كم/
  ]
  
  let mileage: number | undefined
  for (const pattern of mileagePatterns) {
    const match = normalizedQuery.match(pattern)
    if (match) {
      // Check if this is "X ألف" format (thousands)
      const isThousands = pattern.toString().includes('ألف') || 
                          pattern.toString().includes('الف') || 
                          pattern.toString().includes('k');
      
      mileage = parseInt(match[1]);
      if (isThousands) {
        mileage *= 1000;
      }
      confidence += 15
      break
    }
  }
  
  // Special handling for Chevrolet Camaro
  if (detectedBrand === 'شيفروليت' && detectedModel === 'camaro') {
    if (!year) {
      // If we couldn't detect a year but it's a Camaro, default to 2016 with lower confidence
      year = 2016;
      confidence += 5;
      logger.debug("Defaulting to 2016 for Chevrolet Camaro", { confidence: 5 });
    }
    
    // Increase confidence for Chevrolet Camaro detection
    confidence += 10;
    
    // Check for specific engine type indicators in the query
    const isV8 = normalizedQuery.includes('v8') || 
                normalizedQuery.includes('ss') || 
                normalizedQuery.includes('اس اس') ||
                normalizedQuery.includes('zl1') ||
                normalizedQuery.includes('زد ال 1') ||
                normalizedQuery.includes('6.2');
                
    const isV6 = normalizedQuery.includes('v6') || 
               normalizedQuery.includes('3.6');
               
    // Add engine information to the return object
    if (isV8) {
      return {
        carBrand: detectedBrand,
        carModel: detectedModel,
        year,
        mileage,
        engineSize: '6.2L V8',
        isValid: true,
        confidence: confidence + 15
      };
    } else if (isV6) {
      return {
        carBrand: detectedBrand,
        carModel: detectedModel,
        year,
        mileage,
        engineSize: '3.6L V6',
        isValid: true,
        confidence: confidence + 10
      };
    } else {
      // Default to 2.0L L4 if no specific engine mentioned (base model)
      return {
        carBrand: detectedBrand,
        carModel: detectedModel,
        year,
        mileage,
        engineSize: '2.0L L4',
        isValid: true,
        confidence: confidence + 5
      };
    }
  }
  
  return {
    carBrand: detectedBrand,
    carModel: detectedModel,
    year,
    mileage,
    isValid: confidence >= 50,
    confidence
  }
}

/**
 * Enhanced analytics with better error handling and validation
 */
async function saveQueryToAnalytics(
  query: string | undefined, 
  carData?: ExtractedCarData,
  recommendation?: OilRecommendation
) {
  if (!isSupabaseConfigured() || !query || query.trim() === '') {
    console.log('Supabase not configured or empty query. Skipping analytics tracking.')
    return
  }

  try {
    const analyticsData = {
      query: query.trim(),
      car_model: carData?.carModel,
      car_brand: carData?.carBrand,
      car_year: carData?.year,
      mileage: carData?.mileage,
      query_type: determineQueryType(query),
      confidence_score: carData?.confidence || 0,
      recommended_oil: recommendation?.primaryOil?.[0],
      oil_viscosity: recommendation?.viscosity,
      oil_capacity: recommendation?.capacity,
      source: 'web',
      timestamp: new Date().toISOString(),
      session_id: generateSessionId()
    }

    const { error } = await supabase.from('user_queries').insert(analyticsData)

    if (error) {
      console.error('Error saving query to analytics:', error)
      // Log to external service if needed
      logger.error('Analytics save failed', { error, query })
    } else {
      console.log('Successfully saved query to analytics:', query.substring(0, 50))
      
      // Update counters asynchronously
      if (carData?.carModel) {
        updateModelQueryCount(carData.carModel).catch(console.error)
      }
      
      if (carData?.carBrand) {
        updateBrandQueryCount(carData.carBrand).catch(console.error)
      }
    }
  } catch (err) {
    console.error('Error in analytics tracking:', err)
    logger.error('Analytics tracking failed', { error: err, query })
  }
}

/**
 * Enhanced query type determination with better accuracy
 */
function determineQueryType(query: string): string {
  const normalizedQuery = query.toLowerCase()
  
  const queryTypeMappings = [
    { 
      type: 'OIL_RECOMMENDATION', 
      keywords: ['زيت', 'تغيير زيت', 'نوع زيت', 'أفضل زيت'], 
      weight: 3 
    },
    { 
      type: 'SPECIFICATIONS', 
      keywords: ['مواصفات', 'سعة', 'قوة المحرك', 'حجم المحرك'], 
      weight: 2 
    },
    { 
      type: 'MAINTENANCE', 
      keywords: ['صيانة', 'إصلاح', 'عطل', 'مشكلة', 'قطع غيار', 'فلتر'], 
      weight: 2 
    },
    { 
      type: 'PRICE', 
      keywords: ['سعر', 'تكلفة', 'قيمة', 'كم سعر'], 
      weight: 1 
    },
    { 
      type: 'COMPARISON', 
      keywords: ['مقارنة', 'أفضل من', 'أحسن من', 'ايهما أفضل'], 
      weight: 2 
    },
    { 
      type: 'FUEL_CONSUMPTION', 
      keywords: ['استهلاك الوقود', 'صرفية', 'كفاءة', 'بنزين'], 
      weight: 1 
    }
  ]

  let bestMatch = { type: 'OTHER', score: 0 }

  for (const mapping of queryTypeMappings) {
    let score = 0
    for (const keyword of mapping.keywords) {
      if (normalizedQuery.includes(keyword)) {
        score += mapping.weight
      }
    }
    
    if (score > bestMatch.score) {
      bestMatch = { type: mapping.type, score }
    }
  }
  
  return bestMatch.type
}

/**
 * Enhanced model and brand query count updates with better error handling
 */
async function updateModelQueryCount(modelName: string): Promise<void> {
  if (!isSupabaseConfigured() || !modelName) return
  
  try {
    const { data: models, error: fetchError } = await supabase
      .from('car_models')
      .select('id, queries, name')
      .ilike('name', `%${modelName}%`)
      .limit(1)
      
    if (fetchError) {
      console.error('Error fetching car model:', fetchError)
      return
    }
    
    if (models && models.length > 0) {
      const { error: updateError } = await supabase
        .from('car_models')
        .update({ 
          queries: (models[0].queries || 0) + 1,
          last_queried: new Date().toISOString()
        })
        .eq('id', models[0].id)
        
      if (updateError) {
        console.error('Error updating car model query count:', updateError)
      }
    } else {
      // Create new model entry if not exists
      const { error: insertError } = await supabase
        .from('car_models')
        .insert({
          name: modelName,
          brand: 'Unknown', // Set default brand to avoid NOT NULL constraint
          year: 0,          // Set default year to avoid NOT NULL constraint
          queries: 1,
          last_queried: new Date().toISOString()
        })
        
      if (insertError) {
        console.error('Error creating new car model entry:', insertError)
      }
    }
  } catch (err) {
    console.error('Error in updateModelQueryCount:', err)
  }
}

async function updateBrandQueryCount(brandName: string): Promise<void> {
  if (!isSupabaseConfigured() || !brandName) return
  
  try {
    const { data: brands, error: fetchError } = await supabase
      .from('car_brands')
      .select('id, queries, name')
      .ilike('name', `%${brandName}%`)
      .limit(1)
      
    if (fetchError) {
      console.error('Error fetching car brand:', fetchError)
      return
    }
    
    if (brands && brands.length > 0) {
      const { error: updateError } = await supabase
        .from('car_brands')
        .update({ 
          queries: (brands[0].queries || 0) + 1,
          last_queried: new Date().toISOString()
        })
        .eq('id', brands[0].id)
        
      if (updateError) {
        console.error('Error updating car brand query count:', updateError)
      }
    } else {
      // Create new brand entry if not exists
      const { error: insertError } = await supabase
        .from('car_brands')
        .insert({
          name: brandName,
          queries: 1,
          last_queried: new Date().toISOString()
        })
        
      if (insertError) {
        console.error('Error creating new car brand entry:', insertError)
      }
    }
  } catch (err) {
    console.error('Error in updateBrandQueryCount:', err)
  }
}

/**
 * Generate unique session ID for tracking
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Enhanced request validation and sanitization
 */
function validateAndSanitizeRequest(body: any) {
  try {
    const validatedBody = RequestBodySchema.parse(body)
    
    // Additional sanitization
    validatedBody.messages = validatedBody.messages.map(message => ({
      ...message,
      content: message.content.trim().substring(0, 2000) // Limit message length
    }))
    
    return { success: true, data: validatedBody }
  } catch (error) {
    console.error('Request validation failed:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? error.errors : 'Invalid request format' 
    }
  }
}

/**
 * Main POST handler with comprehensive error handling
 */
export async function POST(req: Request) {
  const startTime = Date.now()
  let requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    console.log(`[${requestId}] Processing new request`)
    
    // Enhanced request parsing with timeout
    let body: any
    try {
      const bodyText = await Promise.race([
        req.text(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
      ])
      
      body = JSON.parse(bodyText as string)
    } catch (parseError) {
      console.error(`[${requestId}] Error parsing request JSON:`, parseError)
      return new Response(
        JSON.stringify({
          error: "تم إلغاء الطلب أو تم استلام بيانات غير صالحة",
          requestId
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }
    
    // Validate request format
    const validation = validateAndSanitizeRequest(body)
    if (!validation.success) {
      console.error(`[${requestId}] Request validation failed:`, validation.error)
      return new Response(
        JSON.stringify({
          error: "صيغة الطلب غير صحيحة",
          details: validation.error,
          requestId
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }
    
    // Type assertion to ensure data exists since we've checked validation.success
    const { messages } = validation.data as { messages: { role: "user" | "assistant" | "system"; content: string; }[] }
    
    // Process first user message to extract car data
    const userQuery = messages.find(m => m.role === 'user')?.content || '';
    
    // Check for special cases in the query
    const isJeepCompassQuery = userQuery.toLowerCase().includes('جيب كومباس') || userQuery.toLowerCase().includes('jeep compass');
    const isJeepLaredoQuery = userQuery.toLowerCase().includes('جيب لاريدو') || 
                              userQuery.toLowerCase().includes('jeep laredo') || 
                              userQuery.toLowerCase().includes('جييب لاريدو') ||
                              (userQuery.toLowerCase().includes('جيب') && userQuery.includes('لاريدو')) ||
                              (userQuery.toLowerCase().includes('jeep') && userQuery.toLowerCase().includes('laredo'));
    
    // Get car data for oil recommendations
    let carData: ExtractedCarData | undefined;
    let carSpecsPrompt = '';
    let carTrimData = null;
    
    try {
      // First, try to use enhanced CarQuery API
      const normalizedData = await normalizeArabicCarInput(userQuery);
      
      // Special handling for specific car models not well-detected by default algorithms
      if (isJeepCompassQuery && !normalizedData.make) {
        console.log('Special handling for Jeep Compass');
        normalizedData.make = 'jeep';
        normalizedData.model = 'compass';
        normalizedData.confidence = 80;
      }
      
      // Special handling for Jeep Grand Cherokee (Laredo)
      if (isJeepLaredoQuery && (!normalizedData.make || !normalizedData.model)) {
        console.log('Special handling for Jeep Grand Cherokee (Laredo)');
        normalizedData.make = 'jeep';
        normalizedData.model = 'grand cherokee';
        normalizedData.confidence = 80;
      }
      
      if (normalizedData.make && normalizedData.model) {
        // If we have make and model, get detailed car specifications
        // Always include year parameter when available for more accurate results
        const trims = await getCarModels(
          normalizedData.make,
          normalizedData.model,
          normalizedData.year
        );
        
        if (trims && trims.length > 0) {
          // Use the first trim for demonstration purposes
          // In a future update, we could allow selecting from multiple trims
          carTrimData = trims[0];
          const specs = extractOilRecommendationData(carTrimData);
          const oilRecommendation = suggestOil(specs);
          
          // Log successful car data retrieval
          logger.info("Successfully retrieved car data from CarQuery API", {
            make: normalizedData.make,
            model: normalizedData.model,
            year: normalizedData.year,
            trimCount: trims.length,
            selectedTrim: carTrimData.model_trim
          });
          
          // Special handling for Jeep Compass to ensure correct data
          if (isJeepCompassQuery && normalizedData.year && parseInt(normalizedData.year) >= 2017) {
            oilRecommendation.viscosity = '0W-20';
            oilRecommendation.capacity = '5.2 لتر';
            console.log('Applied special Jeep Compass oil correction');
          }
          
          // Special handling for Jeep Grand Cherokee (Laredo) to ensure correct data
          if (isJeepLaredoQuery) {
            // Check for engine size indicators in the query
            const isV8 = userQuery.toLowerCase().includes('5.7') || 
                        userQuery.toLowerCase().includes('v8') || 
                        userQuery.toLowerCase().includes('هيمي') ||
                        userQuery.toLowerCase().includes('hemi');
                        
            if (isV8) {
              oilRecommendation.viscosity = '5W-20';
              oilRecommendation.capacity = '6.6 لتر';
              console.log('Applied special Jeep Grand Cherokee V8 oil correction');
            } else {
              // Default to V6 specs (most common)
              oilRecommendation.viscosity = '0W-20';
              oilRecommendation.capacity = '5.7 لتر';
              console.log('Applied special Jeep Grand Cherokee V6 oil correction');
            }
          }
          
          // Special handling for Chevrolet Camaro 2016-2018
          const isCamaroQuery = userQuery.toLowerCase().includes('كامارو') || 
                               userQuery.toLowerCase().includes('camaro') ||
                               userQuery.toLowerCase().includes('كمارو');
                               
          if (isCamaroQuery) {
            // Extract year if available
            const yearMatch = userQuery.match(/20(\d{2})/);
            const year = yearMatch ? `20${yearMatch[1]}` : '2016'; // Default to 2016 if not specified
            
            // Check for engine size indicators in the query
            const isV8 = userQuery.toLowerCase().includes('v8') || 
                        userQuery.toLowerCase().includes('ss') || 
                        userQuery.toLowerCase().includes('اس اس') ||
                        userQuery.toLowerCase().includes('zl1') ||
                        userQuery.toLowerCase().includes('زد ال 1') ||
                        userQuery.toLowerCase().includes('6.2');
                        
            const isV6 = userQuery.toLowerCase().includes('v6') || 
                        userQuery.toLowerCase().includes('3.6');
            
            if (isV8) {
              // Add exact Chevrolet Camaro V8 specifications to the prompt
              oilRecommendation.viscosity = '5W-30';
              oilRecommendation.capacity = '9.5 لتر';
              console.log('Applied special Chevrolet Camaro V8 oil correction');
            } else if (isV6) {
              // Add exact Chevrolet Camaro V6 specifications to the prompt
              oilRecommendation.viscosity = '5W-30';
              oilRecommendation.capacity = '5.7 لتر';
              console.log('Applied special Chevrolet Camaro V6 oil correction');
            } else {
              // Add exact Chevrolet Camaro L4 specifications to the prompt (base model)
              oilRecommendation.viscosity = '5W-30';
              oilRecommendation.capacity = '4.7 لتر';
              console.log('Applied special Chevrolet Camaro L4 oil correction');
            }
          }
          
          // Add car specifications to the system prompt
          carSpecsPrompt = `
الآن لديك معلومات دقيقة عن هذه السيارة من قاعدة بيانات CarQuery:
- النوع: ${normalizedData.make} ${normalizedData.model} ${normalizedData.year || ''}
- المحرك: ${carTrimData.model_engine_type || 'غير معروف'} ${carTrimData.model_engine_cc || '0'}cc
- نوع الوقود: ${carTrimData.model_engine_fuel || 'غير معروف'}
${carTrimData.model_engine_compression ? `- نسبة الانضغاط: ${carTrimData.model_engine_compression}` : ''}
${carTrimData.model_weight_kg ? `- وزن السيارة: ${carTrimData.model_weight_kg} كغم` : ''}
${carTrimData.model_lkm_city ? `- استهلاك الوقود: ${carTrimData.model_lkm_city} لتر/كم` : ''}
${carTrimData.model_drive ? `- نظام الدفع: ${carTrimData.model_drive}` : ''}

توصية الزيت بناء على المواصفات:
- اللزوجة المقترحة: ${oilRecommendation.viscosity}
- نوع الزيت: ${oilRecommendation.quality}
- كمية الزيت المطلوبة: ${oilRecommendation.capacity}
- السبب: ${oilRecommendation.reason}

استخدم هذه المعلومات لتقديم توصية دقيقة، لكن يمكنك تعديل التوصية بناء على معرفتك المتخصصة.
`;
        } else {
          logger.warn("No car trims found for the normalized car data", {
            make: normalizedData.make,
            model: normalizedData.model,
            year: normalizedData.year
          });
        }
      }
      
      // Also try the legacy car data extraction as fallback
      if (!carTrimData) {
        carData = enhancedExtractCarData(userQuery);
        logger.info("Using fallback car data extraction", { 
          carData,
          confidence: carData?.confidence || 0
        });
      }
    } catch (carDataError) {
      logger.error("Error extracting car data", { error: carDataError });
      // Continue execution - this is not a fatal error
    }
    
    // If we have car data or specs, update the system prompt
    let enhancedSystemPrompt = openRouter.systemPrompt;
    if (carSpecsPrompt) {
      enhancedSystemPrompt += "\n\n" + carSpecsPrompt;
    } else if (carData && carData.isValid) {
      enhancedSystemPrompt += `\n\nالمستخدم سأل عن ${carData.carBrand} ${carData.carModel} ${carData.year || ''}`;
    }
    
    // Special handling for specific car models that require exact specifications
    // This is a fallback when the API and other methods don't provide accurate data
    if (isJeepCompassQuery) {
      // Extract year if available
      const yearMatch = userQuery.match(/20(\d{2})/);
      const year = yearMatch ? `20${yearMatch[1]}` : '2019'; // Default to 2019 if not specified
      
      // Add exact Jeep Compass specifications to the prompt
      enhancedSystemPrompt += `\n\n
معلومات دقيقة عن جيب كومباس ${year}:
- سعة زيت المحرك: 5.2 لتر
- نوع الزيت الموصى به: 0W-20 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
- فترة تغيير الزيت: كل 8000 كم في الظروف العراقية

يجب التأكد من ذكر هذه المعلومات الدقيقة في إجابتك.
`;
      
      console.log('Added Jeep Compass override specifications');
    }
    
    // Special handling for Jeep Grand Cherokee (Laredo)
    if (isJeepLaredoQuery) {
      // Extract year if available
      const yearMatch = userQuery.match(/20(\d{2})/);
      const year = yearMatch ? `20${yearMatch[1]}` : '2020'; // Default to 2020 if not specified
      
      // Check for engine size indicators in the query
      const isV8 = userQuery.toLowerCase().includes('5.7') || 
                  userQuery.toLowerCase().includes('v8') || 
                  userQuery.toLowerCase().includes('هيمي') ||
                  userQuery.toLowerCase().includes('hemi');
      
      if (isV8) {
        // Add exact Jeep Grand Cherokee V8 specifications to the prompt
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن جيب جراند شيروكي (لاريدو) ${year} بمحرك V8 HEMI:
- سعة زيت المحرك: 6.6 لتر
- نوع الزيت الموصى به: 5W-20 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
- فترة تغيير الزيت: كل 8000 كم في الظروف العراقية

يجب التأكد من ذكر هذه المعلومات الدقيقة في إجابتك.
`;
      } else {
        // Add exact Jeep Grand Cherokee V6 specifications to the prompt (most common)
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن جيب جراند شيروكي (لاريدو) ${year} بمحرك V6:
- سعة زيت المحرك: 5.7 لتر
- نوع الزيت الموصى به: 0W-20 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
- فترة تغيير الزيت: كل 8000 كم في الظروف العراقية

يجب التأكد من ذكر هذه المعلومات الدقيقة في إجابتك.
`;
      }
      
      console.log('Added Jeep Grand Cherokee (Laredo) override specifications');
    }
    
    // Special handling for Chevrolet Camaro 2016-2018
    const isCamaroQuery = userQuery.toLowerCase().includes('كامارو') || 
                         userQuery.toLowerCase().includes('camaro') ||
                         userQuery.toLowerCase().includes('كمارو');
                         
    if (isCamaroQuery) {
      // Extract year if available
      const yearMatch = userQuery.match(/20(\d{2})/);
      const year = yearMatch ? `20${yearMatch[1]}` : '2016'; // Default to 2016 if not specified
      
      // Check for engine size indicators in the query
      const isV8 = userQuery.toLowerCase().includes('v8') || 
                  userQuery.toLowerCase().includes('ss') || 
                  userQuery.toLowerCase().includes('اس اس') ||
                  userQuery.toLowerCase().includes('zl1') ||
                  userQuery.toLowerCase().includes('زد ال 1') ||
                  userQuery.toLowerCase().includes('6.2');
                  
      const isV6 = userQuery.toLowerCase().includes('v6') || 
                  userQuery.toLowerCase().includes('3.6');
      
      if (isV8) {
        // Add exact Chevrolet Camaro V8 specifications to the prompt
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن شيفروليت كامارو ${year} بمحرك V8:
- سعة زيت المحرك: 9.5 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
- فترة تغيير الزيت: كل 8000 كم في الظروف العراقية
- نوع المحرك: 6.2L V8 (LT1/LT4)

يجب التأكد من ذكر هذه المعلومات الدقيقة في إجابتك، خاصة سعة الزيت الكبيرة (9.5 لتر) التي تختلف كثيراً عن الطرازات الأخرى.
التوصية النهائية: Mobil 1 5W-30 Full Synthetic (9.5 لتر)
`;
      } else if (isV6) {
        // Add exact Chevrolet Camaro V6 specifications to the prompt
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن شيفروليت كامارو ${year} بمحرك V6:
- سعة زيت المحرك: 5.7 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
- فترة تغيير الزيت: كل 8000 كم في الظروف العراقية
- نوع المحرك: 3.6L V6 (LGX)

يجب التأكد من ذكر هذه المعلومات الدقيقة في إجابتك.
التوصية النهائية: Valvoline MaxLife 5W-30 Full Synthetic (5.7 لتر)
`;
      } else {
        // Add exact Chevrolet Camaro L4 specifications to the prompt (base model)
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن شيفروليت كامارو ${year} بمحرك L4:
- سعة زيت المحرك: 4.7 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
- فترة تغيير الزيت: كل 8000 كم في الظروف العراقية
- نوع المحرك: 2.0L L4 Turbo (LTG)

يجب التأكد من ذكر هذه المعلومات الدقيقة في إجابتك.
التوصية النهائية: Castrol EDGE 5W-30 Full Synthetic (4.7 لتر)
`;
      }
      
      console.log('Added Chevrolet Camaro override specifications');
    }
    
    // Create OpenRouter client
    const openrouter = createOpenRouterClient();
    
    // Check and potentially reset token limit status
    checkAndResetTokenLimitStatus();
    
    // Determine which model to use based on token limit status
    let modelToUse = openRouter.primaryModel;
    if (apiStatus.isTokenLimitReached) {
      console.log('Token limit reached, using Mistral model');
      modelToUse = openRouter.mistralModel;
    }
    
    // Update analytics asynchronously (don't await)
    try {
      saveQueryToAnalytics(userQuery, carData).catch(err => {
        console.error("Error saving analytics:", err);
      });
    } catch (analyticsError) {
      console.error("Failed to trigger analytics:", analyticsError);
      // Non-fatal error, continue
    }
    
    // Create stream response using streamText
    const result = streamText({
      model: openrouter(modelToUse),
      system: enhancedSystemPrompt,
      messages,
      maxTokens: 900,
      temperature: 0.3,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
    });
    
    // Return the data stream response directly
    return result.toDataStreamResponse();
    
  } catch (error: any) {
    console.error(`[${requestId}] Error processing request:`, error);
    logger.error("Chat API error", { error, requestId });
    
    return new Response(
      JSON.stringify({
        error: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        requestId,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}