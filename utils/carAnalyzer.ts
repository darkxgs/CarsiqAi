import officialSpecs, { type CarSpec } from "@/data/officialSpecs"
import authorizedOils, { type OilSpec } from "@/data/authorizedOils"
import logger from "@/utils/logger"

// إضافة نظام ذاكرة التخزين المؤقت
interface CacheEntry {
  result: OilRecommendation | { errorMessage: string }
  timestamp: number
  expiryTime: number
}

class RecommendationCache {
  private cache = new Map<string, CacheEntry>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 دقيقة

  set(key: string, value: OilRecommendation | { errorMessage: string }): void {
    const entry: CacheEntry = {
      result: value,
      timestamp: Date.now(),
      expiryTime: Date.now() + this.CACHE_DURATION,
    }
    this.cache.set(key, entry)
    logger.debug(`تم حفظ النتيجة في الذاكرة المؤقتة`, { key })
  }

  get(key: string): (OilRecommendation | { errorMessage: string }) | null {
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

export interface CarData {
  carBrand: string
  carModel: string
  year: number
  mileage: number
  conditions: string
  engineSize?: string
  heatResistance?: string
  dustProtection?: boolean
  fuelEfficiency?: string
  location?: string
}

export interface OilRecommendation {
  carSpecs: CarSpec | null
  primaryOil: [string, OilSpec] | null
  alternativeOil: [string, OilSpec] | null
  recommendedViscosity: string
  recommendedType: string
  yearCategory: string
  errorMessage?: string
  
  // Air filter properties
  airFilterNumber?: string
  airFilterChangeInterval?: string
  airFilterPrice?: string
  airFilterImageUrl?: string
}

export class CarAnalyzer {
  /**
   * استخراج بيانات السيارة من رسالة المستخدم
   */
  public static extractCarData(userMessage: string): CarData {
    const message = userMessage.toLowerCase()

    // استخراج بيانات السيارة
    let carBrand = ""
    let carModel = ""
    let year = 0
    let mileage = 0
    let conditions = "عادي" // افتراضي
    let heatResistance = "متوسطة" // افتراضي
    let dustProtection = false // افتراضي
    let fuelEfficiency = "عادي" // افتراضي
    let location = "" // موقع المستخدم

    // تحديد العلامة التجارية
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
    else if (message.includes("كرايسلر") || message.includes("chrysler")) carBrand = "chrysler"

    // تحديد الموديل
    if (message.includes("النترا") || message.includes("elantra")) carModel = "elantra"
    else if (message.includes("سوناتا") || message.includes("sonata")) carModel = "sonata"
    else if (message.includes("توكسون") || message.includes("tucson")) carModel = "tucson"
    else if (message.includes("اكسنت") || message.includes("أكسنت") || message.includes("accent")) carModel = "accent"
    else if (message.includes("كريتا") || message.includes("creta")) carModel = "creta"
    else if (message.includes("كامري") || message.includes("camry")) carModel = "camry"
    else if (message.includes("كورولا") || message.includes("corolla")) carModel = "corolla"
    else if (message.includes("بريوس") || message.includes("prius")) carModel = "prius"
    else if (message.includes("هايلكس") || message.includes("هايلوكس") || message.includes("hilux")) carModel = "hilux"
    else if (message.includes("لاندكروزر") || message.includes("لاند كروزر") || message.includes("landcruiser")) carModel = "landcruiser"
    else if (message.includes("يارس") || message.includes("yaris")) carModel = "yaris"
    else if (message.includes("راف فور") || message.includes("راف 4") || message.includes("rav4")) carModel = "rav4"
    else if (message.includes("سيفيك") || message.includes("civic")) carModel = "civic"
    else if (message.includes("أكورد") || message.includes("accord")) carModel = "accord"
    else if (message.includes("سي آر في") || message.includes("cr-v") || message.includes("crv")) carModel = "crv"
    else if (message.includes("سيتي") || message.includes("city")) carModel = "city"
    else if (message.includes("c300") || message.includes("سي 300") || message.includes("٣٠٠") || (message.includes("300") && (message.includes("كرايسلر") || message.includes("chrysler")))) carModel = "300"
    else if (message.includes("الفئة الثالثة") || message.includes("3 series")) carModel = "3_series"
    else if (message.includes("الفئة الخامسة") || message.includes("5 series")) carModel = "5_series"
    else if (message.includes("اكس 5") || message.includes("x5")) carModel = "x5"
    else if (message.includes("سي كلاس") || message.includes("c class")) carModel = "c_class"
    else if (message.includes("اي كلاس") || message.includes("e class")) carModel = "e_class"
    else if (message.includes("التيما") || message.includes("altima")) carModel = "altima"
    else if (message.includes("صني") || message.includes("sunny")) carModel = "sunny"
    else if (message.includes("باترول") || message.includes("patrol")) carModel = "patrol"
    else if (message.includes("نافارا") || message.includes("navara")) carModel = "navara"
    else if (message.includes("أوبتيما") || message.includes("optima")) carModel = "optima"
    else if (message.includes("سبورتاج") || message.includes("sportage")) carModel = "sportage"
    else if (message.includes("ريو") || message.includes("rio")) carModel = "rio"
    else if (message.includes("سيراتو") || message.includes("cerato")) carModel = "cerato"
    else if (message.includes("كروز") || message.includes("cruze")) carModel = "cruze"
    else if (message.includes("ماليبو") || message.includes("malibu")) carModel = "malibu"
    else if (message.includes("تاهو") || message.includes("tahoe")) carModel = "tahoe"
    else if (message.includes("سلفرادو") || message.includes("silverado")) carModel = "silverado"
    else if (message.includes("باجيرو") || message.includes("pajero")) carModel = "pajero"
    else if (message.includes("لانسر") || message.includes("lancer")) carModel = "lancer"
    else if (message.includes("ال 200") || message.includes("l200")) carModel = "l200"
    else if (message.includes("اف 150") || message.includes("f150") || message.includes("f-150")) carModel = "f150"
    else if (message.includes("رينجر") || message.includes("ranger")) carModel = "ranger"
    else if (message.includes("باسات") || message.includes("passat")) carModel = "passat"
    else if (message.includes("تيجوان") || message.includes("tiguan")) carModel = "tiguan"
    else if (message.includes("تشارجر") || message.includes("charger")) carModel = "charger"
    else if (message.includes("دورانجو") || message.includes("durango")) carModel = "durango"
    else if (message.includes("جي ٧٠") || message.includes("g70") || message.includes("g 70")) carModel = "g70"
    else if (message.includes("جي ٨٠") || message.includes("g80") || message.includes("g 80")) carModel = "g80"

    // استخراج السنة
    const yearMatch = message.match(/20\d{2}/)
    if (yearMatch) year = Number.parseInt(yearMatch[0])

    // استخراج المسافة
    // البحث عن صيغة "X ألف" أولاً
    const mileageThousandMatch = message.match(/(\d+)\s*(ألف|الف|k|كيلو|كلم|الف كم|الف كلم|ألف كم|ألف كلم)/i)
    // البحث عن صيغة "X كم" أو رقم مباشر
    const mileageDirectMatch = message.match(/(\d+)\s*(كم|km)/i) || message.match(/ماشية\s+(\d+)/i) || message.match(/قاطع\s+(\d+)/i)
    
    if (mileageThousandMatch) {
      // إذا كان الرقم بصيغة "ألف"، نضرب في 1000
      mileage = Number.parseInt(mileageThousandMatch[1]) * 1000
    } else if (mileageDirectMatch) {
      // إذا كان الرقم مباشرًا مع "كم"، نأخذه كما هو
      mileage = Number.parseInt(mileageDirectMatch[1])
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
      // افتراضيًا نعتبر الموقع هو العراق كما طلب المستخدم
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
      conditions,
      heatResistance,
      dustProtection,
      fuelEfficiency,
      location,
    }
  }

  /**
   * التحقق من اكتمال بيانات السيارة
   */
  public static validateCarData(carData: CarData): string | null {
    if (!carData.carBrand) {
      return "لم أتمكن من تحديد نوع السيارة. يرجى ذكر اسم الشركة المصنعة (مثل: تويوتا، هيونداي، هوندا)."
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
   * تحديد فئة السنة المناسبة
   */
  public static determineYearCategory(carData: CarData): string {
    const { carBrand, carModel, year } = carData

    // الحصول على فئات السنوات المتاحة لهذا الموديل
    const modelData = officialSpecs[carBrand]?.[carModel]
    if (!modelData) {
      logger.warn(`لا توجد بيانات للموديل: ${carBrand} ${carModel}`)
      return ""
    }

    // ترتيب فئات السنوات تنازلياً
    const yearCategories = Object.keys(modelData).sort().reverse()

    // البحث عن الفئة المناسبة
    for (const category of yearCategories) {
      const [startYear, endYear] = category.split("-").map((y) => Number.parseInt(y))
      if (year >= startYear && year <= endYear) {
        return category
      }
    }

    // إذا لم يتم العثور على فئة مناسبة، استخدم أقرب فئة
    if (yearCategories.length > 0) {
      const latestCategory = yearCategories[0]
      const [startYear, endYear] = latestCategory.split("-").map((y) => Number.parseInt(y))

      if (year > endYear) {
        logger.info(`استخدام أحدث فئة متاحة ${latestCategory} للسنة ${year}`)
        return latestCategory
      } else {
        const oldestCategory = yearCategories[yearCategories.length - 1]
        logger.info(`استخدام أقدم فئة متاحة ${oldestCategory} للسنة ${year}`)
        return oldestCategory
      }
    }

    return ""
  }

  /**
   * تحليل بيانات السيارة وتوصية الزيت المناسب
   */
  public static analyzeCarAndRecommendOil(userMessage: string): OilRecommendation | { errorMessage: string } {
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

      // تحديد فئة السنة
      const yearCategory = this.determineYearCategory(carData)
      if (!yearCategory) {
        const errorResult = {
          errorMessage: `عذراً، لا تتوفر لدينا المواصفات الفنية الرسمية لسيارة ${carData.carBrand} ${carData.carModel} موديل ${carData.year}.`,
        }
        recommendationCache.set(cacheKey, errorResult)
        return errorResult
      }

      // الحصول على مواصفات السيارة
      const carSpecs = officialSpecs[carData.carBrand]?.[carData.carModel]?.[yearCategory]
      if (!carSpecs) {
        logger.error(`لم يتم العثور على مواصفات للسيارة`, { carData, yearCategory })
        const errorResult = {
          errorMessage: `عذراً، لا تتوفر لدينا المواصفات الفنية الرسمية لهذا الموديل حالياً.`,
        }
        recommendationCache.set(cacheKey, errorResult)
        return errorResult
      }

      // تعديل التوصية بناءً على الكيلومترات
      let recommendedViscosity = carSpecs.viscosity
      let recommendedType = carSpecs.oilType

      // Special handling for Genesis cars with high mileage
      if (carData.carBrand === "genesis" && carData.mileage > 100000) {
        // Genesis cars with high mileage need 5W-40 for better protection
        recommendedViscosity = "5W-40"
        recommendedType = "Full Synthetic"
        logger.info(`تعديل التوصية لسيارة جينيسيس ذات كيلومترات عالية`, {
          car: `${carData.carBrand} ${carData.carModel}`,
          mileage: carData.mileage,
          newViscosity: recommendedViscosity,
        })
      } else if (carData.mileage > 150000) {
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
          logger.info(`تعديل التوصية لمقاومة الحرارة العالية في العراق`, { newViscosity: recommendedViscosity })
        }
        
        // للمحركات الأكبر، يفضل لزوجة أعلى في المناخ الحار
        if (carSpecs.engineSize.includes("2.5L") || carSpecs.engineSize.includes("3.0L")) {
          if (recommendedViscosity === "5W-30") {
            recommendedViscosity = "5W-40"
            logger.info(`تعديل إضافي للمحركات الكبيرة في المناخ الحار`, { newViscosity: recommendedViscosity })
          }
        }
      }

      // تعديل التوصية للحماية من الغبار
      if (carData.dustProtection) {
        // زيوت معينة بأضافات خاصة للحماية من الغبار ومنع تآكل المحرك
        const dustProtectionOils = ["Castrol EDGE", "Liqui Moly Top Tec", "Motul 8100"]
        const currentOil = recommendedViscosity === "0W-20" ? "0W-20" : recommendedViscosity
        
        // إذا لم يكن الزيت الحالي مناسبًا للحماية من الغبار، نحاول العثور على بديل
        if (!dustProtectionOils.some(oil => currentOil.includes(oil))) {
          // البحث عن زيوت بديلة مناسبة للحماية من الغبار
          const betterOils = Object.entries(authorizedOils).filter(
            ([name, oil]) => 
              oil.viscosity === recommendedViscosity && 
              oil.type === "Full Synthetic" &&
              dustProtectionOils.some(brand => name.includes(brand))
          )
          
          if (betterOils.length > 0) {
            // ترتيب البدائل حسب الجودة
            recommendedViscosity = betterOils[0][0]
            recommendedType = betterOils[0][1].type
            
            logger.info(`تم تعديل الزيت المقترح للحماية من الغبار في مناخ العراق`, { 
              newViscosity: recommendedViscosity,
              newType: recommendedType,
            })
          }
        }
      }

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

          const result: OilRecommendation = {
            carSpecs,
            primaryOil: sortedAlternatives[0],
            alternativeOil: sortedAlternatives[1] || null,
            recommendedViscosity,
            recommendedType,
            yearCategory,
            errorMessage: `لم نجد زيتاً مطابقاً تماماً للمواصفات المطلوبة، لكن هذه أفضل البدائل المتاحة.`,
            // Add air filter information
            airFilterNumber: carSpecs.airFilterNumber,
            airFilterChangeInterval: carSpecs.airFilterChangeInterval,
            airFilterPrice: carSpecs.airFilterPrice,
            airFilterImageUrl: carSpecs.airFilterImageUrl
          }

          recommendationCache.set(cacheKey, result)
          return result
        } else {
          const errorResult = {
            errorMessage: `عذراً، لا تتوفر لدينا زيوت مناسبة لهذه المواصفات حالياً.`,
          }
          recommendationCache.set(cacheKey, errorResult)
          return errorResult
        }
      }

      // ترتيب الزيوت حسب الجودة والسعر
      const sortedOils = matchingOils.sort((a, b) => {
        const typeOrder = { "Full Synthetic": 1, "High Mileage": 2, "Semi Synthetic": 3, Conventional: 4 }
        return typeOrder[a[1].type] - typeOrder[b[1].type]
      })

      const result: OilRecommendation = {
        carSpecs,
        primaryOil: sortedOils[0],
        alternativeOil: sortedOils[1] || null,
        recommendedViscosity,
        recommendedType,
        yearCategory,
        // Add air filter information
        airFilterNumber: carSpecs.airFilterNumber,
        airFilterChangeInterval: carSpecs.airFilterChangeInterval,
        airFilterPrice: carSpecs.airFilterPrice,
        airFilterImageUrl: carSpecs.airFilterImageUrl
      }

      // حفظ النتيجة في الذاكرة المؤقتة
      recommendationCache.set(cacheKey, result)
      return result
    } catch (error) {
      logger.error(`خطأ أثناء تحليل بيانات السيارة`, { error, userMessage })
      const errorResult = {
        errorMessage: `عذراً، حدث خطأ أثناء تحليل بيانات السيارة. يرجى المحاولة مرة أخرى بصيغة مختلفة.`,
      }
      return errorResult
    }
  }

  /**
   * إنشاء رسالة التوصية النهائية
   */
  public static createRecommendationMessage(recommendation: OilRecommendation): string {
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

      // تنسيق رسالة التوصية مع تحسينات بصرية
      const message = `🚗 **تحليل السيارة** ${engineBadge}
نوع المحرك: ${carSpecs.engineSize}
حجم المحرك: ${carSpecs.capacity}

🛢️ **الزيت الموصى به**
اللزوجة: ${recommendedViscosity}
النوع: ${recommendedType}
العلامة التجارية: ${primaryOil[1].brand}
اسم المنتج: ${primaryOil[0]}
**سعة الزيت الدقيقة: ${carSpecs.capacity}**

✅ **المواصفات الفنية**
API: ${carSpecs.apiSpec || "غير محدد"}
عدد فلتر الزيت: ${carSpecs.filterNumber}
فترة تغيير الزيت: ${carSpecs.changeInterval} كم
سعة الزيت الإجمالية: ${carSpecs.capacity}

${recommendation.airFilterNumber ? `🔄 **معلومات فلتر الهواء**
رقم فلتر الهواء: ${recommendation.airFilterNumber}
فترة التغيير الموصى بها: ${recommendation.airFilterChangeInterval || "15000"} كم
${recommendation.airFilterPrice ? `السعر: ${recommendation.airFilterPrice}` : ''}
` : ''}

💡 **نصائح إضافية**
${primaryOil[1].features ? primaryOil[1].features.join("\n") : "لا توجد نصائح إضافية"}

⚠️ **ملاحظة هامة**
هذه التوصية مبنية على المواصفات الرسمية للشركة المصنعة. يفضل دائماً التأكد من دليل المستخدم الخاص بسيارتك.
تأكد من استخدام الكمية الصحيحة من الزيت (${carSpecs.capacity}) لتجنب مشاكل تشغيل المحرك.

${
  alternativeOil
    ? `
🌟 **بديل مقترح**
اللزوجة: ${recommendedViscosity}
النوع: ${alternativeOil[1].type}
العلامة التجارية: ${alternativeOil[1].brand}
اسم المنتج: ${alternativeOil[0]}
سعة الزيت: ${carSpecs.capacity}
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

export default CarAnalyzer
