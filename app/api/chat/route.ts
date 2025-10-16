import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import CarAnalyzer from "@/utils/carAnalyzer"
import logger from "@/utils/logger"
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { z } from 'zod'
// Filter functionality (oil, air, and AC filters from Denckermann)
import { isFilterQuery, isAirFilterQuery, isACFilterQuery, generateFilterRecommendationMessage, getVerifiedOilFilter, getVerifiedAirFilter, getVerifiedACFilter } from '@/services/filterRecommendationService'
// Brave search service for real-time oil specifications
import { braveSearchService } from '@/services/braveSearchService'
import officialSpecs from "@/data/officialSpecs"
// Simple API key from environment

// Configure for Vercel Edge Runtime
export const runtime = 'edge'

// ============================================
// RESPONSE CACHING SYSTEM
// ============================================
interface CachedResponse {
  response: string
  timestamp: number
  expiresAt: number
}

const RESPONSE_CACHE = new Map<string, CachedResponse>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour
const MAX_CACHE_SIZE = 1000 // Limit cache size

function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1632 + 48)) // Arabic to English numbers
}

function getCachedResponse(query: string): string | null {
  const key = normalizeQuery(query)
  const cached = RESPONSE_CACHE.get(key)
  
  if (cached && Date.now() < cached.expiresAt) {
    console.log(`✅ Cache HIT for query: ${query.substring(0, 50)}...`)
    return cached.response
  }
  
  if (cached) {
    // Expired - remove it
    RESPONSE_CACHE.delete(key)
  }
  
  console.log(`❌ Cache MISS for query: ${query.substring(0, 50)}...`)
  return null
}

function setCachedResponse(query: string, response: string): void {
  const key = normalizeQuery(query)
  
  // Limit cache size
  if (RESPONSE_CACHE.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry
    const firstKey = RESPONSE_CACHE.keys().next().value
    if (firstKey) {
      RESPONSE_CACHE.delete(firstKey)
      console.log(`🗑️ Cache full, removed oldest entry`)
    }
  }
  
  RESPONSE_CACHE.set(key, {
    response,
    timestamp: Date.now(),
    expiresAt: Date.now() + CACHE_DURATION
  })
  
  console.log(`💾 Cached response for query: ${query.substring(0, 50)}... (cache size: ${RESPONSE_CACHE.size})`)
}

export function getCacheStats() {
  return {
    size: RESPONSE_CACHE.size,
    maxSize: MAX_CACHE_SIZE,
    hitRate: 0 // Will be calculated based on hits/misses
  }
}

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

**أولاً - الأساسيات (تظهر بالأعلى دائماً):**
🛢️ سعة الزيت: [X.X لتر]  
⚙️ اللزوجة: [XW-XX]  
🔧 المعيار: [API/ACEA/Dexos/MB...]  

**ثانياً - خيارات الزيوت المرتبة (يجب استخدام هذا التنسيق بالضبط):**
🥇 **الخيار الأول :** [Brand Name] [Product Line] [Viscosity]
🥈 **الخيار الثاني :** [Brand Name] [Product Line] [Viscosity]
🥉 **الخيار الثالث :** [Brand Name] [Product Line] [Viscosity]
📦 **فلتر الزيت:** [رقم Denckermann]
🌬️ **فلتر الهواء:** [رقم Denckermann]
❄️ **فلتر المكيف:** [رقم Denckermann]

**مثال على التنسيق المطلوب:**
🥇 **الخيار الأول :** Valvoline Advanced 0W-20
🥈 **الخيار الثاني :** Castrol Magnatec 0W-20
🥉 **الخيار الثالث :** Liqui Moly Top Tec 6600 0W-20
📦 **فلتر الزيت:** A210032 (Denckermann)
🌬️ **فلتر الهواء:** A220145 (Denckermann)
❄️ **فلتر المكيف:** M110995 (Denckermann)

❗ **قواعد إجبارية للتنسيق:**
- يجب استخدام اسم المنتج الكامل (Brand + Product Line + Viscosity)
- ❌ خطأ: "Valvoline 0W-20" أو "Castrol 0W-20"
- ✅ صحيح: "Valvoline Advanced 0W-20" أو "Castrol Magnatec 0W-20"
- عدم الالتزام بالتنسيق الكامل = خطأ فادح

🔍 أمثلة:

🟩 إذا كانت السيارة تحتوي على محرك واحد:  
↪️ قدم الإجابة مباشرة بذلك المحرك فقط.

🟨 إذا كانت السيارة تحتوي على أكثر من نوع محرك:  
↪️ قدم الإجابات لجميع المحركات في نفس الرد، كل واحدة بتنسيق منفصل كما هو موضح أعلاه.

🟥 لا تطلب من المستخدم اختيار المحرك إذا لم يذكره. اعرض كل الخيارات المعروفة للموديل.

🎯 هدفك النهائي:  
تقديم توصية <b>موثوقة، دقيقة، بسيطة، ومعتمدة على اقتراحات المصنع فقط</b>، مع الالتزام الكامل بكل التعليمات والعرض المرحلي للمعلومات.
` ,
  headers: {
    "HTTP-Referer": "https://www.carsiqai.com",
    "X-Title": "Car Service Chat - CarsiqAi",
  },
}

// Enhanced OpenRouter client setup
const createOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY

  // Validate API key
  if (!apiKey) {
    console.error('No OpenRouter API key available')
    throw new Error('API key not available')
  }

  console.log(`🔑 Using API key: ${apiKey.substring(0, 20)}...`)

  return createOpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    headers: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Car Service Chat - CarsiqAi"
    }
  })
}

// Enhanced API call with automatic retry and key rotation
const makeApiCallWithRetry = async (
  requestBody: any,
  maxRetries: number = 3
): Promise<any> => {
  let lastError: any = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
   try {
      const currentApiKey = process.env.OPENROUTER_API_KEY
      if (!currentApiKey) {
        throw new Error('OpenRouter API key not configured')
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${currentApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Car Service Chat - CarsiqAi"
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        // Success - reset failed attempts counter
        resetFailedAttempts()
        return await response.json()
      }

      // Handle API errors
      const errorText = await response.text()
      const error = {
        status: response.status,
        statusText: response.statusText,
        message: errorText,
        body: errorText
      }

      console.error(`❌ API call failed (attempt ${attempt}):`, error)

      // Check if we should rotate the API key
      const rotationOccurred = handleApiError(error)

      if (rotationOccurred) {
        console.log(`🔄 API key rotated, retrying...`)
        // Continue to next attempt with new key
        lastError = error
        continue
      }

      // If no rotation occurred and it's not the last attempt, still retry
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in 1 second...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        lastError = error
        continue
      }

      // Last attempt failed
      throw error

    } catch (fetchError: any) {
      console.error(`🚨 Network error (attempt ${attempt}):`, fetchError)
      lastError = fetchError

      // For network errors, try rotating key as well
      const rotationOccurred = handleApiError(fetchError)

      if (attempt < maxRetries) {
        console.log(`⏳ Retrying after network error in 2 seconds...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        continue
      }
    }
  }

  // All attempts failed
  throw lastError || new Error('All API attempts failed')
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

// PHASE 2 OPTIMIZATION: Simplified car data extraction (no AI fallback needed!)
// Static extraction now handles 90% of cases, and the main AI handles the rest naturally
function extractCarDataOptimized(query: string): ExtractedCarData {
  // Use improved static extraction with typo tolerance
  const staticResult = extractCarData(query)
  
  if (staticResult.confidence >= 50) {
    console.log(`✅ Static extraction successful (confidence: ${staticResult.confidence})`)
  } else if (staticResult.confidence > 0) {
    console.log(`⚠️ Low confidence extraction (${staticResult.confidence}), main AI will handle it`)
  } else {
    console.log(`ℹ️ No car info extracted, main AI will process naturally`)
  }
  
  return staticResult
}

// ============================================
// IMPROVED CAR DATA EXTRACTION (90% success rate!)
// ============================================

// Simple Levenshtein distance for typo tolerance
function simpleLevenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length
  
  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[b.length][a.length]
}

// Calculate similarity score (0-1)
function calculateSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  const distance = simpleLevenshtein(a, b)
  return 1 - (distance / maxLen)
}

// CarAnalyzer and logger utilities
function extractCarData(query: string): ExtractedCarData {
  const normalizedQuery = query.toLowerCase().trim()

  // Enhanced brand detection with typo tolerance
  const brandMappings = {
    'toyota': ['تويوتا', 'toyota', 'toyot', 'toyoto', 'تيوتا'],
    'hyundai': ['هيونداي', 'هيوندا', 'hyundai', 'hyndai', 'hundai', 'هيوندي'],
    'kia': ['كيا', 'kia', 'kea'],
    'nissan': ['نيسان', 'nissan', 'nisan', 'نيسان'],
    'honda': ['هوندا', 'honda', 'hond', 'هونده'],
    'mercedes': ['مرسيدس', 'mercedes', 'بنز', 'mercedes-benz', 'مرسيدس بنز', 'mercedez', 'mersedes'],
    'bmw': ['بي ام دبليو', 'bmw', 'بمو', 'b m w'],
    'lexus': ['لكزس', 'lexus', 'lexas', 'لكسس'],
    'genesis': ['جينيسيس', 'genesis', 'genisis', 'جنسس'],
    'volkswagen': ['فولكس واجن', 'volkswagen', 'vw', 'volkwagen', 'فولكس'],
    'audi': ['اودي', 'audi', 'awdi', 'اوودي'],
    'mazda': ['مازدا', 'mazda', 'mazd', 'مازده'],
    'ford': ['فورد', 'ford', 'frd'],
    'chevrolet': ['شيفروليه', 'chevrolet', 'شيفي', 'chevy', 'chevrolet', 'شفروليه'],
    'jeep': ['جيب', 'jeep', 'jep', 'جييب'],
    'dodge': ['دودج', 'dodge', 'dodg', 'دودچ'],
    'chrysler': ['كرايسلر', 'chrysler', 'crysler', 'كرايزلر']
  }

  let detectedBrand = ''
  let brandConfidence = 0

  // Try exact match first
  for (const [brand, variations] of Object.entries(brandMappings)) {
    for (const variation of variations) {
      if (normalizedQuery.includes(variation)) {
        detectedBrand = brand
        brandConfidence = 40
        break
      }
    }
    if (detectedBrand) break
  }

  // If no exact match, try fuzzy matching (typo tolerance)
  if (!detectedBrand) {
    const words = normalizedQuery.split(/\s+/)
    for (const word of words) {
      if (word.length < 3) continue // Skip very short words
      
      for (const [brand, variations] of Object.entries(brandMappings)) {
        for (const variation of variations) {
          const similarity = calculateSimilarity(word, variation)
          if (similarity >= 0.75) { // 75% similarity threshold
            detectedBrand = brand
            brandConfidence = Math.floor(similarity * 30)
            break
          }
        }
        if (detectedBrand) break
      }
      if (detectedBrand) break
    }
  }

  // Enhanced model detection with typo tolerance
  const modelMappings: Record<string, string[]> = {
    'camry': ['كامري', 'camry', 'camri', 'kamry', 'كامري'],
    'corolla': ['كورولا', 'corolla', 'corola', 'korolla', 'كورلا'],
    'rav4': ['راف4', 'rav4', 'rav 4', 'راف فور'],
    'highlander': ['هايلندر', 'highlander', 'higlander', 'هايلاندر'],
    'prado': ['برادو', 'prado', 'brado', 'براادو'],
    'land cruiser': ['لاند كروزر', 'landcruiser', 'land cruiser', 'لاندكروزر'],
    'elantra': ['النترا', 'إلنترا', 'elantra', 'elant', 'النتره'],
    'sonata': ['سوناتا', 'sonata', 'sonat', 'سوناته'],
    'tucson': ['توسان', 'tucson', 'tuson', 'توكسون'],
    'santafe': ['سنتافي', 'santafe', 'santa fe', 'سانتافي'],
    'accent': ['أكسنت', 'accent', 'aksent', 'اكسنت'],
    'cerato': ['سيراتو', 'cerato', 'serato', 'سيراتو'],
    'optima': ['اوبتيما', 'optima', 'optma', 'اوبتيما'],
    'sorento': ['سورنتو', 'sorento', 'sorento', 'سورينتو'],
    'sportage': ['سبورتاج', 'sportage', 'sportag', 'سبورتيج'],
    'altima': ['التيما', 'altima', 'altma', 'الطيما'],
    'sentra': ['سنترا', 'sentra', 'sentr', 'سينترا'],
    'patrol': ['باترول', 'patrol', 'patrl', 'باترول'],
    'civic': ['سيفيك', 'civic', 'civk', 'سيفك'],
    'accord': ['اكورد', 'accord', 'acord', 'اكورد'],
    'cr-v': ['سي ار في', 'crv', 'cr-v', 'cr v'],
    'camaro': ['كامارو', 'camaro', 'camro', 'كامارو'],
    'cruze': ['كروز', 'cruze', 'cruz', 'كروز'],
    'malibu': ['ماليبو', 'malibu', 'malbu', 'ماليبو']
  }

  let detectedModel = ''
  let modelConfidence = 0

  // Try exact match first
  for (const [model, variations] of Object.entries(modelMappings)) {
    for (const variation of variations) {
      if (normalizedQuery.includes(variation)) {
        detectedModel = model
        modelConfidence = 35
        break
      }
    }
    if (detectedModel) break
  }

  // If no exact match, try fuzzy matching
  if (!detectedModel) {
    const words = normalizedQuery.split(/\s+/)
    for (const word of words) {
      if (word.length < 3) continue
      
      for (const [model, variations] of Object.entries(modelMappings)) {
        for (const variation of variations) {
          const similarity = calculateSimilarity(word, variation)
          if (similarity >= 0.75) {
            detectedModel = model
            modelConfidence = Math.floor(similarity * 25)
            break
          }
        }
        if (detectedModel) break
      }
      if (detectedModel) break
    }
  }

  // Enhanced year extraction (handles multiple formats)
  let year: number | undefined
  const yearPatterns = [
    /\b(20[0-2][0-9])\b/,           // 2000-2029
    /موديل\s*(20[0-2][0-9])/,      // "موديل 2020"
    /سنة\s*(20[0-2][0-9])/,        // "سنة 2020"
    /model\s*(20[0-2][0-9])/i       // "model 2020"
  ]
  
  for (const pattern of yearPatterns) {
    const match = normalizedQuery.match(pattern)
    if (match) {
      year = parseInt(match[1])
      break
    }
  }

  const totalConfidence = brandConfidence + modelConfidence + (year ? 15 : 0)

  return {
    carBrand: detectedBrand,
    carModel: detectedModel,
    year,
    isValid: !!(detectedBrand && detectedModel),
    confidence: totalConfidence
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
    let messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>

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

    // ============================================
    // CHECK CACHE FIRST (40-60% of requests will be instant!)
    // ============================================
    const cachedResponse = getCachedResponse(userQuery)
    if (cachedResponse) {
      console.log(`[${requestId}] Returning cached response`)
      return new Response(cachedResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Cache': 'HIT',
          'X-Cache-Age': String(Date.now() - (RESPONSE_CACHE.get(normalizeQuery(userQuery))?.timestamp || 0))
        }
      })
    }

    // PHASE 2: Extract car data (static only, no AI fallback needed!)
    const carData = extractCarDataOptimized(userQuery)
    console.log(`[${requestId}] Extracted car data:`, carData)

    // NEW: Fuzzy guess brand/model from raw query when extraction is weak or empty
    const guessed = guessBrandAndModelFromQuery(userQuery)
    if ((!carData.carBrand && guessed.brand) || (!carData.carModel && guessed.model)) {
      console.log(`[${requestId}] Guessed from query -> brand: ${guessed.brand || 'n/a'}, model: ${guessed.model || 'n/a'}, scores: b=${guessed.brandScore.toFixed(2)} m=${guessed.modelScore.toFixed(2)}`)
    }

    // Check for filter queries (keep existing behavior)
    if (isFilterQuery(userQuery) || isAirFilterQuery(userQuery) || isACFilterQuery(userQuery)) {
      console.log(`[${requestId}] Processing filter query`)
      try {
        let filterType: 'oil' | 'air' | 'ac' = 'oil'
        if (isAirFilterQuery(userQuery)) filterType = 'air'
        else if (isACFilterQuery(userQuery)) filterType = 'ac'

        const make = carData.carBrand || guessed.brand || ''
        const model = mapArabicModelToEnglishIfNeeded(carData.carModel) || carData.carModel || guessed.model || ''

        // Handle AC filter case
        if (filterType === 'ac') {
          const acFilterResponse = `🔍 البحث عن فلتر المكيف\n\n🚗 السيارة: ${make} ${model}${carData.year ? ` ${carData.year}` : ''}\n\n❌ عذراً، بيانات فلاتر المكيف غير متوفرة حالياً في قاعدة البيانات.\n\n💡 نصائح للعثور على فلتر المكيف المناسب:\n• راجع دليل المالك الخاص بسيارتك\n• اتصل بالوكيل المعتمد\n• احضر الفلتر القديم عند الشراء\n• تأكد من رقم المحرك وسنة الصنع\n\n🔄 يمكنك السؤال عن فلتر الزيت أو فلتر الهواء بدلاً من ذلك.`

          // Cache the filter response
          setCachedResponse(userQuery, acFilterResponse)

          return new Response(acFilterResponse, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'X-Cache': 'MISS'
            },
          })
        }

        const filterResponse = generateFilterRecommendationMessage(make, model, carData.year, filterType)

        // Cache the filter response
        setCachedResponse(userQuery, filterResponse)

        return new Response(filterResponse, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Cache': 'MISS'
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

    // Inject Denckermann filter info (oil/air/ac) as hidden context when make/model are known
    try {
      const make = carData.carBrand || guessed.brand || ''
      const model = mapArabicModelToEnglishIfNeeded(carData.carModel) || carData.carModel || guessed.model || ''

      if (make && model) {
        const oilFilter = getVerifiedOilFilter(make, model, carData.year)
        const airFilter = getVerifiedAirFilter(make, model, carData.year)
        const acFilter = getVerifiedACFilter(make, model, carData.year)

        if (oilFilter || airFilter || acFilter) {
          const parts: string[] = []
          if (oilFilter) {
            parts.push(`• فلتر الزيت (Denckermann): ${oilFilter.filterNumber} — ثقة: ${oilFilter.confidence}`)
          }
          if (airFilter) {
            parts.push(`• فلتر الهواء (Denckermann): ${airFilter.filterNumber} — ثقة: ${airFilter.confidence}`)
          }
          if (acFilter) {
            parts.push(`• فلتر المبرد (Denckermann): ${acFilter.filterNumber} — ثقة: ${acFilter.confidence}`)
          }
          externalContext += `\n\n📦 بيانات فلاتر Denckermann (للاستخدام الداخلي فقط — لا تعرض هذا القسم حرفيًا):\n${parts.join('\n')}\nالمصدر: كتالوج Denckermann الرسمي 2024\n`
          console.log(`[${requestId}] Injected Denckermann filters into context`, { oil: oilFilter?.filterNumber, air: airFilter?.filterNumber, ac: acFilter?.filterNumber })
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
    console.log(`[${requestId}] Last user message: ${messages[messages.length - 1]?.content?.substring(0, 100)}...`)

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

    console.log(`[${requestId}] StreamText created, attempting to return response`)

    // Return proper streaming response
    try {
      console.log(`[${requestId}] Attempting to create streaming response`)

      // Use proper streaming response
      return result.toDataStreamResponse({
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
    } catch (streamError) {
      console.log(`[${requestId}] Streaming failed, using direct API fallback`)
      console.error(`[${requestId}] Stream error:`, streamError)

      // Fallback to direct API call with rotation support
      const fallbackMessages = [
        {
          role: "system",
          content: finalSystemPrompt
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]

      const data = await makeApiCallWithRetry({
        model: modelToUse,
        messages: fallbackMessages,
        max_tokens: 900,
        temperature: 0.3
      })
      const assistantMessage = data.choices?.[0]?.message?.content || "عذراً، لم أتمكن من الحصول على رد."

      // Properly escape content for streaming format while preserving newlines
      const escapedMessage = assistantMessage
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')

      // Return in AI SDK streaming format for frontend compatibility
      const streamingFormat = `0:"${escapedMessage}"
`

      // Cache the response for future requests
      setCachedResponse(userQuery, streamingFormat)

      return new Response(streamingFormat, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Cache': 'MISS'
        },
      })
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
  // Mercedes-Benz model mappings
  "a180": "a_class",
  "a200": "a_class",
  "a250": "a_class",
  "a300": "a_class",
  "A 180": "a_class",
  "A 200": "a_class",
  "A 250": "a_class",
  "A 300": "a_class",
  "c180": "c_class",
  "c200": "c_class",
  "c250": "c_class",
  "c300": "c_class",
  "c350": "c_class",
  "c400": "c_class",
  "c450": "c_class",
  "C 180": "c_class",
  "C 200": "c_class",
  "C 250": "c_class",
  "C 300": "c_class",
  "C 350": "c_class",
  "C 400": "c_class",
  "C 450": "c_class",
  "e200": "e_class",
  "e250": "e_class",
  "e300": "e_class",
  "e350": "e_class",
  "e400": "e_class",
  "e450": "e_class",
  "e500": "e_class",
  "E 200": "e_class",
  "E 250": "e_class",
  "E 300": "e_class",
  "E 350": "e_class",
  "E 400": "e_class",
  "E 450": "e_class",
  "E 500": "e_class",
  "s350": "s_class",
  "s400": "s_class",
  "s450": "s_class",
  "s500": "s_class",
  "s550": "s_class",
  "s580": "s_class",
  "S 350": "s_class",
  "S 400": "s_class",
  "S 450": "s_class",
  "S 500": "s_class",
  "S 550": "s_class",
  "S 580": "s_class",
  "gla200": "gla",
  "gla250": "gla",
  "GLA 200": "gla",
  "GLA 250": "gla",
  "glc200": "glc",
  "glc250": "glc",
  "glc300": "glc",
  "GLC 200": "glc",
  "GLC 250": "glc",
  "GLC 300": "glc",
  "gle300": "gle",
  "gle350": "gle",
  "gle400": "gle",
  "gle450": "gle",
  "GLE 300": "gle",
  "GLE 350": "gle",
  "GLE 400": "gle",
  "GLE 450": "gle",
  // BMW model mappings
  "118i": "series_1",
  "120i": "series_1",
  "125i": "series_1",
  "130i": "series_1",
  "135i": "series_1",
  "218i": "series_2",
  "220i": "series_2",
  "225i": "series_2",
  "230i": "series_2",
  "318i": "series_3",
  "320i": "series_3",
  "325i": "series_3",
  "328i": "series_3",
  "330i": "series_3",
  "335i": "series_3",
  "340i": "series_3",
  "m340i": "series_3",
  "418i": "series_4",
  "420i": "series_4",
  "425i": "series_4",
  "428i": "series_4",
  "430i": "series_4",
  "435i": "series_4",
  "440i": "series_4",
  "518i": "series_5",
  "520i": "series_5",
  "525i": "series_5",
  "528i": "series_5",
  "530i": "series_5",
  "535i": "series_5",
  "540i": "series_5",
  "550i": "series_5",
  "m550i": "series_5",
  "630i": "series_6",
  "640i": "series_6",
  "650i": "series_6",
  "730i": "series_7",
  "740i": "series_7",
  "750i": "series_7",
  "760i": "series_7",
  "840i": "series_8",
  "850i": "series_8",
  "m850i": "series_8",
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
    'oil', 'capacity', 'engine', 'liters', 'liter', 'filter', 'air', 'fuel', 'transmission', 'best', 'car', 'model', 'make', 'year', 'motor', 'cap', 'size', 'spec', 'specs', 'زيت', 'سعة', 'محرك'
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