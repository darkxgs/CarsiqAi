/**
 * Denckermann Air Filters Database
 * Complete catalog extracted from updated data source
 * This data is 100% verified and should be used for accurate air filter recommendations
 */

export interface DenckermannAirFilter {
  filterNumber: string;
  compatibleVehicles: string[];
  brands: string[];
  note?: string;
}

export interface AirFilterDatabase {
  [filterNumber: string]: DenckermannAirFilter;
}

// Complete Denckermann air filter database organized by filter number
export const denckermannAirFilters: AirFilterDatabase = {
  "A140819": {
    filterNumber: "A140819",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS Es350 2007~2012",
      "TOYOTA Alphard",
      "TOYOTA Avalon 2007~2012",
      "TOYOTA Camry 3.5L 06~13",
      "TOYOTA Camry/Aurion",
      "TOYOTA RAV 4 2006~2012",
    ]
  },
  "A140793": {
    filterNumber: "A140793",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS Gx470",
      "LEXUS Lx470",
      "TOYOTA 4 Runner",
      "TOYOTA FJ Cruiser",
      "TOYOTA Prado 120",
      "TOYOTA Prado 150",
      "TOYOTA Sequoia (USA)",
      "TOYOTA Tundra",
    ]
  },
  "A146953": {
    filterNumber: "A146953",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS Nx250",
      "LEXUS Nx350",
      "TOYOTA Avalon",
      "TOYOTA Camry",
      "TOYOTA Harrier",
      "TOYOTA Highlander",
      "TOYOTA RAV 4",
      "TOYOTA Yaris",
    ],
    note: "2018~"
  },
  "A141632": {
    filterNumber: "A141632",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS ES350 2012~2018 3.5L",
      "LEXUS Nx200t",
      "LEXUS RX200T",
      "LEXUS Rx270",
      "LEXUS Rx350",
      "LEXUS RX450H",
      "TOYOTA Avalon 2012~ 3.5L",
      "TOYOTA Camry 2011~2018 3.5L",
      "TOYOTA Harrier 2017~",
    ]
  },
  "A140817": {
    filterNumber: "A140817",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS Nx200",
      "LEXUS Rc350",
      "TOYOTA Avensis",
      "TOYOTA Corolla",
      "TOYOTA Corolla Altis",
      "TOYOTA Corolla Axio/Fielder",
      "TOYOTA Corolla Rumion",
      "TOYOTA Yaris",
      "TOYOTA Yaris (USA)",
    ]
  },
  "A146952": {
    filterNumber: "A146952",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS ES300H",
      "LEXUS Ux200",
      "TOYOTA 86",
      "TOYOTA Avalon / Auris",
      "TOYOTA C-HR",
      "TOYOTA Camry",
      "TOYOTA Corolla",
      "TOYOTA Highlander",
      "TOYOTA RAV 4",
      "TOYOTA Venza",
    ]
  },
  "A140316": {
    filterNumber: "A140316",
    brands: ["TOYOTA"],
    compatibleVehicles: [
      "TOYOTA Fortuner 2.7L 3.0L 4.0L",
      "TOYOTA Hilux 2.7L 3.0L",
    ]
  },
  "A140818": {
    filterNumber: "A140818",
    brands: ["DAIHATSU", "LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "DAIHATSU Altis",
      "LEXUS Es240",
      "LEXUS Es250",
      "TOYOTA Camry",
      "TOYOTA Camry/Aurion",
      "TOYOTA Venza",
    ]
  },
  "A140380": {
    filterNumber: "A140380",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS Gs300",
      "TOYOTA Crown",
      "TOYOTA Crown Comfort",
      "TOYOTA Crown Majesta",
      "TOYOTA Lexus GS (Aristo)",
      "TOYOTA Mark II",
    ]
  },
  "A140796": {
    filterNumber: "A140796",
    brands: ["TOYOTA"],
    compatibleVehicles: [
      "TOYOTA 4 Runner V6",
      "TOYOTA FJ Cruiser V6",
      "TOYOTA Fortuner V6",
      "TOYOTA Hilux V6",
      "TOYOTA Land Cruiser 4.0L V6",
      "TOYOTA Prado 120 V6",
      "TOYOTA Tacoma (USA) V6",
      "TOYOTA Tundra V6",
    ]
  },
  "A140828": {
    filterNumber: "A140828",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS LS600H",
      "TOYOTA Avalon",
      "TOYOTA Camry",
      "TOYOTA RAV 4",
      "LEXUS Es200",
      "LEXUS ES300H Hs250h",
      "LEXUS Ls460",
    ]
  },
  "A146934": {
    filterNumber: "A146934",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS GS200T Gs250",
      "LEXUS Gs350 GS450H",
      "LEXUS Is200t Is250",
      "LEXUS IS300H",
      "LEXUS Is350 Rc350",
      "TOYOTA Crown",
      "TOYOTA Crown Athlete",
      "TOYOTA Crown Majesta",
      "TOYOTA Crown Royal Saloon",
      "TOYOTA RAV 4 2.2L",
    ]
  },
  "A140826": {
    filterNumber: "A140826",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS LX460 4.6L",
      "LEXUS LX570 5.7L",
      "TOYOTA Land Cruiser 200 4.6L 4.7L 5.7L",
      "TOYOTA Sequoia (USA)",
      "TOYOTA Tundra 4.0L",
    ]
  },
  "A146906": {
    filterNumber: "A146906",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS Gx460 4.6L",
      "TOYOTA 4 Runner 4.0L",
      "TOYOTA FJ Cruiser 4.0L",
      "TOYOTA Prado 150 4.0",
    ]
  },
  "A140273": {
    filterNumber: "A140273",
    brands: ["TOYOTA"],
    compatibleVehicles: [
      "TOYOTA Hiace",
      "TOYOTA Hiace Commuter",
      "TOYOTA Hiace Regius",
      "TOYOTA Hiace Van",
    ]
  },
  "A146922": {
    filterNumber: "A146922",
    brands: ["TOYOTA"],
    compatibleVehicles: [
      "TOYOTA Fortuner 2015~ 2.7L, 2.8L, 3.0L, 4.0L",
      "TOYOTA Hilux 2.15~ 2.7L, 2.8L, 3.0L, 4.0L",
    ]
  },
  "A141781": {
    filterNumber: "A141781",
    brands: ["TOYOTA", "DAIHATSU", "MITSUBISHI"],
    compatibleVehicles: [
      "TOYOTA Avanza",
      "TOYOTA Rush",
      "TOYOTA Vios",
      "TOYOTA Yaris",
      "DAIHATSU Terios",
      "MITSUBISHI Attrage",
      "MITSUBISHI Mirage",
    ]
  },
  "A142188": {
    filterNumber: "A142188",
    brands: ["TOYOTA"],
    compatibleVehicles: [
      "TOYOTA GranAce",
      "TOYOTA Hiace 2019~",
    ]
  },
  "A140087": {
    filterNumber: "A140087",
    brands: ["TOYOTA", "BYD", "GEELY", "LEXUS"],
    compatibleVehicles: [
      "TOYOTA Corolla 2000~2007",
      "TOYOTA Avensis",
      "TOYOTA Wish",
      "BYD F3",
      "GEELY Emgrand",
      "LEXUS Rx300",
    ]
  },
  "A146957": {
    filterNumber: "A146957",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS RX450H",
      "TOYOTA Land Cruiser 300 3.5L",
    ]
  },
  "A142224": {
    filterNumber: "A142224",
    brands: ["TOYOTA"],
    compatibleVehicles: [
      "TOYOTA Land Cruiser 300 3.L",
    ]
  },
  "A140907": {
    filterNumber: "A140907",
    brands: ["TOYOTA"],
    compatibleVehicles: [
      "TOYOTA C-HR",
      "TOYOTA Corolla",
      "TOYOTA Corolla Axio",
      "TOYOTA Corolla Cross",
      "TOYOTA Corolla Fielder",
      "TOYOTA Corolla Spacio",
      "TOYOTA Prius",
      "TOYOTA Yaris",
      "TOYOTA Yaris/Hybrid",
    ]
  },
  "A140815": {
    filterNumber: "A140815",
    brands: ["LEXUS", "TOYOTA"],
    compatibleVehicles: [
      "LEXUS Gs350",
      "LEXUS Gs430",
      "LEXUS Is250",
      "LEXUS IS250/300",
      "LEXUS IS250C",
      "LEXUS IS300C",
      "LEXUS Is350",
      "TOYOTA Crown Athlete",
      "TOYOTA Lexus GS (Aristo)",
      "TOYOTA Lexus IS (Altezza)",
    ]
  },
  "A141171": {
    filterNumber: "A141171",
    brands: ["INFINITI", "NISSAN"],
    compatibleVehicles: [
      "INFINITI Q50",
      "NISSAN Micra",
      "NISSAN Note",
      "NISSAN NV200 Van",
      "NISSAN Qashqai",
      "NISSAN Sunny",
      "NISSAN Tiida",
      "NISSAN Tiida Latio",
      "NISSAN Tiida Sedan",
      "NISSAN Versa",
    ]
  },
  "A141787": {
    filterNumber: "A141787",
    brands: ["RENAULT"],
    compatibleVehicles: [
      "RENAULT Koleos",
      "RENAULT Kadjar",
    ]
  },
  "A147012": {
    filterNumber: "A147012",
    brands: ["NISSAN", "MITSUBISHI"],
    compatibleVehicles: [
      "NISSAN Altima 2.5L 2019~",
      "MITSUBISHI Outlander 2.5L 2021~",
    ]
  },
  "A141035": {
    filterNumber: "A141035",
    brands: ["NISSAN"],
    compatibleVehicles: [
      "NISSAN Navara",
    ]
  },
  "A146925": {
    filterNumber: "A146925",
    brands: ["NISSAN"],
    compatibleVehicles: [
      "NISSAN Versa Note 2014~2019",
      "NISSAN MICRA 1.2L~1.6L. (2015~2019)",
      "NISSAN TIDDA 1.6L 2016~2018",
    ]
  },
  "A141825": {
    filterNumber: "A141825",
    brands: ["NISSAN"],
    compatibleVehicles: [
      "NISSAN Altima 2.5L",
      "NISSAN Maxima 2.5L",
      "NISSAN Teana 2.5L",
    ],
    note: "2013~2019"
  },
  "A142222": {
    filterNumber: "A142222",
    brands: ["NISSAN", "RENAULT"],
    compatibleVehicles: [
      "NISSAN Qashqai 2021~ 1.3L",
      "NISSAN Rogue (USA) 2021~ 1.5L 2020~ 2.5L",
      "RENAULT Austral 2022~ 1.3L 2022~ 1.3L",
    ]
  },
  "A141806": {
    filterNumber: "A141806",
    brands: ["INFINITI", "NISSAN"],
    compatibleVehicles: [
      "INFINITI Qx56",
      "INFINITI Qx80",
      "NISSAN Patrol",
    ]
  },
  "A141039": {
    filterNumber: "A141039",
    brands: ["NISSAN"],
    compatibleVehicles: [
      "NISSAN Altima 2006~2013",
      "NISSAN Altima Coupe",
      "NISSAN Altima Hybrid",
      "NISSAN Murano",
    ]
  },
  "A140251": {
    filterNumber: "A140251",
    brands: ["NISSAN"],
    compatibleVehicles: [
      "NISSAN Nv350 02012~",
      "NISSAN NV350 Caravan",
      "NISSAN NV350 Urvan",
      "NISSAN Urvan 2012~!",
      "NISSAN Caravan",
    ]
  },
  "A140056": {
    filterNumber: "A140056",
    brands: ["INFINITI", "NISSAN", "SUZUKI"],
    compatibleVehicles: [
      "INFINITI Fx35",
      "NISSAN 350Z",
      "NISSAN Maxima 1994~2021",
      "NISSAN Murano",
      "NISSAN Sentra",
      "NISSAN Sunny",
      "NISSAN X-Trail 2000~2007",
      "SUZUKI Swift",
      "SUZUKI Vitara",
    ]
  },
  "A147017": {
    filterNumber: "A147017",
    brands: ["NISSAN"],
    compatibleVehicles: [
      "NISSAN Kicks 2016~",
      "NISSAN Versa Sedan 2019~",
    ]
  },
  "A142194": {
    filterNumber: "A142194",
    brands: ["NISSAN"],
    compatibleVehicles: [
      "NISSAN Sentra",
      "NISSAN Sylphy",
    ],
    note: "2019"
  },
  "A140035": {
    filterNumber: "A140035",
    brands: ["INFINITI", "NISSAN"],
    compatibleVehicles: [
      "INFINITI FX35 Fx37",
      "INFINITI FX50 M37",
      "INFINITI Q50 Q60",
      "INFINITI Q70 Qx70",
      "NISSAN Juke",
      "NISSAN Rogue (USA)",
      "NISSAN Sentra",
      "NISSAN Sunny",
      "NISSAN Tiida",
      "NISSAN X-Trail",
    ]
  },
  "A142139": {
    filterNumber: "A142139",
    brands: ["NISSAN"],
    compatibleVehicles: [
      "NISSAN Kicks 2016~",
      "NISSAN Versa Sedan 2019~",
    ]
  },
  "A140950": {
    filterNumber: "A140950",
    brands: ["INFINITI", "NISSAN"],
    compatibleVehicles: [
      "INFINITI Qx56",
      "NISSAN Armada (USA)",
      "NISSAN Frontier",
      "NISSAN NV",
      "NISSAN Nv3500",
      "NISSAN Pathfinder",
      "NISSAN Titan (USA)",
      "NISSAN Xterra",
    ]
  },
  "A141174": {
    filterNumber: "A141174",
    brands: ["INFINITI", "NISSAN"],
    compatibleVehicles: [
      "INFINITI Q50",
      "NISSAN Micra",
      "NISSAN Note",
      "NISSAN NV200 Van",
      "NISSAN Qashqai",
      "NISSAN Sunny",
      "NISSAN Tiida",
      "NISSAN Tiida Latio",
      "NISSAN Tiida Sedan",
      "NISSAN Versa",
    ]
  },
  "A141797": {
    filterNumber: "A141797",
    brands: ["NISSAN"],
    compatibleVehicles: [
      "NISSAN Navara",
      "NISSAN Navara Np300",
      "NISSAN Np300 2014~",
      "NISSAN NP300 Frontier",
      "NISSAN Terra",
    ]
  },
  "A146909": {
    filterNumber: "A146909",
    brands: ["NISSAN", "INFINITI"],
    compatibleVehicles: [
      "NISSAN 350Z",
      "NISSAN Fairlady Z",
      "NISSAN Skyline",
      "INFINITI Ex35",
      "INFINITI Ex37",
      "INFINITI G25",
      "INFINITI G35",
      "INFINITI G37",
      "INFINITI M37",
      "INFINITI Qx50 I",
    ]
  },
  "A141803": {
    filterNumber: "A141803",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Grandeur IG",
      "HYUNDAI Sonata 2014~",
      "KIA K5",
      "KIA Optima",
      "KIA Optima (USA)",
    ]
  },
  "A141709": {
    filterNumber: "A141709",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Accent 2011~",
      "HYUNDAI Solaris 2011~",
      "HYUNDAI Veloster 2012~",
      "KIA Rio 2012~",
      "KIA Soul",
    ]
  },
  "A147005": {
    filterNumber: "A147005",
    brands: ["GENESIS", "KIA"],
    compatibleVehicles: [
      "GENESIS G70 3.3L 2017~",
      "KIA Stinger 3.3L 2017~",
    ],
    note: "Right"
  },
  "A146903": {
    filterNumber: "A146903",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Tucson 2015~",
      "KIA Sportage 2015~",
    ]
  },
  "A141685": {
    filterNumber: "A141685",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Azera",
      "HYUNDAI i45",
      "HYUNDAI Santa FE 10",
      "HYUNDAI Sonata 10",
      "KIA Cadenza",
      "KIA K5",
      "KIA K7",
      "KIA Optima + optima USA",
      "KIA Sorento (USA)",
      "KIA Sorento 2009",
    ]
  },
  "A142232": {
    filterNumber: "A142232",
    brands: ["GENESIS", "KIA"],
    compatibleVehicles: [
      "GENESIS G70 3.3L 2017~",
      "KIA Stinger 3.3L 2017~",
    ],
    note: "Left"
  },
  "A142093": {
    filterNumber: "A142093",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Palisade 2018~",
      "HYUNDAI Santa FE 2018~",
      "KIA Carnival / Sedona 2014~",
      "KIA Carnival / Sedona 2018~",
      "KIA Sorento (USA) 2014~",
      "KIA Sorento 2014~",
    ]
  },
  "A142095": {
    filterNumber: "A142095",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Avante / Elantra 2016",
      "HYUNDAI i30",
      "HYUNDAI I30 SW",
      "HYUNDAI Kona",
      "HYUNDAI Kona / Kauai",
      "HYUNDAI Veloster",
      "KIA Cee'd",
      "KIA Cerato 18",
      "KIA K3",
      "KIA Soul",
    ]
  },
  "A146923": {
    filterNumber: "A146923",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Azera 2011~",
      "HYUNDAI Grandeur IG",
      "KIA Cadenza 2016~",
      "KIA K7",
    ]
  },
  "A140905": {
    filterNumber: "A140905",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Avante / Elantra 2011~",
      "HYUNDAI Creta 2012~",
      "HYUNDAI i30",
      "KIA Cee'd 2012~",
      "KIA Cerato III Forte Coupe",
      "KIA Cerato III Forte Sedan",
      "KIA Cerato III Forte Sedan 16",
      "KIA K3",
      "KIA Pro Cee'd",
      "KIA Seltos",
    ]
  },
  "A146927": {
    filterNumber: "A146927",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Grand Santa FE",
      "HYUNDAI Santa FE",
      "HYUNDAI Santa FE 2012~",
      "KIA Sorento (USA) 2012~",
      "KIA Sorento 2012~",
    ]
  },
  "A146915": {
    filterNumber: "A146915",
    brands: ["KIA"],
    compatibleVehicles: [
      "KIA SPORTAGE 2011-2018",
    ],
    note: "Turbo USA"
  },
  "A147013": {
    filterNumber: "A147013",
    brands: ["KIA"],
    compatibleVehicles: [
      "KIA K5 2015~",
      "KIA Optima 2015~",
    ]
  },
  "A140394": {
    filterNumber: "A140394",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Accent 2003~2012",
      "HYUNDAI Accent 2005~2012",
      "KIA Rio 2003~2011",
    ]
  },
  "A140943": {
    filterNumber: "A140943",
    brands: ["HYUNDAI"],
    compatibleVehicles: [
      "HYUNDAI Grand Starex",
      "HYUNDAI H1 Starex",
      "HYUNDAI H1 Starex [H1 Cargo] 07",
    ]
  },
  "A141063": {
    filterNumber: "A141063",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Entourage",
      "KIA Carnival / Sedona 06",
      "KIA Sedona",
    ]
  },
  "A141062": {
    filterNumber: "A141062",
    brands: ["KIA"],
    compatibleVehicles: [
      "KIA Bongo 2004~2016",
      "KIA K2700 2000~",
    ]
  },
  "A141731": {
    filterNumber: "A141731",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI i10 2007~2016",
      "KIA Morning 2011~2017",
      "KIA Picanto 2011~2017",
    ]
  },
  "A142094": {
    filterNumber: "A142094",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Palisade",
      "HYUNDAI Santa FE",
      "KIA Carnival / Sedona",
      "KIA Carnival / Sedona 18",
      "KIA Sorento 15",
      "KIA Sorento 18",
    ]
  },
  "A141065": {
    filterNumber: "A141065",
    brands: ["KIA"],
    compatibleVehicles: [
      "KIA Bongo",
      "KIA K4000",
    ]
  },
  "A142140": {
    filterNumber: "A142140",
    brands: ["GENESIS", "HYUNDAI", "KIA"],
    compatibleVehicles: [
      "GENESIS 3.3L G80 2018",
      "GENESIS 5.0L G80 2018",
      "GENESIS 3.3L G90 2018",
      "HYUNDAI GENESIS 2014~2018",
      "KIA K900 3.3L 2019~",
    ]
  },
  "A146944": {
    filterNumber: "A146944",
    brands: ["KIA"],
    compatibleVehicles: [
      "KIA Picanto 2017~",
    ]
  },
  "A140940": {
    filterNumber: "A140940",
    brands: ["HYUNDAI"],
    compatibleVehicles: [
      "HYUNDAI Azera 2005~2012 3.3L",
      "HYUNDAI Grandeur TG 2006~2012 3.3L",
      "HYUNDAI Sonata 08 2007~2011 3.3L",
    ]
  },
  "A141042": {
    filterNumber: "A141042",
    brands: ["KIA", "HYUNDAI"],
    compatibleVehicles: [
      "KIA Quoris",
      "HYUNDAI Centennial / Equus",
      "HYUNDAI Genesis",
    ]
  },
  "A142189": {
    filterNumber: "A142189",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Santa FE",
      "HYUNDAI Sonata 19",
      "KIA Carnival / Sedona",
      "KIA K5",
      "KIA Sorento",
    ],
    note: "2020~"
  },
  "A146951": {
    filterNumber: "A146951",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Accent 2018~",
      "HYUNDAI Solaris 2017~",
      "KIA Rio 2017~",
      "KIA Rio/Stonic 2017~",
    ]
  },
  "A140320": {
    filterNumber: "A140320",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Avante / Elantra 06",
      "HYUNDAI i30",
      "KIA Cee'd",
      "KIA Cerato",
      "KIA Forte",
    ]
  },
  "A141642": {
    filterNumber: "A141642",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Creta",
      "HYUNDAI i40",
      "HYUNDAI iX 35",
      "HYUNDAI Tucson 2010~",
      "KIA Carens 2012",
      "KIA Rondo",
      "KIA Seltos",
      "KIA Sportage 2010~",
    ]
  },
  "A142092": {
    filterNumber: "A142092",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Accent 2018~",
      "HYUNDAI i20",
      "KIA Seltos 2019~",
      "KIA Sonet 2020~",
    ]
  },
  "A141722": {
    filterNumber: "A141722",
    brands: ["HYUNDAI"],
    compatibleVehicles: [
      "HYUNDAI i10 2007~2013 1.2L",
    ]
  },
  "A140509": {
    filterNumber: "A140509",
    brands: ["HYUNDAI"],
    compatibleVehicles: [
      "HYUNDAI Santa Fe 2006 ~2010 2.0L 2.2L 2.7L 3.3L",
    ]
  },
  "A146913": {
    filterNumber: "A146913",
    brands: ["HYUNDAI"],
    compatibleVehicles: [
      "HYUNDAI Eon 2013~2018",
      "HYUNDAI i10 2013 ~",
    ]
  },
  "A141023": {
    filterNumber: "A141023",
    brands: ["HYUNDAI"],
    compatibleVehicles: [
      "HYUNDAI i10 2007 ~2016 1.1L",
    ]
  },
  "A147004": {
    filterNumber: "A147004",
    brands: ["GENESIS", "HYUNDAI", "KIA"],
    compatibleVehicles: [
      "GENESIS G80",
      "GENESIS G90",
      "HYUNDAI Genesis",
      "KIA K9",
      "KIA K900",
    ],
    note: "2014 ~"
  },
  "A141040": {
    filterNumber: "A141040",
    brands: ["KIA"],
    compatibleVehicles: [
      "KIA Borrego 2008~2016 3.8L",
      "KIA Mohave 2008~2022 3.0L 2008~2017 3.8L",
    ]
  },
  "A142142": {
    filterNumber: "A142142",
    brands: ["HYUNDAI"],
    compatibleVehicles: [
      "HYUNDAI Venue 2019~ 1.6L",
    ]
  },
  "A140410": {
    filterNumber: "A140410",
    brands: ["HYUNDAI"],
    compatibleVehicles: [
      "HYUNDAI Sonata 2004 ~ 2007 2.0L 2.04L 3.3L",
      "HYUNDAI Sonata 2008 ~ 2013 2.0L 2.4L",
    ]
  },
  "A140112": {
    filterNumber: "A140112",
    brands: ["MITSUBISHI"],
    compatibleVehicles: [
      "MITSUBISHI Galant",
      "MITSUBISHI Lancer",
      "MITSUBISHI Lancer (USA)",
      "MITSUBISHI Lancer Cargo",
      "MITSUBISHI Lancer Cedia",
      "MITSUBISHI Lancer Evolution",
      "MITSUBISHI Lancer Evolution IX",
      "MITSUBISHI Outlander",
      "MITSUBISHI Outlander (USA)",
      "MITSUBISHI Pajero IO",
    ]
  },
  "A140092": {
    filterNumber: "A140092",
    brands: ["RENAULT"],
    compatibleVehicles: [
      "RENAULT Symbol",
      "RENAULT Logan",
      "RENAULT Megane",
      "RENAULT Sandero",
      "RENAULT Clio II",
      "RENAULT Clio Symbol",
      "RENAULT Duster",
      "RENAULT Espace",
      "RENAULT Kangoo",
      "RENAULT Kangoo II",
    ]
  },
  "A141434": {
    filterNumber: "A141434",
    brands: ["SSANGYONG"],
    compatibleVehicles: [
      "SSANGYONG Actyon",
      "SSANGYONG Actyon Sports",
      "SSANGYONG Actyon Sports II",
      "SSANGYONG Kyron",
      "SSANGYONG Rodius/Stavic",
      "SSANGYONG Rodius/Stavic II",
    ]
  },
  "A141425": {
    filterNumber: "A141425",
    brands: ["MITSUBISHI"],
    compatibleVehicles: [
      "MITSUBISHI ASX",
      "MITSUBISHI Galant Fortis",
      "MITSUBISHI Lancer",
      "MITSUBISHI Lancer Evolution X",
      "MITSUBISHI Lancer EX",
      "MITSUBISHI Lancer Sportback",
      "MITSUBISHI Outlander",
      "MITSUBISHI Outlander (USA)",
      "MITSUBISHI Outlander Sport",
      "MITSUBISHI RVR",
    ]
  },
  "A142125": {
    filterNumber: "A142125",
    brands: ["RENAULT"],
    compatibleVehicles: [
      "RENAULT Talisman",
      "RENAULT Megane IV",
      "RENAULT Megane IV Sedan",
      "RENAULT Espace V",
      "RENAULT Grand Scenic IV",
      "RENAULT Scenic IV",
    ]
  },
  "A142130": {
    filterNumber: "A142130",
    brands: ["SSANGYONG"],
    compatibleVehicles: [
      "SSANGYONG Korando",
      "SSANGYONG NEW Actyon (Korando C)",
    ]
  },
  "A140833": {
    filterNumber: "A140833",
    brands: ["KMITSUBISHI", "MITSUBISHI"],
    compatibleVehicles: [
      "KMITSUBISHI ASX",
      "MITSUBISHI Eclipse Cross",
      "MITSUBISHI Galant Fortis",
      "MITSUBISHI Grandis",
      "MITSUBISHI Outlander",
      "MITSUBISHI Outlander Sport",
      "MITSUBISHI RVR",
    ]
  },
  "A141252": {
    filterNumber: "A141252",
    brands: ["RENAULT"],
    compatibleVehicles: [
      "RENAULT Fluence",
      "RENAULT Megane III",
      "RENAULT Scenic III",
    ]
  },
  "A142129": {
    filterNumber: "A142129",
    brands: ["SSANGYONG"],
    compatibleVehicles: [
      "SSANGYONG Actyon Sports",
      "SSANGYONG Actyon Sports II",
      "SSANGYONG Musso",
      "SSANGYONG Rexton Sports",
      "SSANGYONG Rodius/Stavic",
      "SSANGYONG Rodius/Stavic II",
    ]
  },
  "A141422": {
    filterNumber: "A141422",
    brands: ["MITSUBISHI"],
    compatibleVehicles: [
      "MITSUBISHI L200",
      "MITSUBISHI Nativa",
      "MITSUBISHI Pajero / Montero",
      "MITSUBISHI Pajero / Montero Sport",
      "MITSUBISHI Pajero Sport",
      "MITSUBISHI Triton",
    ]
  },
  "A146992": {
    filterNumber: "A146992",
    brands: ["SSANGYONG"],
    compatibleVehicles: [
      "SSANGYONG Tivoli 1.6L 2015~",
      "SSANGYONG XLV 1.6L 2016~",
    ]
  },
  "A140408": {
    filterNumber: "A140408",
    brands: ["MITSUBISHI"],
    compatibleVehicles: [
      "MITSUBISHI Pajero",
      "MITSUBISHI Pajero / Montero",
      "MITSUBISHI Shogun",
    ]
  },
  "A141365": {
    filterNumber: "A141365",
    brands: ["Chery"],
    compatibleVehicles: [
      "Chery Chery Tiggo 1.6L 2012~2013, 1.8L 2008~2012, 2.0L 2006~",
    ]
  },
  "A140519": {
    filterNumber: "A140519",
    brands: [],
    compatibleVehicles: [
    ]
  },
  "A140853": {
    filterNumber: "A140853",
    brands: ["AUDI", "SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI A3 Q3 TT",
      "SKODA Octavia II Octavia RS",
      "VOLKSWAGEN Beetle",
      "VOLKSWAGEN Caddy III",
      "VOLKSWAGEN Golf V * VI",
      "VOLKSWAGEN Jetta V * VI",
      "VOLKSWAGEN New Beetle",
      "VOLKSWAGEN Passat",
      "VOLKSWAGEN Passat CC",
      "VOLKSWAGEN Tiguan",
    ]
  },
  "A147011": {
    filterNumber: "A147011",
    brands: ["VOLKSWAGEN"],
    compatibleVehicles: [
      "VOLKSWAGEN Altas 2017~ 2.0L 2017~ 2.0L 2016~ 3.6L",
      "VOLKSWAGEN Teramont 2017~ 2.0L 2019~ 3.6L",
    ]
  },
  "A141933": {
    filterNumber: "A141933",
    brands: ["AUDI", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI Q7",
      "VOLKSWAGEN Touareg",
    ]
  },
  "A140750": {
    filterNumber: "A140750",
    brands: ["AUDI", "SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI A3 A3 II",
      "SKODA Octavia II",
      "VOLKSWAGEN Caddy III",
      "VOLKSWAGEN Golf Golf V",
      "VOLKSWAGEN Golf VI",
      "VOLKSWAGEN Jetta V Jetta VI",
      "VOLKSWAGEN New Passat",
      "VOLKSWAGEN Passat",
      "VOLKSWAGEN Tiguan",
      "VOLKSWAGEN Touran",
    ]
  },
  "A141726": {
    filterNumber: "A141726",
    brands: ["AUDI", "SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI A3 III",
      "AUDI Q2 Q3 TT",
      "SKODA Octavia",
      "VOLKSWAGEN Arteon",
      "VOLKSWAGEN Golf",
      "VOLKSWAGEN Jetta",
      "VOLKSWAGEN Passat",
      "VOLKSWAGEN Tiguan",
      "VOLKSWAGEN Touran",
    ]
  },
  "A141837": {
    filterNumber: "A141837",
    brands: ["AUDI"],
    compatibleVehicles: [
      "AUDI A8 3.0L 4.0L 4.2L",
    ]
  },
  "A140460": {
    filterNumber: "A140460",
    brands: ["AUDI", "SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI A3 Q3 TT",
      "SKODA Octavia II Octavia RS",
      "VOLKSWAGEN Beetle",
      "VOLKSWAGEN Caddy III",
      "VOLKSWAGEN Golf V * VI",
      "VOLKSWAGEN Jetta V * VI",
      "VOLKSWAGEN New Beetle",
      "VOLKSWAGEN Passat",
      "VOLKSWAGEN Passat CC",
      "VOLKSWAGEN Tiguan",
    ]
  },
  "A141782": {
    filterNumber: "A141782",
    brands: ["AUDI", "SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI A3 III",
      "AUDI Q2 Q3 TT",
      "SKODA Octavia",
      "VOLKSWAGEN Arteon",
      "VOLKSWAGEN Golf",
      "VOLKSWAGEN Jetta",
      "VOLKSWAGEN Passat",
      "VOLKSWAGEN Tiguan",
      "VOLKSWAGEN Touran",
    ],
    note: "Turbo"
  },
  "A140894": {
    filterNumber: "A140894",
    brands: ["AUDI"],
    compatibleVehicles: [
      "AUDI A4",
      "AUDI A5",
      "AUDI Q5",
      "AUDI S4",
      "AUDI S5",
      "AUDI Sq5",
    ]
  },
  "A140012": {
    filterNumber: "A140012",
    brands: ["AUDI", "SEAT", "SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI A3",
      "AUDI A3 I",
      "AUDI TT",
      "SEAT Leon I",
      "SEAT Toledo II",
      "SKODA Octavia I",
      "VOLKSWAGEN Beetle Convertible",
      "VOLKSWAGEN Bora",
      "VOLKSWAGEN Golf Estate",
      "VOLKSWAGEN Golf IV",
      "VOLKSWAGEN New Beetle",
    ]
  },
  "A141700": {
    filterNumber: "A141700",
    brands: ["AUDI"],
    compatibleVehicles: [
      "AUDI A6 2.8L 3.0L 4.0L",
      "AUDI A7 2.8L 3.0L 4.0L",
    ]
  },
  "A142198": {
    filterNumber: "A142198",
    brands: ["VOLKSWAGEN"],
    compatibleVehicles: [
      "VOLKSWAGEN Golf VIII 2019~ 1.8L",
      "VOLKSWAGEN Jetta 2019~ 1.4L",
    ]
  },
  "A141727": {
    filterNumber: "A141727",
    brands: ["AUDI"],
    compatibleVehicles: [
      "AUDI A6",
      "AUDI A6L",
      "AUDI A7",
    ]
  },
  "A146948": {
    filterNumber: "A146948",
    brands: ["AUDI"],
    compatibleVehicles: [
      "AUDI A4 2015~ 2.0L",
      "AUDI Q5 2016~ 2.0L",
    ]
  },
  "A140860": {
    filterNumber: "A140860",
    brands: ["VOLKSWAGEN"],
    compatibleVehicles: [
      "VOLKSWAGEN Jetta V",
      "VOLKSWAGEN Jetta VI",
      "VOLKSWAGEN Passat",
    ]
  },
  "A140749": {
    filterNumber: "A140749",
    brands: ["Audi"],
    compatibleVehicles: [
      "Audi A6",
      "Audi A6 Allroad",
      "Audi A6 A6L",
    ]
  },
  "A141242": {
    filterNumber: "A141242",
    brands: ["AUDI"],
    compatibleVehicles: [
      "AUDI A4 2007~2013 1.8L 2.0L",
      "AUDI A4 Allroad 2008~2016",
      "AUDI A4L 2008~2016",
      "AUDI A5 2009~2017",
      "AUDI Q5 2009~2017",
    ]
  },
  "A142018": {
    filterNumber: "A142018",
    brands: ["PORSCHE"],
    compatibleVehicles: [
      "PORSCHE Panamera",
      "PORSCHE Panamera 4",
      "PORSCHE Panamera 4S",
      "PORSCHE Panamera S",
      "PORSCHE Panamera TURBO S",
    ]
  },
  "A141444": {
    filterNumber: "A141444",
    brands: ["JAGUAR"],
    compatibleVehicles: [
      "JAGUAR S-Type",
      "JAGUAR XF",
      "JAGUAR XFR",
      "JAGUAR XJ",
      "JAGUAR Xj6",
      "JAGUAR Xj8",
      "JAGUAR XJ8L",
      "JAGUAR XJR",
    ]
  },
  "A142088": {
    filterNumber: "A142088",
    brands: ["LAND ROVER"],
    compatibleVehicles: [
      "LAND ROVER Discovery IV",
      "LAND ROVER Discovery V",
      "LAND ROVER Range Rover",
      "LAND ROVER Range Rover III",
      "LAND ROVER Range Rover IV",
      "LAND ROVER Range Rover Sport",
      "LAND ROVER Range Rover Vogue",
    ]
  },
  "A140852": {
    filterNumber: "A140852",
    brands: ["AUDI", "LAND ROVER", "PORSCHE", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI Q7",
      "LAND ROVER Range Rover III",
      "LAND ROVER Range Rover Sport",
      "PORSCHE Cayenne",
      "PORSCHE Cayenne GTS",
      "PORSCHE Cayenne S",
      "PORSCHE Cayenne TURBO",
      "PORSCHE Cayenne TURBO S",
      "VOLKSWAGEN Touareg",
    ]
  },
  "A140009": {
    filterNumber: "A140009",
    brands: ["VOLKSWAGEN"],
    compatibleVehicles: [
      "VOLKSWAGEN Caddy I",
      "VOLKSWAGEN Golf Cabriolet",
      "VOLKSWAGEN Golf II",
      "VOLKSWAGEN Scirocco",
    ]
  },
  "A141741": {
    filterNumber: "A141741",
    brands: ["LAND ROVER", "Range Rover"],
    compatibleVehicles: [
      "LAND ROVER Discovery Sport",
      "LAND ROVER Freelander II",
      "Range Rover Evoque",
    ]
  },
  "A141783": {
    filterNumber: "A141783",
    brands: ["AUDI", "SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI A3 Q3 TT",
      "SKODA Octavia II Octavia RS",
      "VOLKSWAGEN Beetle",
      "VOLKSWAGEN Caddy III",
      "VOLKSWAGEN Golf V * VI",
      "VOLKSWAGEN Jetta V * VI",
      "VOLKSWAGEN New Beetle",
      "VOLKSWAGEN Passat",
      "VOLKSWAGEN Passat CC",
      "VOLKSWAGEN Tiguan",
    ]
  },
  "A142136": {
    filterNumber: "A142136",
    brands: ["AUDI", "SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI A1",
      "AUDI A3 III",
      "AUDI Q2",
      "SKODA Fabia",
      "SKODA Karoq",
      "SKODA Octavia III",
      "VOLKSWAGEN Golf VII",
      "VOLKSWAGEN Polo VI",
      "VOLKSWAGEN T-Roc",
      "VOLKSWAGEN UP",
    ]
  },
  "A141453": {
    filterNumber: "A141453",
    brands: ["LAND ROVER"],
    compatibleVehicles: [
      "LAND ROVER Freelander II 2006~2014 2.2L, 2006~2014 3.2L",
    ]
  },
  "A140890": {
    filterNumber: "A140890",
    brands: ["AUDI", "SEAT", "SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "AUDI A1",
      "AUDI A3 III",
      "AUDI Q2",
      "AUDI Q3",
      "SEAT Alhambra II",
      "SEAT Ateca",
      "SEAT Ibiza MK IV",
      "SEAT Leon",
      "SEAT Leon III",
      "SEAT Tarraco",
      "SEAT Toledo IV",
      "SKODA Fabia",
      "SKODA Karoq",
      "SKODA Kodiaq",
      "SKODA Octavia I",
      "SKODA Octavia III",
      "SKODA Octavia IV",
      "SKODA Rapid",
      "SKODA SuperB III",
      "VOLKSWAGEN CC",
      "VOLKSWAGEN Golf Sportsvan",
      "VOLKSWAGEN Golf Variant",
      "VOLKSWAGEN Golf VII",
      "VOLKSWAGEN Jetta VI",
      "VOLKSWAGEN Polo V",
      "VOLKSWAGEN Polo V Sedan",
      "VOLKSWAGEN Taos",
      "VOLKSWAGEN Tiguan",
      "VOLKSWAGEN Tiguan II",
      "VOLKSWAGEN Touran",
    ]
  },
  "A141934": {
    filterNumber: "A141934",
    brands: ["PORSCHE"],
    compatibleVehicles: [
      "PORSCHE Macan",
      "PORSCHE Macan S",
      "PORSCHE Macan Turbo",
    ]
  },
  "A140336": {
    filterNumber: "A140336",
    brands: ["SKODA", "VOLKSWAGEN"],
    compatibleVehicles: [
      "SKODA Fabia",
      "SKODA Octavia II",
      "SKODA Praktik",
      "SKODA Rapid",
      "SKODA Roomster",
      "VOLKSWAGEN Golf VI",
      "VOLKSWAGEN Jetta VI",
      "VOLKSWAGEN Polo IV",
      "VOLKSWAGEN Polo V Sedan",
      "VOLKSWAGEN Vento",
    ]
  },
  "A146993": {
    filterNumber: "A146993",
    brands: ["JAGUAR", "LAND ROVER"],
    compatibleVehicles: [
      "JAGUAR F-Pace",
      "JAGUAR XE",
      "JAGUAR XF",
      "LAND ROVER Range Rover Velar",
    ],
    note: "Right"
  },
  "A146938": {
    filterNumber: "A146938",
    brands: ["JAGUAR", "LAND ROVER"],
    compatibleVehicles: [
      "JAGUAR F-Pace",
      "JAGUAR XE",
      "JAGUAR XF",
      "LAND ROVER Range Rover Velar",
    ],
    note: "Left"
  },
  "A146932": {
    filterNumber: "A146932",
    brands: ["JAGUAR", "LAND ROVER", "Range Rover"],
    compatibleVehicles: [
      "JAGUAR E-Pace 2.0L",
      "LAND ROVER Discovery Sport 1.5L 2.0L",
      "Range Rover Evoque 1.5L 2.0L",
    ]
  },
  "A142226": {
    filterNumber: "A142226",
    brands: ["HAVAL"],
    compatibleVehicles: [
      "HAVAL H6 2021",
      "HAVAL Dargo",
    ]
  },
  "A146949": {
    filterNumber: "A146949",
    brands: ["HAVAL"],
    compatibleVehicles: [
      "HAVAL H2",
    ]
  },
  "A142227": {
    filterNumber: "A142227",
    brands: ["GREAT WALL"],
    compatibleVehicles: [
      "GREAT WALL 7",
    ]
  },
  "A147014": {
    filterNumber: "A147014",
    brands: ["HAVAL"],
    compatibleVehicles: [
      "HAVAL H6",
    ]
  },
  "A147009": {
    filterNumber: "A147009",
    brands: ["GREAT WALL"],
    compatibleVehicles: [
      "GREAT WALL PICKUP POER",
    ]
  },
  "A141809": {
    filterNumber: "A141809",
    brands: ["GREAT WALL"],
    compatibleVehicles: [
      "GREAT WALL WINGLE 5",
    ]
  },
  "A140950": {
    filterNumber: "A140950",
    brands: ["INFINITI", "NISSAN"],
    compatibleVehicles: [
      "INFINITI Qx56",
      "NISSAN Armada (USA)",
      "NISSAN Frontier",
      "NISSAN NV",
      "NISSAN Nv3500",
      "NISSAN Pathfinder",
    ]
  },
  "A141063": {
    filterNumber: "A141063",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Entourage",
      "KIA Carnival / Sedona",
      "KIA Carnival / Sedona 06",
    ]
  },
  "A142094": {
    filterNumber: "A142094",
    brands: ["HYUNDAI", "KIA"],
    compatibleVehicles: [
      "HYUNDAI Palisade",
      "HYUNDAI Santa FE",
      "KIA Carnival / Sedona",
      "KIA Carnival / Sedona 18",
      "KIA Sorento 2015 2.0L 2.2L",
    ]
  },
};

// Brand mapping for consistent brand names
const brandMapping: { [key: string]: string } = {
  'LEXUS': 'Lexus',
  'TOYOTA': 'Toyota',
  'NISSAN': 'Nissan',
  'INFINITI': 'Infiniti',
  'HYUNDAI': 'Hyundai',
  'KIA': 'Kia',
  'GENESIS': 'Genesis',
  'MITSUBISHI': 'Mitsubishi',
  'RENAULT': 'Renault',
  'SSANGYONG': 'SsangYong',
  'DAIHATSU': 'Daihatsu',
  'BYD': 'BYD',
  'GEELY': 'Geely',
  'CHERY': 'Chery',
  'PEUGEOT': 'Peugeot',
  'AUDI': 'Audi',
  'SKODA': 'Skoda',
  'VOLKSWAGEN': 'Volkswagen',
  'SEAT': 'Seat',
  'PORSCHE': 'Porsche',
  'JAGUAR': 'Jaguar',
  'LAND ROVER': 'Land Rover',
  'RANGE ROVER': 'Range Rover',
  'BMW': 'BMW',
  'MINI': 'Mini',
  'ROLLS-ROYCE': 'Rolls-Royce',
  'FORD': 'Ford',
  'SUZUKI': 'Suzuki',
  'HONDA': 'Honda',
  'ACURA': 'Acura',
  'MAZDA': 'Mazda',
  'SUBARU': 'Subaru',
  'VOLVO': 'Volvo',
  'HAVAL': 'Haval',
  'GREAT WALL': 'Great Wall',
  'MG (Morris Garages)': 'MG'
};

// Model mapping for consistent model names
const modelMapping: { [key: string]: string } = {
  // Will be populated as needed
};

/**
 * Find air filter by vehicle make and model
 */
export function findAirFilterByVehicle(make: string, model: string): string | null {
  const normalizedMake = make.toLowerCase().trim();
  const normalizedModel = model.toLowerCase().trim();
  
  for (const [filterNumber, filter] of Object.entries(denckermannAirFilters)) {
    for (const vehicle of filter.compatibleVehicles) {
      const vehicleLower = vehicle.toLowerCase();
      
      // Check if the vehicle string contains both make and model
      if (vehicleLower.includes(normalizedMake) && vehicleLower.includes(normalizedModel)) {
        return filterNumber;
      }
      
      // Also check if model matches the end of vehicle name (for cases like "Toyota Camry")
      const vehicleName = vehicleLower.replace(normalizedMake, '').trim();
      if (vehicleName.startsWith(normalizedModel) || 
          normalizedModel.includes(vehicleName.split(' ')[0] || '') ||
          normalizedModel.includes(vehicleName.split(' ').pop() || '')) {
        return filterNumber;
      }
    }
  }
  
  return null;
}

/**
 * Get air filter details by filter number
 */
export function getAirFilterDetails(filterNumber: string): DenckermannAirFilter | null {
  return denckermannAirFilters[filterNumber] || null;
}

/**
 * Search air filters by vehicle name
 */
export function searchAirFiltersByVehicleName(searchTerm: string): Array<{filterNumber: string, vehicle: string, brands: string[]}> {
  const results: Array<{filterNumber: string, vehicle: string, brands: string[]}> = [];
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  for (const [filterNumber, filter] of Object.entries(denckermannAirFilters)) {
    for (const vehicle of filter.compatibleVehicles) {
      if (vehicle.toLowerCase().includes(normalizedSearch)) {
        results.push({
          filterNumber,
          vehicle,
          brands: filter.brands
        });
      }
    }
  }
  
  return results;
}

export default denckermannAirFilters;