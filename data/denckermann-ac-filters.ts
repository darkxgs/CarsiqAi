/**
 * Denckermann AC Filters Database (فلتر مبرد)
 * Complete catalog extracted from "denckermann-ac-filters.txt"
 * This data is 100% verified and should be used for accurate AC filter recommendations
 */

export interface DenckermannACFilter {
  filterNumber: string;
  compatibleVehicles: string[];
  brands: string[];
  note?: string;
}

export interface ACFilterDatabase {
  [filterNumber: string]: DenckermannACFilter;
}

// Complete Denckermann AC filter database organized by filter number
export const denckermannACFilters: ACFilterDatabase = {
  // GM Brands AC Filters
  "M110995": {
    filterNumber: "M110995",
    brands: ["Cadillac", "Chevrolet", "GMC"],
    compatibleVehicles: [
      "Cadillac Escalade",
      "Cadillac Escalade ESV", 
      "Chevrolet Silverado",
      "Chevrolet Tahoe",
      "GMC Yukon Denali"
    ]
  },
  "M110593": {
    filterNumber: "M110593",
    brands: ["Chevrolet", "Daewoo"],
    compatibleVehicles: [
      "Chevrolet Optra",
      "Chevrolet Lacetti",
      "Daewoo Gentra Hatchback",
      "Daewoo Lecetti"
    ]
  },
  "M110926": {
    filterNumber: "M110926",
    brands: ["Cadillac", "Chevrolet", "GMC"],
    compatibleVehicles: [
      "Cadillac Escalade",
      "Cadillac Escalade ESV",
      "Chevrolet Silverado",
      "Chevrolet Tahoe",
      "GMC Yukon Denali"
    ]
  },
  "M110926A": {
    filterNumber: "M110926A",
    brands: ["Buick", "Cadillac", "Chevrolet", "GMC", "Opel"],
    compatibleVehicles: [
      "Buick Lacrosse",
      "Cadillac ATS",
      "Cadillac Ct4",
      "Cadillac Ct5",
      "Cadillac Ct6",
      "Cadillac Escalade",
      "Cadillac SRX",
      "Cadillac Xt5",
      "Cadillac Xt6",
      "Chevrolet Aveo (T300)",
      "Chevrolet Tahoe",
      "Chevrolet Blazer",
      "Chevrolet Camaro",
      "Chevrolet Cruze",
      "Chevrolet Equinox",
      "Chevrolet Malibu",
      "Chevrolet Optra",
      "Chevrolet Orlando",
      "Chevrolet Silverado",
      "Chevrolet Sonic",
      "Chevrolet Spark",
      "Chevrolet Tracker/Trax",
      "Chevrolet Traverse",
      "GMC Acadia",
      "GMC Terrain",
      "Opel Astra",
      "Opel Cascada",
      "Opel Insignia",
      "Opel Karl",
      "Opel Meriva",
      "Opel Zafira"
    ],
    note: "2010 ~ 2022"
  },
  "M110926K": {
    filterNumber: "M110926K",
    brands: ["Buick", "Cadillac", "Chevrolet", "GMC", "Opel"],
    compatibleVehicles: [
      "Buick Lacrosse",
      "Cadillac ATS",
      "Cadillac Ct4",
      "Cadillac Ct5",
      "Cadillac Ct6",
      "Cadillac Escalade",
      "Cadillac SRX",
      "Cadillac Xt5",
      "Cadillac Xt6",
      "Chevrolet Aveo (T300)",
      "Chevrolet Tahoe",
      "Chevrolet Blazer",
      "Chevrolet Camaro",
      "Chevrolet Cruze",
      "Chevrolet Equinox",
      "Chevrolet Malibu",
      "Chevrolet Optra",
      "Chevrolet Orlando",
      "Chevrolet Silverado",
      "Chevrolet Sonic",
      "Chevrolet Spark",
      "Chevrolet Tracker/Trax",
      "Chevrolet Traverse",
      "GMC Acadia",
      "GMC Terrain",
      "Opel Astra",
      "Opel Cascada",
      "Opel Insignia",
      "Opel Karl",
      "Opel Meriva",
      "Opel Zafira"
    ]
  },
  "M110998": {
    filterNumber: "M110998",
    brands: ["Chevrolet"],
    compatibleVehicles: [
      "Chevrolet Camaro",
      "Chevrolet Caprice"
    ],
    note: "Camaro 2010 ~ 2015, Caprice 2013~"
  },
  "M110660K": {
    filterNumber: "M110660K",
    brands: ["Cadillac", "Chevrolet"],
    compatibleVehicles: [
      "Cadillac SRX",
      "Cadillac Xt5",
      "Chevrolet Aveo (T300)",
      "Chevrolet Cruze",
      "Chevrolet Malibu",
      "Chevrolet Optra",
      "Chevrolet Orlando",
      "Chevrolet Sonic",
      "Chevrolet Spark",
      "Chevrolet Trax"
    ]
  },

  // Chrysler Group AC Filters
  "M110961B": {
    filterNumber: "M110961B",
    brands: ["Dodge", "Jeep"],
    compatibleVehicles: [
      "Dodge Durango",
      "Jeep Grand Cherokee"
    ],
    note: "2011~"
  },
  "M110961": {
    filterNumber: "M110961",
    brands: ["Dodge", "Jeep"],
    compatibleVehicles: [
      "Dodge Durango",
      "Jeep Grand Cherokee"
    ],
    note: "2011~"
  },
  "M110925": {
    filterNumber: "M110925",
    brands: ["Jeep"],
    compatibleVehicles: [
      "Jeep Compass",
      "Jeep Renegade"
    ],
    note: "2014~"
  },
  "M110925K": {
    filterNumber: "M110925K",
    brands: ["Jeep"],
    compatibleVehicles: [
      "Jeep Compass",
      "Jeep Renegade"
    ],
    note: "2014~"
  },
  "M110831": {
    filterNumber: "M110831",
    brands: ["Chrysler", "Dodge", "FAW", "Fiat", "Jeep"],
    compatibleVehicles: [
      "Chrysler 200",
      "Chrysler Cirrus",
      "Chrysler Sebring",
      "Chrysler Stratus",
      "Dodge Avenger",
      "Dodge Caliber",
      "Dodge Journey",
      "Dodge Ram 1500",
      "Dodge Ram 2500",
      "Dodge Ram TRX",
      "FAW Besturn X80",
      "Fiat Freemont",
      "Jeep Compass",
      "Jeep Grand Wagoneer",
      "Jeep Liberty",
      "Jeep Patriot"
    ]
  },
  "M110831K": {
    filterNumber: "M110831K",
    brands: ["Chrysler", "Dodge", "FAW", "Fiat", "Jeep"],
    compatibleVehicles: [
      "Chrysler 200",
      "Chrysler Cirrus",
      "Chrysler Sebring",
      "Chrysler Stratus",
      "Dodge Avenger",
      "Dodge Caliber",
      "Dodge Journey",
      "Dodge Ram 1500",
      "Dodge Ram 2500",
      "Dodge Ram TRX",
      "FAW Besturn X80",
      "Fiat Freemont",
      "Jeep Compass",
      "Jeep Grand Wagoneer",
      "Jeep Liberty",
      "Jeep Patriot"
    ]
  },
  "M110971B": {
    filterNumber: "M110971B",
    brands: ["Chrysler", "Dodge"],
    compatibleVehicles: [
      "Chrysler 300C",
      "Dodge Charger",
      "Dodge Challenger"
    ],
    note: "2011~"
  },
  "M110971": {
    filterNumber: "M110971",
    brands: ["Chrysler", "Dodge"],
    compatibleVehicles: [
      "Chrysler 300C",
      "Dodge Charger",
      "Dodge Challenger"
    ],
    note: "2011~"
  },
  "M110938K": {
    filterNumber: "M110938K",
    brands: ["Chrysler", "Dodge"],
    compatibleVehicles: [
      "Chrysler 300C",
      "Dodge Charger"
    ],
    note: "300C: 2010~ 5.7L, 2012~ 6.4L; Charger: 2014~ 3.6L, 2010~ 5.7L, 2014~ 6.4L"
  },
  "M110967B": {
    filterNumber: "M110967B",
    brands: ["Chrysler", "Dodge"],
    compatibleVehicles: [
      "Chrysler 200",
      "Chrysler Cirrus",
      "Chrysler Sebring",
      "Chrysler Stratus",
      "Dodge Avenger",
      "Dodge Caliber",
      "Dodge Journey",
      "Dodge Ram 1500",
      "Dodge Ram 2500"
    ]
  },

  // Ford & Lincoln AC Filters
  "M110855A": {
    filterNumber: "M110855A",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Explorer",
      "Ford Flex",
      "Ford Taurus V",
      "Lincoln MKS",
      "Lincoln MKT"
    ]
  },
  "M110855K": {
    filterNumber: "M110855K",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Explorer",
      "Ford Flex",
      "Ford Taurus V",
      "Lincoln MKS",
      "Lincoln MKT"
    ]
  },
  "M110855": {
    filterNumber: "M110855",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Explorer",
      "Ford Flex",
      "Ford Taurus V",
      "Lincoln MKS",
      "Lincoln MKT"
    ]
  },
  "M110968": {
    filterNumber: "M110968",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Edge",
      "Ford Fusion",
      "Ford Fusion (USA)",
      "Lincoln MKX",
      "Lincoln MKZ"
    ]
  },
  "M110996": {
    filterNumber: "M110996",
    brands: ["Ford"],
    compatibleVehicles: [
      "Ford Mustang"
    ],
    note: "2015 ~"
  },
  "M110523A": {
    filterNumber: "M110523A",
    brands: ["Ford"],
    compatibleVehicles: [
      "Ford B-Max",
      "Ford EcoSport",
      "Ford Fiesta",
      "Ford Fiesta VI",
      "Ford KA+",
      "Ford Puma II",
      "Ford Tourneo Courier",
      "Ford Fiesta (USA)"
    ]
  },
  "M110968A": {
    filterNumber: "M110968A",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Edge",
      "Ford Fusion",
      "Ford Fusion (USA)",
      "Lincoln MKX",
      "Lincoln MKZ"
    ]
  },
  "M111031": {
    filterNumber: "M111031",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Escape",
      "Ford Focus III",
      "Ford Transit Connect",
      "Lincoln MKC"
    ]
  },
  "M110929K": {
    filterNumber: "M110929K",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Edge",
      "Ford Escape",
      "Ford Explorer",
      "Ford Focus IV",
      "Ford Galaxy",
      "Ford Mondeo V",
      "Ford Mustang Mach-E",
      "Ford Bronco Sport (USA)",
      "Lincoln Aviator",
      "Lincoln Corsair"
    ]
  },
  "M111032": {
    filterNumber: "M111032",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Edge",
      "Ford Escape",
      "Ford Explorer",
      "Ford Focus IV",
      "Ford Galaxy",
      "Ford Mondeo V",
      "Ford Mustang Mach-E",
      "Ford Bronco Sport (USA)",
      "Lincoln Aviator",
      "Lincoln Corsair"
    ]
  },
  "M110969B": {
    filterNumber: "M110969B",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Expedition",
      "Ford F-150",
      "Ford F-350",
      "Ford F-450",
      "Lincoln Navigator"
    ],
    note: "Expedition 2017~"
  },
  "M110969": {
    filterNumber: "M110969",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford Expedition",
      "Ford F-150",
      "Ford F-350",
      "Ford F-450",
      "Lincoln Navigator"
    ],
    note: "Expedition 2017~"
  },

  // Toyota & Lexus AC Filters
  "M110473A": {
    filterNumber: "M110473A",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Toyota 4 Runner",
      "Toyota Avalon",
      "Toyota Avensis",
      "Toyota Camry",
      "Toyota Camry/Aurion",
      "Toyota Coaster",
      "Toyota Corolla",
      "Toyota Crown",
      "Toyota Crown Majesta",
      "Toyota Crown Royal Saloon",
      "Toyota Fortuner",
      "Toyota Hiace",
      "Toyota Highlander",
      "Toyota Hilux",
      "Toyota Land Cruiser 200",
      "Toyota Land Cruiser Prado 150",
      "Toyota Prius",
      "Toyota RAV 4",
      "Toyota Sequoia (USA)",
      "Toyota Sienna",
      "Toyota Tundra",
      "Toyota Yaris",
      "Toyota Yaris (USA)",
      "Toyota Yaris/Hybrid",
      "Toyota Yaris/Vios/Limo",
      "Lexus Es200",
      "Lexus Es240",
      "Lexus Es250",
      "Lexus ES300H",
      "Lexus Es350",
      "Lexus Gs300",
      "Lexus Gs350",
      "Lexus Gs430",
      "Lexus GS450H",
      "Lexus Gs460",
      "Lexus Gx460",
      "Lexus Is250",
      "Lexus Is350",
      "Lexus Ls460",
      "Lexus LS600H",
      "Lexus Lx460",
      "Lexus Lx570",
      "Lexus Nx200",
      "Lexus Nx200t",
      "Lexus NX300H",
      "Lexus Rc350",
      "Lexus Rx270",
      "Lexus Rx300",
      "Lexus RX330/350",
      "Lexus Rx350",
      "Lexus RX450H"
    ],
    note: "تويوتا عام"
  },
  "M110473K": {
    filterNumber: "M110473K",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Toyota 4 Runner",
      "Toyota Avalon",
      "Toyota Avensis",
      "Toyota Camry",
      "Toyota Camry/Aurion",
      "Toyota Coaster",
      "Toyota Corolla",
      "Toyota Crown",
      "Toyota Crown Majesta",
      "Toyota Crown Royal Saloon",
      "Toyota Fortuner",
      "Toyota Hiace",
      "Toyota Highlander",
      "Toyota Hilux",
      "Toyota Land Cruiser 200",
      "Toyota Land Cruiser Prado 150",
      "Toyota Prius",
      "Toyota RAV 4",
      "Toyota Sequoia (USA)",
      "Toyota Sienna",
      "Toyota Tundra",
      "Toyota Yaris",
      "Toyota Yaris (USA)",
      "Toyota Yaris/Hybrid",
      "Toyota Yaris/Vios/Limo",
      "Lexus Es200",
      "Lexus Es240",
      "Lexus Es250",
      "Lexus ES300H",
      "Lexus Es350",
      "Lexus Gs300",
      "Lexus Gs350",
      "Lexus Gs430",
      "Lexus GS450H",
      "Lexus Gs460",
      "Lexus Gx460",
      "Lexus Is250",
      "Lexus Is350",
      "Lexus Ls460",
      "Lexus LS600H",
      "Lexus Lx460",
      "Lexus Lx570",
      "Lexus Nx200",
      "Lexus Nx200t",
      "Lexus NX300H",
      "Lexus Rc350",
      "Lexus Rx270",
      "Lexus Rx300",
      "Lexus RX330/350",
      "Lexus Rx350",
      "Lexus RX450H"
    ],
    note: "تويوتا عام"
  },
  "M110475": {
    filterNumber: "M110475",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Toyota 4 Runner",
      "Toyota Avalon",
      "Toyota Avensis",
      "Toyota Camry",
      "Toyota Camry/Aurion",
      "Toyota Coaster",
      "Toyota Corolla",
      "Toyota Crown",
      "Toyota Crown Majesta",
      "Toyota Crown Royal Saloon",
      "Toyota Fortuner",
      "Toyota Hiace",
      "Toyota Highlander",
      "Toyota Hilux",
      "Toyota Land Cruiser 200",
      "Toyota Land Cruiser Prado 150",
      "Toyota Prius",
      "Toyota RAV 4",
      "Toyota Sequoia (USA)",
      "Toyota Sienna",
      "Toyota Tundra",
      "Toyota Yaris",
      "Toyota Yaris (USA)",
      "Toyota Yaris/Hybrid",
      "Toyota Yaris/Vios/Limo",
      "Lexus Es200",
      "Lexus Es240",
      "Lexus Es250",
      "Lexus ES300H",
      "Lexus Es350",
      "Lexus Gs300",
      "Lexus Gs350",
      "Lexus Gs430",
      "Lexus GS450H",
      "Lexus Gs460",
      "Lexus Gx460",
      "Lexus Is250",
      "Lexus Is350",
      "Lexus Ls460",
      "Lexus LS600H",
      "Lexus Lx460",
      "Lexus Lx570",
      "Lexus Nx200",
      "Lexus Nx200t",
      "Lexus NX300H",
      "Lexus Rc350",
      "Lexus Rx270",
      "Lexus Rx300",
      "Lexus RX330/350",
      "Lexus Rx350",
      "Lexus RX450H"
    ],
    note: "تويوتا عام"
  },
  "M110999A": {
    filterNumber: "M110999A",
    brands: ["Toyota", "Lexus", "Mazda"],
    compatibleVehicles: [
      "Toyota Auris",
      "Toyota Avalon",
      "Toyota C-HR",
      "Toyota Camry",
      "Toyota Corolla",
      "Toyota Corolla Cross",
      "Toyota Corolla HB",
      "Toyota Crown",
      "Toyota Crown Majesta",
      "Toyota Fortuner",
      "Toyota GR Corolla",
      "Toyota GR Yaris",
      "Toyota GranAce",
      "Toyota Harrier",
      "Toyota Hiace",
      "Toyota Highlander",
      "Toyota Hilux",
      "Toyota Levin",
      "Toyota Noah/Voxy",
      "Toyota Noah/Voxy/Esquire",
      "Toyota Prius",
      "Toyota RAV 4",
      "Toyota RAV 4 PHV",
      "Toyota RAV 4 Prime",
      "Toyota Sienna",
      "Toyota Sienta",
      "Toyota Venza",
      "Toyota Yaris",
      "Toyota Yaris Cross",
      "Toyota Yaris/Hybrid",
      "Lexus Es200",
      "Lexus Es250",
      "Lexus ES300H",
      "Lexus Es350",
      "Lexus Nx250",
      "Lexus Nx350",
      "Lexus RX200T",
      "Lexus Rx300",
      "Lexus Rx350",
      "Lexus RX450H",
      "Lexus Ux200",
      "Lexus UX250H",
      "Mazda CX-9",
      "Mazda Mazda 2"
    ]
  },
  "M110999K": {
    filterNumber: "M110999K",
    brands: ["Toyota", "Lexus", "Mazda"],
    compatibleVehicles: [
      "Toyota Auris",
      "Toyota Avalon",
      "Toyota C-HR",
      "Toyota Camry",
      "Toyota Corolla",
      "Toyota Corolla Cross",
      "Toyota Corolla HB",
      "Toyota Crown",
      "Toyota Crown Majesta",
      "Toyota Fortuner",
      "Toyota GR Corolla",
      "Toyota GR Yaris",
      "Toyota GranAce",
      "Toyota Harrier",
      "Toyota Hiace",
      "Toyota Highlander",
      "Toyota Hilux",
      "Toyota Levin",
      "Toyota Noah/Voxy",
      "Toyota Noah/Voxy/Esquire",
      "Toyota Prius",
      "Toyota RAV 4",
      "Toyota RAV 4 PHV",
      "Toyota RAV 4 Prime",
      "Toyota Sienna",
      "Toyota Sienta",
      "Toyota Venza",
      "Toyota Yaris",
      "Toyota Yaris Cross",
      "Toyota Yaris/Hybrid",
      "Lexus Es200",
      "Lexus Es250",
      "Lexus ES300H",
      "Lexus Es350",
      "Lexus Nx250",
      "Lexus Nx350",
      "Lexus RX200T",
      "Lexus Rx300",
      "Lexus Rx350",
      "Lexus RX450H",
      "Lexus Ux200",
      "Lexus UX250H",
      "Mazda CX-9",
      "Mazda Mazda 2"
    ]
  },
  "M110999": {
    filterNumber: "M110999",
    brands: ["Toyota", "Lexus", "Mazda"],
    compatibleVehicles: [
      "Toyota Auris",
      "Toyota Avalon",
      "Toyota C-HR",
      "Toyota Camry",
      "Toyota Corolla",
      "Toyota Corolla Cross",
      "Toyota Corolla HB",
      "Toyota Crown",
      "Toyota Crown Majesta",
      "Toyota Fortuner",
      "Toyota GR Corolla",
      "Toyota GR Yaris",
      "Toyota GranAce",
      "Toyota Harrier",
      "Toyota Hiace",
      "Toyota Highlander",
      "Toyota Hilux",
      "Toyota Levin",
      "Toyota Noah/Voxy",
      "Toyota Noah/Voxy/Esquire",
      "Toyota Prius",
      "Toyota RAV 4",
      "Toyota RAV 4 PHV",
      "Toyota RAV 4 Prime",
      "Toyota Sienna",
      "Toyota Sienta",
      "Toyota Venza",
      "Toyota Yaris",
      "Toyota Yaris Cross",
      "Toyota Yaris/Hybrid",
      "Lexus Es200",
      "Lexus Es250",
      "Lexus ES300H",
      "Lexus Es350",
      "Lexus Nx250",
      "Lexus Nx350",
      "Lexus RX200T",
      "Lexus Rx300",
      "Lexus Rx350",
      "Lexus RX450H",
      "Lexus Ux200",
      "Lexus UX250H",
      "Mazda CX-9",
      "Mazda Mazda 2"
    ],
    note: "تويوتا عام حديث 2017 ~"
  },

  // Nissan & Infiniti AC Filters
  "M110974": {
    filterNumber: "M110974",
    brands: ["Nissan"],
    compatibleVehicles: [
      "Nissan Micra",
      "Nissan Note",
      "Nissan Sunny",
      "Nissan Versa",
      "Nissan Versa Sedan"
    ]
  },
  "M110885A": {
    filterNumber: "M110885A",
    brands: ["Nissan", "Renault"],
    compatibleVehicles: [
      "Nissan Qashqai",
      "Nissan Rogue Sport",
      "Nissan X-Trail",
      "Renault Dokker",
      "Renault Express",
      "Renault Kangoo"
    ]
  },
  "M110885K": {
    filterNumber: "M110885K",
    brands: ["Nissan", "Renault"],
    compatibleVehicles: [
      "Nissan Qashqai",
      "Nissan Rogue Sport",
      "Nissan X-Trail",
      "Renault Dokker",
      "Renault Express",
      "Renault Kangoo"
    ]
  },
  "M110885": {
    filterNumber: "M110885",
    brands: ["Nissan", "Renault"],
    compatibleVehicles: [
      "Nissan Qashqai",
      "Nissan Rogue Sport",
      "Nissan X-Trail",
      "Renault Dokker",
      "Renault Express",
      "Renault Kangoo"
    ]
  },
  "M110924A": {
    filterNumber: "M110924A",
    brands: ["Nissan", "Renault", "Samsung"],
    compatibleVehicles: [
      "Nissan Almera",
      "Nissan Qashqai",
      "Nissan Rogue (USA)",
      "Nissan X-Trail",
      "Renault Koleos",
      "Renault Megane IV",
      "Renault Megane IV Sedan",
      "Renault Talisman",
      "Samsung Sm6"
    ]
  },
  "M110924": {
    filterNumber: "M110924",
    brands: ["Nissan", "Renault", "Samsung"],
    compatibleVehicles: [
      "Nissan Almera",
      "Nissan Qashqai",
      "Nissan Rogue (USA)",
      "Nissan X-Trail",
      "Renault Koleos",
      "Renault Megane IV",
      "Renault Megane IV Sedan",
      "Renault Talisman",
      "Samsung Sm6"
    ]
  },
  "M110950K": {
    filterNumber: "M110950K",
    brands: ["Nissan", "Renault", "Samsung"],
    compatibleVehicles: [
      "Nissan Almera",
      "Nissan Qashqai",
      "Nissan Rogue (USA)",
      "Nissan X-Trail",
      "Renault Koleos",
      "Renault Megane IV",
      "Renault Megane IV Sedan",
      "Renault Talisman",
      "Samsung Sm6"
    ]
  },
  "M110849": {
    filterNumber: "M110849",
    brands: ["Infiniti", "Nissan"],
    compatibleVehicles: [
      "Infiniti QX60/JX",
      "Nissan Altima",
      "Nissan Maxima",
      "Nissan Murano",
      "Nissan Pathfinder",
      "Nissan Teana"
    ]
  },
  "M110973": {
    filterNumber: "M110973",
    brands: ["Infiniti", "Nissan"],
    compatibleVehicles: [
      "Infiniti QX60/JX",
      "Nissan Altima",
      "Nissan Maxima",
      "Nissan Murano",
      "Nissan Pathfinder",
      "Nissan Teana"
    ],
    note: "Altima 2012~2018"
  },
  "M110973B": {
    filterNumber: "M110973B",
    brands: ["Infiniti", "Nissan"],
    compatibleVehicles: [
      "Infiniti QX60/JX",
      "Nissan Altima",
      "Nissan Maxima",
      "Nissan Murano",
      "Nissan Pathfinder",
      "Nissan Teana"
    ],
    note: "Altima 2012~2018"
  },

  // Haval AC Filters
  "M110977": {
    filterNumber: "M110977",
    brands: ["Haval"],
    compatibleVehicles: [
      "Haval H2"
    ],
    note: "H2 1.5T 2014 ~ 2021"
  },

  // Mitsubishi AC Filters
  "M110770": {
    filterNumber: "M110770",
    brands: ["Mitsubishi"],
    compatibleVehicles: [
      "Mitsubishi ASX",
      "Mitsubishi Delica D:5",
      "Mitsubishi Eclipse Cross",
      "Mitsubishi Galant Fortis",
      "Mitsubishi L200",
      "Mitsubishi Lancer",
      "Mitsubishi Lancer Evolution",
      "Mitsubishi Lancer Evolution X",
      "Mitsubishi Lancer EX",
      "Mitsubishi Lancer Sportback",
      "Mitsubishi Outlander",
      "Mitsubishi Outlander (USA)",
      "Mitsubishi Outlander Sport",
      "Mitsubishi Pajero / Montero Sport",
      "Mitsubishi Pajero Sport",
      "Mitsubishi RVR",
      "Mitsubishi Triton"
    ]
  },

  // SsangYong AC Filters
  "M110566": {
    filterNumber: "M110566",
    brands: ["SsangYong"],
    compatibleVehicles: [
      "SsangYong Tivoli",
      "SsangYong XLV"
    ]
  },

  // Jaguar & Land Rover AC Filters
  "M110719K": {
    filterNumber: "M110719K",
    brands: ["Jaguar", "Land Rover"],
    compatibleVehicles: [
      "Jaguar E-Pace",
      "Land Rover Discovery Sport",
      "Land Rover Freelander II",
      "Land Rover Range Rover Evoque"
    ]
  },
  "M110719": {
    filterNumber: "M110719",
    brands: ["Jaguar", "Land Rover"],
    compatibleVehicles: [
      "Jaguar E-Pace",
      "Land Rover Discovery Sport",
      "Land Rover Freelander II",
      "Land Rover Range Rover Evoque"
    ]
  }
};

// Helper function to search for AC filter by vehicle make and model
export function findACFilterByVehicle(make: string, model: string): string | null {
  const normalizedMake = make?.toLowerCase?.()?.trim?.() || '';
  const normalizedModel = model?.toLowerCase?.()?.trim?.() || '';
  
  // Create a comprehensive mapping of Arabic/English brand names
  const makeMapping: { [key: string]: string } = {
    // Toyota & Lexus
    'تويوتا': 'toyota',
    'toyota': 'toyota',
    'لكزس': 'lexus',
    'lexus': 'lexus',
    
    // Ford & Lincoln
    'فورد': 'ford',
    'ford': 'ford',
    'لينكولن': 'lincoln',
    'lincoln': 'lincoln',
    
    // Chevrolet & GM brands
    'شيفروليه': 'chevrolet',
    'chevrolet': 'chevrolet',
    'جي ام سي': 'gmc',
    'gmc': 'gmc',
    'كاديلاك': 'cadillac',
    'cadillac': 'cadillac',
    'بيويك': 'buick',
    'buick': 'buick',
    'اوبل': 'opel',
    'opel': 'opel',
    'دايو': 'daewoo',
    'daewoo': 'daewoo',
    
    // Nissan & Infiniti
    'نيسان': 'nissan',
    'nissan': 'nissan',
    'انفينيتي': 'infiniti',
    'infiniti': 'infiniti',
    
    // Chrysler Group
    'كرايسلر': 'chrysler',
    'chrysler': 'chrysler',
    'دودج': 'dodge',
    'dodge': 'dodge',
    'جيب': 'jeep',
    'jeep': 'jeep',
    'فيات': 'fiat',
    'fiat': 'fiat',
    
    // Renault
    'رينو': 'renault',
    'renault': 'renault',
    
    // Chinese brands
    'هافال': 'haval',
    'haval': 'haval',
    'فاو': 'faw',
    'faw': 'faw',
    
    // Korean brands
    'سامسونج': 'samsung',
    'samsung': 'samsung',
    
    // Other brands
    'ميتسوبيشي': 'mitsubishi',
    'mitsubishi': 'mitsubishi',
    'سانج يونج': 'ssangyong',
    'ssangyong': 'ssangyong',
    'جاكوار': 'jaguar',
    'jaguar': 'jaguar',
    'لاند روفر': 'land rover',
    'land rover': 'land rover',
    'مازدا': 'mazda',
    'mazda': 'mazda'
  };

  // Comprehensive model mapping for Arabic to English
  const modelMapping: { [key: string]: string } = {
    // Toyota Models
    'كامري': 'camry',
    'camry': 'camry',
    'كورولا': 'corolla',
    'corolla': 'corolla',
    'بريوس': 'prius',
    'prius': 'prius',
    'راف فور': 'rav 4',
    'rav4': 'rav 4',
    'rav 4': 'rav 4',
    'يارس': 'yaris',
    'yaris': 'yaris',
    'هايلكس': 'hilux',
    'hilux': 'hilux',
    'لاندكروزر': 'land cruiser',
    'landcruiser': 'land cruiser',
    'land cruiser': 'land cruiser',
    'برادو': 'prado',
    'prado': 'prado',
    'فورتشنر': 'fortuner',
    'fortuner': 'fortuner',
    'افالون': 'avalon',
    'avalon': 'avalon',
    'هايس': 'hiace',
    'hiace': 'hiace',
    'سي اتش ار': 'c-hr',
    'c-hr': 'c-hr',
    'chr': 'c-hr',
    'سيكويا': 'sequoia',
    'sequoia': 'sequoia',
    'تندرا': 'tundra',
    'tundra': 'tundra',
    'فور رانر': '4 runner',
    '4runner': '4 runner',
    '4 runner': '4 runner',
    'هايلاندر': 'highlander',
    'highlander': 'highlander',
    'سيينا': 'sienna',
    'sienna': 'sienna',
    'فينزا': 'venza',
    'venza': 'venza',
    'كراون': 'crown',
    'crown': 'crown',
    'كوستر': 'coaster',
    'coaster': 'coaster',
    'اوريس': 'auris',
    'auris': 'auris',
    'هارير': 'harrier',
    'harrier': 'harrier',
    'ليفين': 'levin',
    'levin': 'levin',
    'نوح': 'noah',
    'noah': 'noah',
    'فوكسي': 'voxy',
    'voxy': 'voxy',
    'سيينتا': 'sienta',
    'sienta': 'sienta',
    'جران ايس': 'granace',
    'granace': 'granace',
    
    // Lexus Models
    'اي اس': 'es',
    'es': 'es',
    'جي اس': 'gs',
    'gs': 'gs',
    'ال اس': 'ls',
    'ls': 'ls',
    'ار اكس': 'rx',
    'rx': 'rx',
    'ال اكس': 'lx',
    'lx': 'lx',
    'جي اكس': 'gx',
    'gx': 'gx',
    'is': 'is',
    'ان اكس': 'nx',
    'nx': 'nx',
    'يو اكس': 'ux',
    'ux': 'ux',
    'ار سي': 'rc',
    'rc': 'rc',
    
    // Nissan Models
    'التيما': 'altima',
    'altima': 'altima',
    'ماكسيما': 'maxima',
    'maxima': 'maxima',
    'مورانو': 'murano',
    'murano': 'murano',
    'باثفايندر': 'pathfinder',
    'pathfinder': 'pathfinder',
    'قاشقاي': 'qashqai',
    'qashqai': 'qashqai',
    'اكس تريل': 'x-trail',
    'x-trail': 'x-trail',
    'xtrail': 'x-trail',
    'مايكرا': 'micra',
    'micra': 'micra',
    'نوت': 'note',
    'note': 'note',
    'صني': 'sunny',
    'sunny': 'sunny',
    'فيرسا': 'versa',
    'versa': 'versa',
    'تيانا': 'teana',
    'teana': 'teana',
    'المرا': 'almera',
    'almera': 'almera',
    'روج': 'rogue',
    'rogue': 'rogue',
    'باترول': 'patrol',
    'patrol': 'patrol',
    
    // Ford Models
    'اكسبلورر': 'explorer',
    'explorer': 'explorer',
    'ايدج': 'edge',
    'edge': 'edge',
    'فيوجن': 'fusion',
    'fusion': 'fusion',
    'موستانج': 'mustang',
    'mustang': 'mustang',
    'اسكيب': 'escape',
    'escape': 'escape',
    'فوكس': 'focus',
    'focus': 'focus',
    'فييستا': 'fiesta',
    'fiesta': 'fiesta',
    'ايكوسبورت': 'ecosport',
    'ecosport': 'ecosport',
    'اكسبيديشن': 'expedition',
    'expedition': 'expedition',
    'اف 150': 'f-150',
    'f-150': 'f-150',
    'f150': 'f-150',
    'تورس': 'taurus',
    'taurus': 'taurus',
    'فليكس': 'flex',
    'flex': 'flex',
    'جالاكسي': 'galaxy',
    'galaxy': 'galaxy',
    'مونديو': 'mondeo',
    'mondeo': 'mondeo',
    'ترانزيت': 'transit',
    'transit': 'transit',
    
    // Chevrolet Models
    'كامارو': 'camaro',
    'camaro': 'camaro',
    'كروز': 'cruze',
    'cruze': 'cruze',
    'ماليبو': 'malibu',
    'malibu': 'malibu',
    'سيلفرادو': 'silverado',
    'silverado': 'silverado',
    'تاهو': 'tahoe',
    'tahoe': 'tahoe',
    'سوبربان': 'suburban',
    'suburban': 'suburban',
    'افيو': 'aveo',
    'aveo': 'aveo',
    'سونيك': 'sonic',
    'sonic': 'sonic',
    'سبارك': 'spark',
    'spark': 'spark',
    'اكوينوكس': 'equinox',
    'equinox': 'equinox',
    'ترافيرس': 'traverse',
    'traverse': 'traverse',
    'بليزر': 'blazer',
    'blazer': 'blazer',
    'اورلاندو': 'orlando',
    'orlando': 'orlando',
    'تراكس': 'trax',
    'trax': 'trax',
    'تراكر': 'tracker',
    'tracker': 'tracker',
    'اوبترا': 'optra',
    'optra': 'optra',
    'لاسيتي': 'lacetti',
    'lacetti': 'lacetti',
    'كابريس': 'caprice',
    'caprice': 'caprice',
    
    // Cadillac Models
    'اسكاليد': 'escalade',
    'escalade': 'escalade',
    'ايه تي اس': 'ats',
    'ats': 'ats',
    'سي تي فور': 'ct4',
    'ct4': 'ct4',
    'سي تي فايف': 'ct5',
    'ct5': 'ct5',
    'سي تي سكس': 'ct6',
    'ct6': 'ct6',
    'اس ار اكس': 'srx',
    'srx': 'srx',
    'اكس تي فايف': 'xt5',
    'xt5': 'xt5',
    'اكس تي سكس': 'xt6',
    'xt6': 'xt6',
    
    // Jeep Models
    'جراند شيروكي': 'grand cherokee',
    'grand cherokee': 'grand cherokee',
    'شيروكي': 'cherokee',
    'cherokee': 'cherokee',
    'كومباس': 'compass',
    'compass': 'compass',
    'رينيجيد': 'renegade',
    'renegade': 'renegade',
    'رانجلر': 'wrangler',
    'wrangler': 'wrangler',
    'ليبرتي': 'liberty',
    'liberty': 'liberty',
    'باتريوت': 'patriot',
    'patriot': 'patriot',
    'جراند واجونير': 'grand wagoneer',
    'grand wagoneer': 'grand wagoneer',
    
    // Dodge Models
    'تشارجر': 'charger',
    'charger': 'charger',
    'تشالنجر': 'challenger',
    'challenger': 'challenger',
    'دورانجو': 'durango',
    'durango': 'durango',
    'افينجر': 'avenger',
    'avenger': 'avenger',
    'كاليبر': 'caliber',
    'caliber': 'caliber',
    'جورني': 'journey',
    'journey': 'journey',
    'رام': 'ram',
    'ram': 'ram',
    
    // Chrysler Models
    '300سي': '300c',
    '300c': '300c',
    'سيبرينج': 'sebring',
    'sebring': 'sebring',
    'سيروس': 'cirrus',
    'cirrus': 'cirrus',
    'ستراتوس': 'stratus',
    'stratus': 'stratus',
    
    // Lincoln Models
    'ام كي اس': 'mks',
    'mks': 'mks',
    'ام كي تي': 'mkt',
    'mkt': 'mkt',
    'ام كي اكس': 'mkx',
    'mkx': 'mkx',
    'ام كي زد': 'mkz',
    'mkz': 'mkz',
    'ام كي سي': 'mkc',
    'mkc': 'mkc',
    'نافيجيتر': 'navigator',
    'navigator': 'navigator',
    'افييتر': 'aviator',
    'aviator': 'aviator',
    'كورسير': 'corsair',
    'corsair': 'corsair',
    
    // Infiniti Models
    'كيو اكس': 'qx',
    'qx': 'qx',
    'كيو فايف زيرو': 'q50',
    'q50': 'q50',
    'كيو سكستي': 'q60',
    'q60': 'q60',
    'اف اكس': 'fx',
    'fx': 'fx',
    'اي اكس': 'ex',
    'ex': 'ex',
    'جي': 'g',
    'g': 'g',
    'ام': 'm',
    'm': 'm',
    
    // Renault Models
    'كوليوس': 'koleos',
    'koleos': 'koleos',
    'ميجان': 'megane',
    'megane': 'megane',
    'تاليسمان': 'talisman',
    'talisman': 'talisman',
    'دوكر': 'dokker',
    'dokker': 'dokker',
    'اكسبريس': 'express',
    'express': 'express',
    'كانجو': 'kangoo',
    'kangoo': 'kangoo',
    
    // Mazda Models
    'سي اكس ناين': 'cx-9',
    'cx-9': 'cx-9',
    'cx9': 'cx-9',
    'مازدا تو': 'mazda 2',
    'mazda 2': 'mazda 2',
    'mazda2': 'mazda 2',
    
    // Mitsubishi Models
    'لانسر': 'lancer',
    'lancer': 'lancer',
    'اوتلاندر': 'outlander',
    'outlander': 'outlander',
    'باجيرو': 'pajero',
    'pajero': 'pajero',
    'مونتيرو': 'montero',
    'montero': 'montero',
    'ال 200': 'l200',
    'l200': 'l200',
    'تريتون': 'triton',
    'triton': 'triton',
    'اي اس اكس': 'asx',
    'asx': 'asx',
    'ديليكا': 'delica',
    'delica': 'delica',
    'ايكليبس كروس': 'eclipse cross',
    'eclipse cross': 'eclipse cross',
    'جالانت فورتيس': 'galant fortis',
    'galant fortis': 'galant fortis',
    'ار في ار': 'rvr',
    'rvr': 'rvr',
    
    // Haval Models
    'اتش تو': 'h2',
    'h2': 'h2',
    'اتش سكس': 'h6',
    'h6': 'h6',
    'اتش ناين': 'h9',
    'h9': 'h9',
    'اف سفن': 'f7',
    'f7': 'f7',
    'جوليون': 'jolion',
    'jolion': 'jolion',
    'دارجو': 'dargo',
    'dargo': 'dargo',
    
    // SsangYong Models
    'تيفولي': 'tivoli',
    'tivoli': 'tivoli',
    'اكس ال في': 'xlv',
    'xlv': 'xlv',
    
    // Jaguar Models
    'اي بيس': 'e-pace',
    'e-pace': 'e-pace',
    'اف بيس': 'f-pace',
    'f-pace': 'f-pace',
    'اي تايب': 'e-type',
    'e-type': 'e-type',
    'اكس اف': 'xf',
    'xf': 'xf',
    'اكس اي': 'xe',
    'xe': 'xe',
    'اكس جي': 'xj',
    'xj': 'xj',
    
    // Land Rover Models
    'ديسكفري': 'discovery',
    'discovery': 'discovery',
    'فريلاندر': 'freelander',
    'freelander': 'freelander',
    'رينج روفر': 'range rover',
    'range rover': 'range rover',
    'ايفوك': 'evoque',
    'evoque': 'evoque',
    'ديفندر': 'defender',
    'defender': 'defender',
    'سبورت': 'sport',
    'sport': 'sport',
    
    // Opel Models
    'استرا': 'astra',
    'astra': 'astra',
    'انسيجنيا': 'insignia',
    'insignia': 'insignia',
    'كورسا': 'corsa',
    'corsa': 'corsa',
    'كارل': 'karl',
    'karl': 'karl',
    'ميريفا': 'meriva',
    'meriva': 'meriva',
    'زافيرا': 'zafira',
    'zafira': 'zafira',
    'كاسكادا': 'cascada',
    'cascada': 'cascada',
    
    // Buick Models
    'لاكروس': 'lacrosse',
    'lacrosse': 'lacrosse',
    'انكليف': 'enclave',
    'enclave': 'enclave',
    'انكور': 'encore',
    'encore': 'encore',
    'انفيجن': 'envision',
    'envision': 'envision',
    
    // GMC Models
    'يوكون': 'yukon',
    'yukon': 'yukon',
    'دينالي': 'denali',
    'denali': 'denali',
    'اكاديا': 'acadia',
    'acadia': 'acadia',
    'تيرين': 'terrain',
    'terrain': 'terrain',
    'سييرا': 'sierra',
    'sierra': 'sierra',
    'كانيون': 'canyon',
    'canyon': 'canyon',
    
    // Fiat Models
    'فريمونت': 'freemont',
    'freemont': 'freemont',
    'دوكاتو': 'ducato',
    'ducato': 'ducato',
    'بونتو': 'punto',
    'punto': 'punto',
    'بيندا': 'panda',
    'panda': 'panda',
    'فايف هندرد': '500',
    '500': '500',
    
    // Samsung Models
    'اس ام سكس': 'sm6',
    'sm6': 'sm6',
    'اس ام ثري': 'sm3',
    'sm3': 'sm3',
    'اس ام فايف': 'sm5',
    'sm5': 'sm5',
    
    // FAW Models
    'بيسترن': 'besturn',
    'besturn': 'besturn',
    'اكس ايتي': 'x80',
    'x80': 'x80',
    'بي فايف': 'b50',
    'b50': 'b50',
    'في تو': 'v2',
    'v2': 'v2'
  };

  const mappedMake = makeMapping[normalizedMake] || normalizedMake;
  const mappedModel = modelMapping[normalizedModel] || normalizedModel;
  
  // Search through all filters
  for (const [filterNumber, filterData] of Object.entries(denckermannACFilters)) {
    // Check if the make matches any of the brands
    const brandMatch = filterData.brands.some(brand => 
      brand.toLowerCase().includes(mappedMake) || mappedMake.includes(brand.toLowerCase())
    );
    
    if (brandMatch) {
      // Check if the model matches any of the compatible vehicles
      const vehicleMatch = filterData.compatibleVehicles.some(vehicle => {
        const normalizedVehicle = vehicle.toLowerCase();
        return normalizedVehicle.includes(mappedModel) || 
               mappedModel.includes(normalizedVehicle.split(' ').pop() || '') ||
               normalizedVehicle.includes(normalizedModel);
      });
      
      if (vehicleMatch) {
        return filterNumber;
      }
    }
  }
  
  return null;
}

// Helper function to get AC filter details by filter number
export function getACFilterDetails(filterNumber: string): DenckermannACFilter | null {
  return denckermannACFilters[filterNumber] || null;
}

// Helper function to get all available AC filter numbers
export function getAllACFilterNumbers(): string[] {
  return Object.keys(denckermannACFilters).sort();
}

// Helper function to search AC filters by brand
export function getACFiltersByBrand(brand: string): DenckermannACFilter[] {
  const normalizedBrand = brand.toLowerCase().trim();
  return Object.values(denckermannACFilters).filter(filter => 
    filter.brands.some(b => b.toLowerCase().includes(normalizedBrand))
  );
}

// Helper function to get AC filter statistics
export function getACFilterStats() {
  const totalFilters = Object.keys(denckermannACFilters).length;
  const brandsSet = new Set<string>();
  const vehiclesSet = new Set<string>();
  
  Object.values(denckermannACFilters).forEach(filter => {
    filter.brands.forEach(brand => brandsSet.add(brand));
    filter.compatibleVehicles.forEach(vehicle => vehiclesSet.add(vehicle));
  });
  
  return {
    totalFilters,
    totalBrands: brandsSet.size,
    totalVehicles: vehiclesSet.size,
    filtersWithNotes: Object.values(denckermannACFilters).filter(f => f.note).length
  };
}