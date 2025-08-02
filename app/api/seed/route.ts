import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// Real car models data with updated queries count
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
    query: "ما هو أفضل زيت لسيارة نيسان التيما 2024؟",
    user_id: "user_4",
    car_model: "نيسان التيما 2024",
    car_brand: "نيسان",
    query_type: "MAINTENANCE",
    source: "web",
    location: "عمان"
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
    type: "SEGMENT",
    value: "SUV متوسطة الحجم",
    importance: 10,
    source: "تقرير مبيعات السيارات 2024"
  },
  {
    type: "PREFERENCE",
    value: "الاقتصاد في استهلاك الوقود",
    importance: 9,
    source: "استطلاع أولويات المشترين"
  }
]

export async function GET(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Supabase not configured. Please set up Supabase first.' },
        { status: 400 }
      )
    }

    // Clear existing data
    await supabase.from('market_insights').delete().not('id', 'is', null)
    await supabase.from('user_queries').delete().not('id', 'is', null)
    await supabase.from('car_brands').delete().not('id', 'is', null)
    await supabase.from('car_models').delete().not('id', 'is', null)
    
    // Insert car brands
    const { error: brandsError } = await supabase.from('car_brands').insert(carBrands)
    if (brandsError) throw brandsError

    // Insert car models
    const { error: modelsError } = await supabase.from('car_models').insert(carModels)
    if (modelsError) throw modelsError

    // Insert user queries with timestamps spread over the last 30 days
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

    return NextResponse.json(
      { success: true, message: 'Database seeded successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { success: false, message: 'Error seeding database', error: error },
      { status: 500 }
    )
  }
} 