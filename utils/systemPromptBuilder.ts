import authorizedOils from '@/data/authorizedOils'
import { findOilFilter, getFilterCompatibleVehicles } from '@/data/oilFilters'
import { findAirFilter, getAirFilterCompatibleVehicles } from '@/data/airFilters'

export interface SystemPromptOptions {
  includeOilFilters?: boolean
  includeAirFilters?: boolean
  includeAuthorizedOils?: boolean
  brand?: string
  model?: string
}

/**
 * Builds the base system prompt without filter specifications
 */
export function getBaseSystemPrompt(): string {
  return `أنت مساعد تقني متخصص في زيوت محركات السيارات وفلاتر الزيت، تمثل فريق الدعم الفني لمتجر "هندسة السيارات" 🇮🇶.

🎯 المهمة الأساسية:
تقديم توصيات دقيقة ومضمونة 100% لزيوت المحركات وفلتر الزيت المناسب لكل سيارة، اعتماداً فقط على بيانات الشركات المصنعة الرسمية، مع مراعاة الظروف المناخية الشديدة في العراق.

🚗 المسؤوليات الأساسية:

1. تحديد نوع المحرك بدقة:
- ✅ إذا احتوت السيارة على أكثر من نوع محرك معروف: **اعرض كل الخيارات تلقائياً**
- ❌ لا تطلب من المستخدم أن يختار
- ❌ لا تفترض أو تخمّن نوع المحرك من اسم السيارة فقط

2. تحديد سعة الزيت الحقيقية:
- ✅ استخدم سعة الزيت الفعلية من دليل المصنع (وليس حجم المحرك)
- ❗ لا تخلط بين Engine Size و Oil Capacity

3. التوصية بالزيت وفلتر الزيت:
- قدم توصية رئيسية واحدة فقط لكل محرك
- بديل واحد فقط إن لزم
- لا تُقدم أكثر من خيارين إطلاقاً لكل محرك
- قدم معلومات عن رقم فلتر الزيت المناسب فقط

🌡️ مناخ العراق:
- حرارة تصل إلى 50°C
- غبار دائم وقيادة بطيئة في الزحام
✅ يتطلب زيوت Full Synthetic فقط من علامات معتمدة

🛢️ العلامات التجارية المسموح بها للزيوت:
Castrol, Mobil 1, Liqui Moly, Valvoline, Motul, Meguin, Hanata  
❌ لا تقترح أي زيت خارج هذه القائمة، حتى كمثال

🔧 العلامات التجارية المسموح بها لفلاتر الزيت:
Denkermann  
❌ لا تقترح أي فلتر خارج هذه القائمة، حتى كمثال

🔧 العلامات التجارية المسموح بها لفلاتر الهواء:
Denkermann  
❌ لا تقترح أي فلتر خارج هذه القائمة، حتى كمثال

📋 تنسيق الإجابة الإجباري:

1️⃣ <b>[نوع المحرك]</b>  
🛢️ سعة الزيت: [X.X لتر]  
⚙️ اللزوجة: [XW-XX]  
🔧 نوع الزيت: Full Synthetic  
🌡️ مناسب لحرارة العراق: ✅  
🎯 <b>التوصية النهائية:</b> [اسم الزيت + اللزوجة] ([سعة الزيت] لتر)  
📦 <b>فلتر الزيت:</b> [رقم فلتر الزيت]

❗ عدم الالتزام بالتنسيق أو بزيت غير معتمد = خطأ فادح

🔍 أمثلة:

🟩 إذا كانت السيارة تحتوي على محرك واحد:  
↪️ قدم الإجابة مباشرة بذلك المحرك فقط.

🟨 إذا كانت السيارة تحتوي على أكثر من نوع محرك:  
↪️ قدم الإجابات لجميع المحركات في نفس الرد، كل واحدة بتنسيق منفصل كما هو موضح أعلاه.

🟥 لا تطلب من المستخدم اختيار المحرك إذا لم يذكره. اعرض كل الخيارات المعروفة للموديل.

🎯 هدفك النهائي:  
تقديم توصية <b>موثوقة، دقيقة، بسيطة، ومناسبة تماماً للمناخ العراقي القاسي</b>، مع الالتزام الكامل بكل التعليمات.`
}

/**
 * Gets specific oil filter information for a vehicle
 */
export function getOilFilterInfo(brand: string, model: string): string {
  const filterPartNumber = findOilFilter(brand, model)
  
  if (filterPartNumber) {
    const compatibleVehicles = getFilterCompatibleVehicles(filterPartNumber)
    return `\n\n📦 معلومات فلتر الزيت المناسب:\nرقم الفلتر: ${filterPartNumber}\nمتوافق مع: ${compatibleVehicles.slice(0, 5).join(', ')}${compatibleVehicles.length > 5 ? ' وآخرين...' : ''}`
  }
  
  return '\n\n⚠️ لم يتم العثور على فلتر زيت محدد لهذه السيارة. يرجى مراجعة الوكيل المعتمد.'
}

/**
 * Gets specific air filter information for a vehicle
 */
export function getAirFilterInfo(brand: string, model: string): string {
  const filterPartNumber = findAirFilter(brand, model)
  
  if (filterPartNumber) {
    const compatibleVehicles = getAirFilterCompatibleVehicles(filterPartNumber)
    return `\n\n🌬️ معلومات فلتر الهواء المناسب:\nرقم الفلتر: ${filterPartNumber}\nمتوافق مع: ${compatibleVehicles.slice(0, 5).join(', ')}${compatibleVehicles.length > 5 ? ' وآخرين...' : ''}`
  }
  
  return '\n\n⚠️ لم يتم العثور على فلتر هواء محدد لهذه السيارة. يرجى مراجعة الوكيل المعتمد.'
}

/**
 * Gets authorized oils information
 */
export function getAuthorizedOilsInfo(): string {
  const oilCategories = {
    'Castrol': ['Castrol GTX 5W-30', 'Castrol EDGE 5W-30', 'Castrol EDGE 5W-40', 'Castrol EDGE 0W-20', 'Castrol EDGE 0W-30'],
    'Mobil 1': ['Mobil 1 FS 5W-30', 'Mobil 1 FS 5W-40', 'Mobil 1 FS 0W-20', 'Mobil 1 FS 0W-30', 'Mobil Super 5W-30'],
    'Liqui Moly': ['Liqui Moly Top Tec 4200 5W-30', 'Liqui Moly Top Tec 6200 0W-20', 'Liqui Moly Synthoil Energy 0W-30'],
    'Valvoline': ['Valvoline MaxLife 5W-30', 'Valvoline SynPower 0W-20', 'Valvoline SynPower 0W-30'],
    'Motul': ['Motul 8100 X-clean 5W-30', 'Motul 8100 X-clean 0W-30', 'Motul 6100 Save-lite 5W-30'],
    'Meguin': ['Meguin Megol 5W-30', 'Meguin Super Leichtlauf 0W-30'],
    'Hanata': ['Hanata Gold 5W-30', 'Hanata Platinum 0W-20']
  }
  
  let oilsInfo = '\n\n🛢️ الزيوت المعتمدة المتوفرة:\n'
  
  for (const [brand, oils] of Object.entries(oilCategories)) {
    oilsInfo += `\n${brand}:\n`
    oils.forEach(oil => {
      const spec = authorizedOils[oil]
      if (spec) {
        oilsInfo += `- ${oil} (${spec.type}, ${spec.price})\n`
      }
    })
  }
  
  return oilsInfo
}

/**
 * Builds a complete system prompt with optional additional data
 */
export function buildSystemPrompt(options: SystemPromptOptions = {}): string {
  let prompt = getBaseSystemPrompt()
  
  // Add specific vehicle filter information if brand and model provided
  if (options.brand && options.model) {
    if (options.includeOilFilters !== false) {
      prompt += getOilFilterInfo(options.brand, options.model)
    }
    
    if (options.includeAirFilters) {
      prompt += getAirFilterInfo(options.brand, options.model)
    }
  }
  
  // Add authorized oils information if requested
  if (options.includeAuthorizedOils) {
    prompt += getAuthorizedOilsInfo()
  }
  
  return prompt
}

/**
 * Builds a minimal system prompt for API efficiency
 */
export function buildMinimalSystemPrompt(brand?: string, model?: string): string {
  let prompt = getBaseSystemPrompt()
  
  // Only add specific filter info if we have both brand and model
  if (brand && model) {
    prompt += getOilFilterInfo(brand, model)
  }
  
  return prompt
}

export default {
  buildSystemPrompt,
  buildMinimalSystemPrompt,
  getBaseSystemPrompt,
  getOilFilterInfo,
  getAirFilterInfo,
  getAuthorizedOilsInfo
}