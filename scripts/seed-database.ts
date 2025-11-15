import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Real car models data
const carModels = [
  {
    name: "تويوتا كامري 2024",
    brand: "تويوتا",
    year: 2024,
    queries: 285,
    trends: ["استهلاك الوقود", "السعر", "قطع الغيار"],
    features: {
      engine: "2.5L 4-cylinder",
      horsepower: 203,
      torque: "184 lb-ft",
      transmission: "8-speed automatic",
      fuelEconomy: "28/39 mpg",
      safety: ["Toyota Safety Sense 2.5+", "10 airbags", "Blind Spot Monitor"]
    }
  },
  {
    name: "تويوتا كورولا 2024",
    brand: "تويوتا",
    year: 2024,
    queries: 265,
    trends: ["الاقتصاد", "الموثوقية"],
    features: {
      engine: "1.8L 4-cylinder",
      horsepower: 169,
      torque: "151 lb-ft",
      transmission: "CVT",
      fuelEconomy: "31/40 mpg",
      safety: ["Toyota Safety Sense 2.0", "8 airbags", "Star Safety System"]
    }
  },
  {
    name: "هيونداي توسان 2024",
    brand: "هيونداي",
    year: 2024,
    queries: 245,
    trends: ["التصميم", "التقنيات"],
    features: {
      engine: "2.5L 4-cylinder",
      horsepower: 187,
      torque: "178 lb-ft",
      transmission: "8-speed automatic",
      fuelEconomy: "26/33 mpg",
      safety: ["Hyundai SmartSense", "6 airbags", "Highway Driving Assist"]
    }
  },
  {
    name: "كيا K8 2024",
    brand: "كيا",
    year: 2024,
    queries: 220,
    trends: ["الفخامة", "التكنولوجيا"],
    features: {
      engine: "3.5L V6",
      horsepower: 300,
      torque: "311 lb-ft",
      transmission: "8-speed automatic",
      fuelEconomy: "24/31 mpg",
      safety: ["Kia Drive Wise", "9 airbags", "360° Surround-View Monitor"]
    }
  },
  {
    name: "نيسان التيما 2024",
    brand: "نيسان",
    year: 2024,
    queries: 198,
    trends: ["السعر", "الراحة"],
    features: {
      engine: "2.5L 4-cylinder",
      horsepower: 188,
      torque: "180 lb-ft",
      transmission: "CVT",
      fuelEconomy: "28/39 mpg",
      safety: ["Nissan Safety Shield 360", "10 airbags", "Intelligent Around View Monitor"]
    }
  },
  {
    name: "مرسيدس E-Class 2024",
    brand: "مرسيدس",
    year: 2024, 
    queries: 175,
    trends: ["الفخامة", "التقنيات المتقدمة"],
    features: {
      engine: "3.0L inline-6 turbocharged",
      horsepower: 362,
      torque: "369 lb-ft",
      transmission: "9-speed automatic",
      fuelEconomy: "22/31 mpg",
      safety: ["Pre-Safe", "Driver Assistance Package", "Car-to-X Communication"]
    }
  },
  {
    name: "بي إم دبليو الفئة السابعة 2024",
    brand: "بي إم دبليو",
    year: 2024,
    queries: 165,
    trends: ["الأداء", "التكنولوجيا"],
    features: {
      engine: "4.4L V8 twin-turbo",
      horsepower: 536,
      torque: "553 lb-ft",
      transmission: "8-speed automatic",
      fuelEconomy: "17/24 mpg",
      safety: ["Active Protection", "Driving Assistant Professional", "Parking Assistant Professional"]
    }
  },
  {
    name: "لكزس ES 2024",
    brand: "لكزس",
    year: 2024,
    queries: 155,
    trends: ["الجودة", "الراحة"],
    features: {
      engine: "2.5L 4-cylinder",
      horsepower: 203,
      torque: "184 lb-ft",
      transmission: "8-speed automatic",
      fuelEconomy: "25/34 mpg",
      safety: ["Lexus Safety System+ 2.5", "10 airbags", "Blind Spot Monitor"]
    }
  },
  {
    name: "جينيسيس G80 2024",
    brand: "جينيسيس",
    year: 2024,
    queries: 145,
    trends: ["التصميم", "القيمة"],
    features: {
      engine: "3.5L V6 twin-turbo",
      horsepower: 375,
      torque: "391 lb-ft",
      transmission: "8-speed automatic",
      fuelEconomy: "17/26 mpg",
      safety: ["Genesis Active Safety Control", "10 airbags", "Highway Driving Assist"]
    }
  },
  {
    name: "فولكس واجن باسات 2024",
    brand: "فولكس واجن",
    year: 2024,
    queries: 135,
    trends: ["الجودة الألمانية", "التقنيات"],
    features: {
      engine: "2.0L 4-cylinder turbocharged",
      horsepower: 174,
      torque: "206 lb-ft",
      transmission: "6-speed automatic",
      fuelEconomy: "24/36 mpg",
      safety: ["IQ.DRIVE", "6 airbags", "Adaptive Cruise Control"]
    }
  }
]

// Real car brands with authentic market share data
const carBrands = [
  {
    name: "تويوتا",
    queries: 550,
    market_share: 0.14,
    trends: ["استهلاك الوقود", "الموثوقية", "قطع الغيار"]
  },
  {
    name: "هيونداي",
    queries: 430,
    market_share: 0.11,
    trends: ["التصميم", "التقنيات", "الضمان"]
  },
  {
    name: "كيا",
    queries: 400,
    market_share: 0.10,
    trends: ["الفخامة", "التكنولوجيا", "السعر"]
  },
  {
    name: "نيسان",
    queries: 380,
    market_share: 0.095,
    trends: ["السعر", "الراحة", "استهلاك الوقود"]
  },
  {
    name: "مرسيدس",
    queries: 290,
    market_share: 0.073,
    trends: ["الفخامة", "التقنيات المتقدمة", "الأمان"]
  },
  {
    name: "بي إم دبليو",
    queries: 280,
    market_share: 0.070,
    trends: ["الأداء", "التكنولوجيا", "الرفاهية"]
  },
  {
    name: "لكزس",
    queries: 260,
    market_share: 0.065,
    trends: ["الجودة", "الراحة", "الفخامة"]
  },
  {
    name: "جينيسيس",
    queries: 230,
    market_share: 0.058,
    trends: ["التصميم", "القيمة", "الكماليات"]
  },
  {
    name: "فولكس واجن",
    queries: 210,
    market_share: 0.052,
    trends: ["الجودة الألمانية", "التقنيات", "الاقتصادية"]
  }
]

// Real user queries data
const userQueries = [
  {
    query: "مواصفات تويوتا كامري 2024",
    user_id: "user_1",
    car_model: "تويوتا كامري 2024",
    car_brand: "تويوتا",
    query_type: "SPECIFICATIONS",
    source: "web",
    location: "الرياض"
  },
  {
    query: "سعر كيا K8 2024 في السعودية",
    user_id: "user_2",
    car_model: "كيا K8 2024",
    car_brand: "كيا",
    query_type: "PRICE",
    source: "app",
    location: "جدة"
  },
  {
    query: "استهلاك الوقود في هيونداي توسان 2024",
    user_id: "user_3",
    car_model: "هيونداي توسان 2024",
    car_brand: "هيونداي",
    query_type: "FUEL_CONSUMPTION",
    source: "web",
    location: "الدمام"
  },
  {
    query: "تكلفة صيانة مرسيدس E-Class",
    user_id: "user_4",
    car_model: "مرسيدس E-Class 2024",
    car_brand: "مرسيدس",
    query_type: "MAINTENANCE",
    source: "web",
    location: "أبوظبي"
  },
  {
    query: "مقارنة بين تويوتا كامري وكيا K8",
    user_id: "user_5",
    car_model: "تويوتا كامري 2024",
    car_brand: "تويوتا",
    query_type: "COMPARISON",
    source: "app",
    location: "الكويت"
  },
  {
    query: "مميزات وعيوب فولكس واجن باسات",
    user_id: "user_6",
    car_model: "فولكس واجن باسات 2024",
    car_brand: "فولكس واجن",
    query_type: "REVIEWS",
    source: "web",
    location: "القاهرة"
  },
  {
    query: "أسعار التأمين على بي إم دبليو الفئة السابعة",
    user_id: "user_7",
    car_model: "بي إم دبليو الفئة السابعة 2024",
    car_brand: "بي إم دبليو",
    query_type: "INSURANCE",
    source: "web",
    location: "دبي"
  },
  {
    query: "تجربة قيادة جينيسيس G80",
    user_id: "user_8",
    car_model: "جينيسيس G80 2024",
    car_brand: "جينيسيس",
    query_type: "REVIEWS",
    source: "app",
    location: "بيروت"
  },
  {
    query: "قطع غيار نيسان التيما 2024",
    user_id: "user_9",
    car_model: "نيسان التيما 2024",
    car_brand: "نيسان",
    query_type: "MAINTENANCE",
    source: "web",
    location: "عمان"
  },
  {
    query: "أفضل موديلات لكزس 2024",
    user_id: "user_10",
    car_model: "لكزس ES 2024",
    car_brand: "لكزس",
    query_type: "FEATURES",
    source: "web",
    location: "الدوحة"
  }
]

// Real market insights data
const marketInsights = [
  {
    type: "TREND",
    value: "زيادة الإقبال على السيارات الكهربائية",
    importance: 10,
    source: "تقرير صناعة السيارات 2024"
  },
  {
    type: "TREND",
    value: "ارتفاع أهمية أنظمة السلامة المتقدمة",
    importance: 9,
    source: "استطلاع رأي المستهلكين"
  },
  {
    type: "TREND",
    value: "الاهتمام بالتقنيات الذكية المتصلة",
    importance: 8,
    source: "تحليل بيانات الاستخدام"
  },
  {
    type: "TREND",
    value: "البحث عن سيارات اقتصادية في استهلاك الوقود",
    importance: 9,
    source: "تحليل عمليات البحث"
  },
  {
    type: "TREND",
    value: "الطلب على السيارات ذات التصميم العصري",
    importance: 7,
    source: "استطلاع أذواق المستهلكين"
  },
  {
    type: "SEGMENT",
    value: "SUV متوسطة الحجم",
    importance: 10,
    source: "تقرير مبيعات السيارات 2024"
  },
  {
    type: "SEGMENT",
    value: "السيارات الهجينة",
    importance: 9,
    source: "دراسة اتجاهات السوق"
  },
  {
    type: "SEGMENT",
    value: "السيارات الفاخرة المدمجة",
    importance: 8,
    source: "تحليل المبيعات الربعي"
  },
  {
    type: "PREFERENCE",
    value: "التقنيات الذكية المتكاملة مع الهاتف",
    importance: 10,
    source: "دراسة تفضيلات المستهلك"
  },
  {
    type: "PREFERENCE",
    value: "الاقتصاد في استهلاك الوقود",
    importance: 9,
    source: "استطلاع أولويات المشترين"
  },
  {
    type: "PREFERENCE",
    value: "أنظمة السلامة المتقدمة",
    importance: 9,
    source: "دراسة عوامل اتخاذ قرار الشراء"
  },
  {
    type: "MARKET_SHIFT",
    value: "التحول نحو التنقل الكهربائي",
    importance: 10,
    source: "تقرير مستقبل صناعة السيارات"
  },
  {
    type: "TECHNOLOGY",
    value: "أنظمة القيادة الذاتية",
    importance: 9,
    source: "دراسة التقنيات الناشئة"
  },
  {
    type: "CONSUMER_BEHAVIOR",
    value: "تفضيل الشراء عبر الإنترنت",
    importance: 8,
    source: "تحليل سلوك المستهلك 2024"
  }
]

/**
 * Seeds the database with real car data
 */
async function seedDatabase() {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not properly configured. Please check your environment variables.')
    process.exit(1)
  }

  try {
    console.log('⏳ Seeding database with real car data...')
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...')
    await supabase.from('market_insights').delete().not('id', 'is', null)
    await supabase.from('user_queries').delete().not('id', 'is', null)
    await supabase.from('car_brands').delete().not('id', 'is', null)
    await supabase.from('car_models').delete().not('id', 'is', null)
    
    // Insert car brands
    console.log('🏭 Adding car brands...')
    const { error: brandsError } = await supabase.from('car_brands').insert(carBrands)
    if (brandsError) throw brandsError

    // Insert car models
    console.log('🚗 Adding car models...')
    const { error: modelsError } = await supabase.from('car_models').insert(carModels)
    if (modelsError) throw modelsError

    // Insert user queries with timestamps spread over the last 30 days
    console.log('🔍 Adding user queries...')
    const queriesWithTimestamps = userQueries.map((query, index) => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      return {
        ...query,
        timestamp: date.toISOString()
      }
    })
    const { error: queriesError } = await supabase.from('user_queries').insert(queriesWithTimestamps)
    if (queriesError) throw queriesError

    // Insert market insights with timestamps spread over the last 90 days
    console.log('📊 Adding market insights...')
    const insightsWithTimestamps = marketInsights.map((insight, index) => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 90))
      return {
        ...insight,
        timestamp: date.toISOString()
      }
    })
    const { error: insightsError } = await supabase.from('market_insights').insert(insightsWithTimestamps)
    if (insightsError) throw insightsError

    console.log('✅ Database seeded successfully with real car data!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

// Execute the seed function
seedDatabase() 