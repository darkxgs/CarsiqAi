export interface OilSpec {
  brand: string
  viscosity: string
  type: "Full Synthetic" | "Semi Synthetic" | "Conventional" | "High Mileage"
  price: string
  apiSpec?: string
  features?: string[]
}

export interface OilDatabase {
  [oilName: string]: OilSpec
}

// الزيوت المتوفرة من التوكيلات المعتمدة فقط
const authorizedOils: OilDatabase = {
  "Castrol GTX 5W-30": {
    brand: "Castrol",
    viscosity: "5W-30",
    type: "Conventional",
    price: "45 ريال",
    apiSpec: "API SN",
    features: ["مناسب للاستخدام اليومي", "حماية أساسية للمحرك"],
  },
  "Castrol EDGE 5W-30": {
    brand: "Castrol",
    viscosity: "5W-30",
    type: "Full Synthetic",
    price: "75 ريال",
    apiSpec: "API SN PLUS / SP",
    features: ["تقنية Fluid Titanium", "أداء ممتاز تحت الضغط", "يقلل التآكل داخل المحرك"],
  },
  "Castrol EDGE 5W-40": {
    brand: "Castrol",
    viscosity: "5W-40",
    type: "Full Synthetic",
    price: "85 ريال",
    apiSpec: "API SN PLUS / SP",
    features: ["تقنية Fluid Titanium", "مثالي للسيارات الفاخرة عالية الأداء", "حماية ممتازة للمحركات ذات الكيلومترات العالية"],
  },
  "Castrol GTX 0W-20": {
    brand: "Castrol",
    viscosity: "0W-20",
    type: "Conventional",
    price: "50 ريال",
    apiSpec: "API SN",
    features: ["مناسب للاستخدام اليومي", "تدفق سريع في درجات الحرارة المنخفضة"],
  },
  "Castrol EDGE 0W-20": {
    brand: "Castrol",
    viscosity: "0W-20",
    type: "Full Synthetic",
    price: "80 ريال",
    apiSpec: "API SN PLUS / SP",
    features: ["تقنية Fluid Titanium", "أداء ممتاز في درجات الحرارة المنخفضة", "يحسن كفاءة استهلاك الوقود"],
  },
  "Castrol EDGE 0W-30": {
    brand: "Castrol",
    viscosity: "0W-30",
    type: "Full Synthetic",
    price: "85 ريال",
    apiSpec: "API SN PLUS / SP, BMW LL-01, MB 229.5",
    features: ["مناسب للسيارات الأوروبية الفاخرة", "أداء ممتاز في درجات الحرارة القصوى"],
  },

  "Mobil 1 FS 5W-30": {
    brand: "Mobil 1",
    viscosity: "5W-30",
    type: "Full Synthetic",
    price: "80 ريال",
    apiSpec: "API SN PLUS / SP",
    features: ["حماية ممتازة ضد التآكل", "يتحمل درجات الحرارة العالية", "مناسب للمسافات الطويلة"],
  },
  "Mobil 1 FS 5W-40": {
    brand: "Mobil 1",
    viscosity: "5W-40",
    type: "Full Synthetic",
    price: "90 ريال",
    apiSpec: "API SN PLUS / SP",
    features: ["مثالي للسيارات الفاخرة والرياضية", "حماية استثنائية في درجات الحرارة العالية", "يحافظ على أداء المحرك في الكيلومترات العالية"],
  },
  "Mobil 1 FS 0W-20": {
    brand: "Mobil 1",
    viscosity: "0W-20",
    type: "Full Synthetic",
    price: "85 ريال",
    apiSpec: "API SN PLUS / SP",
    features: ["يحسن كفاءة استهلاك الوقود", "تدفق سريع في درجات الحرارة المنخفضة"],
  },
  "Mobil 1 FS 0W-30": {
    brand: "Mobil 1",
    viscosity: "0W-30",
    type: "Full Synthetic",
    price: "90 ريال",
    apiSpec: "API SN PLUS / SP, BMW LL-01, MB 229.5",
    features: ["مناسب للسيارات الأوروبية الفاخرة", "أداء ممتاز في جميع درجات الحرارة"],
  },
  "Mobil Super 5W-30": {
    brand: "Mobil 1",
    viscosity: "5W-30",
    type: "Semi Synthetic",
    price: "55 ريال",
    apiSpec: "API SN",
    features: ["حماية جيدة للمحرك", "مناسب للاستخدام اليومي"],
  },

  "Liqui Moly Top Tec 4200 5W-30": {
    brand: "Liqui Moly",
    viscosity: "5W-30",
    type: "Full Synthetic",
    price: "95 ريال",
    apiSpec: "API SN PLUS / SP, BMW LL-01, MB 229.5",
    features: ["مناسب للسيارات الأوروبية", "حماية ممتازة للمحرك", "يطيل عمر المحرك"],
  },
  "Liqui Moly Top Tec 6200 0W-20": {
    brand: "Liqui Moly",
    viscosity: "0W-20",
    type: "Full Synthetic",
    price: "100 ريال",
    apiSpec: "API SN PLUS / SP",
    features: ["يحسن كفاءة استهلاك الوقود", "مناسب للمحركات الحديثة"],
  },
  "Liqui Moly Synthoil Energy 0W-30": {
    brand: "Liqui Moly",
    viscosity: "0W-30",
    type: "Full Synthetic",
    price: "105 ريال",
    apiSpec: "API SN PLUS / SP, BMW LL-01, MB 229.5",
    features: ["مناسب للسيارات الأوروبية الفاخرة", "أداء ممتاز في جميع درجات الحرارة"],
  },

  "Valvoline MaxLife 5W-30": {
    brand: "Valvoline",
    viscosity: "5W-30",
    type: "High Mileage",
    price: "60 ريال",
    apiSpec: "API SN",
    features: ["مخصص للمحركات عالية الكيلومترات", "يقلل تسرب الزيت", "يحسن أداء المحرك"],
  },
  "Valvoline SynPower 0W-20": {
    brand: "Valvoline",
    viscosity: "0W-20",
    type: "Full Synthetic",
    price: "75 ريال",
    apiSpec: "API SN PLUS / SP",
    features: ["يحسن كفاءة استهلاك الوقود", "حماية ممتازة للمحرك"],
  },
  "Valvoline SynPower 0W-30": {
    brand: "Valvoline",
    viscosity: "0W-30",
    type: "Full Synthetic",
    price: "80 ريال",
    apiSpec: "API SN PLUS / SP, BMW LL-01",
    features: ["مناسب للسيارات الأوروبية", "أداء ممتاز في جميع درجات الحرارة"],
  },

  "Motul 8100 X-clean 5W-30": {
    brand: "Motul",
    viscosity: "5W-30",
    type: "Full Synthetic",
    price: "110 ريال",
    apiSpec: "API SN PLUS / SP, BMW LL-01, MB 229.5",
    features: ["مناسب للسيارات الأوروبية الفاخرة", "يحافظ على نظافة المحرك", "يطيل عمر المحرك"],
  },
  "Motul 8100 X-clean 0W-30": {
    brand: "Motul",
    viscosity: "0W-30",
    type: "Full Synthetic",
    price: "120 ريال",
    apiSpec: "API SN PLUS / SP, BMW LL-01, MB 229.5",
    features: ["مناسب للسيارات الأوروبية الفاخرة", "أداء ممتاز في جميع درجات الحرارة"],
  },
  "Motul 6100 Save-lite 5W-30": {
    brand: "Motul",
    viscosity: "5W-30",
    type: "Semi Synthetic",
    price: "70 ريال",
    apiSpec: "API SN",
    features: ["يحسن كفاءة استهلاك الوقود", "حماية جيدة للمحرك"],
  },

  "Meguin Megol 5W-30": {
    brand: "Meguin",
    viscosity: "5W-30",
    type: "Semi Synthetic",
    price: "55 ريال",
    apiSpec: "API SN",
    features: ["حماية جيدة للمحرك", "مناسب للاستخدام اليومي"],
  },
  "Meguin Super Leichtlauf 0W-30": {
    brand: "Meguin",
    viscosity: "0W-30",
    type: "Full Synthetic",
    price: "65 ريال",
    apiSpec: "API SN PLUS / SP",
    features: ["مناسب للسيارات الأوروبية", "أداء ممتاز في درجات الحرارة المنخفضة"],
  },

  "Hanata Gold 5W-30": {
    brand: "Hanata",
    viscosity: "5W-30",
    type: "Conventional",
    price: "40 ريال",
    apiSpec: "API SN",
    features: ["اقتصادي", "مناسب للاستخدام اليومي"],
  },
  "Hanata Platinum 0W-20": {
    brand: "Hanata",
    viscosity: "0W-20",
    type: "Semi Synthetic",
    price: "50 ريال",
    apiSpec: "API SN",
    features: ["يحسن كفاءة استهلاك الوقود", "مناسب للمحركات الحديثة"],
  },
}

export default authorizedOils
