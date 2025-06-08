// قاعدة بيانات شاملة مبنية على توصيات الشركات المصنّعة الرسمية
export interface CarSpec {
  capacity: string
  viscosity: string
  oilType: "Full Synthetic" | "Semi Synthetic" | "Conventional" | "High Mileage"
  filterNumber: string
  engineSize: string
  apiSpec?: string
  changeInterval?: string
}

export interface YearCategory {
  [yearRange: string]: CarSpec
}

export interface CarModel {
  [model: string]: YearCategory
}

export interface ManufacturerSpecs {
  [manufacturer: string]: CarModel
}

const officialSpecs: ManufacturerSpecs = {
  hyundai: {
    elantra: {
      "2020-2024": {
        capacity: "4.2L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35503",
        engineSize: "2.0L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
      "2017-2019": {
        capacity: "4.2L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35503",
        engineSize: "2.0L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    sonata: {
      "2020-2024": {
        capacity: "5.1L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35531",
        engineSize: "2.5L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    tucson: {
      "2022-2024": {
        capacity: "5.1L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35531",
        engineSize: "2.5L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    accent: {
      "2018-2024": {
        capacity: "3.8L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35504",
        engineSize: "1.6L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    creta: {
      "2018-2024": {
        capacity: "4.0L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35504",
        engineSize: "1.6L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
  },
  genesis: {
    g70: {
      "2017-2021": {
        capacity: "5.7L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35505",
        engineSize: "2.0L Turbo",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
      "2022-2024": {
        capacity: "5.7L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35505",
        engineSize: "2.0L Turbo",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    g80: {
      "2017-2021": {
        capacity: "6.1L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35505",
        engineSize: "3.3L Turbo",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
  },
  toyota: {
    camry: {
      "2018-2024": {
        capacity: "4.8L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "90915-YZZD4",
        engineSize: "2.5L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    corolla: {
      "2020-2024": {
        capacity: "4.4L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "90915-YZZD4",
        engineSize: "2.0L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
      "2014-2019": {
        capacity: "4.2L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "90915-YZZD3",
        engineSize: "1.8L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    prius: {
      "2016-2024": {
        capacity: "3.7L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "90915-YZZD4",
        engineSize: "1.8L Hybrid",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    hilux: {
      "2016-2024": {
        capacity: "6.5L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "90915-20004",
        engineSize: "2.8L Diesel",
        apiSpec: "API CK-4",
        changeInterval: "10000",
      },
      "2005-2015": {
        capacity: "6.0L",
        viscosity: "15W-40",
        oilType: "Semi Synthetic",
        filterNumber: "90915-20003",
        engineSize: "2.5L Diesel",
        apiSpec: "API CJ-4",
        changeInterval: "5000",
      },
    },
    landcruiser: {
      "2016-2024": {
        capacity: "7.0L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "90915-20004",
        engineSize: "4.6L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
      "2008-2015": {
        capacity: "6.8L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "90915-20003",
        engineSize: "4.0L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "7500",
      },
    },
    yaris: {
      "2017-2024": {
        capacity: "3.6L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "90915-YZZD3",
        engineSize: "1.5L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    rav4: {
      "2019-2024": {
        capacity: "4.8L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "90915-YZZD4",
        engineSize: "2.5L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
  },
  honda: {
    civic: {
      "2016-2024": {
        capacity: "4.4L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "15400-PLM-A02",
        engineSize: "2.0L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    accord: {
      "2018-2024": {
        capacity: "3.4L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "15400-PLM-A02",
        engineSize: "1.5L Turbo",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    crv: {
      "2017-2024": {
        capacity: "3.7L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "15400-PLM-A02",
        engineSize: "1.5L Turbo",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    city: {
      "2014-2024": {
        capacity: "3.5L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "15400-PLM-A01",
        engineSize: "1.5L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
  },
  bmw: {
    "3_series": {
      "2019-2024": {
        capacity: "5.2L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        filterNumber: "11427566327",
        engineSize: "2.0L Turbo",
        apiSpec: "BMW LL-01",
        changeInterval: "15000",
      },
    },
    "5_series": {
      "2017-2024": {
        capacity: "5.2L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        filterNumber: "11427566327",
        engineSize: "2.0L Turbo",
        apiSpec: "BMW LL-01",
        changeInterval: "15000",
      },
    },
    x5: {
      "2018-2024": {
        capacity: "6.5L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        filterNumber: "11427566327",
        engineSize: "3.0L Turbo",
        apiSpec: "BMW LL-01",
        changeInterval: "15000",
      },
    },
  },
  mercedes: {
    c_class: {
      "2019-2024": {
        capacity: "5.5L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        filterNumber: "A2711800009",
        engineSize: "2.0L Turbo",
        apiSpec: "MB 229.5",
        changeInterval: "15000",
      },
    },
    e_class: {
      "2017-2024": {
        capacity: "6.0L",
        viscosity: "0W-30",
        oilType: "Full Synthetic",
        filterNumber: "A2711800009",
        engineSize: "2.0L Turbo",
        apiSpec: "MB 229.5",
        changeInterval: "15000",
      },
    },
  },
  nissan: {
    altima: {
      "2019-2024": {
        capacity: "5.0L",
        viscosity: "0W-20",
        oilType: "Full Synthetic",
        filterNumber: "15208-9DA0A",
        engineSize: "2.5L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    sunny: {
      "2012-2024": {
        capacity: "3.8L",
        viscosity: "5W-30",
        oilType: "Semi Synthetic",
        filterNumber: "15208-65F0E",
        engineSize: "1.5L",
        apiSpec: "API SN",
        changeInterval: "7500",
      },
    },
    patrol: {
      "2010-2024": {
        capacity: "6.5L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "15208-9C61A",
        engineSize: "5.6L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    navara: {
      "2016-2024": {
        capacity: "6.7L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "15208-BN30A",
        engineSize: "2.5L Diesel",
        apiSpec: "API CK-4",
        changeInterval: "10000",
      },
    },
  },
  kia: {
    optima: {
      "2016-2020": {
        capacity: "4.8L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35503",
        engineSize: "2.4L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    sportage: {
      "2016-2024": {
        capacity: "4.5L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35504",
        engineSize: "2.0L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    rio: {
      "2017-2024": {
        capacity: "3.6L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35504",
        engineSize: "1.6L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    cerato: {
      "2017-2024": {
        capacity: "4.0L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "26300-35503",
        engineSize: "1.6L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
  },
  chevrolet: {
    cruze: {
      "2016-2019": {
        capacity: "4.5L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "55594651",
        engineSize: "1.4L Turbo",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    malibu: {
      "2016-2024": {
        capacity: "5.0L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "55594651",
        engineSize: "1.5L Turbo",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    tahoe: {
      "2015-2024": {
        capacity: "7.0L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "PF63",
        engineSize: "5.3L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    silverado: {
      "2016-2024": {
        capacity: "7.0L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "PF63",
        engineSize: "5.3L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
  },
  mitsubishi: {
    pajero: {
      "2015-2024": {
        capacity: "5.5L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "MZ690072",
        engineSize: "3.0L",
        apiSpec: "API SN / SN PLUS",
        changeInterval: "10000",
      },
    },
    lancer: {
      "2013-2017": {
        capacity: "4.3L",
        viscosity: "5W-30",
        oilType: "Semi Synthetic",
        filterNumber: "MZ690070",
        engineSize: "1.6L",
        apiSpec: "API SN",
        changeInterval: "7500",
      },
    },
    l200: {
      "2015-2024": {
        capacity: "7.0L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "MZ690412",
        engineSize: "2.4L Diesel",
        apiSpec: "API CJ-4",
        changeInterval: "10000",
      },
    },
  },
  ford: {
    f150: {
      "2015-2024": {
        capacity: "7.5L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "FL-500S",
        engineSize: "5.0L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    ranger: {
      "2015-2024": {
        capacity: "6.0L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "FL-910S",
        engineSize: "2.3L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
  },
  volkswagen: {
    passat: {
      "2016-2024": {
        capacity: "5.5L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "06J115403Q",
        engineSize: "2.0L Turbo",
        apiSpec: "VW 504.00/507.00",
        changeInterval: "15000",
      },
    },
    tiguan: {
      "2017-2024": {
        capacity: "5.0L",
        viscosity: "5W-30",
        oilType: "Full Synthetic",
        filterNumber: "06J115403Q",
        engineSize: "2.0L Turbo",
        apiSpec: "VW 504.00/507.00",
        changeInterval: "15000",
      },
    },
  },
  dodge: {
    charger: {
      "2015-2024": {
        capacity: "6.6L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        filterNumber: "05038041AA",
        engineSize: "3.6L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
    durango: {
      "2016-2024": {
        capacity: "6.6L",
        viscosity: "5W-20",
        oilType: "Full Synthetic",
        filterNumber: "05038041AA",
        engineSize: "3.6L",
        apiSpec: "API SN PLUS / SP",
        changeInterval: "10000",
      },
    },
  },
}

export default officialSpecs
