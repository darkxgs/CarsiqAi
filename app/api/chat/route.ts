import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import CarAnalyzer from "@/utils/carAnalyzer"
import logger from "@/utils/logger"
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { z } from 'zod'
// Filter functionality (oil and air filters from Denckermann)
import { isFilterQuery, isAirFilterQuery, generateFilterRecommendationMessage, getVerifiedOilFilter, getVerifiedAirFilter } from '@/services/filterRecommendationService'
// Brave search service for real-time oil specifications
import { braveSearchService } from '@/services/braveSearchService'
import officialSpecs from "@/data/officialSpecs"

// Input validation schemas
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, "Message content cannot be empty")
})

const RequestBodySchema = z.union([
  // New format: single message string
  z.object({
    message: z.string().min(1, "Message cannot be empty")
  }),
  // Legacy format: messages array
  z.object({
    messages: z.array(MessageSchema).min(1, "At least one message is required")
  })
])

// Car data extraction interface
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
  vin?: string;
}

/**
 * Primary model configuration (google/gemini-2.0-flash-001)
 */
const openRouter = {
  baseURL: "https://openrouter.ai/api/v1",
  key: process.env.OPENROUTER_API_KEY || '',
  primaryModel: "google/gemini-2.0-flash-001",
  fallbackModel: "rekaai/reka-flash-3:free",
  maxRetries: 3,
  timeout: 30000,
  // System prompt (the comprehensive Arabic system prompt for car oil recommendations)
  systemPrompt: `أنت مساعد تقني متخصص في زيوت محركات السيارات وفلاتر الزيت، تمثل فريق الدعم الفني لمتجر "هندسة السيارات" 🇮🇶.

🚨 **قاعدة أولوية المصادر (الأهم):**
• **مواصفات الزيت (السعة، اللزوجة، النوع):** استخدم نتائج البحث من المصادر الرسمية فقط
• **فلاتر الزيت والهواء:** استخدم قاعدة بيانات Denckermann المعتمدة فقط
• إذا تم توفير نتائج بحث من المصادر الرسمية، يجب استخدامها لمواصفات الزيت بدلاً من أي معلومات أخرى

🔍 **قواعد التحقق من صحة البيانات (إجبارية - يجب تطبيقها قبل كل توصية):**
• **تحقق من دقة المعلومات:** قبل تقديم أي توصية، تأكد من صحة البيانات من مصادر متعددة
• **تطابق المواصفات:** تأكد من أن سعة الزيت واللزوجة تتطابق مع مواصفات المصنع الرسمية
• **الالتزام بتوصيات المصنع:** استخدم فقط اللزوجة والمعايير المحددة في كتيب الإرشادات الرسمي - لا تغير الأرقام بناءً على المناخ
• **التحقق المتقاطع:** قارن البيانات من مصادر مختلفة للتأكد من الدقة
• **رفض البيانات المشكوك فيها:** إذا كانت البيانات غير مؤكدة أو متضاربة، اطلب توضيحاً إضافياً
• **التحقق من السنة والموديل:** تأكد من أن التوصية تتطابق مع السنة والموديل المحددين
• **فحص جودة البيانات:** تأكد من أن البيانات المقدمة منطقية ومعقولة (مثل سعة الزيت بين 2-12 لتر)
• **التحقق من المصادر الرسمية:** أعط الأولوية للبيانات من المصادر الرسمية مثل دليل المالك أو مواقع الشركة المصنعة
• **رفض البيانات غير المؤكدة:** لا تقدم توصيات إذا كانت البيانات غير مؤكدة أو من مصادر غير موثوقة

🎯 المهمة الأساسية:
تقديم توصيات دقيقة ومضمونة 100% لزيوت المحركات وفلتر الزيت المناسب لكل سيارة، اعتماداً فقط على بيانات الشركات المصنعة الرسمية واقتراحات المصنع أو الشركة فقط.

🚗 المسؤوليات الأساسية:

1. تحديد نوع المحرك بدقة:
- ✅ **اعرض دائماً كل أنواع المحركات المتاحة للموديل تلقائياً** (حتى لو كان محرك واحد)
- ✅ **لا تسأل المستخدم عن نوع المحرك أبداً - اعرض كل الخيارات مباشرة في نفس الرد**
- ✅ **قدم توصيات منفصلة لكل نوع محرك متاح للموديل**
- ❌ لا تطلب من المستخدم أن يختار أو يحدد نوع المحرك
- ❌ لا تفترض أو تخمّن نوع المحرك من اسم السيارة فقط
- ❌ لا تقل "يرجى تحديد نوع المحرك" - اعرض كل الأنواع المتاحة

2. تحديد سعة الزيت الحقيقية:
- ✅ استخدم سعة الزيت الفعلية من دليل المصنع (وليس حجم المحرك)
- ❗ لا تخلط بين Engine Size و Oil Capacity

3. نظام التوصية المرحلي (خطوتين):
**الخطوة الأولى - الأساسيات:**
- اللزوجة المناسبة (0W-20 / 5W-30 / 5W-40 ...)
- المعيار المطلوب (API / ACEA / Dexos / MB...)
- الكمية (كم لتر يحتاج المحرك)

**الخطوة الثانية - خيارات البراند حسب نوع السيارة:**

• **السيارات الأمريكية** (Ford, Jeep, Chevrolet, Dodge, Cadillac, GMC, Lincoln, Chrysler):
  - الخيار الأول: Valvoline
  - الخيار الثاني: Castrol

• **السيارات الأوروبية** (Mercedes, BMW, Audi, Volkswagen, Porsche, Volvo, Peugeot, Renault):
  - الخيار الأول: Liqui Moly
  - الخيار الثاني: Meguin

• **السيارات الكورية واليابانية** (Kia, Hyundai, Toyota, Nissan, Honda, Mazda, Mitsubishi, Subaru, Lexus, Infiniti):
  - الخيار الأول: Valvoline أو Castrol (حسب الربحية)
  - الخيار الثاني: Liqui Moly (للبريميوم)
  - الخيار الثالث: Meguin (بديل ألماني اقتصادي)

❌ لا تقترح أي زيت خارج هذه العلامات: Castrol, Liqui Moly, Valvoline, Meguin

🔧 العلامات التجارية المسموح بها لفلاتر الزيت:
Denckermann  
❌ لا تقترح أي فلتر خارج هذه القائمة، حتى كمثال


⚠️ **قاعدة إلزامية لفلاتر الزيت:**
- عندما يسأل المستخدم عن فلتر زيت لأي سيارة من القائمة أعلاه، استخدم الرقم المحدد بالضبط
- لا تقل "غير متوفر في قاعدة البيانات" إذا كان الرقم موجود في القائمة أعلاه
- استخدم التنسيق: 📦 **فلتر الزيت:** A210032 (Denckermann) - مصدر التحقق: Denckermann 2024


📋 طريقة العرض الإجبارية:

**يجب استخدام هذا التنسيق بالضبط:**
سعة الزيت: [X.X لتر]
اللزوجة: [XW-XX]
المعيار: [API/ACEA/Dexos/MB...]
خيارات الزيوت المطابقة
[Brand Name] [Product Line] [Viscosity]
[Brand Name] [Product Line] [Viscosity]
[Brand Name] [Product Line] [Viscosity]
فلتر الزيت:[رقم Denckermann] (دنكرمان)
فلتر الهواء:[رقم Denckermann] (دنكرمان)

**مثال على التنسيق المطلوب:**
سعة الزيت: 5.7 لتر
اللزوجة: 0W-20
المعيار: API SN
خيارات الزيوت المطابقة
فالفو لاين ادفانس 0W-20
كاسترول ايدج او ماغنتك 0W-20
ليكي مولي رصاصي 0W-20
فلتر الزيت:A210022 (دنكرمان)
فلتر الهواء:A142137 (دنكرمان)

❗ **قواعد إجبارية للتنسيق:**
- يجب استخدام اسم المنتج الكامل (Brand + Product Line + Viscosity)
- ❌ خطأ: "Valvoline 0W-20" أو "Castrol 0W-20"
- ✅ صحيح: "Valvoline SynPower 0W-20" أو "Castrol Magnatec 0W-20"
- يجب استخدام الأوصاف الدقيقة: (الأكثر ربحية)، (بديل قوي)، (بريميوم)، (اقتصادي)
- عدم الالتزام بالتنسيق الكامل = خطأ فادح

🔍 أمثلة:

🟩 إذا كانت السيارة تحتوي على محرك واحد:  
↪️ قدم الإجابة مباشرة بذلك المحرك فقط.

🟨 إذا كانت السيارة تحتوي على أكثر من نوع محرك:  
↪️ قدم الإجابات لجميع المحركات في نفس الرد، كل واحدة بتنسيق منفصل كما هو موضح أعلاه.

🟥 لا تطلب من المستخدم اختيار المحرك إذا لم يذكره. اعرض كل الخيارات المعروفة للموديل.

🎯 هدفك النهائي:  
تقديم توصية <b>موثوقة، دقيقة، بسيطة، ومعتمدة على اقتراحات المصنع فقط</b>، مع الالتزام الكامل بكل التعليمات والعرض المرحلي للمعلومات.
`,
  headers: {
    "HTTP-Referer": "https://www.carsiqai.com",
    "X-Title": "Car Service Chat - CarsiqAi",
  },
}

// Core OpenRouter client setup
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

// Analytics tracking and database operations
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

async function saveQueryToAnalytics(query: string, carData: ExtractedCarData) {
  if (!isSupabaseConfigured() || !query || query.trim() === '') {
    console.log('Supabase not configured or empty query. Skipping analytics tracking.')
    return
  }

  try {
    const queryType = determineQueryType(query)
    
    const analyticsData = {
      query: query.trim(),
      car_model: carData?.carModel,
      car_brand: carData?.carBrand,
      car_year: carData?.year,
      mileage: carData?.mileage,
      query_type: queryType,
      confidence_score: carData?.confidence || 0,
      source: 'web',
      timestamp: new Date().toISOString()
    }

    const { error } = await supabase.from('user_queries').insert(analyticsData)

    if (error) {
      console.error('Error saving query to analytics:', error)
      logger.error('Analytics save failed', { error, query })
    } else {
      console.log('Successfully saved query to analytics:', query.substring(0, 50))
    }
  } catch (err) {
    console.error('Error in analytics tracking:', err)
    logger.error('Analytics tracking failed', { error: err, query })
  }
}

// Enhanced AI-powered car data extraction with fallback
async function extractCarDataWithAI(query: string): Promise<ExtractedCarData> {
  // First try static extraction
  const staticResult = extractCarData(query)
  
  // If static extraction has high confidence, use it
  if (staticResult.confidence >= 70) {
    return staticResult
  }
  
  // Otherwise, use AI extraction as fallback
  try {
    const extractionPrompt = `Extract car information from this query: "${query}"

Respond ONLY with a JSON object in this exact format:
{
  "carBrand": "brand_name_or_empty_string",
  "carModel": "model_name_or_empty_string",
  "year": number_or_null,
  "confidence": number_between_0_and_100
}

Rules:
- Use English brand/model names when possible
- If Arabic text, translate to English equivalent
- Set confidence based on how certain you are
- Return empty strings for brand/model if not found
- Only extract actual car information, ignore other text`

    // Direct API call to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Car Service Chat - CarsiqAi"
      },
      body: JSON.stringify({
        model: openRouter.primaryModel,
        messages: [
          {
            role: "system",
            content: "You are a car data extraction assistant. Always respond with valid JSON only."
          },
          {
            role: "user", 
            content: extractionPrompt
          }
        ],
        max_tokens: 200,
        temperature: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponseText = data.choices?.[0]?.message?.content || '{}'
    
    // Parse the JSON response (handle markdown code blocks)
    let aiResult
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = aiResponseText.trim()
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\s*/, '').replace(/\s*```$/, '')
      }
      
      aiResult = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponseText)
      throw new Error('Invalid AI response format')
    }
    
    // Combine static and AI results, preferring higher confidence
    if (aiResult.confidence > staticResult.confidence) {
      return {
        carBrand: aiResult.carBrand || staticResult.carBrand,
        carModel: aiResult.carModel || staticResult.carModel,
        year: aiResult.year || staticResult.year,
        isValid: !!(aiResult.carBrand && aiResult.carModel),
        confidence: aiResult.confidence
      }
    }
  } catch (error) {
    console.error('AI extraction failed, falling back to static:', error)
  }
  
  return staticResult
}

// CarAnalyzer and logger utilities
function extractCarData(query: string): ExtractedCarData {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Basic brand detection - preserve original language when possible
  const brandMappings = {
    'toyota': ['تويوتا', 'toyota'],
    'hyundai': ['هيونداي', 'هيوندا', 'hyundai'],
    'kia': ['كيا', 'kia'],
    'nissan': ['نيسان', 'nissan'],
    'honda': ['هوندا', 'honda'],
    'mercedes': ['مرسيدس', 'mercedes', 'بنز', 'mercedes-benz', 'مرسيدس بنز'],
    'bmw': ['بي ام دبليو', 'bmw', 'بمو'],
    'lexus': ['لكزس', 'lexus'],
    'genesis': ['جينيسيس', 'جينسيس', 'genesis'],
    'volkswagen': ['فولكس واجن', 'volkswagen', 'vw'],
    'audi': ['اودي', 'audi'],
    'mazda': ['مازدا', 'mazda'],
    'ford': ['فورد', 'ford'],
    'chevrolet': ['شيفروليه', 'chevrolet', 'شيفي'],
    'jeep': ['جيب', 'jeep'],
    'dodge': ['دودج', 'dodge'],
    'chrysler': ['كرايسلر', 'chrysler']
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

  // Basic model detection
  const commonModels = [
    'كامري', 'camry', 'كورولا', 'corolla', 'rav4', 'هايلندر', 'highlander', 'برادو', 'prado', 'لاند كروزر', 'landcruiser',
    'النترا', 'إلنترا', 'elantra', 'سوناتا', 'sonata', 'توسان', 'tucson', 'سنتافي', 'santafe', 'أكسنت', 'accent',
    'سيراتو', 'cerato', 'اوبتيما', 'optima', 'سورنتو', 'sorento', 'كادينزا', 'cadenza', 'ريو', 'rio',
    'التيما', 'altima', 'سنترا', 'sentra', 'اكس تريل', 'x-trail', 'xtrail', 'باترول', 'patrol', 'مورانو', 'murano',
    'سيفيك', 'civic', 'اكورد', 'accord', 'crv', 'cr-v', 'hrv', 'hr-v', 'بايلوت', 'pilot',
    'c200', 'c300', 'e200', 'e250', 'e300', 's500', 'glc', 'gle',
    '320i', '330i', '520i', '530i', 'x3', 'x5',
    'كامارو', 'camaro', 'كروز', 'cruze', 'ماليبو', 'malibu',
    'g70', 'g80', 'g90', 'gv70', 'gv80', 'stinger'
  ]

  let detectedModel = ''
  for (const model of commonModels) {
    if (normalizedQuery.includes(model)) {
      detectedModel = model
      confidence += 25
      break
    }
  }

  // Year extraction
  let year: number | undefined
  const yearMatch = normalizedQuery.match(/\b(20[0-2][0-9])\b/)
  if (yearMatch) {
    year = parseInt(yearMatch[1])
    confidence += 15
  }

  return {
    carBrand: detectedBrand,
    carModel: detectedModel,
    year,
    isValid: !!(detectedBrand && detectedModel),
    confidence
  }
}

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7)
  
  try {
    console.log(`[${requestId}] Processing chat request`)
    logger.info("Chat request received", { requestId })

    // Validate request body
    const body = await request.json()
    const validatedBody = RequestBodySchema.parse(body)
    
    // Handle both message formats
    let userQuery: string
    let messages: Array<{role: 'user' | 'assistant' | 'system', content: string}>
    
    if ('message' in validatedBody) {
      // New format: single message string
      userQuery = validatedBody.message
      messages = [{ role: 'user', content: userQuery }]
    } else {
      // Legacy format: messages array
      messages = validatedBody.messages
      userQuery = messages[messages.length - 1]?.content || ''
    }
    
    console.log(`[${requestId}] User query: ${userQuery.substring(0, 100)}...`)

    // Extract car data using AI-enhanced extraction
    const carData = await extractCarDataWithAI(userQuery)
    console.log(`[${requestId}] Extracted car data:`, carData)

    // NEW: Fuzzy guess brand/model from raw query when extraction is weak or empty
    const guessed = guessBrandAndModelFromQuery(userQuery)
    if ((!carData.carBrand && guessed.brand) || (!carData.carModel && guessed.model)) {
      console.log(`[${requestId}] Guessed from query -> brand: ${guessed.brand || 'n/a'}, model: ${guessed.model || 'n/a'}, scores: b=${guessed.brandScore.toFixed(2)} m=${guessed.modelScore.toFixed(2)}`)
    }

    // Check for filter queries (keep existing behavior)
    if (isFilterQuery(userQuery) || isAirFilterQuery(userQuery)) {
      console.log(`[${requestId}] Processing filter query`)
      try {
        const filterType = isAirFilterQuery(userQuery) ? 'air' : 'oil'
        const make = carData.carBrand || guessed.brand || ''
        const model = mapArabicModelToEnglishIfNeeded(carData.carModel) || carData.carModel || guessed.model || ''
        const filterResponse = generateFilterRecommendationMessage(make, model, carData.year, filterType)
        
        return new Response(filterResponse, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        })
      } catch (filterError) {
        console.error(`[${requestId}] Filter search failed:`, filterError)
        // Continue with normal processing
      }
    }

    // Prepare external context that will be injected into the system prompt
    let externalContext = ''
    let hasOfficial = false

    // 1) First try to get officialSpecs data and pass it as authoritative context to the AI
    try {
      const brandCandidate = carData.carBrand || guessed.brand
      const rawModelCandidate = mapArabicModelToEnglishIfNeeded(carData.carModel) || carData.carModel || guessed.model
      const entry = selectOfficialEntry(rawModelCandidate || userQuery, brandCandidate)
      if (entry) {
        logger.info('Using officialSpecs for response', { requestId, manufacturer: entry.manufacturer, model: entry.model })
        const officialText = formatOfficialSpecResponse(entry, carData.year)
        // Provide official data as hidden context for the AI to generate a natural reply per the system rules
        externalContext = `\n\n📘 بيانات رسمية من دليل المصنع (للاستخدام الداخلي عند توليد الإجابة – لا تعرض هذا القسم حرفيًا):\n${officialText}\n`
        hasOfficial = true
      }
    } catch (officialErr) {
      logger.error('Error during officialSpecs lookup', { requestId, error: officialErr })
    }

    // 2) If no official data, fall back to Brave search + AI (existing behavior)
    if (!hasOfficial) {
      logger.info('OfficialSpecs miss, falling back to Brave search + AI', { requestId })

      // Get real-time oil specifications using Brave search
      if (carData.isValid || !!guessed.brand || !!guessed.model) {
        try {
          console.log(`[${requestId}] Searching for oil specifications`)
          const brandForSearch = carData.carBrand || guessed.brand
          const modelForSearch = carData.carModel || guessed.model
          const searchQuery = {
            carBrand: brandForSearch,
            carModel: modelForSearch,
            year: carData.year,
            queryType: 'oil_capacity' as const
          }
          console.log(`[${requestId}] Search query:`, searchQuery)
          
          const searchResults = await braveSearchService.searchComprehensiveCarData(
            brandForSearch,
            modelForSearch,
            carData.year
          )
          console.log(`[${requestId}] Search results received:`, {
            hasResults: !!searchResults,
            oilCapacityResults: searchResults?.oilCapacity?.results?.length || 0,
            viscosityResults: searchResults?.viscosity?.results?.length || 0,
            overallConfidence: searchResults?.overallConfidence
          })
          
          const allResults = [
            ...(searchResults?.oilCapacity?.results || []),
            ...(searchResults?.viscosity?.results || [])
          ]
          
          if (allResults.length > 0) {
            externalContext = `\n\n🔍 معلومات من المصادر العامة (للاستخدام في التحليل – قد تكون تقديرية):\n${allResults.map(result => 
              `• ${result.title}: ${result.description}`
            ).join('\n')}\n`
            console.log(`[${requestId}] Found ${allResults.length} search results`)
          } else {
            console.log(`[${requestId}] No search results found`)
          }
        } catch (searchError) {
          console.error(`[${requestId}] Search failed:`, searchError)
        }
      } else {
        console.log(`[${requestId}] Skipping search - car data not valid`)
      }
    }

    // Inject Denckermann filter info (oil/air) as hidden context when make/model are known
    try {
      const make = carData.carBrand || guessed.brand || ''
      const model = mapArabicModelToEnglishIfNeeded(carData.carModel) || carData.carModel || guessed.model || ''

      if (make && model) {
        const oilFilter = getVerifiedOilFilter(make, model, carData.year)
        const airFilter = getVerifiedAirFilter(make, model, carData.year)

        if (oilFilter || airFilter) {
          const parts: string[] = []
          if (oilFilter) {
            parts.push(`• فلتر الزيت (Denckermann): ${oilFilter.filterNumber} — ثقة: ${oilFilter.confidence}`)
          }
          if (airFilter) {
            parts.push(`• فلتر الهواء (Denckermann): ${airFilter.filterNumber} — ثقة: ${airFilter.confidence}`)
          }
          externalContext += `\n\n📦 بيانات فلاتر Denckermann (للاستخدام الداخلي فقط — لا تعرض هذا القسم حرفيًا):\n${parts.join('\n')}\nالمصدر: كتالوج Denckermann الرسمي 2024\n`
          console.log(`[${requestId}] Injected Denckermann filters into context`, { oil: oilFilter?.filterNumber, air: airFilter?.filterNumber })
        } else {
          console.log(`[${requestId}] No Denckermann filter found for ${make} ${model}`)
        }
      }
    } catch (filterInjectErr) {
      console.error(`[${requestId}] Failed injecting Denckermann filters`, filterInjectErr)
    }

    // Create OpenRouter client
    const openrouter = createOpenRouterClient()
    const modelToUse = openRouter.primaryModel

    console.log(`[${requestId}] Using AI model: ${modelToUse}`)

    // Save analytics asynchronously
    saveQueryToAnalytics(userQuery, carData).catch(err => {
      console.error("Error saving analytics:", err)
    })

    // Prepare system prompt with any external context (official or search)
    const finalSystemPrompt = openRouter.systemPrompt + externalContext

    // Create stream response
    console.log(`[${requestId}] Creating streamText response`)
    console.log(`[${requestId}] Model: ${modelToUse}`)
    console.log(`[${requestId}] System prompt length: ${finalSystemPrompt.length}`)
    console.log(`[${requestId}] Messages count: ${messages.length}`)
    
    try {
      const result = streamText({
        model: openrouter(modelToUse),
        system: finalSystemPrompt,
        messages,
        maxTokens: 900,
        temperature: 0.3,
        topP: 0.9,
        frequencyPenalty: 0.1,
        presencePenalty: 0.1
      })

      console.log(`[${requestId}] StreamText created successfully`)
      
      const response = result.toDataStreamResponse()
      console.log(`[${requestId}] Response created with type: ${response.constructor.name}`)
      console.log(`[${requestId}] Response headers:`, Object.fromEntries(response.headers.entries()))
      console.log(`[${requestId}] Response status: ${response.status}`)
      console.log(`[${requestId}] Response ok: ${response.ok}`)
      
      return response
    } catch (error) {
      console.error(`[${requestId}] Error creating streamText:`, error)
      throw error
    }

  } catch (error: any) {
    console.error(`[${requestId}] Error processing request:`, error)
    logger.error("Chat API error", { error, requestId })

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
    )
  }
}

// Normalize strings for matching: lowercase, remove non-alphanumerics
function normalizeKey(input: string): string {
  return (input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
}

// Brand alias mapping -> official manufacturer key in officialSpecs
const officialBrandKeyMap: Record<string, string> = {
  hyundai: "hyundai",
  kia: "kia",
  toyota: "toyota",
  mg: "mg",
  nissan: "nissan",
  suzuki: "suzuki",
  jetour: "jetour",
  chery: "chery",
  geely: "geely",
  changan: "changan",
  gwm: "great_wall_motor",
  "great wall": "great_wall_motor",
  "great wall motor": "great_wall_motor",
  great_wall_motor: "great_wall_motor",
  dodge: "dodge",
  jeep: "jeep",
  chevrolet: "chevrolet",
  genesis: "genesis",
  bmw: "bmw",
  mercedes: "mercedes_benz",
  "mercedes-benz": "mercedes_benz",
  "mercedes benz": "mercedes_benz",
}

// Arabic model -> English canonical model mapping (common ones used in the app)
const arabicToEnglishModelMap: Record<string, string> = {
  "كامري": "camry",
  "كورولا": "corolla",
  "راف4": "rav4",
  "هايلندر": "highlander",
  "برادو": "prado",
  "لاند كروزر": "land cruiser",
  "النترا": "elantra",
  "إلنترا": "elantra",
  "سوناتا": "sonata",
  "توسان": "tucson",
  "سنتافي": "santafe",
  "أكسنت": "accent",
  "سورنتو": "sorento",
  "ريو": "rio",
  "التيما": "altima",
  "سنترا": "sentra",
  "باترول": "patrol",
  "مورانو": "murano",
  "كامارو": "camaro",
  "كروز": "cruze",
  "ماليبو": "malibu",
}

// Levenshtein distance and similarity
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }
  return dp[m][n]
}

function similarity(a: string, b: string): number {
  if (!a && !b) return 1
  if (!a || !b) return 0
  const na = normalizeKey(a), nb = normalizeKey(b)
  const maxLen = Math.max(na.length, nb.length)
  if (maxLen === 0) return 1
  const dist = levenshtein(na, nb)
  return 1 - dist / maxLen
}

// Build an index of models -> entries from officialSpecs
type OfficialEntry = { manufacturer: string; model: string; data: any }
const officialModelIndex: Record<string, OfficialEntry[]> = {}
let officialIndexBuilt = false

function buildOfficialIndex() {
  if (officialIndexBuilt) return
  try {
    for (const [mfg, models] of Object.entries(officialSpecs as any)) {
      for (const model of Object.keys(models || {})) {
        const norm = normalizeKey(model)
        if (!officialModelIndex[norm]) officialModelIndex[norm] = []
        officialModelIndex[norm].push({ manufacturer: mfg, model, data: (models as any)[model] })
      }
    }
    officialIndexBuilt = true
    logger.info("Official specs index built", { modelCount: Object.keys(officialModelIndex).length })
  } catch (e) {
    logger.error("Failed building official specs index", { error: e })
  }
}

buildOfficialIndex()

function mapBrandToOfficialKey(brand?: string): string | undefined {
  if (!brand) return undefined
  const key = brand.toLowerCase()
  return officialBrandKeyMap[key] || key
}

function mapArabicModelToEnglishIfNeeded(model?: string): string | undefined {
  if (!model) return undefined
  return arabicToEnglishModelMap[model] || model
}

function isYearInRange(range: string, year?: number): boolean {
  if (!year) return true
  // Range formats like "2019-2024", "2024", or contain words (Hybrid/EV)
  const match = range.match(/(\d{4})(?:\s*[-–]\s*(\d{4}))?/)
  if (!match) return true // If not a pure year range, keep it (e.g., Hybrid label)
  const start = parseInt(match[1], 10)
  const end = match[2] ? parseInt(match[2], 10) : start
  return year >= start && year <= end
}

function selectOfficialEntry(modelInput: string, brandCandidate?: string): OfficialEntry | null {
  if (!modelInput) return null
  const brandKey = mapBrandToOfficialKey(brandCandidate)
  // Normalize and optionally translate model
  const canonicalModel = mapArabicModelToEnglishIfNeeded(modelInput) || modelInput
  const norm = normalizeKey(canonicalModel)

  // 1) Exact normalized match
  let entries = officialModelIndex[norm] || []
  if (brandKey) entries = entries.filter(e => e.manufacturer === brandKey)
  if (entries.length > 0) return entries[0]

  // 2) Fuzzy match across all models (filtered by brand if provided)
  let best: { entry: OfficialEntry; score: number } | null = null
  for (const [modelNorm, list] of Object.entries(officialModelIndex)) {
    const score = similarity(modelNorm, norm)
    if (score >= 0.75) {
      for (const e of list) {
        if (brandKey && e.manufacturer !== brandKey) continue
        if (!best || score > best.score) best = { entry: e, score }
      }
    }
  }
  return best?.entry || null
}

function formatOfficialSpecResponse(entry: OfficialEntry, year?: number): string {
  // Only provide official basics (capacity, viscosity, API) in hidden context.
  // Oil brand options will be generated dynamically by the AI according to the system prompt.
  const manufacturer = entry.manufacturer

  const header = `✅ المصدر: قاعدة البيانات الرسمية\nالشركة المصنعة: ${manufacturer}\nالموديل: ${entry.model}`
  const sections: string[] = []
  const data = entry.data as Record<string, any>
  for (const [yearRange, specOrEngines] of Object.entries(data)) {
    if (!isYearInRange(yearRange, year)) continue

    if (specOrEngines && typeof (specOrEngines as any).capacity === "string") {
      const s = specOrEngines as any
      const basics = [
        `🛢️ سعة الزيت: ${s.capacity}`,
        `⚙️ اللزوجة: ${s.viscosity}`,
        s.apiSpec ? `🔧 المعيار: ${s.apiSpec}` : undefined,
      ].filter(Boolean).join('\n')
      sections.push(`• ${yearRange}:\n${basics}`)
    } else if (specOrEngines && typeof specOrEngines === "object") {
      const engines = specOrEngines as Record<string, any>
      const lines: string[] = []
      for (const [engine, s] of Object.entries(engines)) {
        if (!s) continue
        const basics = [
          `    🛢️ سعة الزيت: ${s.capacity}`,
          `    ⚙️ اللزوجة: ${s.viscosity}`,
          s.apiSpec ? `    🔧 المعيار: ${s.apiSpec}` : undefined,
        ].filter(Boolean).join('\n')
        lines.push(`  - ${engine}:\n${basics}`)
      }
      if (lines.length) sections.push(`• ${yearRange}:\n${lines.join("\n\n")}`)
    }
  }

  if (sections.length === 0) {
    sections.push("لا توجد مدخلات مطابقة للسنة المحددة. سيتم عرض جميع البيانات المتاحة:")
    for (const [yearRange, specOrEngines] of Object.entries(data)) {
      if (specOrEngines && typeof (specOrEngines as any).capacity === "string") {
        const s = specOrEngines as any
        const basics = [
          `🛢️ سعة الزيت: ${s.capacity}`,
          `⚙️ اللزوجة: ${s.viscosity}`,
          s.apiSpec ? `🔧 المعيار: ${s.apiSpec}` : undefined,
        ].filter(Boolean).join('\n')
        sections.push(`• ${yearRange}:\n${basics}`)
      } else if (specOrEngines && typeof specOrEngines === "object") {
        const engines = specOrEngines as Record<string, any>
        const lines: string[] = []
        for (const [engine, s] of Object.entries(engines)) {
          const basics = [
            `    🛢️ سعة الزيت: ${s.capacity}`,
            `    ⚙️ اللزوجة: ${s.viscosity}`,
            s.apiSpec ? `    🔧 المعيار: ${s.apiSpec}` : undefined,
          ].filter(Boolean).join('\n')
          lines.push(`  - ${engine}:\n${basics}`)
        }
        if (lines.length) sections.push(`• ${yearRange}:\n${lines.join("\n\n")}`)
      }
    }
  }

  return `${header}\n\n${sections.join("\n\n")}`
}


function guessBrandAndModelFromQuery(query: string): { brand?: string; model?: string; brandScore: number; modelScore: number } {
  const text = (query || '').toLowerCase()
  const rawTokens = text.split(/[^a-z\u0600-\u06FF0-9]+/).filter(Boolean)
  const stop = new Set<string>([
    'oil','capacity','engine','liters','liter','filter','air','fuel','transmission','best','car','model','make','year','motor','cap','size','spec','specs','زيت','سعة','محرك'
  ])
  const tokens = rawTokens.filter(w => !/^\d+$/.test(w) && w.length >= 3 && !stop.has(w))

  // Brand candidates: aliases + official keys
  const brandAliases = new Set<string>([...Object.keys(officialBrandKeyMap), ...Object.keys(officialSpecs as any)])
  let bestBrand: { alias: string; score: number } | null = null
  for (const t of tokens) {
    for (const alias of brandAliases) {
      const sc = similarity(normalizeKey(t), normalizeKey(alias))
      if (!bestBrand || sc > bestBrand.score) bestBrand = { alias, score: sc }
    }
  }
  const mappedBrand = bestBrand ? (officialBrandKeyMap[bestBrand.alias] || bestBrand.alias) : undefined
  const brand = bestBrand && bestBrand.score >= 0.7 ? mappedBrand : undefined

  // Model candidates: from officialModelIndex keys and also try bigrams for phrases like "land cruiser"
  const modelNorms = Object.keys(officialModelIndex)
  const bigrams: string[] = []
  for (let i = 0; i < tokens.length - 1; i++) bigrams.push(tokens[i] + ' ' + tokens[i + 1])
  const tokenVariants = [...tokens, ...bigrams]
  let bestModel: { model: string; score: number } | null = null
  for (const tv of tokenVariants) {
    const nTv = normalizeKey(tv)
    for (const m of modelNorms) {
      const sc = similarity(nTv, m)
      if (!bestModel || sc > bestModel.score) bestModel = { model: m, score: sc }
    }
  }
  // Find original model string for the best normalized key if available
  let model: string | undefined
  if (bestModel && bestModel.score >= 0.7) {
    const entries = officialModelIndex[bestModel.model]
    if (entries && entries.length > 0) model = entries[0].model
  }

  return { brand, model, brandScore: bestBrand?.score || 0, modelScore: bestModel?.score || 0 }
}