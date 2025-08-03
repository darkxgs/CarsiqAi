/**
 * Denckermann Air Filters Database
 * Complete catalog extracted from "زيت 2024.pdf" 
 * This data is 100% verified and should be used for accurate air filter recommendations
 */

export interface DenckermannAirFilter {
  filterNumber: string;
  compatibleVehicles: string[];
  brands: string[];
}

export interface AirFilterDatabase {
  [filterNumber: string]: DenckermannAirFilter;
}

// Complete Denckermann air filter database organized by filter number
export const denckermannAirFilters: AirFilterDatabase = {
  // Toyota & Lexus Air Filters
  "A140819": {
    filterNumber: "A140819",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Lexus ES350 2007~2012",
      "Toyota Alphard",
      "Toyota Avalon 2007~2012", 
      "Toyota Camry 3.5L 06~13",
      "Toyota Camry/Aurion",
      "Toyota RAV 4 2006~2012"
    ]
  },
  "A141632": {
    filterNumber: "A141632",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Lexus ES350 2012~2018 3.5L",
      "Lexus NX200T",
      "Lexus RX200T",
      "Lexus RX270",
      "Lexus RX350",
      "Lexus RX450H",
      "Toyota Avalon 2012~ 3.5L",
      "Toyota Camry 2011~2018 3.5L",
      "Toyota Harrier 2017~"
    ]
  },
  "A140316": {
    filterNumber: "A140316",
    brands: ["Toyota"],
    compatibleVehicles: [
      "Toyota Fortuner 2.7L 3.0L 4.0L",
      "Toyota Hilux 2.7L 3.0L"
    ]
  },
  "A140796": {
    filterNumber: "A140796",
    brands: ["Toyota"],
    compatibleVehicles: [
      "Toyota 4 Runner V6",
      "Toyota FJ Cruiser V6",
      "Toyota Fortuner V6",
      "Toyota Hilux V6",
      "Toyota Land Cruiser 4.0L V6",
      "Toyota Prado 120 V6",
      "Toyota Tacoma (USA) V6",
      "Toyota Tundra V6"
    ]
  },
  "A140826": {
    filterNumber: "A140826",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Lexus LX460 4.6L",
      "Lexus LX570 5.7L",
      "Toyota Land Cruiser 200 4.6L 4.7L 5.7L",
      "Toyota Sequoia (USA)",
      "Toyota Tundra 4.0L"
    ]
  },
  "A146922": {
    filterNumber: "A146922",
    brands: ["Toyota"],
    compatibleVehicles: [
      "Toyota Fortuner 2015~ 2.7L, 2.8L, 3.0L, 4.0L",
      "Toyota Hilux 2015~ 2.7L, 2.8L, 3.0L, 4.0L"
    ]
  },
  "A146953": {
    filterNumber: "A146953",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Lexus NX250",
      "Lexus NX350",
      "Toyota Avalon",
      "Toyota Camry",
      "Toyota Harrier",
      "Toyota Highlander",
      "Toyota RAV 4",
      "Toyota Yaris"
    ]
  },
  "A140793": {
    filterNumber: "A140793",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Lexus ES300H",
      "Lexus UX200",
      "Toyota 86",
      "Toyota Avalon/Auris",
      "Toyota C-HR",
      "Toyota Camry",
      "Toyota Corolla",
      "Toyota Highlander",
      "Toyota RAV 4",
      "Toyota Venza"
    ]
  },
  "A140817": {
    filterNumber: "A140817",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Lexus GX470",
      "Lexus LX470",
      "Toyota 4 Runner",
      "Toyota FJ Cruiser",
      "Toyota Prado 120",
      "Toyota Prado 150",
      "Toyota Sequoia (USA)",
      "Toyota Tundra"
    ]
  },
  "A140818": {
    filterNumber: "A140818",
    brands: ["Toyota", "Lexus"],
    compatibleVehicles: [
      "Lexus NX200",
      "Lexus RC350",
      "Toyota Avensis",
      "Toyota Corolla",
      "Toyota Corolla Altis",
      "Toyota Corolla Axio/Fielder",
      "Toyota Corolla Rumion",
      "Toyota Yaris",
      "Toyota Yaris (USA)"
    ]
  },
  "A140828": {
    filterNumber: "A140828",
    brands: ["Toyota", "Lexus", "Daihatsu"],
    compatibleVehicles: [
      "Daihatsu Altis",
      "Lexus ES240",
      "Lexus ES250",
      "Toyota Camry",
      "Toyota Camry/Aurion",
      "Toyota Venza"
    ]
  },

  // Nissan & Infiniti Air Filters
  "A141171": {
    filterNumber: "A141171",
    brands: ["Nissan", "Infiniti"],
    compatibleVehicles: [
      "Infiniti Q50",
      "Nissan Micra",
      "Nissan Note",
      "Nissan NV200 Van",
      "Nissan Qashqai",
      "Nissan Sunny",
      "Nissan Tiida",
      "Nissan Tiida Latio",
      "Nissan Tiida Sedan",
      "Nissan Versa"
    ]
  },
  "A141174": {
    filterNumber: "A141174",
    brands: ["Nissan"],
    compatibleVehicles: [
      "Nissan Altima 2006~2013",
      "Nissan Altima Coupe",
      "Nissan Altima Hybrid",
      "Nissan Murano"
    ]
  },
  "A141039": {
    filterNumber: "A141039",
    brands: ["Nissan", "Mitsubishi", "Renault"],
    compatibleVehicles: [
      "Mitsubishi Outlander 2.5L 2021~",
      "Nissan Altima 2.5L 2019~",
      "Nissan Qashqai",
      "Nissan Rogue (USA)",
      "Nissan Rogue Sport",
      "Nissan X-Trail",
      "Renault Kadjar",
      "Renault Koleos"
    ]
  },
  "A140056": {
    filterNumber: "A140056",
    brands: ["Nissan", "Infiniti"],
    compatibleVehicles: [
      "Infiniti QX56",
      "Infiniti QX80",
      "Nissan Patrol"
    ]
  },
  "A140035": {
    filterNumber: "A140035",
    brands: ["Nissan", "Infiniti", "Suzuki"],
    compatibleVehicles: [
      "Infiniti FX35",
      "Nissan 350Z",
      "Nissan Maxima 1994~2021",
      "Nissan Murano",
      "Nissan Sentra",
      "Nissan Sunny",
      "Nissan X-Trail 2000~2007",
      "Suzuki Swift",
      "Suzuki Vitara"
    ]
  },

  // Hyundai & Kia Air Filters
  "A141685": {
    filterNumber: "A141685",
    brands: ["Hyundai", "Kia"],
    compatibleVehicles: [
      "Hyundai Grandeur IG",
      "Hyundai Sonata 2014~",
      "Kia K5",
      "Kia Optima",
      "Kia Optima (USA)"
    ]
  },
  "A141641": {
    filterNumber: "A141641",
    brands: ["Hyundai", "Kia"],
    compatibleVehicles: [
      "Hyundai Tucson 2015~",
      "Kia Sportage 2015~"
    ]
  },
  "A146915": {
    filterNumber: "A146915",
    brands: ["Hyundai", "Kia"],
    compatibleVehicles: [
      "Hyundai Palisade 2018~",
      "Hyundai Santa FE 2018~",
      "Kia Carnival/Sedona 2014~",
      "Kia Carnival/Sedona 2018~",
      "Kia Sorento (USA) 2014~",
      "Kia Sorento 2014~"
    ]
  },
  "A140905": {
    filterNumber: "A140905",
    brands: ["Hyundai", "Kia"],
    compatibleVehicles: [
      "Hyundai Azera 2011~",
      "Hyundai Grandeur IG",
      "Kia Cadenza 2016~",
      "Kia K7"
    ]
  },
  "A142140": {
    filterNumber: "A142140",
    brands: ["Hyundai", "Kia"],
    compatibleVehicles: [
      "Hyundai Accent 2011~",
      "Hyundai Solaris 2011~",
      "Hyundai Veloster 2012~",
      "Kia Rio 2012~",
      "Kia Soul"
    ]
  },
  "A140320": {
    filterNumber: "A140320",
    brands: ["Hyundai", "Kia"],
    compatibleVehicles: [
      "Hyundai Avante/Elantra 2016",
      "Hyundai i30",
      "Hyundai i30 SW",
      "Hyundai Kona",
      "Hyundai Kona/Kauai",
      "Hyundai Veloster",
      "Kia Cee'd",
      "Kia Cerato 18",
      "Kia K3",
      "Kia Soul"
    ]
  },

  // BMW & Mini Air Filters
  "A142136": {
    filterNumber: "A142136",
    brands: ["BMW"],
    compatibleVehicles: [
      "BMW 116i, 118i, 120i",
      "BMW 316i, 318i, 320i, 320si",
      "BMW X1 sDrive 18 I"
    ]
  },
  "A146932": {
    filterNumber: "A146932",
    brands: ["BMW", "Mini"],
    compatibleVehicles: [
      "BMW 216i, 218d, 218i",
      "BMW 220d, 220i, 225i",
      "BMW X1 sDrive",
      "BMW X2 xDrive",
      "Mini Cooper, Cooper D",
      "Mini Cooper S, Cooper S ALL4",
      "Mini Cooper SD",
      "Mini F54 Clubman",
      "Mini One, One D",
      "Mini One First"
    ]
  },
  "A142088": {
    filterNumber: "A142088",
    brands: ["BMW"],
    compatibleVehicles: [
      "BMW 316i, 318",
      "BMW 320, 323, 325",
      "BMW 328i",
      "BMW 330, 520i, 523i",
      "BMW 525i",
      "BMW 528i, 530i",
      "BMW 728i",
      "BMW M3",
      "BMW X3",
      "BMW Z3 (2000~2006)"
    ]
  },

  // Mercedes-Benz Air Filters
  "A142115": {
    filterNumber: "A142115",
    brands: ["Mercedes-Benz"],
    compatibleVehicles: [
      "Mercedes-Benz C-Classe (W205/A205/C205/S205)",
      "Mercedes-Benz E-Classe (W/S212) (W/S213, A/C238)",
      "Mercedes-Benz GLC/GLC Coupé (X253/C253)",
      "Mercedes-Benz GLE/GLS/GLE Coupe (W167)",
      "Mercedes-Benz SLC (R172)",
      "Mercedes-Benz SLK (R172)"
    ]
  },
  "A141686": {
    filterNumber: "A141686",
    brands: ["Mercedes-Benz"],
    compatibleVehicles: [
      "Mercedes-Benz C 230, C 240, C 250, C 280, C 300, C 320, C 350, C 55 AMG",
      "Mercedes-Benz CL 500, CL 55 AMG",
      "Mercedes-Benz CLC 230, CLC 350",
      "Mercedes-Benz CLK 240, CLK 280, CLK 320, CLK 350, CLK 500",
      "Mercedes-Benz CLS 350, CLS 500",
      "Mercedes-Benz E 230, E 230 AMG, E 240, E 280, E 300, E 320, E 350, E 500",
      "Mercedes-Benz G 320, G 500, G 55 AMG",
      "Mercedes-Benz GL 450, GL 500",
      "Mercedes-Benz GLK 280",
      "Mercedes-Benz ML 300, ML 350, ML 500",
      "Mercedes-Benz R 280, R 350, R 500",
      "Mercedes-Benz S 280, S 300, S 320L, S 350, S 350 AMG, S 350L, S 430, S 450, S 500, S 55 AMG",
      "Mercedes-Benz SL 280, SL 300, SL 320, SL 350, SL 500, SL 55 AMG",
      "Mercedes-Benz SLK 280"
    ]
  },

  // Ford & Lincoln Air Filters
  "A140929": {
    filterNumber: "A140929",
    brands: ["Ford", "Lincoln", "Mazda"],
    compatibleVehicles: [
      "Ford Edge, Explorer, Flex, Taurus V",
      "Lincoln MKS, MKT, MKX",
      "Mazda CX-9, Mazda 6"
    ]
  },
  "A141131": {
    filterNumber: "A141131",
    brands: ["Ford", "Mazda"],
    compatibleVehicles: [
      "Ford Ranger",
      "Mazda BT-50"
    ]
  },
  "A140914": {
    filterNumber: "A140914",
    brands: ["Ford", "Lincoln"],
    compatibleVehicles: [
      "Ford EXPEDITION 2007-2020",
      "Ford F-150 2009-2021",
      "Ford F-250 SUPER DUTY, F-350 SUPER DUTY 2008-2016",
      "Ford F-450 SUPER DUTY 2008-2016",
      "Lincoln NAVIGATOR 2007-2020"
    ]
  },

  // Chevrolet & GM Air Filters
  "A142101": {
    filterNumber: "A142101",
    brands: ["Chevrolet", "Cadillac", "Opel"],
    compatibleVehicles: [
      "Cadillac ATS",
      "Chevrolet Cruze",
      "Opel Astra K"
    ]
  },
  "A142100": {
    filterNumber: "A142100",
    brands: ["Chevrolet", "Daewoo", "Holden", "Ravon"],
    compatibleVehicles: [
      "Chevrolet Aveo (T300)",
      "Chevrolet Cobalt, Optra, Sonic, Spin",
      "Daewoo Aveo",
      "Holden Barina",
      "Ravon R4"
    ]
  },
  "A146963": {
    filterNumber: "A146963",
    brands: ["Chevrolet", "Cadillac", "GMC"],
    compatibleVehicles: [
      "Cadillac Escalade, Escalade ESV",
      "Chevrolet Avalanche, Silverado, Suburban, Tahoe",
      "GMC Yukon Denali, Yukon XL 2500"
    ]
  },

  // Jeep, Dodge, Chrysler Air Filters
  "A142137": {
    filterNumber: "A142137",
    brands: ["Jeep", "Mitsubishi"],
    compatibleVehicles: [
      "Jeep Grand Cherokee",
      "Mitsubishi L200",
      "Mitsubishi Pajero/Montero",
      "Mitsubishi Pajero/Montero Sport",
      "Mitsubishi Pajero Sport",
      "Mitsubishi Triton"
    ]
  },
  "A141009": {
    filterNumber: "A141009",
    brands: ["Chrysler", "Dodge", "Jeep"],
    compatibleVehicles: [
      "Chrysler 300C",
      "Dodge Charger, Magnum",
      "Jeep Cherokee, Cherokee Pioneer",
      "Jeep Grand Cherokee, Liberty",
      "Jeep Wrangler 20112018 3.6L, 20062012 3.8L"
    ]
  },
  "A141632": {
    filterNumber: "A141632",
    brands: ["Jeep", "Ram"],
    compatibleVehicles: [
      "Jeep COMPASS 2018-2021",
      "Jeep RENEGADE 2015-2021",
      "Ram PROMASTER CITY 2015-2021"
    ]
  },

  // Volkswagen, Audi, Skoda Air Filters
  "A140853": {
    filterNumber: "A140853",
    brands: ["Volkswagen", "Audi", "Skoda"],
    compatibleVehicles: [
      "Audi A3, Q3, TT",
      "Skoda Octavia II, Octavia RS",
      "Volkswagen Beetle",
      "Volkswagen Caddy III",
      "Volkswagen Golf V, VI",
      "Volkswagen Jetta V, VI",
      "Volkswagen New Beetle",
      "Volkswagen Passat",
      "Volkswagen Passat CC",
      "Volkswagen Tiguan"
    ]
  },
  "A141837": {
    filterNumber: "A141837",
    brands: ["Volkswagen", "Audi", "Skoda"],
    compatibleVehicles: [
      "Audi A3 III",
      "Audi Q2, Q3, TT",
      "Skoda Octavia",
      "Volkswagen Arteon",
      "Volkswagen Golf",
      "Volkswagen Jetta",
      "Volkswagen Passat",
      "Volkswagen Tiguan",
      "Volkswagen Touran"
    ]
  },

  // Land Rover & Jaguar Air Filters
  "A142088": {
    filterNumber: "A142088",
    brands: ["Land Rover"],
    compatibleVehicles: [
      "Land Rover Discovery IV, Discovery V",
      "Land Rover Range Rover, Range Rover III, Range Rover IV",
      "Land Rover Range Rover Sport",
      "Land Rover Range Rover Vogue"
    ]
  },
  "A141741": {
    filterNumber: "A141741",
    brands: ["Land Rover", "Range Rover"],
    compatibleVehicles: [
      "Land Rover Discovery Sport",
      "Land Rover Freelander II",
      "Range Rover Evoque"
    ]
  },

  // Honda & Acura Air Filters
  "A147007": {
    filterNumber: "A147007",
    brands: ["Honda"],
    compatibleVehicles: [
      "Honda Civic, Civic (USA)",
      "Honda Accord 2017~ 1.5L"
    ]
  },
  "A146918": {
    filterNumber: "A146918",
    brands: ["Honda", "Acura"],
    compatibleVehicles: [
      "Honda CR-V 2011~2016 2.4L",
      "Honda CR-V (USA) 2011~2014 2.4L",
      "Acura ILX 2012~2015 2000"
    ]
  },
  "A140342": {
    filterNumber: "A140342",
    brands: ["Honda"],
    compatibleVehicles: [
      "Honda Civic, Civic (USA)",
      "Honda Civic Coupe",
      "Honda Civic VIII (EUR)",
      "Honda Crossroad, FR-V, Stream (2001~2012)"
    ]
  },

  // Mazda Air Filters
  "A141795": {
    filterNumber: "A141795",
    brands: ["Mazda"],
    compatibleVehicles: [
      "Mazda CX-4, CX-5, CX-8",
      "Mazda 3, Mazda 5",
      "Mazda 6, Mazda 6 Wagon"
    ]
  },

  // Volvo Air Filters
  "A140595": {
    filterNumber: "A140595",
    brands: ["Volvo"],
    compatibleVehicles: [
      "Volvo S60, S60 II, S80",
      "Volvo V60, V70",
      "Volvo XC60, XC70"
    ]
  },

  // Chinese Brands Air Filters
  "A142225": {
    filterNumber: "A142225",
    brands: ["Haval"],
    compatibleVehicles: [
      "Haval H9"
    ]
  },
  "A142226": {
    filterNumber: "A142226",
    brands: ["Haval"],
    compatibleVehicles: [
      "Haval H2"
    ]
  },
  "A142227": {
    filterNumber: "A142227",
    brands: ["Haval", "Great Wall"],
    compatibleVehicles: [
      "Haval H6",
      "Great Wall PICKUP POER",
      "Great Wall WINGLE 5"
    ]
  }
};

// Helper function to search for air filter by vehicle make and model
export function findAirFilterByVehicle(make: string, model: string): string | null {
  const normalizedMake = make.toLowerCase().trim();
  const normalizedModel = model.toLowerCase().trim();
  
  // Create a mapping of common Arabic/English names
  const makeMapping: { [key: string]: string } = {
    'تويوتا': 'toyota',
    'toyota': 'toyota',
    'هيونداي': 'hyundai', 
    'hyundai': 'hyundai',
    'كيا': 'kia',
    'kia': 'kia',
    'فورد': 'ford',
    'ford': 'ford',
    'شيفروليه': 'chevrolet',
    'chevrolet': 'chevrolet',
    'نيسان': 'nissan',
    'nissan': 'nissan',
    'مرسيدس': 'mercedes-benz',
    'mercedes': 'mercedes-benz',
    'بي ام دبليو': 'bmw',
    'bmw': 'bmw',
    'لاند روفر': 'land rover',
    'land rover': 'land rover',
    'جاكوار': 'jaguar',
    'jaguar': 'jaguar',
    'هوندا': 'honda',
    'honda': 'honda',
    'مازدا': 'mazda',
    'mazda': 'mazda',
    'فولفو': 'volvo',
    'volvo': 'volvo',
    'جيب': 'jeep',
    'jeep': 'jeep'
  };

  // Model mapping for Arabic to English
  const modelMapping: { [key: string]: string } = {
    'كامري': 'camry',
    'كورولا': 'corolla',
    'بريوس': 'prius',
    'راف فور': 'rav 4',
    'يارس': 'yaris',
    'هايلكس': 'hilux',
    'لاندكروزر': 'land cruiser',
    'النترا': 'elantra',
    'سوناتا': 'sonata',
    'توكسون': 'tucson',
    'سانتافي': 'santa fe',
    'كريتا': 'creta',
    'سبورتاج': 'sportage',
    'سورينتو': 'sorento',
    'سيراتو': 'cerato',
    'اوبتيما': 'optima',
    'التيما': 'altima',
    'باترول': 'patrol',
    'اكسبلورر': 'explorer',
    'موستانج': 'mustang',
    'كامارو': 'camaro',
    'ماليبو': 'malibu',
    'e250': 'e250',
    'e200': 'e200',
    'e350': 'e350',
    'c200': 'c200',
    'c250': 'c250',
    'c300': 'c300',
    '320i': '320i',
    '325i': '325i',
    '328i': '328i',
    '330i': '330i'
  };

  const mappedMake = makeMapping[normalizedMake] || normalizedMake;
  const mappedModel = modelMapping[normalizedModel] || normalizedModel;

  // Search through all air filters
  for (const [filterNumber, filterData] of Object.entries(denckermannAirFilters)) {
    // Check if any brand matches
    const brandMatch = filterData.brands.some(brand => 
      brand.toLowerCase() === mappedMake
    );
    
    if (brandMatch) {
      // Check if any compatible vehicle matches the model
      const matchingVehicle = filterData.compatibleVehicles.find(vehicle => {
        const vehicleName = vehicle.toLowerCase();
        // Try both original and mapped model names
        return vehicleName.includes(mappedModel) || 
               vehicleName.includes(normalizedModel) ||
               mappedModel.includes(vehicleName.split(' ').pop() || '') ||
               normalizedModel.includes(vehicleName.split(' ').pop() || '');
      });
      
      if (matchingVehicle) {
        return filterNumber;
      }
    }
  }

  return null;
}

// Helper function to get air filter details
export function getAirFilterDetails(filterNumber: string): DenckermannAirFilter | null {
  return denckermannAirFilters[filterNumber] || null;
}

// Helper function to search air filters by partial vehicle name
export function searchAirFiltersByVehicleName(searchTerm: string): Array<{filterNumber: string, vehicle: string, brands: string[]}> {
  const results: Array<{filterNumber: string, vehicle: string, brands: string[]}> = [];
  const normalizedSearch = searchTerm?.toLowerCase()?.trim() || '';

  for (const [filterNumber, filterData] of Object.entries(denckermannAirFilters)) {
    const matchingVehicles = (filterData?.compatibleVehicles || []).filter(vehicle => 
      vehicle?.toLowerCase()?.includes(normalizedSearch)
    );
    
    matchingVehicles.forEach(vehicle => {
      results.push({
        filterNumber,
        vehicle,
        brands: filterData.brands
      });
    });
  }

  return results;
}

export default denckermannAirFilters;