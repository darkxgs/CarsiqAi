import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import CarAnalyzer from "@/utils/carAnalyzer"
import logger from "@/utils/logger"
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { z } from 'zod'

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
    'مازda': ['مازda', 'mazda'],
    'سوزوكي': ['سوزوكي', 'suzuki'],
    'ميتسوبيشي': ['ميتسوبيشي', 'mitsubishi'],
    'شيفروليت': ['شيفروليت', 'chevrolet'],
    'فورد': ['فورد', 'ford'],
    'بيجو': ['بيجو', 'peugeot'],
    'رينو': ['رينو', 'renault']
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
    'g70', 'g80', 'g90', 'gv70', 'gv80'
  ]
  
  let detectedModel = ''
  for (const model of commonModels) {
    if (normalizedQuery.includes(model)) {
      detectedModel = model
      confidence += 25
      break
    }
  }
  
  // Enhanced year extraction
  const yearMatch = normalizedQuery.match(/20[0-2][0-9]/) || normalizedQuery.match(/[1-2][0-9]{3}/)
  const year = yearMatch ? parseInt(yearMatch[0]) : undefined
  if (year && year >= 1990 && year <= new Date().getFullYear()) {
    confidence += 20
  }
  
  // Enhanced mileage extraction
  const mileagePatterns = [
    /(\d+)\s*ألف/,
    /(\d+)\s*الف/,
    /(\d+)\s*k/i,
    /(\d+)\s*km/i,
    /(\d+)\s*كيلو/
  ]
  
  let mileage: number | undefined
  for (const pattern of mileagePatterns) {
    const match = normalizedQuery.match(pattern)
    if (match) {
      mileage = parseInt(match[1]) * 1000
      confidence += 15
      break
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
 * Enhanced AI response with retry logic
 */
async function generateAIResponse(
  messages: any[], 
  systemPrompt: string, 
  maxTokens: number = 900,
  retryCount: number = 0
): Promise<any> {
  const openrouter = createOpenRouterClient()
  
  // Check and potentially reset token limit status
  checkAndResetTokenLimitStatus()
  
  // Determine which model to use based on token limit status
  let modelToUse = openRouter.primaryModel
  if (apiStatus.isTokenLimitReached) {
    console.log('Token limit reached, using Mistral model')
    modelToUse = openRouter.mistralModel
  } else if (retryCount > 0) {
    console.log('Retry attempt, using fallback model')
    modelToUse = openRouter.fallbackModel
  }
  
  try {
    const result = streamText({
      model: openrouter(modelToUse),
      system: systemPrompt,
      messages,
      maxTokens,
      temperature: 0.3, // Lower temperature for more consistent responses
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
    })

    return result
  } catch (error) {
    console.error(`AI response generation failed (attempt ${retryCount + 1}):`, error)
    
    // Check if error is related to token limits
    if (isTokenLimitError(error)) {
      console.warn('Token limit error detected, switching to Mistral model for future requests')
      apiStatus.isTokenLimitReached = true
      apiStatus.errorCount += 1
      apiStatus.lastError = error.message || 'Unknown token limit error'
      apiStatus.lastErrorTime = new Date()
      
      if (retryCount < openRouter.maxRetries) {
        console.log('Retrying with Mistral model...')
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))) // Exponential backoff
        return generateAIResponse(messages, systemPrompt, Math.max(500, maxTokens - 200), retryCount + 1)
      }
    }
    
    if (retryCount < openRouter.maxRetries) {
      console.log(`Retrying with ${retryCount === 0 ? 'fallback model' : 'reduced parameters'}...`)
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))) // Exponential backoff
      return generateAIResponse(messages, systemPrompt, Math.max(500, maxTokens - 200), retryCount + 1)
    }
    
    throw error
  }
}

/**
 * Main POST handler with comprehensive error handling
 */
export async function POST(req: Request) {
  const startTime = Date.now()
  let requestId: string | undefined
  
  try {
    // Generate unique request ID for tracking
    requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
    
    // Extract and analyze user message
    const userMessages = messages.filter((m: any) => m.role === 'user')
    const latestUserMessage = userMessages[userMessages.length - 1]
    
    let extractedCarData: ExtractedCarData | undefined
    let recommendation: any
    
    if (latestUserMessage) {
      console.log(`[${requestId}] Processing user query: ${latestUserMessage.content.substring(0, 100)}...`)
      
      // Enhanced car data extraction
      extractedCarData = enhancedExtractCarData(latestUserMessage.content)
      console.log(`[${requestId}] Extracted car data:`, {
        brand: extractedCarData.carBrand,
        model: extractedCarData.carModel,
        confidence: extractedCarData.confidence,
        isValid: extractedCarData.isValid
      })
    }

    // Handle first message (initial recommendation)
    if (messages.length === 1 && latestUserMessage) {
      try {
        // Generate car analysis and oil recommendation
        recommendation = await CarAnalyzer.analyzeCarAndRecommendOil(latestUserMessage.content)
        
        let finalRecommendation = ""
        let systemPromptAddition = ""

        if ("errorMessage" in recommendation) {
          finalRecommendation = recommendation.errorMessage
          logger.warn(`[${requestId}] No suitable recommendation found`, {
            userMessage: latestUserMessage.content,
            error: recommendation.errorMessage,
          })
        } else {
          finalRecommendation = CarAnalyzer.createRecommendationMessage(recommendation)
          
          // Extract oil capacity for accurate display
          const oilCapacity = recommendation.carSpecs?.capacity || "غير معروف"
          const carData = extractedCarData || CarAnalyzer.extractCarData(latestUserMessage.content)
          const brandAndModel = `${carData.carBrand} ${carData.carModel}`
          
          // Create explicit capacity instruction
          systemPromptAddition = `
تنبيه حاسم: سعة الزيت الدقيقة لسيارة ${brandAndModel} هي ${oilCapacity} بالضبط حسب بيانات الشركة المصنعة الرسمية. 
يجب استخدام هذه القيمة بالضبط في التوصية النهائية دون أي تعديل أو تقريب.

قاعدة إلزامية: اختتم ردك بـ "التوصية النهائية:" متبوعة بالزيت المحدد واللزوجة والكمية الدقيقة.
مثال: التوصية النهائية: Castrol EDGE 5W-40 (${oilCapacity})
`
          
          logger.info(`[${requestId}] Generated recommendation successfully`, {
            carBrand: carData.carBrand,
            carModel: carData.carModel,
            recommendedOil: recommendation.primaryOil?.[0],
            oilCapacity: oilCapacity,
          })
        }

        // Save analytics data
        await saveQueryToAnalytics(latestUserMessage.content, extractedCarData, recommendation)

        // Generate AI response with enhanced system prompt
        const result = await generateAIResponse(
          [{ role: "user", content: latestUserMessage.content }],
          `${openRouter.systemPrompt}

${systemPromptAddition}

التوصية المفصلة المطلوب معالجتها: ${finalRecommendation}`,
          900
        )

        const processingTime = Date.now() - startTime
        console.log(`[${requestId}] Request completed successfully in ${processingTime}ms`)
        
        return result.toDataStreamResponse()
        
      } catch (error) {
        console.error(`[${requestId}] Error in initial recommendation processing:`, error)
        logger.error("خطأ أثناء معالجة التوصية الأولى", { error, requestId })

        // Fallback response for first message errors
        const errorResult = await generateAIResponse(
          [{
            role: "user",
            content: `عذراً، حدث خطأ أثناء معالجة طلبك الخاص بـ "${latestUserMessage.content}". 
            يرجى المحاولة مرة أخرى بصيغة أوضح. 
            مثال صحيح: 'هيونداي النترا 2022 ماشية 130 ألف كيلو'`
          }],
          `أنت مساعد خبير في زيوت السيارات. ساعد المستخدم في إعادة صياغة طلبه بشكل واضح.`,
          500
        )

        return errorResult.toDataStreamResponse()
      }
    }

    // Handle follow-up messages
    try {
      await saveQueryToAnalytics(latestUserMessage?.content, extractedCarData)
      
      const result = await generateAIResponse(
        messages,
        `${openRouter.systemPrompt}

تذكير مهم: يجب اختتام كل رد بـ "التوصية النهائية:" متبوعة بالزيت المحدد واللزوجة والكمية الدقيقة من مواصفات الشركة المصنعة.`,
        900
      )

      const processingTime = Date.now() - startTime
      console.log(`[${requestId}] Follow-up request completed in ${processingTime}ms`)
      
      return result.toDataStreamResponse()
      
    } catch (error) {
      console.error(`[${requestId}] Error in follow-up message processing:`, error)
      throw error
    }

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`[${requestId}] General error in API route (${processingTime}ms):`, error)
    logger.error("خطأ عام في معالجة الطلب", { 
      error, 
      requestId, 
      processingTime 
    })

    // Return structured error response
    return new Response(
      JSON.stringify({
        error: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        requestId: requestId,
        suggestion: "تأكد من كتابة نوع السيارة والموديل بوضوح"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}