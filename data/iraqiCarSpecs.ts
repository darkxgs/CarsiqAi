// قاعدة بيانات شاملة للسيارات الشائعة في العراق مع مراعاة الظروف المحلية
import type { CarSpec } from "./CarSpec" // Assuming CarSpec is defined in another file

export interface IraqiCarSpec extends CarSpec {
  heatResistance: "عالية" | "متوسطة" | "منخفضة"
  dustProtection: "ممتازة" | "جيدة" | "عادية"
  fuelEfficiency: "ممتاز" | "جيد" | "عادي"
  iraqiConditions: {
    recommendedViscosity: string
    changeIntervalHot: string // فترة التغيير في الجو الحار
    specialNotes: string[]
  }
}

export interface IraqiCarModel {
  [model: string]: {
    [yearRange: string]: IraqiCarSpec
  }
}

export interface IraqiManufacturerSpecs {
  [manufacturer: string]: IraqiCarModel
}

const iraqiCarSpecs: IraqiManufacturerSpecs = {
  toyota: {
    corolla: {
      "2018-2024": {
        capacity: "4.4L",
        viscosity: "5W-30", // معدل للجو الحار
        oilType: "Full Synthetic",
        filterNumber: "90915-YZZD4",
        engineSize: "1.8L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "8000", // مقلل للظروف الحارة
        heatResistance: "عالية",
        dustProtection: "ممتازة",
        fuelEfficiency: "ممتاز",
        iraqiConditions: {
          recommendedViscosity: "5W-30 أو 10W-30",
          changeIntervalHot: "6000-7000 كم",
          specialNotes: [
            "يفضل التغيير كل 6 أشهر في الصيف",
            "استخدم زيت مقاوم للحرارة العالية",
            "فحص مستوى الزيت أسبوعياً",
          ],
        },
      },
    },
    camry: {
      "2018-2024": {
        capacity: "4.8L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "90915-YZZD4",
        engineSize: "2.5L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "8000",
        heatResistance: "عالية",
        dustProtection: "ممتازة",
        fuelEfficiency: "جيد",
        iraqiConditions: {
          recommendedViscosity: "5W-30 أو 10W-30",
          changeIntervalHot: "6000-7000 كم",
          specialNotes: [
            "محرك قوي يتحمل الحرارة العالية",
            "يفضل الزيت التخليقي الكامل",
            "مراقبة حرارة المحرك في الصيف",
          ],
        },
      },
    },
  },
  hyundai: {
    elantra: {
      "2020-2024": {
        capacity: "4.2L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35503",
        engineSize: "2.0L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "7500",
        heatResistance: "جيدة",
        dustProtection: "جيدة",
        fuelEfficiency: "ممتاز",
        iraqiConditions: {
          recommendedViscosity: "5W-30",
          changeIntervalHot: "5000-6000 كم",
          specialNotes: [
            "محرك اقتصادي في استهلاك الوقود",
            "حساس للغبار - تغيير فلتر الهواء بانتظام",
            "مراقبة مستوى سائل التبريد",
          ],
        },
      },
    },
  },
  kia: {
    cerato: {
      "2019-2024": {
        capacity: "4.2L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35503",
        engineSize: "2.0L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "7500",
        heatResistance: "جيدة",
        dustProtection: "جيدة",
        fuelEfficiency: "ممتاز",
        iraqiConditions: {
          recommendedViscosity: "5W-30",
          changeIntervalHot: "5000-6000 كم",
          specialNotes: [
            "محرك موثوق ومناسب للظروف المحلية",
            "صيانة منتظمة لضمان الأداء الأمثل",
            "تجنب القيادة العنيفة في الحر الشديد",
          ],
        },
      },
    },
  },
  nissan: {
    sunny: {
      "2018-2024": {
        capacity: "3.8L",
        viscosity: "5W-30",
        oilType: "Semi Synthetic",
        filterNumber: "15208-9DA0A",
        engineSize: "1.6L",
        apiSpec: "API SN",
        changeInterval: "7000",
        heatResistance: "متوسطة",
        dustProtection: "عادية",
        fuelEfficiency: "ممتاز",
        iraqiConditions: {
          recommendedViscosity: "5W-30 أو 10W-30",
          changeIntervalHot: "5000 كم",
          specialNotes: ["محرك صغير اقتصادي", "يحتاج عناية خاصة في الحر الشديد", "تغيير الزيت بانتظام أكثر أهمية"],
        },
      },
    },
  },
}

export default iraqiCarSpecs

// معلومات إضافية عن ظروف العراق
export const iraqiConditions = {
  climate: {
    summerTemp: "45-50°C",
    winterTemp: "5-15°C",
    humidity: "منخفضة",
    dustLevel: "عالي جداً",
  },
  fuelQuality: {
    octaneRating: "متغير (87-95)",
    sulfurContent: "متوسط إلى عالي",
    additives: "محدودة",
  },
  drivingConditions: {
    trafficDensity: "عالية في المدن",
    roadQuality: "متغيرة",
    stopAndGo: "شائع جداً",
  },
  recommendations: {
    oilChangeFrequency: "كل 5000-7000 كم في الصيف",
    airFilterChange: "كل 3 أشهر",
    coolantCheck: "شهرياً في الصيف",
    generalMaintenance: "أكثر تكراراً من المناخات المعتدلة",
  },
}
