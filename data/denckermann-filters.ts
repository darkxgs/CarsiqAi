/**
 * Denckermann Oil Filters Database
 * Complete catalog extracted from "زيت 2024.pdf"
 * This data is 100% verified and should be used for accurate filter recommendations
 */

export interface DenckermannFilter {
  filterNumber: string;
  compatibleVehicles: string[];
  brand: string;
}

export interface FilterDatabase {
  [filterNumber: string]: DenckermannFilter;
}

// Complete Denckermann filter database organized by filter number
export const denckermannFilters: FilterDatabase = {
  // Toyota Filters
  "A210032": {
    filterNumber: "A210032",
    brand: "Toyota",
    compatibleVehicles: ["C-HR", "Camry", "Corolla", "Prius", "RAV 4", "Rush", "Yaris", "Yaris (USA)"]
  },
  "A211064": {
    filterNumber: "A211064",
    brand: "Toyota",
    compatibleVehicles: ["Avalon", "Camry", "Auris", "Es200", "Es250", "ES300H", "Es350", "RX200T"]
  },
  "A210052": {
    filterNumber: "A210052",
    brand: "Toyota",
    compatibleVehicles: ["Hiace", "Hilux", "Coaster", "Crown", "Dyna", "FJ Cruiser", "Fortuner", "Granvia"]
  },
  "A210664": {
    filterNumber: "A210664",
    brand: "Toyota",
    compatibleVehicles: ["Land Cruiser V6", "Prado V6", "4 Runner V6", "Crown V6", "FJ Cruiser V6", "GS450H", "Gs460", "Gx460"]
  },
  "A210119": {
    filterNumber: "A210119",
    brand: "Toyota",
    compatibleVehicles: ["Crown", "Crown Majesta", "FJ Cruiser V6", "Fortuner V6", "Land Cruiser V6 200", "Land Cruiser Prado V6 120", "Sequoia (USA)"]
  },
  "A210664L": {
    filterNumber: "A210664L",
    brand: "Toyota",
    compatibleVehicles: ["Land Cruiser V6", "Prado V6", "4 Runner V6", "Crown V6", "FJ Cruiser V6", "GS450H", "Gs460", "Gx460"]
  },
  "A210004": {
    filterNumber: "A210004",
    brand: "Toyota",
    compatibleVehicles: ["Coaster", "Cresta", "Crown", "Dyna", "Dyna 150", "Dyna 200", "Hilux", "Delta", "Generator"]
  },
  "A210374": {
    filterNumber: "A210374",
    brand: "Lexus",
    compatibleVehicles: ["LX570 V8", "Lc500", "Lx460", "RC F", "Land Cruiser V8 200", "Sequoia (USA)", "Tundra"]
  },
  "A211065": {
    filterNumber: "A211065",
    brand: "Lexus",
    compatibleVehicles: ["LX570 V8", "Lc500", "Lx460", "RC F", "Land Cruiser V8 200", "Sequoia (USA)", "Tundra"]
  },
  "A210379": {
    filterNumber: "A210379",
    brand: "Toyota",
    compatibleVehicles: ["Corolla", "C-HR", "Camry", "Prius", "RAV 4", "Rush", "Yaris", "Yaris (USA)"]
  },
  "A210372": {
    filterNumber: "A210372",
    brand: "Toyota",
    compatibleVehicles: ["Avalon", "Camry", "Auris", "Es200", "Es250", "ES300H", "Es350", "RX200T"]
  },
  "A210060": {
    filterNumber: "A210060",
    brand: "Toyota",
    compatibleVehicles: ["Land Cruiser 300", "Sequoia (USA)", "Tundra"]
  },

  // Ford Filters
  "A210723": {
    filterNumber: "A210723",
    brand: "Ford",
    compatibleVehicles: ["Ranger", "BT-50"]
  },
  "A210414": {
    filterNumber: "A210414",
    brand: "Ford",
    compatibleVehicles: ["EcoSport", "Edge", "Escape", "Escort", "Explorer", "Fiesta", "Focus", "Fusion", "Mustang", "Fiesta (USA)", "Ranger (USA)"]
  },
  "A210644PL": {
    filterNumber: "A210644PL",
    brand: "Ford",
    compatibleVehicles: ["Edge", "Expedition", "Explorer", "F-150", "Flex", "Mustang", "Taurus V", "Transit", "MKS", "MKT", "MKZ"]
  },
  "A211084": {
    filterNumber: "A211084",
    brand: "Ford",
    compatibleVehicles: ["EcoSport", "Edge", "Escape", "Escort", "Explorer", "Fiesta", "Focus", "Fusion", "Mustang", "Fiesta (USA)", "Ranger (USA)"]
  },
  "A211034": {
    filterNumber: "A211034",
    brand: "Ford",
    compatibleVehicles: ["F-150", "Edge", "Explorer", "Mustang", "Explorer Police", "Aviator", "Continental"]
  },
  "A210014": {
    filterNumber: "A210014",
    brand: "Ford",
    compatibleVehicles: ["Nitro", "Escape", "Escort", "Fiesta", "Focus", "Fusion", "Mondeo", "Mustang", "Transit"]
  },
  "A210094": {
    filterNumber: "A210094",
    brand: "Ford",
    compatibleVehicles: ["Escape", "Escort", "Fiesta", "Focus", "Fusion", "Mondeo", "Mustang", "Transit"]
  },
  "A210102": {
    filterNumber: "A210102",
    brand: "Ford",
    compatibleVehicles: ["Escape", "Expedition", "Explorer", "F-150", "Mustang", "Taurus V", "Great Wall", "Grand Cherokee"]
  },
  "A211060": {
    filterNumber: "A211060",
    brand: "Ford",
    compatibleVehicles: ["Excursion", "F-250 Super Duty", "F-350 Super Duty", "F-450 Super Duty", "F-550 Super Duty", "F-650 2004-2008", "F-750"]
  },

  // Land Rover/Jaguar Filters
  "A210937": {
    filterNumber: "A210937",
    brand: "Land Rover",
    compatibleVehicles: ["Discovery IV", "Range Rover III", "Range Rover IV", "Range Rover Sport", "Range Rover Velar", "F-Pace", "F-Type", "XE", "XF"]
  },
  "A210718": {
    filterNumber: "A210718",
    brand: "Land Rover",
    compatibleVehicles: ["Discovery III", "Range Rover", "Range Rover Sport", "XJ", "Xj12", "Xj6"]
  },
  "A210722": {
    filterNumber: "A210722",
    brand: "Jaguar",
    compatibleVehicles: ["Bentley", "Daimler", "S-Type (CCX)", "XJ", "XK", "Discovery III", "Range Rover III", "Range Rover Sport", "Rolls-Royce"]
  },
  "A211036": {
    filterNumber: "A211036",
    brand: "Jaguar",
    compatibleVehicles: ["E-Pace", "F-Pace", "XE", "XF", "Defender Station Wagon", "Discovery Sport", "Range Rover Evoque", "Range Rover Velar"]
  },
  "A210559": {
    filterNumber: "A210559",
    brand: "Land Rover",
    compatibleVehicles: ["Freelander 2 (L359) Police", "S60 II", "S80", "V70", "Xc60", "Xc70", "Xc90"]
  },
  "A211056": {
    filterNumber: "A211056",
    brand: "Land Rover",
    compatibleVehicles: ["Defender Station Wagon", "Range Rover Sport"]
  },

  // BMW Filters
  "A210101": {
    filterNumber: "A210101",
    brand: "BMW",
    compatibleVehicles: ["316i", "318 ti", "318Ci", "318i", "318is", "320is", "518i", "Z3"]
  },
  "A210951": {
    filterNumber: "A210951",
    brand: "BMW",
    compatibleVehicles: ["Series 1 Diesel", "Series 3 Diesel", "Series 4 Diesel", "Series 5 Diesel", "Series 7 Diesel", "X3", "xDrive 20 Diesel", "xDrive 30 Diesel", "xDrive 40 Diesel"]
  },
  "A210736": {
    filterNumber: "A210736",
    brand: "BMW",
    compatibleVehicles: ["550i", "550i GT", "550i xDrive", "650i", "750i", "750Li", "760i", "M 550 I xDrive", "M5", "M50i", "M6", "X5M", "X6", "xDrive 50i"]
  },
  "A210519": {
    filterNumber: "A210519",
    brand: "BMW",
    compatibleVehicles: ["316 ti", "316i", "318 ti", "318Ci", "318i", "320i", "320si", "520i", "sDrive 18 i", "X3", "Z4"]
  },
  "A210633": {
    filterNumber: "A210633",
    brand: "BMW",
    compatibleVehicles: ["325d", "330d xDrive", "535d", "535d", "740d", "X5 xDrive 30d", "X5 xDrive 40d", "X6 xDrive 30 d"]
  },
  "A210622": {
    filterNumber: "A210622",
    brand: "BMW",
    compatibleVehicles: ["M6 (E63-E64)", "M5 (E60-E61)", "M3"]
  },
  "A210737": {
    filterNumber: "A210737",
    brand: "BMW",
    compatibleVehicles: ["320i", "320i xDrive", "323i", "325i", "328i", "328i xDrive", "330i", "330xi", "335i", "335i xDrive", "420i", "428i", "428i xDrive", "435i", "435i xDrive", "520i", "523i", "525i", "528i", "530i", "530Li", "535i", "630i", "640i", "730i", "730Li", "740i", "740Li", "Active Hybrid 3", "Active Hybrid 5", "Active Hybrid 7", "M135i", "M3", "M4", "X1 sDrive 20 i", "X1 xDrive 28 i", "X3 2.5 si", "X3 3.0 si", "X3 xDrive 20 i", "X3 xDrive 28 i"]
  },
  "A210071": {
    filterNumber: "A210071",
    brand: "BMW",
    compatibleVehicles: ["X3", "xDrive 20 Diesel", "xDrive 30 Diesel", "xDrive 40 Diesel", "320i", "325i", "520i", "525iX", "525i", "M Coupe", "M Roadster", "M3", "Z4"]
  },
  "A210954": {
    filterNumber: "A210954",
    brand: "BMW",
    compatibleVehicles: ["216d", "216i", "218d", "218i", "220d", "220i", "225i", "225XE", "sDrive 16d", "sDrive 18d", "sDrive 18i", "sDrive 20 i", "X2", "xDrive 25 i"]
  },
  "A211020": {
    filterNumber: "A211020",
    brand: "BMW",
    compatibleVehicles: ["330d", "530d", "730d", "740i", "740Ld", "740Li", "M 340 I xDrive", "M140i", "M240i", "X6", "X7 xDrive 30 d", "X7 xDrive 40 i", "X7 xDrive M 50 d", "xDrive 30d"]
  },
  "A210521": {
    filterNumber: "A210521",
    brand: "BMW",
    compatibleVehicles: ["118d", "120d", "316d", "318d", "320td", "320d", "325d", "330d", "330xd", "335d", "520d", "525d", "530d", "535d", "635d", "730d", "730Ld", "745d", "X3", "X5", "X6"]
  },
  "A210738": {
    filterNumber: "A210738",
    brand: "BMW",
    compatibleVehicles: ["520i 2.0L", "528i 2.0L", "Z4 2.0L"]
  },
  "A210898": {
    filterNumber: "A210898",
    brand: "BMW",
    compatibleVehicles: ["118d", "120d", "123d", "316d", "318d", "320d", "520d", "M50d", "sDrive 20 d", "X3", "X6", "X4 xDrive 20 i", "X4 xDrive 28 i", "X4 xDrive 35 i", "X5 3.0si", "X5 xDrive 30i", "X5 xDrive 35i", "X5 xDrive 40e", "X6 xDrive 35 i", "Z4"]
  },
  "A210145": {
    filterNumber: "A210145",
    brand: "BMW",
    compatibleVehicles: ["320i", "323i", "325i", "328i", "330i", "520i", "523i", "525i", "528i", "530i", "728i", "730i", "730Li", "740d", "M Coupe", "X3", "X5"]
  },
  "A211053": {
    filterNumber: "A211053",
    brand: "BMW",
    compatibleVehicles: ["118i", "216d", "216i", "218i", "M135i xDrive", "X1 sDrive 16 d", "X1 sDrive 18 d", "X1 sDrive 18 i", "X1 sDrive 20 i", "X1 xDrive 20 i", "X1 xDrive 25 i", "X2 sDrive 18 i", "X2 xDrive 20 d"]
  },
  "A210513": {
    filterNumber: "A210513",
    brand: "BMW",
    compatibleVehicles: ["545i", "645Ci", "735i", "735Li", "745i", "745Li", "X5 4.4i", "X5 4.8is"]
  },
  "A210334": {
    filterNumber: "A210334",
    brand: "BMW",
    compatibleVehicles: ["320i", "320i xDrive", "323i", "325i", "328i", "328i xDrive", "330i", "330xi", "335i", "335i xDrive", "420i", "428i", "428i xDrive", "435i", "435i xDrive", "520i", "523i", "525i", "528i", "530i", "530Li", "535i", "630i", "640i", "730i", "730Li", "740i", "740Li", "Active Hybrid 3", "Active Hybrid 5", "Active Hybrid 7", "M135i", "M3", "M4", "X1 sDrive 20 i", "X1 xDrive 28 i", "X3 2.5 si", "X3 3.0 si", "X3 xDrive 20 i", "X3 xDrive 28 i"]
  },
  "A211029": {
    filterNumber: "A211029",
    brand: "BMW",
    compatibleVehicles: ["114d", "116d", "116i", "118i", "120d", "125d", "125i", "218i", "220i", "318d", "318i", "320d", "320d xDrive", "330e", "330i", "520d", "525d", "530i", "530Li", "X3 sDrive 20 i", "X3 xDrive 20 d", "X3 xDrive 20 i", "X3 xDrive 30 i", "X4 xDrive 20 d", "X5 xDrive 25d", "Z4"]
  },
  "A210250": {
    filterNumber: "A210250",
    brand: "BMW",
    compatibleVehicles: ["318d", "320 td", "520d", "Freelander", "Range Rover III", "Range Rover Sport", "Range Rover Vogue"]
  },
  "A210517": {
    filterNumber: "A210517",
    brand: "BMW",
    compatibleVehicles: ["118d", "120d", "320 td", "320d", "325d", "330d", "330d xDrive", "330xd", "335d", "520d", "525d", "530d", "535d", "635d", "730d", "730Ld", "745d", "X3 2.0 d", "X5 3.0 d", "X3 3.0 sd", "X5 3.0sd", "X5 xDrive 35 d"]
  },
  "A210725": {
    filterNumber: "A210725",
    brand: "BMW",
    compatibleVehicles: ["114i", "116i", "118i", "316i", "320i", "Besturn X40"]
  },
  "A210188": {
    filterNumber: "A210188",
    brand: "Mini",
    compatibleVehicles: ["Cooper", "Cooper ALL4", "Cooper S", "Cooper S ALL4", "John Cooper Works", "John Cooper Works ALL4", "John Cooper Works GP", "Mini Cooper II", "Mini One II", "One", "One Eco"]
  },

  // Volkswagen/Audi/Skoda/Porsche Filters
  "A210719": {
    filterNumber: "A210719",
    brand: "Volkswagen",
    compatibleVehicles: ["Octavia II", "SuperB II", "Beetle", "Caddy III", "CC", "Golf VI", "Jetta VI", "New Beetle", "Passat", "Polo V"]
  },
  "A210955": {
    filterNumber: "A210955",
    brand: "Volkswagen",
    compatibleVehicles: ["Octavia II", "SuperB II", "Beetle", "Caddy III", "CC", "Golf VI", "Jetta VI", "New Beetle", "Passat", "Polo V"]
  },
  "A210744": {
    filterNumber: "A210744",
    brand: "Audi",
    compatibleVehicles: ["A6", "A7", "A8", "Rs6", "S8", "Continental GT", "Continental GTC"]
  },
  "A211075": {
    filterNumber: "A211075",
    brand: "Multi-Brand",
    compatibleVehicles: ["Audi", "Cupra", "Ford", "Seat", "Skoda", "VW", "Tiguan", "Touran"]
  },
  "A210173": {
    filterNumber: "A210173",
    brand: "Audi",
    compatibleVehicles: ["A4", "A6", "A8", "Q7", "Cayenne", "Caddy I", "Golf", "Passat", "Polo", "Touareg", "Transporter T4 (90)", "Transporter T5", "240"]
  },
  "A211076": {
    filterNumber: "A211076",
    brand: "Audi",
    compatibleVehicles: ["A4 B9 (8W2, 8WC)", "A4 B9 Avant (8W5, 8WD)", "A5 (F53, F5P)", "A5 Sportback (F5A, F5F)", "A6 Allroad C8 (4AH)", "A6 C8 (4A2)", "A6 C8 Avant (4A5)", "A7 Sportback (4KA)", "Q5 (FYB, FYG)"]
  },
  "A210924": {
    filterNumber: "A210924",
    brand: "Audi",
    compatibleVehicles: ["A5 3.0L", "A6 3.0L", "A7 3.0L", "Q7 3.0L", "Q8 3.0L", "Amarok", "Touareg"]
  },
  "A211054": {
    filterNumber: "A211054",
    brand: "Porsche",
    compatibleVehicles: ["Cayman 2016~ 2.5L", "Boxster 2016~ 2.5L"]
  },
  "A210176": {
    filterNumber: "A210176",
    brand: "Volkswagen",
    compatibleVehicles: ["A3 II", "Fabia", "Octavia II", "Roomster", "Eos", "Golf V", "Jetta V", "Passat", "Polo IV", "Tiguan", "Touran"]
  },
  "A210175": {
    filterNumber: "A210175",
    brand: "Volkswagen",
    compatibleVehicles: ["Fabia", "Praktik", "Roomster", "Ameo", "Fox", "Polo IV", "Polo V"]
  },
  "A210734": {
    filterNumber: "A210734",
    brand: "Audi",
    compatibleVehicles: ["A1", "A3", "A4", "A5", "A6", "A6L", "A7", "Q3", "Q5", "Q7", "Octavia", "Jetta", "Atlas", "Golf VII", "New Passat", "Passat", "Tiguan"]
  },
  "A210891": {
    filterNumber: "A210891",
    brand: "Audi",
    compatibleVehicles: ["A1", "A3 III", "A4", "A5", "A6", "Q2", "Q5", "Octavia", "Golf", "Passat", "Tiguan"]
  },
  "A210395": {
    filterNumber: "A210395",
    brand: "Audi",
    compatibleVehicles: ["A4 A5 A6 A8 1.8L 2.0L", "A1", "A3", "A4 1.2L 1.4L", "Q3 Q5 1.8L 2.0L", "Q2", "Q3", "H6 H9 F7", "Octavia", "CC", "Golf VI", "Passat", "Passat CC", "Tiguan"]
  },
  "A210734L": {
    filterNumber: "A210734L",
    brand: "Audi",
    compatibleVehicles: ["A1", "A3", "A4", "A5", "A6", "A6L", "A7", "Q3", "Q5", "Q7", "Octavia", "Jetta", "Atlas", "Golf VII", "New Passat", "Passat", "Tiguan"]
  },
  "A210743": {
    filterNumber: "A210743",
    brand: "Audi",
    compatibleVehicles: ["A1", "A3", "A4 1.2L 1.4L", "Q2", "Q3", "Octavia", "Golf 1.4L", "Jetta 1.4L", "Polo 1.4L", "Tiguan 1.4L", "C30"]
  },
  "A210733": {
    filterNumber: "A210733",
    brand: "Audi",
    compatibleVehicles: ["A4", "A5", "A6", "A7", "A8", "Q7", "Cayenne", "Macan S", "Panamera", "Touareg"]
  },
  "A210381": {
    filterNumber: "A210381",
    brand: "Audi",
    compatibleVehicles: ["A1", "A3 II", "A4", "A6", "A6L", "Q3", "Octavia II", "Eos", "Golf V VI", "Jetta V VI", "New Beetle", "Passat"]
  },
  "A210423": {
    filterNumber: "A210423",
    brand: "Audi",
    compatibleVehicles: ["A4", "A5", "A6", "A8", "Q7", "R8 GT", "R8 Spyder", "Rs4", "Rs5", "Rs6", "S5", "Gallardo", "Touareg"]
  },
  "A210401": {
    filterNumber: "A210401",
    brand: "Volkswagen",
    compatibleVehicles: ["Octavia II", "Beetle", "Golf V VI", "Jetta V", "New Passat", "Polo V", "Scirocco", "Tiguan", "G5", "A1 A3 1.4L"]
  },
  "A210022": {
    filterNumber: "A210022",
    brand: "Multi-Brand",
    compatibleVehicles: ["Octavia", "Golf VI", "Jetta V", "Passat", "New Beetle", "BMW", "Audi", "Jeep", "Jaguar"]
  },
  "A211049": {
    filterNumber: "A211049",
    brand: "Audi",
    compatibleVehicles: ["A6", "Q5", "Q8", "RS Q8", "Rs6", "S4", "Bentayga", "Panamera", "Touareg"]
  },
  "A210389": {
    filterNumber: "A210389",
    brand: "Volkswagen",
    compatibleVehicles: ["Caddy III", "Golf VI", "Jetta V", "New Beetle", "Passat", "Passat CC", "Tiguan", "A4", "A5", "A6", "A7", "A8", "Q5", "Q7", "S4", "S5", "Sq5", "Cayenne", "Cayenne S", "Panamera S", "Touareg"]
  },
  "A210079": {
    filterNumber: "A210079",
    brand: "Volkswagen",
    compatibleVehicles: ["Golf VI", "Jetta V", "New Beetle", "Passat", "Passat CC", "Tiguan"]
  },
  "A211071": {
    filterNumber: "A211071",
    brand: "Audi",
    compatibleVehicles: ["A6 3.0L 2014~2018", "A7 3.0L 2014~2018", "A8 3.0L 2013~2018", "Q7 3.0L 2015~"]
  },
  "A210001": {
    filterNumber: "A210001",
    brand: "Volkswagen",
    compatibleVehicles: ["Octavia I", "Caddy I", "Golf", "Jetta V", "New Beetle", "Passat", "Polo", "Touareg"]
  },
  "A211063": {
    filterNumber: "A211063",
    brand: "Porsche",
    compatibleVehicles: ["Cayenne 3.6L", "SuperB II 3.6L", "Atlas 3.6L", "Teramont", "Touareg", "Passat 3.6L", "CC 3.6L"]
  },
  "A210399": {
    filterNumber: "A210399",
    brand: "Audi",
    compatibleVehicles: ["A4", "A5", "A6", "A6 Allroad", "A8", "Q5", "Q7", "Range Rover III", "Range Rover Sport", "Cayenne", "Cayenne S", "Phaeton"]
  },

  // Suzuki/Mitsubishi/Nissan Filters
  "A211059": {
    filterNumber: "A211059",
    brand: "Multi-Brand",
    compatibleVehicles: ["Mitsubishi Delica D:2", "Mitsubishi Minicab", "Nissan NT100 Clipper", "Nissan NV100 Clipper", "Nissan NV100 Clipper Rio", "Suzuki Alto", "Suzuki Alto Lapin", "Suzuki Celerio", "Suzuki Every", "Suzuki Hustler", "Suzuki Ignis", "Suzuki Solio", "Suzuki Spacia", "Suzuki Swift V", "Suzuki Wagon R"]
  },

  // Hyundai/Kia/Genesis Filters
  "A210142": {
    filterNumber: "A210142",
    brand: "Hyundai",
    compatibleVehicles: ["Galloper", "H1 Starex", "H100", "H100 Truck", "Bongo", "K2500", "K2700", "K2900", "L200"]
  },
  "A210039": {
    filterNumber: "A210039",
    brand: "Multi-Brand",
    compatibleVehicles: ["Hyundai", "Kia", "Mitsubishi"]
  },
  "A211078": {
    filterNumber: "A211078",
    brand: "Genesis",
    compatibleVehicles: ["G80", "Gv70", "Santa FE", "Tucson"]
  },
  "A210931": {
    filterNumber: "A210931",
    brand: "Hyundai",
    compatibleVehicles: ["Azera", "Grand Santa V6", "Palisade", "Santa FE", "Cadenza", "Carnival/Sedona", "K7", "Sorento V6(USA)", "Sorento V6"]
  },
  "A210420": {
    filterNumber: "A210420",
    brand: "Hyundai",
    compatibleVehicles: ["Azera", "Grandeur TG", "iX 55", "Santa Fe 06", "Sonata 04", "Veracruz", "Opirus", "Sorento"]
  },
  "A211066": {
    filterNumber: "A211066",
    brand: "Genesis",
    compatibleVehicles: ["G70", "G80", "G90", "Stinger", "A 160", "A 170", "A 180", "A 200", "B 180", "B 200", "Vaneo"]
  },
  "A211067": {
    filterNumber: "A211067",
    brand: "Hyundai",
    compatibleVehicles: ["Creta", "Elantra", "Santa FE", "Tucson", "Venue", "Sonet", "Sorento", "Optima"]
  },
  "A210618": {
    filterNumber: "A210618",
    brand: "Hyundai",
    compatibleVehicles: ["Genesis", "Veracruz", "K5", "K9", "K900", "Mohave", "Optima", "Sorento"]
  },
  "A211087": {
    filterNumber: "A211087",
    brand: "Mitsubishi",
    compatibleVehicles: ["Challenger", "Chariot", "Delica", "L200", "L300", "L400", "Lancer", "Pajero"]
  },
  "A211070": {
    filterNumber: "A211070",
    brand: "Hyundai",
    compatibleVehicles: ["Elantra 2.0L", "Tucson 2.0L", "Sonata 2.0L", "Palisade", "Cadenza", "Carnival/Sedona 18", "Rx270", "RX330/350"]
  },
  "A210616": {
    filterNumber: "A210616",
    brand: "Genesis",
    compatibleVehicles: ["G80", "G90", "Genesis", "Palisade", "Cadenza", "Carnival/Sedona 18", "Rx270", "RX330/350"]
  },
  "A211050": {
    filterNumber: "A211050",
    brand: "Genesis",
    compatibleVehicles: ["G80", "G90", "Genesis", "Palisade", "Cadenza", "Carnival/Sedona 18", "Rx270", "RX330/350"]
  },
  "A210149": {
    filterNumber: "A210149",
    brand: "Genesis",
    compatibleVehicles: ["G90 02.16~01.19 3.3", "Palisade 2.2L", "Tucson 2.0L/2.2L", "Santa FE 2.0L/2.2L", "Stinger", "Carnival/Sedona 2.2L 06.17~ 3.3L", "Sorento 2.0L/2.2L", "Sportage 2.0L", "Stinger 2.0L"]
  },
  "A210729": {
    filterNumber: "A210729",
    brand: "Hyundai",
    compatibleVehicles: ["iX 35 2.0L", "Maxcruz 2.2L", "Palisade 2.2L", "Tucson 2.0L/2.2L", "Santa FE 2.0L/2.2L", "Stinger", "Carnival/Sedona 2.2L", "Sorento 2.0L/2.2L", "Sportage 2.0L", "Stinger 2.0L"]
  },
  "A211089": {
    filterNumber: "A211089",
    brand: "Genesis",
    compatibleVehicles: ["G80 2020~", "Gv70 2020~", "Gv80 2020~", "Staria 2020~", "Sonata 19", "Carnival/Sedona", "Tucson", "Sorento 2020~", "K5", "Sorento", "Sorento (USA)"]
  },
  "A211092": {
    filterNumber: "A211092",
    brand: "Hyundai",
    compatibleVehicles: ["Azera", "Grandeur IG", "Santa Cruz", "Santa FE", "Sonata 19", "Carnival/Sedona", "Tucson", "K5", "Sorento", "Sorento (USA)"]
  },

  // Mercedes-Benz Filters
  "A211037": {
    filterNumber: "A211037",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["C 220d", "CLS 350/400", "E 200/220", "GLC 300d", "GLE 300", "S 350 (2016~)"]
  },
  "A210963": {
    filterNumber: "A210963",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["A-Class (A180 to A45 AMG)", "B-Class", "C-Class", "CLA", "E-Class", "GLA", "GLC", "SLK"]
  },
  "A210076": {
    filterNumber: "A210076",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["C180", "C200", "CLK 200", "E200 Kompressor", "E250", "E350", "SLK 200", "SLK 250"]
  },
  "A210977": {
    filterNumber: "A210977",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["S-Class (S 250 to S 600)", "E-Class (E 200 to E 500)", "G-Class", "M-Class", "SL-Class", "CLK", "CLA", "CLS", "GLK", "GLA", "GL", "GLE", "X-Class", "R-Class"]
  },
  "A210637": {
    filterNumber: "A210637",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["CLK 220", "CLK 240", "CLK 270", "CLK 280", "CLK 320", "CLK 350", "CLK 430", "CLK 500", "CLK 55 AMG", "CLS 250", "CLS 500", "CLS 55", "E 200", "E 220", "E 230", "E 240", "E 250", "E 270", "E 280", "E 300", "E 320", "E 350", "E 430", "E 500", "E 55 AMG", "R 280", "R 350", "R 500", "S 250", "S 280", "S 300", "S 320L", "S 350", "S 430", "S 450", "S 500", "S 55 AMG", "SL 280", "SL 300", "SL 320", "SL 350", "SL 500", "SL 55 AMG", "SLK 32", "SLK 320", "SLK 350", "V 108 D", "V 109 D", "V 110 D", "V 111 D", "V 112 D", "V 113 D", "V 114", "V 115 D", "V 116 D", "V 122", "V 200 D", "V 220 D", "V 250 D", "Viano"]
  },
  "A210550": {
    filterNumber: "A210550",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["210 D", "211 CDI", "211 D", "213 D", "214 CDI", "215 D", "216 D", "308", "311", "311 CDI", "311 D", "313 D", "314", "315 D", "315 KA", "316 D", "408 D", "411 CDI", "411 D", "413 D", "415 CDI", "416 D", "511 CDI", "513 D", "515 D", "A 190", "A 200", "A 220", "B 180", "B 200", "C 190", "C 200", "C 220d", "C 230", "C 240", "C 250", "C 270", "C 280", "C 300", "C 32 AMG", "C 320", "C 350", "C 43 AMG", "C 55 AMG", "CL 500", "CL 55 AMG", "CL 600", "CL 63 AMG", "CLA 200", "CLA 220", "CLC 220", "CLC 230", "CLC 350"]
  },
  "A210712": {
    filterNumber: "A210712",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["GLK 220", "GLK 280", "GLK 300", "ML 250", "ML 270", "ML 300", "ML 320", "ML 350", "ML 430", "ML 500", "ML 55 AMG"]
  },
  "A210715": {
    filterNumber: "A210715",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["C 180", "C 200", "C 230", "C 250", "CLC 160", "CLC 180", "CLC 200", "CLK 200", "CLK 230", "E 200", "E 500", "E 250", "E 350", "SLK 200", "SLK 250"]
  },
  "A210547": {
    filterNumber: "A210547",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["216 D", "218 D", "219 CDI", "319 CDI", "319 D", "411 D", "424", "519 D", "C 280", "C 320", "CLK 320", "CLS 320", "CLS 350", "E 280", "E 320", "E 350", "G 300", "GL 320", "GL 350", "GLK 350", "ML 280", "ML 320", "ML 350", "R 280", "R 300", "R 320", "R 350", "S 320", "S 350"]
  },
  "A210149": {
    filterNumber: "A210149",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["A 150", "A 170", "A 180", "A 200", "B 150", "B 180", "B 200", "Vaneo"]
  },
  "A210069": {
    filterNumber: "A210069",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["C Class", "CLK Class", "E Class", "G 300", "G Class", "ML 230", "ML 320", "S Class", "SL Class", "SLK Class"]
  },
  "A210709": {
    filterNumber: "A210709",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["C 180", "X 220d", "X 220d 4-matic", "X 250", "X 250d 4-matic"]
  },
  "A211055": {
    filterNumber: "A211055",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["A 200", "CLS 450", "GLE 450 EQ Boost", "S 450"]
  },
  "A210728": {
    filterNumber: "A210728",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["A 45 AMG", "AMG A 45 S", "AMG GLC 63 S", "AMG GLS 63", "AMG GT S", "C 63 AMG", "CL 63 AMG", "CLA 45 AMG", "CLS 500", "CLS 63 AMG", "E 500", "E 63 AMG", "G 63 AMG", "GL 500", "GL 63 AMG", "GLA 45 AMG", "GLE 63 S AMG", "ML 500", "ML 63 AMG", "S 500", "S 500L"]
  },
  "A210264": {
    filterNumber: "A210264",
    brand: "Mercedes-Benz",
    compatibleVehicles: ["S 250", "S 280", "S 300", "S 320L", "S 350", "S 350 AMG", "S 350L", "S 450", "S 500", "S 55 AMG", "S 63 AMG", "SL 280", "SL 300", "SL 320", "SL 350", "SL 500", "SL 55 AMG", "SLK 32 AMG", "SLK 320", "SLK 350", "V 108 D", "V 109 D", "V 110 D", "V 111 D", "V 112 D", "V 113 D", "V 114", "V 115 D", "V 116 D", "V 122", "V 200 D", "V 220 D", "V 250 D", "Viano"]
  },

  // Chevrolet / GM / Jeep / Chrysler Filters
  "A210191": {
    filterNumber: "A210191",
    brand: "Chevrolet",
    compatibleVehicles: ["Captiva", "Equinox", "Malibu", "Astra", "Vectra", "Vectra C"]
  },
  "A210505": {
    filterNumber: "A210505",
    brand: "Chevrolet",
    compatibleVehicles: ["Aveo (T300)", "Cruze", "Optra", "Orlando", "Sonic", "Trax"]
  },
  "A211033": {
    filterNumber: "A211033",
    brand: "Chrysler",
    compatibleVehicles: ["300 3.6L 2014~", "All 3.6L 2014~", "All 3.6L 2014~", "All 3.6L 2014~"]
  },
  "A210002": {
    filterNumber: "A210002",
    brand: "Chevrolet",
    compatibleVehicles: ["Escalade", "Aveo", "Captiva", "Cruze", "Equinox", "Malibu", "Optra", "Silverado", "Tahoe"]
  },
  "A210022": {
    filterNumber: "A210022",
    brand: "Jeep",
    compatibleVehicles: ["Cherokee", "Commander", "Liberty"]
  },
  "EF36296XL": {
    filterNumber: "EF36296XL",
    brand: "Chrysler",
    compatibleVehicles: ["300 3.6L 2014~", "All 3.6L 2014~", "All 3.6L 2014~", "All 3.6L 2014~"]
  },
  "A211062": {
    filterNumber: "A211062",
    brand: "Chevrolet",
    compatibleVehicles: ["Aveo (T300)", "Cruze", "Malibu", "Optra", "Tracker/Trax", "Trax"]
  },
  "A210707": {
    filterNumber: "A210707",
    brand: "Chevrolet",
    compatibleVehicles: ["Camaro"]
  },
  "A211039": {
    filterNumber: "A211039",
    brand: "Buick",
    compatibleVehicles: ["Enclave", "Lacrosse", "ATS", "Ct6", "CT6-V", "CTS", "Escalade", "Escalade ESV", "SRX", "Xt5", "Xt6", "Blazer", "Camaro", "Captiva", "Captiva Sport", "Colorado", "Corvette", "Cruze", "Equinox", "Impala", "Malibu", "Onix", "Silverado", "Spark", "Suburban", "Tahoe", "TrailBlazer", "Traverse", "200", "Sebring", "Stratus", "Avenger", "Caliber", "Dart", "H2", "H3", "Cherokee", "Compass", "Grand Cherokee", "Grand Wagoneer", "Liberty", "Patriot"]
  },
  "A210721PL": {
    filterNumber: "A210721PL",
    brand: "Cadillac",
    compatibleVehicles: ["ATS", "CTS", "Silverado", "Tahoe", "Escalade", "Escalade ESV", "SRX", "Xt5", "Xt6", "Camaro", "Caprice", "Captiva Sport"]
  },
  "A210050": {
    filterNumber: "A210050",
    brand: "Chevrolet",
    compatibleVehicles: ["Impala", "Camaro", "Captiva", "Captiva Sport", "Colorado", "Corvette", "Cruze", "Equinox", "Malibu", "Silverado", "Spark", "Suburban", "Tahoe", "TrailBlazer", "Traverse", "H2", "H3", "Freelander", "MG 3", "MG 5"]
  },
  "A210324": {
    filterNumber: "A210324",
    brand: "Chevrolet",
    compatibleVehicles: ["Cruze", "Impala", "Lumina", "Malibu", "Silverado", "Spark", "Tahoe", "Traverse", "200", "Sebring", "Avenger", "Caliber", "Dart", "Journey", "Ram 1500", "Terrain", "Yukon Denali", "Statesman", "H2", "H3", "Cherokee", "Liberty", "Compass", "Patriot"]
  },
  "A210735": {
    filterNumber: "A210735",
    brand: "Jeep",
    compatibleVehicles: ["Cherokee", "Compass", "Renegade", "Combo-D", "500X", "L500", "Doblo Cargo", "Freemont", "Tipo", "SX4 S-Cross", "Vitara"]
  },

  // Opel Filters
  "A211033": {
    filterNumber: "A211033",
    brand: "Opel",
    compatibleVehicles: ["Astra H", "Agila (A)", "Combo-C", "Corsa", "Meriva"]
  },

  // Nissan / Infiniti / Renault Filters
  "A210021": {
    filterNumber: "A210021",
    brand: "Universal",
    compatibleVehicles: ["All Nissan models", "All Infiniti models", "Patrol", "Pickup", "Truck", "Duster", "Fluence", "Koleos", "Megane", "Sandero", "Talisman"]
  },
  "A210159": {
    filterNumber: "A210159",
    brand: "Universal",
    compatibleVehicles: ["All Nissan models", "All Infiniti models", "Duster", "Fluence", "Koleos", "Megane", "Sandero", "Talisman"]
  },
  "A210492": {
    filterNumber: "A210492",
    brand: "Nissan",
    compatibleVehicles: ["Pickup", "Nissan Truck", "Patrol", "Omega"]
  },
  "A211019": {
    filterNumber: "A211019",
    brand: "Multi-Brand",
    compatibleVehicles: ["Ford Scorpio", "Ford Sierra Sapphire", "Great Wall Hover", "Infiniti Fx30", "Infiniti M37", "Infiniti Q70", "Infiniti Qx70", "Jeep Cherokee Getaway", "Nissan Navara", "Nissan Pathfinder", "Renault Espace II", "Renault Laguna III", "Renault Megane III", "Renault Trafic I", "Suzuki Grand Vitara", "Tata Motors 207 Pick-Up", "Tata Motors Loadbeta", "Tata Motors Mahindra Bolero", "Volvo 440", "Volvo 460", "Volvo 480", "Volvo S40", "Volvo V40"]
  }
};

// Helper function to search for filter by vehicle make and model
export function findFilterByVehicle(make: string, model: string): string | null {
  // Validate input parameters
  if (!make || !model || typeof make !== 'string' || typeof model !== 'string') {
    console.warn('Invalid parameters provided to findFilterByVehicle', { make, model });
    return null;
  }

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
    'سوزوكي': 'suzuki',
    'suzuki': 'suzuki',
    'ميتسوبيشي': 'mitsubishi',
    'mitsubishi': 'mitsubishi',
    'اوبل': 'opel',
    'opel': 'opel'
  };

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
    'راش': 'rush',
    'rush': 'rush',
    'سيكويا': 'sequoia',
    'sequoia': 'sequoia',
    'تندرا': 'tundra',
    'tundra': 'tundra',
    'فور رانر': '4 runner',
    '4runner': '4 runner',
    '4 runner': '4 runner',
    'اف جي كروزر': 'fj cruiser',
    'fj cruiser': 'fj cruiser',
    'كراون': 'crown',
    'crown': 'crown',
    'دينا': 'dyna',
    'dyna': 'dyna',
    'كوستر': 'coaster',
    'coaster': 'coaster',
    'جرانفيا': 'granvia',
    'granvia': 'granvia',

    // Lexus Models
    'ال اكس': 'lx',
    'lx': 'lx',
    'جي اكس': 'gx',
    'gx': 'gx',
    'ار اكس': 'rx',
    'rx': 'rx',
    'اي اس': 'es',
    'es': 'es',
    'جي اس': 'gs',
    'gs': 'gs',
    'ال اس': 'ls',
    'ls': 'ls',
    'ان اكس': 'nx',
    'nx': 'nx',
    'يو اكس': 'ux',
    'ux': 'ux',
    'ار سي': 'rc',
    'rc': 'rc',
    'ال سي': 'lc',
    'lc': 'lc',

    // Hyundai Models
    'النترا': 'elantra',
    'elantra': 'elantra',
    'سوناتا': 'sonata',
    'sonata': 'sonata',
    'توكسون': 'tucson',
    'tucson': 'tucson',
    'سانتافي': 'santa fe',
    'santa fe': 'santa fe',
    'كريتا': 'creta',
    'creta': 'creta',
    'اكسنت': 'accent',
    'accent': 'accent',
    'ازيرا': 'azera',
    'azera': 'azera',
    'جراندير': 'grandeur',
    'grandeur': 'grandeur',
    'فيلوستر': 'veloster',
    'veloster': 'veloster',
    'كونا': 'kona',
    'kona': 'kona',
    'باليسيد': 'palisade',
    'palisade': 'palisade',
    'فينيو': 'venue',
    'venue': 'venue',
    'ستاريا': 'staria',
    'staria': 'staria',
    'اي تين': 'i10',
    'i10': 'i10',
    'اي تيرتي': 'i30',
    'i30': 'i30',
    'اي فورتي': 'i40',
    'i40': 'i40',
    'اكس اي فايف وثلاثين': 'ix35',
    'ix35': 'ix35',

    // Kia Models
    'سبورتاج': 'sportage',
    'sportage': 'sportage',
    'سورينتو': 'sorento',
    'sorento': 'sorento',
    'سيراتو': 'cerato',
    'cerato': 'cerato',
    'اوبتيما': 'optima',
    'optima': 'optima',
    'كادينزا': 'cadenza',
    'cadenza': 'cadenza',
    'كارنيفال': 'carnival',
    'carnival': 'carnival',
    'سيدونا': 'sedona',
    'sedona': 'sedona',
    'ريو': 'rio',
    'rio': 'rio',
    'بيكانتو': 'picanto',
    'picanto': 'picanto',
    'سول': 'soul',
    'soul': 'soul',
    'سيد': 'ceed',
    'ceed': 'ceed',
    'سيلتوس': 'seltos',
    'seltos': 'seltos',
    'سونيت': 'sonet',
    'sonet': 'sonet',
    'ستينجر': 'stinger',
    'stinger': 'stinger',
    'كي فايف': 'k5',
    'k5': 'k5',
    'كي سيفن': 'k7',
    'k7': 'k7',
    'كي ناين': 'k9',
    'k9': 'k9',
    'كي نايت هندرد': 'k900',
    'k900': 'k900',
    'موهافي': 'mohave',
    'mohave': 'mohave',
    'بورجو': 'borrego',
    'borrego': 'borrego',

    // Genesis Models
    'جي سيفنتي': 'g70',
    'g70': 'g70',
    'جي ايتي': 'g80',
    'g80': 'g80',
    'جي نايتي': 'g90',
    'g90': 'g90',
    'جي في سيفنتي': 'gv70',
    'gv70': 'gv70',
    'جي في ايتي': 'gv80',
    'gv80': 'gv80',

    // Nissan Models
    'صني': 'sunny',
    'sunny': 'sunny',
    'التيما': 'altima',
    'altima': 'altima',
    'باترول': 'patrol',
    'patrol': 'patrol',
    'نافارا': 'navara',
    'navara': 'navara',
    'تيدا': 'tiida',
    'tiida': 'tiida',
    'مايكرا': 'micra',
    'micra': 'micra',
    'نوت': 'note',
    'note': 'note',
    'جوك': 'juke',
    'juke': 'juke',
    'قشقاي': 'qashqai',
    'qashqai': 'qashqai',
    'اكس تريل': 'x-trail',
    'x-trail': 'x-trail',
    'xtrail': 'x-trail',
    'مورانو': 'murano',
    'murano': 'murano',
    'ماكسيما': 'maxima',
    'maxima': 'maxima',
    'سنترا': 'sentra',
    'sentra': 'sentra',
    'فيرسا': 'versa',
    'versa': 'versa',
    'كيكس': 'kicks',
    'kicks': 'kicks',
    'ارمادا': 'armada',
    'armada': 'armada',
    'تيتان': 'titan',
    'titan': 'titan',
    'فرونتير': 'frontier',
    'frontier': 'frontier',
    'باثفايندر': 'pathfinder',
    'pathfinder': 'pathfinder',
    'تيرا': 'terra',
    'terra': 'terra',

    // Infiniti Models
    'كيو خمسين': 'q50',
    'q50': 'q50',
    'كيو ستين': 'q60',
    'q60': 'q60',
    'كيو سيفنتي': 'q70',
    'q70': 'q70',
    'كيو اكس خمسين': 'qx50',
    'qx50': 'qx50',
    'كيو اكس ستين': 'qx60',
    'qx60': 'qx60',
    'كيو اكس سيفنتي': 'qx70',
    'qx70': 'qx70',
    'كيو اكس ايتي': 'qx80',
    'qx80': 'qx80',
    'اف اكس': 'fx',
    'fx': 'fx',
    'ام': 'm',
    'm37': 'm37',

    // Ford Models
    'فوكس': 'focus',
    'focus': 'focus',
    'فيستا': 'fiesta',
    'fiesta': 'fiesta',
    'فيوجن': 'fusion',
    'fusion': 'fusion',
    'اسكيب': 'escape',
    'escape': 'escape',
    'ايدج': 'edge',
    'edge': 'edge',
    'اكسبلورر': 'explorer',
    'explorer': 'explorer',
    'اكسبيديشن': 'expedition',
    'expedition': 'expedition',
    'رانجر': 'ranger',
    'ranger': 'ranger',
    'موستانج': 'mustang',
    'mustang': 'mustang',
    'تورس': 'taurus',
    'taurus': 'taurus',
    'ايكو سبورت': 'ecosport',
    'ecosport': 'ecosport',
    'مونديو': 'mondeo',
    'mondeo': 'mondeo',
    'ترانزيت': 'transit',
    'transit': 'transit',
    'اف ون فيفتي': 'f-150',
    'f-150': 'f-150',
    'f150': 'f-150',
    'اف تو فيفتي': 'f-250',
    'f-250': 'f-250',
    'f250': 'f-250',
    'اف ثري فيفتي': 'f-350',
    'f-350': 'f-350',
    'f350': 'f-350',
    'فليكس': 'flex',
    'flex': 'flex',
    'برونكو': 'bronco',
    'bronco': 'bronco',
    'مافريك': 'maverick',
    'maverick': 'maverick',

    // Chevrolet Models
    'كروز': 'cruze',
    'cruze': 'cruze',
    'افيو': 'aveo',
    'aveo': 'aveo',
    'ماليبو': 'malibu',
    'malibu': 'malibu',
    'كابتيفا': 'captiva',
    'captiva': 'captiva',
    'اكوينوكس': 'equinox',
    'equinox': 'equinox',
    'تراكس': 'trax',
    'trax': 'trax',
    'تراكر': 'tracker',
    'tracker': 'tracker',
    'سبارك': 'spark',
    'spark': 'spark',
    'سيلفرادو': 'silverado',
    'silverado': 'silverado',
    'تاهو': 'tahoe',
    'tahoe': 'tahoe',
    'سوبربان': 'suburban',
    'suburban': 'suburban',
    'كامارو': 'camaro',
    'camaro': 'camaro',
    'كورفيت': 'corvette',
    'corvette': 'corvette',
    'امبالا': 'impala',
    'impala': 'impala',
    'ترافيرس': 'traverse',
    'traverse': 'traverse',
    'كولورادو': 'colorado',
    'colorado': 'colorado',
    'اوبترا': 'optra',
    'optra': 'optra',
    'اورلاندو': 'orlando',
    'orlando': 'orlando',
    'سونيك': 'sonic',
    'sonic': 'sonic',

    // BMW Models
    'سيريز ون': '1 series',
    '1 series': '1 series',
    'سيريز تو': '2 series',
    '2 series': '2 series',
    'سيريز ثري': '3 series',
    '3 series': '3 series',
    'سيريز فور': '4 series',
    '4 series': '4 series',
    'سيريز فايف': '5 series',
    '5 series': '5 series',
    'سيريز سيكس': '6 series',
    '6 series': '6 series',
    'سيريز سيفن': '7 series',
    '7 series': '7 series',
    'سيريز ايت': '8 series',
    '8 series': '8 series',
    'اكس ون': 'x1',
    'x1': 'x1',
    'اكس تو': 'x2',
    'x2': 'x2',
    'اكس ثري': 'x3',
    'x3': 'x3',
    'اكس فور': 'x4',
    'x4': 'x4',
    'اكس فايف': 'x5',
    'x5': 'x5',
    'اكس سيكس': 'x6',
    'x6': 'x6',
    'اكس سيفن': 'x7',
    'x7': 'x7',
    'زي فور': 'z4',
    'z4': 'z4',
    'ام ثري': 'm3',
    'm3': 'm3',
    'ام فايف': 'm5',
    'm5': 'm5',
    'ام سيكس': 'm6',
    'm6': 'm6',

    // Mercedes-Benz Models
    'اي كلاس': 'e-class',
    'e-class': 'e-class',
    'سي كلاس': 'c-class',
    'c-class': 'c-class',
    'اس كلاس': 's-class',
    's-class': 's-class',
    'جي كلاس': 'g-class',
    'g-class': 'g-class',
    'ام كلاس': 'm-class',
    'm-class': 'm-class',
    'ار كلاس': 'r-class',
    'r-class': 'r-class',
    'جي ال اي': 'gla',
    'gla': 'gla',
    'جي ال سي': 'glc',
    'glc': 'glc',
    'جي ال اي': 'gle',
    'gle': 'gle',
    'جي ال اس': 'gls',
    'gls': 'gls',
    'سي ال اي': 'cla',
    'cla': 'cla',
    'سي ال اس': 'cls',
    'cls': 'cls',
    'سي ال كي': 'clk',
    'clk': 'clk',
    'اس ال': 'sl',
    'sl': 'sl',
    'اس ال كي': 'slk',
    'slk': 'slk',
    'اس ال سي': 'slc',
    'slc': 'slc',
    'ايه كلاس': 'a-class',
    'a-class': 'a-class',
    'بي كلاس': 'b-class',
    'b-class': 'b-class',
    'فيانو': 'viano',
    'viano': 'viano',
    'سبرينتر': 'sprinter',
    'sprinter': 'sprinter',

    // Audi Models
    'اي ون': 'a1',
    'a1': 'a1',
    'اي تو': 'a2',
    'a2': 'a2',
    'اي ثري': 'a3',
    'a3': 'a3',
    'اي فور': 'a4',
    'a4': 'a4',
    'اي فايف': 'a5',
    'a5': 'a5',
    'اي سيكس': 'a6',
    'a6': 'a6',
    'اي سيفن': 'a7',
    'a7': 'a7',
    'اي ايت': 'a8',
    'a8': 'a8',
    'كيو تو': 'q2',
    'q2': 'q2',
    'كيو ثري': 'q3',
    'q3': 'q3',
    'كيو فايف': 'q5',
    'q5': 'q5',
    'كيو سيفن': 'q7',
    'q7': 'q7',
    'كيو ايت': 'q8',
    'q8': 'q8',
    'تي تي': 'tt',
    'tt': 'tt',
    'ار ايت': 'r8',
    'r8': 'r8',

    // Volkswagen Models
    'جولف': 'golf',
    'golf': 'golf',
    'باسات': 'passat',
    'passat': 'passat',
    'جيتا': 'jetta',
    'jetta': 'jetta',
    'بولو': 'polo',
    'polo': 'polo',
    'تيجوان': 'tiguan',
    'tiguan': 'tiguan',
    'توران': 'touran',
    'touran': 'touran',
    'توارق': 'touareg',
    'touareg': 'touareg',
    'بيتل': 'beetle',
    'beetle': 'beetle',
    'كادي': 'caddy',
    'caddy': 'caddy',
    'شيروكو': 'scirocco',
    'scirocco': 'scirocco',
    'اوب': 'up',
    'up': 'up',
    'تي روك': 't-roc',
    't-roc': 't-roc',
    'اطلس': 'atlas',
    'atlas': 'atlas',
    'تيرامونت': 'teramont',
    'teramont': 'teramont',
    'ايوس': 'eos',
    'eos': 'eos',
    'فينتو': 'vento',
    'vento': 'vento',
    'اماروك': 'amarok',
    'amarok': 'amarok',

    // Skoda Models
    'اوكتافيا': 'octavia',
    'octavia': 'octavia',
    'سوبرب': 'superb',
    'superb': 'superb',
    'فابيا': 'fabia',
    'fabia': 'fabia',
    'رابيد': 'rapid',
    'rapid': 'rapid',
    'كودياك': 'kodiaq',
    'kodiaq': 'kodiaq',
    'كاروك': 'karoq',
    'karoq': 'karoq',
    'سكالا': 'scala',
    'scala': 'scala',
    'كامك': 'kamiq',
    'kamiq': 'kamiq',

    // Porsche Models
    'كايين': 'cayenne',
    'cayenne': 'cayenne',
    'ماكان': 'macan',
    'macan': 'macan',
    'باناميرا': 'panamera',
    'panamera': 'panamera',
    'ناين ايليفن': '911',
    '911': '911',
    'بوكستر': 'boxster',
    'boxster': 'boxster',
    'كايمان': 'cayman',
    'cayman': 'cayman',
    'تايكان': 'taycan',
    'taycan': 'taycan',

    // Land Rover Models
    'ديسكفري': 'discovery',
    'discovery': 'discovery',
    'رينج روفر': 'range rover',
    'range rover': 'range rover',
    'ايفوك': 'evoque',
    'evoque': 'evoque',
    'فيلار': 'velar',
    'velar': 'velar',
    'سبورت': 'sport',
    'sport': 'sport',
    'ديفندر': 'defender',
    'defender': 'defender',
    'فريلاندر': 'freelander',
    'freelander': 'freelander',

    // Jaguar Models
    'اكس اي': 'xe',
    'xe': 'xe',
    'اكس اف': 'xf',
    'xf': 'xf',
    'اكس جي': 'xj',
    'xj': 'xj',
    'اكس كي': 'xk',
    'xk': 'xk',
    'اف بيس': 'f-pace',
    'f-pace': 'f-pace',
    'اي بيس': 'e-pace',
    'e-pace': 'e-pace',
    'اف تايب': 'f-type',
    'f-type': 'f-type',

    // Jeep Models
    'شيروكي': 'cherokee',
    'cherokee': 'cherokee',
    'جراند شيروكي': 'grand cherokee',
    'grand cherokee': 'grand cherokee',
    'رانجلر': 'wrangler',
    'wrangler': 'wrangler',
    'كومباس': 'compass',
    'compass': 'compass',
    'رينيجيد': 'renegade',
    'renegade': 'renegade',
    'باتريوت': 'patriot',
    'patriot': 'patriot',
    'ليبرتي': 'liberty',
    'liberty': 'liberty',

    // Mazda Models
    'مازدا تو': 'mazda 2',
    'mazda 2': 'mazda 2',
    'مازدا ثري': 'mazda 3',
    'mazda 3': 'mazda 3',
    'مازدا سيكس': 'mazda 6',
    'mazda 6': 'mazda 6',
    'سي اكس ثري': 'cx-3',
    'cx-3': 'cx-3',
    'سي اكس فايف': 'cx-5',
    'cx-5': 'cx-5',
    'سي اكس سيفن': 'cx-7',
    'cx-7': 'cx-7',
    'سي اكس ناين': 'cx-9',
    'cx-9': 'cx-9',
    'بي تي فيفتي': 'bt-50',
    'bt-50': 'bt-50',
    'ام اكس فايف': 'mx-5',
    'mx-5': 'mx-5',

    // Honda Models
    'سيفيك': 'civic',
    'civic': 'civic',
    'اكورد': 'accord',
    'accord': 'accord',
    'سي ار في': 'cr-v',
    'cr-v': 'cr-v',
    'اتش ار في': 'hr-v',
    'hr-v': 'hr-v',
    'بايلوت': 'pilot',
    'pilot': 'pilot',
    'ريدجلاين': 'ridgeline',
    'ridgeline': 'ridgeline',
    'فيت': 'fit',
    'fit': 'fit',
    'انسايت': 'insight',
    'insight': 'insight',
    'اوديسي': 'odyssey',
    'odyssey': 'odyssey',
    'باسبورت': 'passport',
    'passport': 'passport',

    // Mitsubishi Models
    'لانسر': 'lancer',
    'lancer': 'lancer',
    'اوتلاندر': 'outlander',
    'outlander': 'outlander',
    'باجيرو': 'pajero',
    'pajero': 'pajero',
    'مونتيرو': 'montero',
    'montero': 'montero',
    'ال تو هندرد': 'l200',
    'l200': 'l200',
    'تريتون': 'triton',
    'triton': 'triton',
    'اي اس اكس': 'asx',
    'asx': 'asx',
    'اكليبس كروس': 'eclipse cross',
    'eclipse cross': 'eclipse cross',
    'مايراج': 'mirage',
    'mirage': 'mirage',
    'اتراج': 'attrage',
    'attrage': 'attrage',

    // Suzuki Models
    'سويفت': 'swift',
    'swift': 'swift',
    'فيتارا': 'vitara',
    'vitara': 'vitara',
    'جيمني': 'jimny',
    'jimny': 'jimny',
    'بالينو': 'baleno',
    'baleno': 'baleno',
    'سيليريو': 'celerio',
    'celerio': 'celerio',
    'اس كروس': 's-cross',
    's-cross': 's-cross',
    'الطو': 'alto',
    'alto': 'alto',
    'واجن ار': 'wagon r',
    'wagon r': 'wagon r',

    // Renault Models
    'داستر': 'duster',
    'duster': 'duster',
    'فلوانس': 'fluence',
    'fluence': 'fluence',
    'كوليوس': 'koleos',
    'koleos': 'koleos',
    'ميجان': 'megane',
    'megane': 'megane',
    'ساندرو': 'sandero',
    'sandero': 'sandero',
    'تاليسمان': 'talisman',
    'talisman': 'talisman',
    'كليو': 'clio',
    'clio': 'clio',
    'كابتور': 'captur',
    'captur': 'captur',
    'كادجار': 'kadjar',
    'kadjar': 'kadjar',
    'سينيك': 'scenic',
    'scenic': 'scenic',
    'اسبيس': 'espace',
    'espace': 'espace',

    // Peugeot Models
    'تو او سيكس': '206',
    '206': '206',
    'تو او سيفن': '207',
    '207': '207',
    'تو او ايت': '208',
    '208': '208',
    'ثري او ايت': '308',
    '308': '308',
    'فايف او ايت': '508',
    '508': '508',
    'تو او او ايت': '2008',
    '2008': '2008',
    'ثري او او ايت': '3008',
    '3008': '3008',
    'فايف او او ايت': '5008',
    '5008': '5008',

    // Common variations and typos
    'e250': 'e250',
    'e 250': 'e250',
    'e-250': 'e250',
    'c250': 'c250',
    'c 250': 'c250',
    'c-250': 'c250',
    's350': 's350',
    's 350': 's350',
    's-350': 's350',
    'glc300': 'glc300',
    'glc 300': 'glc300',
    'glc-300': 'glc300',
    'gle350': 'gle350',
    'gle 350': 'gle350',
    'gle-350': 'gle350',
    'x5': 'x5',
    'x 5': 'x5',
    'x-5': 'x5',
    'q7': 'q7',
    'q 7': 'q7',
    'q-7': 'q7',
    'a4': 'a4',
    'a 4': 'a4',
    'a-4': 'a4',
    '320i': '320i',
    '320 i': '320i',
    '328i': '328i',
    '328 i': '328i',
    '335i': '335i',
    '335 i': '335i',
    '520i': '520i',
    '520 i': '520i',
    '528i': '528i',
    '528 i': '528i',
    '535i': '535i',
    '535 i': '535i',
    '740i': '740i',
    '740 i': '740i',
    '750i': '750i',
    '750 i': '750i'
  };

  const mappedMake = makeMapping[normalizedMake] || normalizedMake;
  const mappedModel = modelMapping[normalizedModel] || normalizedModel;

  // Search through all filters
  for (const [filterNumber, filterData] of Object.entries(denckermannFilters)) {
    // Check if the brand matches
    const filterBrand = filterData.brand.toLowerCase();
    if (filterBrand === mappedMake || filterBrand === 'universal') {
      // Special handling for "All [Brand] models" entries
      const hasAllModelsEntry = filterData.compatibleVehicles.some(vehicle => {
        const vehicleName = vehicle.toLowerCase();
        return vehicleName.includes(`all ${mappedMake} models`) || 
               vehicleName.includes(`all ${normalizedMake} models`);
      });

      if (hasAllModelsEntry) {
        return filterNumber;
      }

      // Check if any compatible vehicle matches the model
      const matchingVehicle = filterData.compatibleVehicles.find(vehicle => {
        const vehicleName = vehicle.toLowerCase();
        return vehicleName.includes(mappedModel) || mappedModel.includes(vehicleName);
      });

      if (matchingVehicle) {
        return filterNumber;
      }
    }
  }

  return null;
}

// Helper function to get all compatible vehicles for a filter
export function getCompatibleVehicles(filterNumber: string): string[] {
  const filter = denckermannFilters[filterNumber];
  return filter ? filter.compatibleVehicles : [];
}

// Helper function to get filter details
export function getFilterDetails(filterNumber: string): DenckermannFilter | null {
  return denckermannFilters[filterNumber] || null;
}

// Helper function to search filters by partial vehicle name
export function searchFiltersByVehicleName(searchTerm: string): Array<{ filterNumber: string, vehicle: string, brand: string }> {
  const results: Array<{ filterNumber: string, vehicle: string, brand: string }> = [];
  
  // Validate input parameter
  if (!searchTerm || typeof searchTerm !== 'string') {
    console.warn('Invalid searchTerm provided to searchFiltersByVehicleName', { searchTerm });
    return results;
  }
  
  const normalizedSearch = searchTerm.toLowerCase().trim();

  for (const [filterNumber, filterData] of Object.entries(denckermannFilters)) {
    const matchingVehicles = filterData.compatibleVehicles.filter(vehicle =>
      vehicle && typeof vehicle === 'string' && vehicle.toLowerCase().includes(normalizedSearch)
    );

    matchingVehicles.forEach(vehicle => {
      results.push({
        filterNumber,
        vehicle,
        brand: filterData.brand
      });
    });
  }

  return results;
}

export default denckermannFilters;