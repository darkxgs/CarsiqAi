// Oil Filter Database - Denckermann Official Specifications
export interface OilFilterSpec {
  partNumber: string
  applicableVehicles: {
    brand: string
    models: string[]
  }[]
}

export interface OilFilterDatabase {
  [partNumber: string]: OilFilterSpec
}

export const oilFilters: OilFilterDatabase = {
  "A210032": {
    partNumber: "A210032",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["C-HR", "Camry", "Corolla", "Prius", "RAV 4", "Rush", "Yaris", "Yaris (USA)"]
      }
    ]
  },
  "A210379": {
    partNumber: "A210379",
    applicableVehicles: [
      {
        brand: "Toyota", 
        models: ["C-HR", "Camry", "Corolla", "Prius", "RAV 4", "Rush", "Yaris", "Yaris (USA)"]
      }
    ]
  },
  "A210052": {
    partNumber: "A210052",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Hiace", "Hilux", "Coaster", "Crown", "Dyna", "FJ Cruiser", "Fortuner", "Granvia"]
      }
    ]
  },
  "A210119": {
    partNumber: "A210119",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Crown", "Crown Majesta", "FJ Cruiser V6", "Fortuner V6", "Land Cruiser V6 200", "Land Cruiser Prado V6 120", "Sequoia (USA)"]
      }
    ]
  },
  "A210004": {
    partNumber: "A210004",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Coaster", "Cresta", "Crown", "Dyna", "Dyna 150", "Dyna 200", "Hilux"]
      }
    ]
  },
  "A210374": {
    partNumber: "A210374",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Land Cruiser V6 200"]
      }
    ]
  },
  "A210060": {
    partNumber: "A210060",
    applicableVehicles: [
      {
        brand: "Toyota",
        models: ["Sequoia (USA)"]
      }
    ]
  },
  // Ford Filters
  "A210159": {
    partNumber: "A210159",
    applicableVehicles: [
      {
        brand: "Ford",
        models: ["Scorpio", "Sierra Sapphire", "Excursion", "F-250 Super Duty", "F-350 Super Duty", "F-450 Super Duty", "F-550 Super Duty", "F-650 (2004-2008)", "F-750", "Expedition", "Explorer", "F-150", "Mustang", "Taurus V"]
      },
      {
        brand: "Suzuki",
        models: ["Grand Vitara"]
      }
    ]
  },
  "A210014": {
    partNumber: "A210014",
    applicableVehicles: [
      {
        brand: "Ford",
        models: ["Edge", "Flex", "Transit", "Expedition", "Explorer", "F-150", "Mustang", "Taurus V"]
      }
    ]
  },
  "A210094": {
    partNumber: "A210094",
    applicableVehicles: [
      {
        brand: "Ford",
        models: ["Escort", "Fiesta", "Focus", "Fusion", "Mondeo", "Escape"]
      }
    ]
  },
  "A210723": {
    partNumber: "A210723",
    applicableVehicles: [
      {
        brand: "Ford",
        models: ["Ranger"]
      },
      {
        brand: "Audi",
        models: ["A3"]
      },
      {
        brand: "Volkswagen", 
        models: ["Golf"]
      },
      {
        brand: "Skoda",
        models: ["Octavia"]
      },
      {
        brand: "Porsche",
        models: ["Macan"]
      }
    ]
  },
  "A210414": {
    partNumber: "A210414",
    applicableVehicles: [
      {
        brand: "Ford",
        models: ["EcoSport"]
      }
    ]
  },
  // Land Rover Filters
  "A210718": {
    partNumber: "A210718",
    applicableVehicles: [
      {
        brand: "Land Rover",
        models: ["Discovery III", "Range Rover III", "Range Rover Sport"]
      },
      {
        brand: "Jaguar",
        models: ["XJ", "Xj12", "Xj6"]
      }
    ]
  },
  "A210937": {
    partNumber: "A210937",
    applicableVehicles: [
      {
        brand: "Land Rover",
        models: ["Discovery IV", "Range Rover IV", "Range Rover Velar"]
      },
      {
        brand: "Jaguar",
        models: ["F-Pace", "F-Type", "XE", "XF"]
      }
    ]
  },
  "A211036": {
    partNumber: "A211036",
    applicableVehicles: [
      {
        brand: "Land Rover",
        models: ["Defender Station Wagon", "Range Rover Evoque"]
      },
      {
        brand: "Jaguar",
        models: ["E-Pace", "F-Pace", "XE", "XF"]
      }
    ]
  },
  "A211056": {
    partNumber: "A211056",
    applicableVehicles: [
      {
        brand: "Land Rover",
        models: ["Defender Station Wagon"]
      }
    ]
  },
  "A210559": {
    partNumber: "A210559",
    applicableVehicles: [
      {
        brand: "Land Rover",
        models: ["Freelander 2 (L359) Police"]
      }
    ]
  },
  "A210721PL": {
    partNumber: "A210721PL",
    applicableVehicles: [
      {
        brand: "Land Rover",
        models: ["Freelander"]
      },
      {
        brand: "Chevrolet",
        models: ["Aveo (T300)", "Cruze", "Optra", "Orlando", "Sonic", "Trax", "Camaro"]
      }
    ]
  },
  // BMW Filters
  "A210738": {
    partNumber: "A210738",
    applicableVehicles: [
      {
        brand: "BMW",
        models: ["320i", "323i", "325i", "328i", "330i", "335i", "520i", "523i", "525i", "528i", "530i", "730i", "740i", "X3", "X5", "Z4"]
      }
    ]
  },
  "A210101": {
    partNumber: "A210101",
    applicableVehicles: [
      {
        brand: "BMW",
        models: ["M3", "M Coupe", "M Roadster"]
      }
    ]
  },
  "A210519": {
    partNumber: "A210519",
    applicableVehicles: [
      {
        brand: "BMW",
        models: ["316i", "318i"]
      }
    ]
  },
  "A210736": {
    partNumber: "A210736",
    applicableVehicles: [
      {
        brand: "BMW",
        models: ["320d", "325d", "330d", "530d", "730d"]
      }
    ]
  },
  // Suzuki Filters  
  "A211059": {
    partNumber: "A211059",
    applicableVehicles: [
      {
        brand: "Suzuki",
        models: ["Alto", "Alto Lapin", "Celerio", "Every", "Hustler", "Ignis", "Solio", "Spacia", "Swift V", "Wagon R"]
      }
    ]
  },
  // Hyundai Filters
  "A210931": {
    partNumber: "A210931",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Azera", "Grand Santa V6", "Palisade", "Santa FE"]
      },
      {
        brand: "Kia",
        models: ["Cadenza", "Carnival/Sedona", "K7", "Sorento V6 (USA)", "Sorento V6"]
      }
    ]
  },
  "A211067": {
    partNumber: "A211067",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Creta", "Elantra", "Santa FE", "Tucson", "Venue"]
      },
      {
        brand: "Kia",
        models: ["Sonet", "Sorento"]
      }
    ]
  },
  "A211070": {
    partNumber: "A211070",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Elantra 2.0L", "Tucson 2.0L", "Sonata 2.0L"]
      }
    ]
  },
  "A211089": {
    partNumber: "A211089",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Genesis G80", "Gv70", "Gv80", "Staria"]
      },
      {
        brand: "Kia",
        models: ["Carnival / Sedona", "Sorento"]
      }
    ]
  },
  "A210420": {
    partNumber: "A210420",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Azera", "Grandeur TG", "iX 55", "Santa Fe 06", "Sonata 04", "Veracruz"]
      },
      {
        brand: "Kia",
        models: ["Opirus", "Sorento"]
      }
    ]
  },
  "A210618": {
    partNumber: "A210618",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Genesis", "Veracruz"]
      },
      {
        brand: "Kia",
        models: ["K5", "K9", "K900", "Mohave", "Optima", "Sorento"]
      },
      {
        brand: "Lexus",
        models: ["Rx270", "RX330/350"]
      }
    ]
  },
  "A210616": {
    partNumber: "A210616",
    applicableVehicles: [
      {
        brand: "Hyundai",
        models: ["Genesis G80", "G90", "Palisade"]
      },
      {
        brand: "Kia", 
        models: ["Cadenza", "Carnival / Sedona (2018)"]
      },
      {
        brand: "Lexus",
        models: ["Rx270", "RX330/350"]
      }
    ]
  },
  // Mitsubishi Filters
  "A211066": {
    partNumber: "A211066",
    applicableVehicles: [
      {
        brand: "Mitsubishi",
        models: ["Challenger", "Chariot", "Delica", "L200", "L300", "L400", "Lancer", "Pajero"]
      }
    ]
  },
  // Mercedes-Benz Filters
  "A211037": {
    partNumber: "A211037",
    applicableVehicles: [
      {
        brand: "Mercedes-Benz",
        models: ["C 220d", "CLS 350/400", "E 200/220", "GLC 300d", "GLE 300", "S 350 (2016~)"]
      }
    ]
  },
  "A210963": {
    partNumber: "A210963",
    applicableVehicles: [
      {
        brand: "Mercedes-Benz",
        models: ["A-Class (A180 to A45 AMG)", "B-Class", "C-Class", "CLA", "E-Class", "GLA", "GLC", "SLK"]
      },
      {
        brand: "Audi",
        models: ["A4", "A5", "Q5"]
      },
      {
        brand: "Volkswagen",
        models: ["Passat", "Tiguan"]
      },
      {
        brand: "Skoda",
        models: ["Superb"]
      },
      {
        brand: "Porsche",
        models: ["Cayenne"]
      },
      {
        brand: "Volvo",
        models: ["S40", "S60", "S80", "V40", "XC60", "XC70", "XC90"]
      },
      {
        brand: "Mini",
        models: ["Mini Cooper", "Clubman", "Countryman"]
      }
    ]
  },
  "A210076": {
    partNumber: "A210076",
    applicableVehicles: [
      {
        brand: "Mercedes-Benz",
        models: ["C180", "C200", "CLK 200", "E200 Kompressor", "E250", "E350", "SLK 200", "SLK 250"]
      }
    ]
  },
  "A210977": {
    partNumber: "A210977",
    applicableVehicles: [
      {
        brand: "Mercedes-Benz",
        models: ["S-Class (S 250 to S 600)", "E-Class (E 200 to E 500)", "G-Class", "M-Class", "SL-Class", "CLK", "CLA", "CLS", "GLK", "GLA", "GL", "GLE", "X-Class", "R-Class"]
      }
    ]
  },
  // General Motors Filters
  "A211062": {
    partNumber: "A211062",
    applicableVehicles: [
      {
        brand: "Chevrolet",
        models: ["Aveo (T300)", "Cruze", "Malibu", "Optra", "Trax", "Tracker"]
      }
    ]
  },
  "A210050": {
    partNumber: "A210050",
    applicableVehicles: [
      {
        brand: "Chevrolet",
        models: ["Captiva", "Equinox", "Malibu", "Camaro", "Impala", "Silverado", "Spark", "Tahoe", "Traverse"]
      },
      {
        brand: "Opel",
        models: ["Astra", "Vectra", "Vectra C"]
      }
    ]
  },
  "A210191": {
    partNumber: "A210191",
    applicableVehicles: [
      {
        brand: "Chevrolet",
        models: ["Impala", "Silverado", "Tahoe", "Trail Blazer"]
      }
    ]
  },
  "A211033": {
    partNumber: "A211033",
    applicableVehicles: [
      {
        brand: "Opel",
        models: ["Astra H", "Agila (A)", "Combo-C", "Corsa", "Meriva"]
      }
    ]
  },
  // Nissan/Infiniti Filters
  "A210021": {
    partNumber: "A210021",
    applicableVehicles: [
      {
        brand: "Nissan",
        models: ["All Nissan models", "Patrol", "Pickup", "Truck"]
      },
      {
        brand: "Renault",
        models: ["Duster", "Fluence", "Koleos", "Megane", "Sandero", "Talisman"]
      },
      {
        brand: "Mazda",
        models: ["Mazda 3", "Mazda 6", "BT-50"]
      },
      {
        brand: "Subaru",
        models: ["Forester", "Impreza", "Outback"]
      },
      {
        brand: "Jeep",
        models: ["Grand Cherokee"]
      },
      {
        brand: "Dodge",
        models: ["Ram", "Charger", "Challenger"]
      },
      {
        brand: "Chrysler",
        models: ["300"]
      },
      {
        brand: "Daewoo",
        models: ["Lanos", "Nubira"]
      },
      {
        brand: "Chery",
        models: ["Tiggo", "Arrizo"]
      },
      {
        brand: "Peugeot",
        models: ["206", "207"]
      },
      {
        brand: "SsangYong",
        models: ["Rexton", "Korando"]
      }
    ]
  },
  "A210492": {
    partNumber: "A210492",
    applicableVehicles: [
      {
        brand: "Infiniti",
        models: ["FX30", "M37", "Q70", "QX70"]
      }
    ]
  }
}

// Helper function to find oil filter for a vehicle
export function findOilFilter(brand: string, model: string): string | null {
  const normalizedBrand = brand.toLowerCase()
  const normalizedModel = model.toLowerCase()
  
  for (const [partNumber, filterSpec] of Object.entries(oilFilters)) {
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

// Helper function to get all compatible vehicles for a filter
export function getFilterCompatibleVehicles(partNumber: string): string[] {
  const filter = oilFilters[partNumber]
  if (!filter) return []
  
  const vehicles: string[] = []
  for (const vehicle of filter.applicableVehicles) {
    for (const model of vehicle.models) {
      vehicles.push(`${vehicle.brand} ${model}`)
    }
  }
  
  return vehicles
}

export default oilFilters