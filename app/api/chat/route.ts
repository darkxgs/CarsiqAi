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
// Import the new modular system prompt builder
import { buildMinimalSystemPrompt } from '@/utils/systemPromptBuilder'

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
  mistralModel: "google/gemma-3-27b-it:free",
  maxRetries: 3,
  timeout: 30000,
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
    'كامارو', 'camaro', 'كمارو', 'كامرو',
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
  
  return {
    carBrand: detectedBrand,
    carModel: detectedModel,
    year,
    mileage,
    vin: vinNumber,
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
          brand: 'Unknown',
          year: 0,
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
    
    const { messages } = validation.data as { messages: { role: "user" | "assistant" | "system"; content: string; }[] }
    
    // Process first user message to extract car data
    const userQuery = messages.find(m => m.role === 'user')?.content || '';
    
    // Get car data for oil recommendations
    let carData: ExtractedCarData | undefined;
    let carSpecsPrompt = '';
    let carTrimData = null;
    
    try {
      // First, try to use enhanced CarQuery API
      const normalizedData = await normalizeArabicCarInput(userQuery);
      
      if (normalizedData.make && normalizedData.model) {
        // If we have make and model, get detailed car specifications
        const trims = await getCarModels(
          normalizedData.make,
          normalizedData.model,
          normalizedData.year
        );
        
        if (trims && trims.length > 0) {
          carTrimData = trims[0];
          const specs = extractOilRecommendationData(carTrimData);
          const oilRecommendation = suggestOil(specs);
          
          logger.info("Successfully retrieved car data from CarQuery API", {
            make: normalizedData.make,
            model: normalizedData.model,
            year: normalizedData.year,
            trimCount: trims.length,
            selectedTrim: carTrimData.model_trim
          });
          
          // Add car specifications to the system prompt
          carSpecsPrompt = `
الآن لديك معلومات دقيقة عن هذه السيارة من قاعدة بيانات CarQuery:
- النوع: ${normalizedData.make} ${normalizedData.model} ${normalizedData.year || ''}
- المحرك: ${carTrimData.model_engine_type || 'غير معروف'} ${carTrimData.model_engine_cc || '0'}cc
- نوع الوقود: ${carTrimData.model_engine_fuel || 'غير معروف'}
${carTrimData.model_engine_compression ? `- نسبة الانضغاط: ${carTrimData.model_engine_compression}` : ''}
${carTrimData.model_weight_kg ? `- وزن السيارة: ${carTrimData.model_weight_kg} كغم` : ''}
${carTrimData.model_lkm_city ? `- استهلاك الوقود: ${carTrimData.model_lkm_city} لتر/كم` : ''}

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
    
    // Build the system prompt dynamically using the new modular system
    let enhancedSystemPrompt = buildMinimalSystemPrompt(carData?.carBrand, carData?.carModel);
    
    // If we have car specs from API, add them
    if (carSpecsPrompt) {
      enhancedSystemPrompt += "\n\n" + carSpecsPrompt;
    } else if (carData && carData.isValid) {
      enhancedSystemPrompt += `\n\nالمستخدم سأل عن ${carData.carBrand} ${carData.carModel} ${carData.year || ''}`;
      
      // استخدام vinEngineResolver إذا تم اكتشاف VIN
      if (carData.vin) {
        try {
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
    
    // Create OpenRouter client
    const openrouter = createOpenRouterClient();
    
    // Check and potentially reset token limit status
    checkAndResetTokenLimitStatus();
    
    // Determine which model to use based on token limit status
    let modelToUse = openRouter.primaryModel;
    if (apiStatus.isTokenLimitReached) {
      console.log('Token limit reached, using fallback model');
      modelToUse = openRouter.fallbackModel;
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
    
    // Update API status if token limit error
    if (isTokenLimitError(error)) {
      apiStatus.isTokenLimitReached = true;
      apiStatus.errorCount++;
      apiStatus.lastError = error.message;
      apiStatus.lastErrorTime = new Date();
      console.log('Token limit reached, marking API status');
    }
    
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