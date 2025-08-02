import { getCarSpecs, getCarByVIN, getTopModels, getCarRecommendations, EnhancedCarSpec } from '@/db/enhanced-supabase'
import authorizedOils, { type OilSpec } from "@/data/authorizedOils"
import logger from "@/utils/logger"

export interface TrackingCarData {
  carBrand: string
  carModel: string
  year: number
  mileage: number
  conditions: string
  vin?: string
  transmissionType?: "Automatic" | "Manual" | "CVT" | "DCT"
  driveType?: "FWD" | "RWD" | "AWD" | "4WD"
  engineSize?: string
  fuelType?: "Gasoline" | "Diesel" | "Hybrid" | "Electric" | "Plug-in Hybrid"
  heatResistance?: string
  dustProtection?: boolean
  fuelEfficiency?: string
  location?: string
}

export interface TrackingOilRecommendation {
  carSpecs: EnhancedCarSpec | null
  primaryOil: [string, OilSpec] | null
  alternativeOil: [string, OilSpec] | null
  recommendedViscosity: string
  recommendedType: string
  yearCategory: string
  transmissionRecommendation?: string
  serviceBulletins?: Array<{
    title: string
    description: string
    url: string
  }>
  temperatureNotes?: string
  similarCars?: Array<{
    brand: string
    model: string
    year: number
    similarity: number
  }>
  popularModels?: Array<{
    brand: string
    model: string
    year: number
    queries: number
  }>
  errorMessage?: string
}

interface CacheEntry {
  result: TrackingOilRecommendation | { errorMessage: string }
  timestamp: number
  expiryTime: number
}

class RecommendationCache {
  private cache = new Map<string, CacheEntry>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 دقيقة

  set(key: string, value: TrackingOilRecommendation | { errorMessage: string }): void {
    const entry: CacheEntry = {
      result: value,
      timestamp: Date.now(),
      expiryTime: Date.now() + this.CACHE_DURATION,
    }
    this.cache.set(key, entry)
    logger.debug(`تم حفظ النتيجة في الذاكرة المؤقتة`, { key })
  }

  get(key: string): (TrackingOilRecommendation | { errorMessage: string }) | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiryTime) {
      this.cache.delete(key)
      logger.debug(`انتهت صلاحية النتيجة في الذاكرة المؤقتة`, { key })
      return null
    }

    logger.debug(`تم استرجاع النتيجة من الذاكرة المؤقتة`, { key })
    return entry.result
  }

  clear(): void {
    this.cache.clear()
    logger.info(`تم مسح الذاكرة المؤقتة`)
  }

  getStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    }
  }
}

const recommendationCache = new RecommendationCache()

export class TrackingCarAnalyzer {
  /**
   * استخراج بيانات السيارة من رسالة المستخدم
   */
  public static extractCarData(userMessage: string): TrackingCarData {
    const message = userMessage.toLowerCase()

    // استخراج بيانات السيارة
    let carBrand = ""
    let carModel = ""
    let year = 0
    let mileage = 0
    let vin = ""
    let conditions = "عادي" // افتراضي
    let transmissionType: "Automatic" | "Manual" | "CVT" | "DCT" | undefined = undefined
    let driveType: "FWD" | "RWD" | "AWD" | "4WD" | undefined = undefined
    let heatResistance = "متوسطة" // افتراضي
    let dustProtection = false // افتراضي
    let fuelEfficiency = "عادي" // افتراضي
    let location = "" // موقع المستخدم
    let fuelType: "Gasoline" | "Diesel" | "Hybrid" | "Electric" | "Plug-in Hybrid" | undefined = undefined

    // تحديد العلامة التجارية - كود مشابه للنسخة الحالية
    if (message.includes("هيونداي") || message.includes("hyundai")) carBrand = "hyundai"
    else if (message.includes("تويوتا") || message.includes("toyota")) carBrand = "toyota"
    else if (message.includes("هوندا") || message.includes("honda")) carBrand = "honda"
    else if (message.includes("بي ام دبليو") || message.includes("bmw")) carBrand = "bmw"
    else if (message.includes("مرسيدس") || message.includes("mercedes")) carBrand = "mercedes"
    else if (message.includes("نيسان") || message.includes("nissan")) carBrand = "nissan"
    else if (message.includes("كيا") || message.includes("kia")) carBrand = "kia"
    else if (message.includes("جنسزز") || message.includes("جينيسيس") || message.includes("genesis")) carBrand = "genesis"
    else if (message.includes("شيفروليه") || message.includes("شفروليه") || message.includes("chevrolet")) carBrand = "chevrolet"
    else if (message.includes("ميتسوبيشي") || message.includes("متسوبيشي") || message.includes("mitsubishi")) carBrand = "mitsubishi"
    else if (message.includes("فورد") || message.includes("ford")) carBrand = "ford"
    else if (message.includes("فولكس واجن") || message.includes("فولكسفاجن") || message.includes("volkswagen")) carBrand = "volkswagen"
    else if (message.includes("دودج") || message.includes("dodge")) carBrand = "dodge"

    // تحديد الموديل - جزء من الكود المستخدم سابقاً
    if (message.includes("النترا") || message.includes("elantra")) carModel = "elantra"
    else if (message.includes("سوناتا") || message.includes("sonata")) carModel = "sonata"
    else if (message.includes("توكسون") || message.includes("tucson")) carModel = "tucson"
    // ... وهكذا لباقي الموديلات

    // استخراج VIN
    const vinMatch = message.match(/vin[:\s]*([A-HJ-NPR-Z0-9]{17})/i)
    if (vinMatch) vin = vinMatch[1]

    // استخراج السنة
    const yearMatch = message.match(/20\d{2}/)
    if (yearMatch) year = Number.parseInt(yearMatch[0])

    // استخراج المسافة
    const mileageThousandMatch = message.match(/(\d+)\s*(ألف|الف|k|كيلو|كلم|الف كم|الف كلم|ألف كم|ألف كلم)/i)
    const mileageDirectMatch = message.match(/(\d+)\s*(كم|km)/i) || message.match(/ماشية\s+(\d+)/i) || message.match(/قاطع\s+(\d+)/i)
    
    if (mileageThousandMatch) {
      mileage = Number.parseInt(mileageThousandMatch[1]) * 1000
    } else if (mileageDirectMatch) {
      mileage = Number.parseInt(mileageDirectMatch[1])
    }

    // تحديد نوع ناقل الحركة
    if (message.includes("اوتوماتيك") || message.includes("أوتوماتيك") || message.includes("automatic")) {
      transmissionType = "Automatic"
    } else if (message.includes("مانيوال") || message.includes("عادي") || message.includes("manual")) {
      transmissionType = "Manual"
    } else if (message.includes("cvt")) {
      transmissionType = "CVT"
    } else if (message.includes("dct") || message.includes("dual clutch")) {
      transmissionType = "DCT"
    }

    // تحديد نوع الدفع
    if (message.includes("دفع أمامي") || message.includes("دفع امامي") || message.includes("fwd")) {
      driveType = "FWD"
    } else if (message.includes("دفع خلفي") || message.includes("rwd")) {
      driveType = "RWD"
    } else if (message.includes("دفع رباعي") || message.includes("4wd") || message.includes("4x4")) {
      driveType = "4WD"
    } else if (message.includes("دفع كلي") || message.includes("awd")) {
      driveType = "AWD"
    }

    // تحديد نوع الوقود
    if (message.includes("بنزين") || message.includes("gasoline")) {
      fuelType = "Gasoline"
    } else if (message.includes("ديزل") || message.includes("diesel")) {
      fuelType = "Diesel"
    } else if (message.includes("هايبرد") || message.includes("هجين") || message.includes("hybrid")) {
      fuelType = "Hybrid"
    } else if (message.includes("كهربائي") || message.includes("electric")) {
      fuelType = "Electric"
    } else if (message.includes("بلاقين") || message.includes("plug-in")) {
      fuelType = "Plug-in Hybrid"
    }

    // تحديد ظروف التشغيل
    if (message.includes("شاق") || message.includes("صعب")) conditions = "شاق"
    else if (message.includes("سفر") || message.includes("طريق")) conditions = "سفر"
    else if (message.includes("مدينة")) conditions = "مدينة"

    // تحديد موقع المستخدم
    if (message.includes("العراق") || message.includes("عراق")) {
      location = "العراق"
    } else if (message.includes("السعودية") || message.includes("سعودية")) {
      location = "السعودية"
    } else if (message.includes("الإمارات") || message.includes("الامارات") || message.includes("دبي") || message.includes("ابوظبي")) {
      location = "الإمارات"
    } else if (message.includes("الكويت")) {
      location = "الكويت"
    } else {
      // افتراضيًا نعتبر الموقع هو العراق
      location = "العراق"
    }

    // تحديد مقاومة الحرارة
    if (message.includes("مقاومة حرارة عالية")) heatResistance = "عالية"
    else if (message.includes("مقاومة حرارة منخفضة")) heatResistance = "منخفضة"

    // تحديد حماية من الغبار
    if (message.includes("حماية من الغبار")) dustProtection = true

    // تحديد كفاءة الوقود
    if (message.includes("كفاءة الوقود عالية")) fuelEfficiency = "عالية"
    else if (message.includes("كفاءة الوقود منخفضة")) fuelEfficiency = "منخفضة"

    // تطبيق إعدادات المناخ بناءً على الموقع تلقائيًا
    if (location === "العراق") {
      // يعتبر مناخ العراق حار وجاف بشكل عام
      heatResistance = "عالية" // مقاومة حرارة عالية افتراضيًا
      dustProtection = true // حماية من الغبار افتراضيًا
      // للمناطق الصحراوية والظروف القاسية
      if (conditions === "عادي" && !message.includes("مدينة")) {
        conditions = "شاق" // نعتبر الظروف شاقة افتراضيًا
      }
    }

    return {
      carBrand,
      carModel,
      year,
      mileage,
      vin,
      conditions,
      transmissionType,
      driveType,
      heatResistance,
      dustProtection,
      fuelEfficiency,
      location,
      fuelType
    }
  }

  /**
   * التحقق من اكتمال بيانات السيارة
   */
  public static validateCarData(carData: TrackingCarData): string | null {
    // التحقق من VIN إذا كان متوفرًا
    if (carData.vin && carData.vin.length === 17) {
      // يمكن أن نعتمد على VIN فقط إذا كان متوفرًا
      return null
    }

    // التحقق من البيانات الأساسية
    if (!carData.carBrand) {
      return "لم أتمكن من تحديد نوع السيارة. يرجى ذكر اسم الشركة المصنعة (مثل: تويوتا، هيونداي، هوندا) أو رقم VIN الخاص بالسيارة."
    }

    if (!carData.carModel) {
      return `لم أتمكن من تحديد موديل السيارة ${carData.carBrand}. يرجى ذكر الموديل بوضوح.`
    }

    if (!carData.year) {
      return `لم أتمكن من تحديد سنة صنع السيارة ${carData.carBrand} ${carData.carModel}. يرجى ذكر السنة (مثال: 2020).`
    }

    if (!carData.mileage) {
      return `لم أتمكن من تحديد عدد الكيلومترات للسيارة ${carData.carBrand} ${carData.carModel}. يرجى ذكر عدد الكيلومترات (مثال: 50 ألف).`
    }

    return null
  }

  /**
   * تحليل بيانات السيارة وتوصية الزيت المناسب باستخدام Supabase
   */
  public static async analyzeCarAndRecommendOil(userMessage: string): Promise<TrackingOilRecommendation | { errorMessage: string }> {
    try {
      // إنشاء مفتاح للذاكرة المؤقتة
      const cacheKey = userMessage.toLowerCase().trim()

      // التحقق من وجود النتيجة في الذاكرة المؤقتة
      const cachedResult = recommendationCache.get(cacheKey)
      if (cachedResult) {
        return cachedResult
      }

      // استخراج بيانات السيارة
      const carData = this.extractCarData(userMessage)

      // التحقق من اكتمال البيانات
      const validationError = this.validateCarData(carData)
      if (validationError) {
        const errorResult = { errorMessage: validationError }
        recommendationCache.set(cacheKey, errorResult)
        return errorResult
      }

      // محاولة الحصول على البيانات من VIN أولاً إذا كان متاحًا
      if (carData.vin && carData.vin.length === 17) {
        logger.info(`استخدام VIN للحصول على بيانات السيارة: ${carData.vin}`)
        
        const vinData = await getCarByVIN(carData.vin)
        if (vinData) {
          // استخدام بيانات VIN لتحديث بيانات السيارة
          carData.carBrand = vinData.brand
          carData.carModel = vinData.model
          carData.year = vinData.year
          
          // الحصول على مواصفات السيارة من البيانات المحدثة
          const carSpecs = vinData.specs
          
          if (!carSpecs) {
            logger.warn(`لم يتم العثور على مواصفات للسيارة باستخدام VIN`, { vin: carData.vin })
            const errorResult = {
              errorMessage: `عذراً، لم نتمكن من العثور على مواصفات لسيارتك باستخدام رقم VIN. يرجى التأكد من صحة الرقم أو تقديم معلومات إضافية عن السيارة.`
            }
            recommendationCache.set(cacheKey, errorResult)
            return errorResult
          }
          
          // المتابعة بالمواصفات المستلمة من VIN
          return await this.generateRecommendation(carData, carSpecs)
        }
      }

      // إذا لم يكن VIN متاحًا أو لم تجد نتائج، استخدم البيانات المستخرجة
      logger.info(`الحصول على مواصفات السيارة من قاعدة البيانات: ${carData.carBrand} ${carData.carModel} ${carData.year}`)
      
      const carSpecs = await getCarSpecs(carData.carBrand, carData.carModel, carData.year)
      
      if (!carSpecs) {
        logger.warn(`لم يتم العثور على مواصفات للسيارة`, { carData })
        const errorResult = {
          errorMessage: `عذراً، لا تتوفر لدينا المواصفات الفنية الرسمية لسيارة ${carData.carBrand} ${carData.carModel} موديل ${carData.year}.`
        }
        recommendationCache.set(cacheKey, errorResult)
        return errorResult
      }
      
      // المتابعة بالمواصفات المستلمة من قاعدة البيانات
      return await this.generateRecommendation(carData, carSpecs)
      
    } catch (error) {
      logger.error(`خطأ أثناء تحليل بيانات السيارة`, { error, userMessage })
      const errorResult = {
        errorMessage: `عذراً، حدث خطأ أثناء تحليل بيانات السيارة. يرجى المحاولة مرة أخرى بصيغة مختلفة.`
      }
      return errorResult
    }
  }

  /**
   * إنشاء التوصية بناءً على بيانات السيارة والمواصفات
   */
  private static async generateRecommendation(carData: TrackingCarData, carSpecs: EnhancedCarSpec): Promise<TrackingOilRecommendation> {
    // استخدام نفس منطق التوصية مع إضافة الميزات الجديدة
    
    // تعديل التوصية بناءً على الكيلومترات
    let recommendedViscosity = carSpecs.viscosity
    let recommendedType = carSpecs.oilType

    // Special handling for high mileage
    if (carData.mileage > 150000) {
      if (carSpecs.viscosity === "0W-20") recommendedViscosity = "5W-30"
      else if (carSpecs.viscosity === "0W-30") recommendedViscosity = "5W-30"
      recommendedType = "High Mileage"
      logger.info(`تعديل التوصية للكيلومترات العالية`, {
        originalViscosity: carSpecs.viscosity,
        newViscosity: recommendedViscosity,
      })
    } else if (carData.mileage > 100000) {
      if (carSpecs.viscosity === "0W-20") recommendedViscosity = "5W-30"
      logger.info(`تعديل التوصية للكيلومترات المتوسطة`, {
        originalViscosity: carSpecs.viscosity,
        newViscosity: recommendedViscosity,
      })
    }

    // تعديل التوصية بناءً على ظروف التشغيل
    if (carData.conditions === "شاق" && recommendedViscosity === "0W-20") {
      recommendedViscosity = "5W-30"
      logger.info(`تعديل التوصية لظروف التشغيل الشاقة`, { newViscosity: recommendedViscosity })
    }

    // تعديل التوصية بناءً على مقاومة الحرارة
    if (carData.heatResistance === "عالية") {
      if (recommendedViscosity.startsWith("0W-")) {
        recommendedViscosity = "5W-30"
        logger.info(`تعديل التوصية لمقاومة الحرارة العالية`, { newViscosity: recommendedViscosity })
      }
      
      // للمحركات الأكبر، يفضل لزوجة أعلى في المناخ الحار
      if (carSpecs.engineSize.includes("2.5L") || carSpecs.engineSize.includes("3.0L")) {
        if (recommendedViscosity === "5W-30") {
          recommendedViscosity = "5W-40"
          logger.info(`تعديل إضافي للمحركات الكبيرة في المناخ الحار`, { newViscosity: recommendedViscosity })
        }
      }
    }

    // إضافة توصيات لنقل الحركة
    let transmissionRecommendation = ""
    if (carData.transmissionType === "Automatic") {
      transmissionRecommendation = "يوصى باستخدام زيت ATF المخصص للسيارات الأوتوماتيكية وتغييره كل 60,000 كم."
    } else if (carData.transmissionType === "CVT") {
      transmissionRecommendation = "يجب استخدام زيت CVT المخصص فقط. لا تستخدم زيت ATF العادي."
    } else if (carData.transmissionType === "Manual") {
      transmissionRecommendation = "يوصى باستخدام زيت 75W-90 للجير العادي وتغييره كل 80,000 كم."
    }

    // إضافة ملاحظات درجة الحرارة
    let temperatureNotes = ""
    if (carSpecs.temperatureRange) {
      temperatureNotes = `الزيت الموصى به مناسب لدرجات حرارة بين ${carSpecs.temperatureRange.min} و ${carSpecs.temperatureRange.max} درجة مئوية.`
    } else if (carData.location === "العراق") {
      temperatureNotes = "نظرًا للمناخ الحار في العراق، يفضل استخدام زيت بلزوجة أعلى للحماية المثلى."
    }

    // الحصول على السيارات المشابهة والموديلات الشائعة
    const similarCars = await getCarRecommendations(carData.carBrand, carData.carModel, carData.year)
    const popularModels = await getTopModels(5)

    // البحث عن أفضل زيت متوفر
    const matchingOils = Object.entries(authorizedOils).filter(
      ([name, oil]) =>
        oil.viscosity === recommendedViscosity && (oil.type === recommendedType || oil.type === "Full Synthetic"),
    )

    // التعامل مع حالة عدم وجود زيوت مطابقة
    if (matchingOils.length === 0) {
      logger.warn(`لم يتم العثور على زيوت مطابقة`, { recommendedViscosity, recommendedType })

      // البحث عن بدائل قريبة
      const alternativeOils = Object.entries(authorizedOils).filter(
        ([name, oil]) => oil.type === "Full Synthetic" || oil.type === recommendedType,
      )

      if (alternativeOils.length > 0) {
        // ترتيب البدائل حسب الجودة
        const sortedAlternatives = alternativeOils.sort((a, b) => {
          const typeOrder = { "Full Synthetic": 1, "High Mileage": 2, "Semi Synthetic": 3, Conventional: 4 }
          return typeOrder[a[1].type] - typeOrder[b[1].type]
        })

        return {
          carSpecs,
          primaryOil: sortedAlternatives[0],
          alternativeOil: sortedAlternatives[1] || null,
          recommendedViscosity,
          recommendedType,
          yearCategory: `${carData.year}`,
          transmissionRecommendation,
          temperatureNotes,
          similarCars,
          popularModels,
          errorMessage: `لم نجد زيتاً مطابقاً تماماً للمواصفات المطلوبة، لكن هذه أفضل البدائل المتاحة.`,
        }
      } else {
        return {
          errorMessage: `عذراً، لا تتوفر لدينا زيوت مناسبة لهذه المواصفات حالياً.`,
          carSpecs: null,
          primaryOil: null,
          alternativeOil: null,
          recommendedViscosity: "",
          recommendedType: "",
          yearCategory: "",
          similarCars,
          popularModels,
        }
      }
    }

    // ترتيب الزيوت حسب الجودة والسعر
    const sortedOils = matchingOils.sort((a, b) => {
      const typeOrder = { "Full Synthetic": 1, "High Mileage": 2, "Semi Synthetic": 3, Conventional: 4 }
      return typeOrder[a[1].type] - typeOrder[b[1].type]
    })

    return {
      carSpecs,
      primaryOil: sortedOils[0],
      alternativeOil: sortedOils[1] || null,
      recommendedViscosity,
      recommendedType,
      yearCategory: `${carData.year}`,
      transmissionRecommendation,
      temperatureNotes,
      similarCars,
      popularModels,
    }
  }

  /**
   * إنشاء رسالة التوصية النهائية
   */
  public static createRecommendationMessage(recommendation: TrackingOilRecommendation): string {
    try {
      if (recommendation.errorMessage) {
        return recommendation.errorMessage
      }

      if (!recommendation.carSpecs || !recommendation.primaryOil) {
        return `عذراً، لم نتمكن من إيجاد توصية مناسبة. يرجى التأكد من المعلومات المدخلة.`
      }

      const { carSpecs, primaryOil, alternativeOil, recommendedViscosity, recommendedType } = recommendation

      // تحديد نوع المحرك للـ badge
      const engineBadge = carSpecs.engineSize.includes("Hybrid")
        ? "🔋 هايبرد"
        : carSpecs.engineSize.includes("Turbo")
          ? "⚡ تيربو"
          : "🔧 عادي"

      const driveTypeBadge = carSpecs.driveType ? `${carSpecs.driveType}` : ""
      const transmissionBadge = carSpecs.transmissionType ? `${carSpecs.transmissionType}` : ""

      // إضافة توصيات للسيارات المشابهة
      const similarCarsSection = recommendation.similarCars && recommendation.similarCars.length > 0
        ? `\n🚘 **سيارات مشابهة**\n${recommendation.similarCars.slice(0, 3).map(car => 
            `- ${car.brand} ${car.model} (${car.year})`
          ).join('\n')}`
        : ""

      // تنسيق رسالة التوصية مع تحسينات بصرية
      const message = `🚗 **تحليل السيارة** ${engineBadge}
${driveTypeBadge ? `نوع الدفع: ${driveTypeBadge}\n` : ""}${transmissionBadge ? `ناقل الحركة: ${transmissionBadge}\n` : ""}نوع المحرك: ${carSpecs.engineSize}
حجم المحرك: ${carSpecs.capacity}
${carSpecs.fuelType ? `نوع الوقود: ${carSpecs.fuelType}\n` : ""}

🛢️ **الزيت الموصى به**
اللزوجة: ${recommendedViscosity}
النوع: ${recommendedType}
العلامة التجارية: ${primaryOil[1].brand}
اسم المنتج: ${primaryOil[0]}

✅ **المواصفات الفنية**
API: ${carSpecs.apiSpec || "غير محدد"}
عدد الفلتر: ${carSpecs.filterNumber}
فترة التغيير: ${carSpecs.changeInterval} كم

${recommendation.transmissionRecommendation ? `🔄 **توصية ناقل الحركة**\n${recommendation.transmissionRecommendation}\n\n` : ""}

${recommendation.temperatureNotes ? `🌡️ **ملاحظات درجة الحرارة**\n${recommendation.temperatureNotes}\n\n` : ""}

${recommendation.serviceBulletins?.length ? `⚠️ **نشرات الخدمة الهامة**\n${recommendation.serviceBulletins.map(b => `- ${b.title}: ${b.description}`).join('\n')}\n\n` : ""}

💡 **نصائح إضافية**
${primaryOil[1].features ? primaryOil[1].features.join("\n") : "لا توجد نصائح إضافية"}
${similarCarsSection}

⚠️ **ملاحظة هامة**
هذه التوصية مبنية على المواصفات الرسمية للشركة المصنعة. يفضل دائماً التأكد من دليل المستخدم الخاص بسيارتك.

${
  alternativeOil
    ? `
🌟 **بديل مقترح**
اللزوجة: ${recommendedViscosity}
النوع: ${alternativeOil[1].type}
العلامة التجارية: ${alternativeOil[1].brand}
اسم المنتج: ${alternativeOil[0]}
`
    : ""
}`

      return message
    } catch (error) {
      logger.error(`خطأ أثناء إنشاء رسالة التوصية`, { error, recommendation })
      return `عذراً، حدث خطأ أثناء إنشاء رسالة التوصية.`
    }
  }
}

export default TrackingCarAnalyzer 