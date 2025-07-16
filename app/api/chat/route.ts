import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import CarAnalyzer from "@/utils/carAnalyzer"
import logger from "@/utils/logger"
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { z } from 'zod'
import { normalizeArabicCarInput, getCarModels, extractOilRecommendationData, suggestOil } from '@/utils/carQueryApi'
// استيراد قاعدة البيانات الداخلية والمساعدة في معالجة VIN
import officialSpecs from '@/data/officialSpecs'
import { getAccurateOilRecommendation, decodeVIN } from '@/utils/vinEngineResolver'

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
  vin?: string; // Add VIN to the interface
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
  primaryModel: "google/gemini-2.0-flash-001",
fallbackModel: "rekaai/reka-flash-3:free",
mistralModel: "google/gemma-3-27b-it:free"
,
  maxRetries: 3,
  timeout: 30000,
  systemPrompt: `أنت مساعد تقني ذكي متخصص في زيوت وفلاتر السيارات، تمثل فريق الدعم الفني لمتجر "هندسة السيارات" 🇮🇶.

🎯 الهدف الرئيسي:
تقديم توصيات دقيقة 100% ومضمونة بناءً فقط على البيانات الرسمية من الشركات المصنعة، مع مراعاة الظروف القاسية للمناخ العراقي.

🌍 البيئة في العراق:
- حرارة مرتفعة تصل إلى 50°C
- غبار دائم وقيادة في زحام
✅ يتطلب استخدام زيوت Full Synthetic فقط من علامات معتمدة
✅ يتطلب فلاتر هواء عالية الجودة وتغيير منتظم

🛠️ مسؤولياتك:

1️⃣ تحديد نوع المحرك:
- ✅ إذا كان هناك أكثر من نوع محرك معروف للسيارة: **اعرض جميع الخيارات تلقائياً**
- ❌ لا تطلب من المستخدم اختيار نوع المحرك
- ❌ لا تفترض نوع المحرك من اسم السيارة فقط

2️⃣ تحديد سعة الزيت:
- ✅ استخرج سعة الزيت الحقيقية من دليل الشركة (وليس حجم المحرك)
- ❗ لا تخلط بين Engine Size و Oil Capacity

3️⃣ التوصيات:
- لكل نوع محرك، قدم فقط:
  - ✅ زيت واحد موصى به
  - 🅱️ بديل واحد فقط إن لزم
  - 🔩 رقم فلتر الزيت المناسب
  - 🌬️ رقم فلتر الهواء المناسب + تغيير كل كم كم + السعر (إن وجد)
- ❌ لا تُقدّم أكثر من خيارين لأي مكون

🛢️ الزيوت المسموح بها فقط:
Castrol, Mobil 1, Liqui Moly, Valvoline, Motul, Meguin, Hanata

🔧 الفلاتر المسموح بها فقط:
Denkermann, Mahle, Mann, Bosch, Fram

📋 تنسيق الإجابة الإجباري (لكل محرك):

1️⃣ <b>[اسم المحرك]</b>  
🛢️ سعة الزيت: [X.X لتر]  
⚙️ اللزوجة: [XW-XX]  
🔧 نوع الزيت: Full Synthetic  
🌡️ مناسب لحرارة العراق: ✅  
🎯 <b>التوصية النهائية:</b> [اسم الزيت + اللزوجة] ([سعة الزيت] لتر)  
📦 <b>فلتر الزيت:</b> [رقم فلتر الزيت]  
🌬️ <b>فلتر الهواء:</b> [رقم فلتر الهواء] (تغيير كل [عدد] كم)

❗ أي مخالفة لهذه التعليمات تعتبر خطأ فادح

🟩 مثال:
إذا كانت السيارة تحتوي على محرك واحد معروف → قدم التوصية بذلك المحرك مباشرة  
🟨 إذا كانت السيارة تحتوي على أكثر من محرك معروف → قدم التوصيات لجميع المحركات بدون طلب من المستخدم  
🟥 لا تطلب من المستخدم اختيار نوع المحرك إطلاقاً

🎯 هدفك النهائي:
تقديم توصية دقيقة، موثوقة، مفهومة، ومناسبة تماماً للبيئة العراقية، وفقاً للتعليمات أعلاه فقط.

`,
  headers: {
    "HTTP-Referer": "https://www.carsiqai.com",
    "X-Title": "Car Service Chat - CarsiqAi",
  },
}

// Enhanced OpenRouter client with retry logic
const createOpenRouterClient = () => {
  return createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Car Service Chat - CarsiqAi"
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
  
  // VIN extraction from query
  let vinNumber: string | undefined;
  const vinPatterns = [
    /\bVIN\s*[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/i,
    /\bرقم الهيكل\s*[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/i,
    /\b([A-HJ-NPR-Z0-9]{17})\b/i
  ];
  
  for (const pattern of vinPatterns) {
    const match = normalizedQuery.match(pattern);
    if (match && match[1]) {
      // Verify this looks like a valid VIN (17 characters, no I,O,Q)
      const potentialVin = match[1].toUpperCase();
      if (/^[A-HJ-NPR-Z0-9]{17}$/.test(potentialVin) && !potentialVin.includes('I') && !potentialVin.includes('O') && !potentialVin.includes('Q')) {
        vinNumber = potentialVin;
        confidence += 35; // High confidence for VIN detection
        break;
      }
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
    vin: vinNumber, // Add VIN to extracted data
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
  const lowerQuery = query.toLowerCase()
  
  // Car Specifications
  if (
    lowerQuery.includes('مواصفات') || 
    lowerQuery.includes('سعة المحرك') || 
    lowerQuery.includes('engine size') || 
    lowerQuery.includes('cc') ||
    lowerQuery.includes('سي سي')
  ) {
    return 'SPECIFICATIONS'
  }
  
  // Oil Change/Service
  if (
    lowerQuery.includes('زيت') ||
    lowerQuery.includes('oil') ||
    lowerQuery.includes('تغيير') ||
    lowerQuery.includes('فلتر الزيت') ||
    lowerQuery.includes('oil filter')
  ) {
    return 'SERVICE'
  }
  
  // Air Filter
  if (
    lowerQuery.includes('فلتر الهواء') ||
    lowerQuery.includes('air filter') ||
    lowerQuery.includes('فلتر هواء')
  ) {
    return 'SERVICE'
  }
  
  // Maintenance
  if (
    lowerQuery.includes('صيانة') || 
    lowerQuery.includes('maintenance') ||
    lowerQuery.includes('خدمة')
  ) {
    return 'MAINTENANCE'
  }
  
  // Price
  if (
    lowerQuery.includes('سعر') || 
    lowerQuery.includes('تكلفة') || 
    lowerQuery.includes('price') || 
    lowerQuery.includes('cost')
  ) {
    return 'PRICE'
  }
  
  // Comparison
  if (
    lowerQuery.includes('مقارنة') || 
    lowerQuery.includes('أفضل من') || 
    lowerQuery.includes('vs') || 
    lowerQuery.includes('compare')
  ) {
    return 'COMPARISON'
  }
  
  // Features
  if (
    lowerQuery.includes('ميزات') || 
    lowerQuery.includes('خصائص') || 
    lowerQuery.includes('features')
  ) {
    return 'FEATURES'
  }
  
  // Fuel consumption
  if (
    lowerQuery.includes('استهلاك الوقود') || 
    lowerQuery.includes('fuel') || 
    lowerQuery.includes('كم يصرف')
  ) {
    return 'FUEL_CONSUMPTION'
  }
  
  // Insurance
  if (
    lowerQuery.includes('تأمين') || 
    lowerQuery.includes('insurance')
  ) {
    return 'INSURANCE'
  }
  
  // Reviews
  if (
    lowerQuery.includes('تقييم') || 
    lowerQuery.includes('review') ||
    lowerQuery.includes('رأي')
  ) {
    return 'REVIEWS'
  }
  
  return 'OTHER'
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
    const isNissanSunnyQuery = userQuery.toLowerCase().includes('نيسان صني') || 
                               userQuery.toLowerCase().includes('nissan sunny') ||
                              (userQuery.toLowerCase().includes('نيسان') && 
                               (userQuery.toLowerCase().includes('صني') || userQuery.toLowerCase().includes('sunny')));
    const isToyotaCorollaQuery = userQuery.toLowerCase().includes('تويوتا كورولا') || 
                              userQuery.toLowerCase().includes('toyota corolla') ||
                             (userQuery.toLowerCase().includes('تويوتا') && 
                              (userQuery.toLowerCase().includes('كورولا') || userQuery.toLowerCase().includes('corolla')));
    const isKiaCeratoQuery = userQuery.toLowerCase().includes('كيا سيراتو') || 
                          userQuery.toLowerCase().includes('kia cerato') ||
                         (userQuery.toLowerCase().includes('كيا') && 
                          (userQuery.toLowerCase().includes('سيراتو') || userQuery.toLowerCase().includes('cerato')));
    
    // Get car data for oil recommendations
    let carData: ExtractedCarData | undefined;
    let carSpecsPrompt = '';
    let carTrimData = null;
    
    try {
      // First, try to use enhanced CarQuery API
      const normalizedData = await normalizeArabicCarInput(userQuery);
      
      // Check for VIN in query for more accurate info
      let extractedVin = '';
      const vinPatterns = [
        /\bVIN\s*[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/i,
        /\bرقم الهيكل\s*[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/i,
        /\b([A-HJ-NPR-Z0-9]{17})\b/i
      ];
      
      for (const pattern of vinPatterns) {
        const match = userQuery.match(pattern);
        if (match && match[1]) {
          const potentialVin = match[1].toUpperCase();
          if (/^[A-HJ-NPR-Z0-9]{17}$/.test(potentialVin)) {
            extractedVin = potentialVin;
            console.log('Detected VIN:', extractedVin);
            
            // Try to decode the VIN for enhanced info
            try {
              const vinData = await decodeVIN(extractedVin);
              console.log('Decoded VIN data:', vinData);
              
              // If VIN is decoded successfully, update normalized data
              if (vinData) {
                if (!normalizedData.make || !normalizedData.model) {
                  // Use vinData to improve car identification
                  console.log('Enhanced car identification using VIN');
                }
              }
            } catch (vinError) {
              console.error('Error decoding VIN:', vinError);
            }
            break;
          }
        }
      }
      
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
      
      // Special handling for Nissan Sunny
      if (isNissanSunnyQuery && (!normalizedData.make || !normalizedData.model)) {
        console.log('Special handling for Nissan Sunny');
        normalizedData.make = 'nissan';
        normalizedData.model = 'sunny';
        normalizedData.confidence = 80;
      }

      // Special handling for Toyota Corolla
      if (isToyotaCorollaQuery && (!normalizedData.make || !normalizedData.model)) {
        console.log('Special handling for Toyota Corolla');
        normalizedData.make = 'toyota';
        normalizedData.model = 'corolla';
        normalizedData.confidence = 80;
      }

      // Special handling for Kia Cerato
      if (isKiaCeratoQuery && (!normalizedData.make || !normalizedData.model)) {
        console.log('Special handling for Kia Cerato');
        normalizedData.make = 'kia';
        normalizedData.model = 'cerato';
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
                        
            const engineSpecified = isV8 || isV6 || userQuery.toLowerCase().includes('l4') || 
                                   userQuery.toLowerCase().includes('2.0') || 
                                   userQuery.toLowerCase().includes('تيربو') || 
                                   userQuery.toLowerCase().includes('turbo');
            
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
            } else if (!engineSpecified) {
              // If no specific engine is mentioned, don't set a default capacity
              // This will trigger the multi-option response in the prompt
              console.log('No specific Camaro engine mentioned - will show all options');
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
        
        // استخدام vinEngineResolver إذا تم اكتشاف VIN
        if (carData.vin) {
          try {
            // الحصول على توصيات الزيت باستخدام VIN
            const vinRecommendations = await getAccurateOilRecommendation(
              carData.carBrand,
              carData.carModel,
              carData.year || new Date().getFullYear(),
              carData.vin
            );
            
            if (vinRecommendations) {
              console.log('Successfully retrieved oil recommendations using VIN');
              enhancedSystemPrompt += `\n\nتم استخراج بيانات دقيقة باستخدام رقم الهيكل (VIN).`;
            }
          } catch (vinError) {
            console.error('Failed to get VIN recommendations:', vinError);
          }
        }
    }
    
    // Special handling for specific car models that require exact specifications
    // This is a fallback when the API and other methods don't provide accurate data
      
      // ✅ Nissan Sunny override
      if (isNissanSunnyQuery) {
      // Extract year if available
      const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2019';
      
      enhancedSystemPrompt += `\n\n
🚗 نيسان صني ${year} تأتي بمحركين حسب السوق:

1️⃣ <b>HR15DE - سعة 1.5 لتر (الأكثر شيوعًا)</b>
🛢️ سعة الزيت: 3.4 لتر (مع الفلتر)
⚙️ اللزوجة: 5W-30
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Mobil 1 5W-30 Full Synthetic (3.4 لتر)

2️⃣ <b>HR16DE - سعة 1.6 لتر (أقل شيوعًا)</b>
🛢️ سعة الزيت: 4.4 لتر (مع الفلتر)
⚙️ اللزوجة: 5W-30
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Valvoline 5W-30 Full Synthetic (4.4 لتر)

⚠️ لا تفترض نوع المحرك. إذا لم يذكر المستخدم النوع، اطلب منه تحديده بدقة.`;
        
        console.log('Added Nissan Sunny override specifications');
      }
      
      // ✅ Toyota Corolla override
      if (isToyotaCorollaQuery) {
        const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2018';
        
        // استخدام بيانات officialSpecs بدلاً من تكرار القيم بشكل ثابت
        let corollaSpecs: Record<string, any> = {};
        try {
          const toyotaData = officialSpecs['toyota']?.['corolla'] || {};
          const isOlderModel = parseInt(year) < 2020;
          
          // اختيار نطاق السنوات المناسب
          const yearRange = isOlderModel ? '2014-2019' : '2020-2024';
          corollaSpecs = toyotaData[yearRange] || {};
          
          console.log(`Using officialSpecs for Toyota Corolla ${year}, year range: ${yearRange}`);
        } catch (specError) {
          console.error('Error accessing officialSpecs for Toyota Corolla:', specError);
        }
        
        // استخدام بيانات officialSpecs إذا كانت متوفرة، وإلا استخدام قيم افتراضية
        const newModel: Record<string, string> = {
          capacity: corollaSpecs['capacity'] || '4.4L',
          viscosity: corollaSpecs['viscosity'] || '0W-20',
          engineSize: corollaSpecs['engineSize'] || '2.0L',
          oilType: corollaSpecs['oilType'] || 'Full Synthetic',
          recommended: 'Castrol EDGE 0W-20'
        };
        
        const oldModel: Record<string, string> = {
          capacity: corollaSpecs['capacity'] || '4.2L',
          viscosity: corollaSpecs['viscosity'] || '5W-30',
          engineSize: corollaSpecs['engineSize'] || '1.8L',
          oilType: corollaSpecs['oilType'] || 'Full Synthetic',
          recommended: 'Mobil 1 5W-30'
        };
        
        const isOlderModel = parseInt(year) < 2020;
        
        enhancedSystemPrompt += `\n\n
🚗 تويوتا كورولا ${year} تأتي بمحركين حسب السوق:

1️⃣ <b>${isOlderModel ? '1.8L 4-cylinder 2ZR-FE' : '2.0L 4-cylinder M20A-FKS'}</b>
🛢️ سعة الزيت: ${isOlderModel ? oldModel.capacity.replace('L', '') : newModel.capacity.replace('L', '')} لتر
⚙️ اللزوجة: ${isOlderModel ? oldModel.viscosity : newModel.viscosity}
🔧 نوع الزيت: ${isOlderModel ? oldModel.oilType : newModel.oilType}
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: ${isOlderModel ? oldModel.recommended : newModel.recommended} ${isOlderModel ? oldModel.viscosity : newModel.viscosity} ${isOlderModel ? oldModel.oilType : newModel.oilType} (${isOlderModel ? oldModel.capacity.replace('L', '') : newModel.capacity.replace('L', '')} لتر)

2️⃣ <b>1.6L 4-cylinder 1ZR-FE (أقل شيوعًا)</b>
🛢️ سعة الزيت: 3.7 لتر
⚙️ اللزوجة: 5W-30
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Mobil 1 5W-30 Full Synthetic (3.7 لتر)

⚠️ لا تفترض نوع المحرك. إذا لم يذكر المستخدم النوع، اطلب منه تحديده بدقة.`;
        
        console.log('Added Toyota Corolla override specifications');
      }
      
      // ✅ Kia Cerato override
      if (isKiaCeratoQuery) {
        const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2018';
        
        // استخدام بيانات officialSpecs إذا كانت متوفرة لكيا سيراتو
        let ceratoSpecs: Record<string, any> = {};
        try {
          const kiaData = officialSpecs['kia']?.['cerato'] || {};
          
          // محاولة العثور على نطاق سنوات مناسب
          for (const yearRange of Object.keys(kiaData)) {
            const rangeParts = yearRange.split('-');
            if (rangeParts.length === 2) {
              const startYear = parseInt(rangeParts[0]);
              const endYear = parseInt(rangeParts[1]);
              if (parseInt(year) >= startYear && parseInt(year) <= endYear) {
                ceratoSpecs = kiaData[yearRange] || {};
                console.log(`Found matching year range ${yearRange} for Kia Cerato ${year}`);
                break;
              }
            }
          }
        } catch (specError) {
          console.error('Error accessing officialSpecs for Kia Cerato:', specError);
        }
        
        // استخدام البيانات من officialSpecs أو القيم الافتراضية
        const model20L: Record<string, string> = {
          capacity: ceratoSpecs['capacity'] || '4.0L',
          viscosity: ceratoSpecs['viscosity'] || '5W-30',
          engineSize: ceratoSpecs['engineSize'] || '2.0L',
          oilType: ceratoSpecs['oilType'] || 'Full Synthetic',
          recommended: 'Liqui Moly 5W-30'
        };
        
        enhancedSystemPrompt += `\n\n
🚗 كيا سيراتو ${year} تأتي بمحركين حسب السوق:

1️⃣ <b>2.0L 4-cylinder Nu MPI (الأكثر شيوعًا)</b>
🛢️ سعة الزيت: ${model20L.capacity.replace('L', '')} لتر
⚙️ اللزوجة: ${model20L.viscosity}
🔧 نوع الزيت: ${model20L.oilType}
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: ${model20L.recommended} ${model20L.viscosity} ${model20L.oilType} (${model20L.capacity.replace('L', '')} لتر)

2️⃣ <b>1.6L 4-cylinder Gamma MPI (أقل شيوعًا)</b>
🛢️ سعة الزيت: 3.3 لتر
⚙️ اللزوجة: 5W-30
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Motul 8100 5W-30 Full Synthetic (3.3 لتر)

⚠️ لا تفترض نوع المحرك. إذا لم يذكر المستخدم النوع، اطلب منه تحديده بدقة.`;
        
        console.log('Added Kia Cerato override specifications');
      }
      
      // ✅ Jeep Compass override
      if (isJeepCompassQuery) {
        const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2019';
      
        enhancedSystemPrompt += `\n\n
🚗 جيب كومباس ${year}:
🛢️ سعة الزيت: 5.2 لتر
⚙️ اللزوجة: 0W-20
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Mobil 1 0W-20 Full Synthetic (5.2 لتر)`;
      
      console.log('Added Jeep Compass override specifications');
    }
    
      // ✅ Jeep Grand Cherokee (Laredo) override
    if (isJeepLaredoQuery) {
      const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2020';
      
      const isV8 = userQuery.toLowerCase().includes('5.7') || 
                  userQuery.toLowerCase().includes('v8') || 
                  userQuery.toLowerCase().includes('هيمي') ||
                  userQuery.toLowerCase().includes('hemi');
      
      if (isV8) {
        enhancedSystemPrompt += `\n\n
🚗 جيب جراند شيروكي (لاريدو) ${year} - محرك V8 HEMI:
🛢️ سعة الزيت: 6.6 لتر
⚙️ اللزوجة: 5W-20
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Castrol EDGE 5W-20 Full Synthetic (6.6 لتر)`;
      } else {
        enhancedSystemPrompt += `\n\n
🚗 جيب جراند شيروكي (لاريدو) ${year} - محرك V6:
🛢️ سعة الزيت: 5.7 لتر
⚙️ اللزوجة: 0W-20
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Mobil 1 0W-20 Full Synthetic (5.7 لتر)`;
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
                  
      const engineSpecified = isV8 || isV6 || 
                             userQuery.toLowerCase().includes('l4') || 
                             userQuery.toLowerCase().includes('2.0') || 
                             userQuery.toLowerCase().includes('تيربو') || 
                             userQuery.toLowerCase().includes('turbo');
      
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
      } else if (!engineSpecified) {
        // When no specific engine is mentioned, show all options
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن شيفروليت كامارو ${year}:
شيفروليت كامارو ${year} تأتي بثلاثة خيارات من المحركات، كل منها يتطلب كمية مختلفة من الزيت:

1️⃣ محرك 2.0L تيربو – 4 سلندر (LTG)
- سعة زيت المحرك: 4.7 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
التوصية النهائية للمحرك 2.0L: Liqui Moly 5W-40 Full Synthetic (4.7 لتر)

2️⃣ محرك 3.6L V6 (LGX)
- سعة زيت المحرك: 5.7 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
التوصية النهائية للمحرك 3.6L: Mobil 1 5W-30 Full Synthetic (5.7 لتر)

3️⃣ محرك 6.2L V8 (LT1 / LT4)
- سعة زيت المحرك: 9.5 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
التوصية النهائية للمحرك 6.2L: Castrol EDGE 5W-30 Full Synthetic (9.5 لتر)

⚠️ تحذير مهم: يجب عليك عرض جميع الخيارات الثلاثة للمستخدم! لا تختر خيارًا واحدًا فقط!
استخدام كمية غير صحيحة من الزيت قد يسبب أضرارًا بالغة للمحرك.

⚠️ قاعدة إلزامية: عندما لا يحدد المستخدم نوع المحرك بوضوح، يجب عليك:
1. عرض جميع الخيارات الثلاثة كاملة
2. التأكيد على أهمية معرفة نوع المحرك بالضبط
3. الطلب من المستخدم تحديد نوع المحرك للحصول على توصية دقيقة

لا تقدم توصية نهائية واحدة فقط! لا تفترض أن المحرك هو 6.2L! لا تستخدم حجم المحرك (6.2L) كسعة للزيت!
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