// Air Filter Database - Denckermann Official Specifications
export interface AirFilterSpec {
  partNumber: string
  applicableVehicles: {
    brand: string
    models: string[]
  }[]
}

export interface AirFilterDatabase {
  [partNumber: string]: AirFilterSpec
}

export const airFilters: AirFilterDatabase = {
  // Toyota & Lexus Air Filters
  "A140819": {
    partNumber: "A140819",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["ES350 2007~2012"]
      },
      {
        brand: "Toyota",
        models: ["Alphard", "Avalon 2007~2012", "Camry 3.5L 06~13", "Camry/Aurion", "RAV 4 2006~2012"]
      }
    ]
  },
  "A141632": {
    partNumber: "A141632",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["ES350 2012~2018 3.5L", "NX200T", "RX200T", "RX270", "RX350", "RX450H"]
      },
      {
        brand: "Toyota",
        models: ["Avalon 2012~ 3.5L", "Camry 2011~2018 3.5L", "Harrier 2017~"]
      },
      {
        brand: "Jeep",
        models: ["COMPASS 2018-2021", "RENEGADE 2015-2021"]
      },
      {
        brand: "Ram",
        models: ["PROMASTER CITY 2015-2021"]
      }
    ]
  },
  "A140316": {
    partNumber: "A140316",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Fortuner 2.7L 3.0L 4.0L", "Hilux 2.7L 3.0L"]
      }
    ]
  },
  "A140796": {
    partNumber: "A140796",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["4 Runner V6", "FJ Cruiser V6", "Fortuner V6", "Hilux V6", "Land Cruiser 4.0L V6", "Prado 120 V6", "Tacoma (USA) V6", "Tundra V6"]
      }
    ]
  },
  "A140826": {
    partNumber: "A140826",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["LX460 4.6L", "LX570 5.7L"]
      },
      {
        brand: "Toyota",
        models: ["Land Cruiser 200 4.6L 4.7L 5.7L", "Sequoia (USA)", "Tundra 4.0L"]
      }
    ]
  },
  "A146922": {
    partNumber: "A146922",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Fortuner 2015~ 2.7L, 2.8L, 3.0L, 4.0L", "Hilux 2015~ 2.7L, 2.8L, 3.0L, 4.0L"]
      }
    ]
  },
  "A146953": {
    partNumber: "A146953",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["NX250", "NX350"]
      },
      {
        brand: "Toyota",
        models: ["Avalon", "Camry", "Harrier", "Highlander", "RAV 4", "Yaris"]
      }
    ]
  },
  "A140793": {
    partNumber: "A140793",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["ES300H", "UX200"]
      },
      {
        brand: "Toyota",
        models: ["86", "Avalon/Auris", "C-HR", "Camry", "Corolla", "Highlander", "RAV 4", "Venza"]
      }
    ]
  },
  "A140817": {
    partNumber: "A140817",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["GX470", "LX470"]
      },
      {
        brand: "Toyota",
        models: ["4 Runner", "FJ Cruiser", "Prado 120", "Prado 150", "Sequoia (USA)", "Tundra"]
      }
    ]
  },
  "A140818": {
    partNumber: "A140818",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["NX200", "RC350"]
      },
      {
        brand: "Toyota",
        models: ["Avensis", "Corolla", "Corolla Altis", "Corolla Axio/Fielder", "Corolla Rumion", "Yaris", "Yaris (USA)"]
      }
    ]
  },
  "A140828": {
    partNumber: "A140828",
    applicableVehicles: [
      {
        brand: "Daihatsu",
        models: ["Altis"]
      },
      {
        brand: "Lexus",
        models: ["ES240", "ES250"]
      },
      {
        brand: "Toyota",
        models: ["Camry", "Camry/Aurion", "Venza"]
      }
    ]
  },
  "A146906": {
    partNumber: "A146906",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["LS600H", "ES200", "ES300H", "HS250H", "LS460"]
      },
      {
        brand: "Toyota",
        models: ["Avalon", "Camry", "RAV 4"]
      }
    ]
  },
  "A141781": {
    partNumber: "A141781",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["GX460 4.6L"]
      },
      {
        brand: "Toyota",
        models: ["4 Runner 4.0L", "FJ Cruiser 4.0L", "Prado 150 4.0L"]
      }
    ]
  },
  "AF12377": {
    partNumber: "AF12377",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Avanza 2018~", "Rush 2018~", "Vios 2018~", "Yaris 2018~"]
      },
      {
        brand: "Daihatsu",
        models: ["Terios 2018~"]
      },
      {
        brand: "Mitsubishi",
        models: ["Attrage 2018~", "Mirage 2018~"]
      }
    ]
  },
  "A146934": {
    partNumber: "A146934",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["GS300"]
      },
      {
        brand: "Toyota",
        models: ["Crown", "Crown Comfort", "Crown Majesta", "Lexus GS (Aristo)", "Mark II"]
      }
    ]
  },
  "A140273": {
    partNumber: "A140273",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["GS200T", "GS250", "GS350", "GS450H", "IS200T", "IS250", "IS300H", "IS350", "RC350"]
      },
      {
        brand: "Toyota",
        models: ["Crown", "Crown Athlete", "Crown Majesta", "Crown Royal Saloon", "RAV 4 2.2L"]
      }
    ]
  },
  "A140380": {
    partNumber: "A140380",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Hiace", "Hiace Commuter", "Hiace Regius", "Hiace Van"]
      }
    ]
  },
  "A142188": {
    partNumber: "A142188",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["GranAce", "Hiace 2019~"]
      }
    ]
  },
  "A146952": {
    partNumber: "A146952",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Land Cruiser 300 3.3L 2021~"]
      }
    ]
  },
  "A140087": {
    partNumber: "A140087",
    applicableVehicles: [
      {
        brand: "BYD",
        models: ["F3"]
      },
      {
        brand: "Geely",
        models: ["Emgrand"]
      },
      {
        brand: "Lexus",
        models: ["RX300", "RX450H"]
      },
      {
        brand: "Toyota",
        models: ["Corolla 2000~2007", "Avensis", "Wish", "Land Cruiser 300 3.5L"]
      }
    ]
  },
  "A140907": {
    partNumber: "A140907",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["C-HR", "Corolla", "Corolla Axio", "Corolla Cross", "Corolla Fielder", "Corolla Spacio", "Prius", "Yaris", "Yaris/Hybrid"]
      }
    ]
  },
  "A140815": {
    partNumber: "A140815",
    applicableVehicles: [
      {
        brand: "Lexus",
        models: ["GS350", "GS430", "IS250", "IS250/300", "IS250C", "IS300C", "IS350"]
      },
      {
        brand: "Toyota",
        models: ["Crown Athlete", "Lexus GS (Aristo)", "Lexus IS (Altezza)"]
      }
    ]
  },

  // Nissan & Infiniti Air Filters
  "A141171": {
    partNumber: "A141171",
    applicableVehicles: [
      {
        brand: "Infiniti",
        models: ["Q50"]
      },
      {
        brand: "Nissan",
        models: ["Micra", "Note", "NV200 Van", "Qashqai", "Sunny", "Tiida", "Tiida Latio", "Tiida Sedan", "Versa"]
      }
    ]
  },
  "A141174": {
    partNumber: "A141174",
    applicableVehicles: [
      {
        brand: "Nissan",
        models: ["Altima 2006~2013", "Altima Coupe", "Altima Hybrid", "Murano"]
      }
    ]
  },
  "A141039": {
    partNumber: "A141039",
    applicableVehicles: [
      {
        brand: "Mitsubishi",
        models: ["Outlander 2.5L 2021~"]
      },
      {
        brand: "Nissan",
        models: ["Altima 2.5L 2019~", "Qashqai", "Rogue (USA)", "Rogue Sport", "X-Trail"]
      },
      {
        brand: "Renault",
        models: ["Kadjar", "Koleos"]
      }
    ]
  },
  "A147017": {
    partNumber: "A147017",
    applicableVehicles: [
      {
        brand: "Nissan",
        models: ["Kicks 2016~", "Versa Sedan 2019~"]
      }
    ]
  },
  "A141797": {
    partNumber: "A141797",
    applicableVehicles: [
      {
        brand: "Nissan",
        models: ["Navara", "Navara NP300", "NP300 2014~", "NP300 Frontier", "Terra"]
      }
    ]
  },
  "A141825": {
    partNumber: "A141825",
    applicableVehicles: [
      {
        brand: "Nissan",
        models: ["Altima 2.5L 2013~2019", "Maxima 2.5L 2013~2019", "Teana 2.5L 2013~2019"]
      }
    ]
  },
  "A142139": {
    partNumber: "A142139",
    applicableVehicles: [
      {
        brand: "Nissan",
        models: ["Kicks 2016~", "Versa Sedan 2019~"]
      }
    ]
  },
  "A140056": {
    partNumber: "A140056",
    applicableVehicles: [
      {
        brand: "Infiniti",
        models: ["QX56", "QX80"]
      },
      {
        brand: "Nissan",
        models: ["Patrol"]
      }
    ]
  },
  "A140035": {
    partNumber: "A140035",
    applicableVehicles: [
      {
        brand: "Infiniti",
        models: ["FX35"]
      },
      {
        brand: "Nissan",
        models: ["350Z", "Maxima 1994~2021", "Murano", "Sentra", "Sunny", "X-Trail 2000~2007"]
      },
      {
        brand: "Suzuki",
        models: ["Swift", "Vitara"]
      }
    ]
  },
  "A140319": {
    partNumber: "A140319",
    applicableVehicles: [
      {
        brand: "Infiniti",
        models: ["FX35, FX37", "FX50, M37", "Q50, Q60", "Q70, QX70"]
      },
      {
        brand: "Nissan",
        models: ["Juke", "Rogue (USA)", "Sentra", "Sunny", "Tiida", "X-Trail"]
      }
    ]
  },
  "A142194": {
    partNumber: "A142194",
    applicableVehicles: [
      {
        brand: "Nissan",
        models: ["Sentra 2019", "Sylphy 2019"]
      }
    ]
  },
  "A140251": {
    partNumber: "A140251",
    applicableVehicles: [
      {
        brand: "Infiniti",
        models: ["QX56"]
      },
      {
        brand: "Nissan",
        models: ["NV350 2012~", "NV350 Caravan", "NV350 Urvan", "Urvan 2012~", "Caravan", "Armada (USA)", "Frontier", "NV", "NV3500", "Pathfinder", "Titan (USA)", "Xterra"]
      }
    ]
  },
  "A146909": {
    partNumber: "A146909",
    applicableVehicles: [
      {
        brand: "Infiniti",
        models: ["EX35", "EX37", "G25", "G35", "G37", "M37", "QX50 I"]
      },
      {
        brand: "Nissan",
        models: ["350Z", "Fairlady Z", "Skyline"]
      }
    ]
  },
  "A142222": {
    partNumber: "A142222",
    applicableVehicles: [
      {
        brand: "Nissan",
        models: ["Qashqai 2021~ 1.3L", "Rogue (USA) 2021~ 1.5L, 2020~ 2.5L"]
      },
      {
        brand: "Renault",
        models: ["Austral 2022~ 1.3L"]
      }
    ]
  },

  // Hyundai & Kia Air Filters
  "A141685": {
    partNumber: "A141685",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Grandeur IG", "Sonata 2014~"]
      },
      {
        brand: "Kia",
        models: ["K5", "Optima", "Optima (USA)"]
      }
    ]
  },
  "A141641": {
    partNumber: "A141641",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Tucson 2015~"]
      },
      {
        brand: "Kia",
        models: ["Sportage 2015~"]
      }
    ]
  },
  "A146915": {
    partNumber: "A146915",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Palisade 2018~", "Santa FE 2018~"]
      },
      {
        brand: "Kia",
        models: ["Carnival/Sedona 2014~", "Carnival/Sedona 2018~", "Sorento (USA) 2014~", "Sorento 2014~"]
      }
    ]
  },

  // More brands would continue here...
  // This is a sample showing the structure for the most common filters
}

// Helper function to find air filter for a vehicle
export function findAirFilter(brand: string, model: string): string | null {
  const normalizedBrand = brand.toLowerCase()
  const normalizedModel = model.toLowerCase()
  
  for (const [partNumber, filterSpec] of Object.entries(airFilters)) {
    for (const vehicle of filterSpec.applicableVehicles) {
      if (vehicle.brand.toLowerCase() === normalizedBrand) {
        for (const vehicleModel of vehicle.models) {
          if (vehicleModel.toLowerCase().includes(normalizedModel) || 
              normalizedModel.includes(vehicleModel.toLowerCase())) {
            return partNumber
          }
        }
      }
    }
  }
  
  return null
}

// Helper function to get all compatible vehicles for an air filter
export function getAirFilterCompatibleVehicles(partNumber: string): string[] {
  const filter = airFilters[partNumber]
  if (!filter) return []
  
  const vehicles: string[] = []
  for (const vehicle of filter.applicableVehicles) {
    for (const model of vehicle.models) {
      vehicles.push(`${vehicle.brand} ${model}`)
    }
  }
  
  return vehicles
}

export default airFilters