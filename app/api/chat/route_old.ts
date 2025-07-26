import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import CarAnalyzer from "@/utils/carAnalyzer"
import logger from "@/utils/logger"
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { z } from 'zod'
import { normalizeArabicCarInput, getCarModels, extractOilRecommendationData, suggestOil } from '@/utils/carQueryApi'
// استيراد قاعدة البيانات الداخلية والمساعدة في معالجة VIN
import officialSpecs from '@/data/officialSpecs'
import { getAccurateOilRecommendation, decodeVIN } from '@/utils/vinEngineResolver'
// Import the new modular system prompt builder
import { buildMinimalSystemPrompt } from '@/utils/systemPromptBuilder'

// Input validation schemas
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, "Message content cannot be empty")
})

const RequestBodySchema = z.object({
  messages: z.array(MessageSchema).min(1, "At least one message is required")
})

// Enhanced car data extraction with better validation
interface ExtractedCarData {
  carBrand: string;
  carModel: string;
  year?: number;
  mileage?: number;
  engineSize?: string;
  fuelType?: string;
  transmission?: string;
  isValid: boolean;
  confidence: number;
  vin?: string; // Add VIN to the interface
}

// Enhanced oil recommendation interface
interface OilRecommendation {
  primaryOil: string[];
  alternativeOil?: string[];
  viscosity: string;
  capacity: string;
  brand: string;
  specification: string;
  reason: string;
  priceRange?: string;
  changeInterval: string;
  climateConsiderations: string;
}

// API status tracking for token limits
interface ApiStatus {
  isTokenLimitReached: boolean;
  errorCount: number;
  lastError?: string;
  lastErrorTime?: Date;
}

// Initialize API status
const apiStatus: ApiStatus = {
  isTokenLimitReached: false,
  errorCount: 0
}

/**
 * Enhanced OpenRouter configuration with fallback options
 */
const openRouter = {
  baseURL: "https://openrouter.ai/api/v1",
  key: process.env.OPENROUTER_API_KEY || '',
  primaryModel: "google/gemini-2.0-flash-001",
  fallbackModel: "rekaai/reka-flash-3:free",
  mistralModel: "google/gemma-3-27b-it:free",
  maxRetries: 3,
  timeout: 30000,
  // Remove the massive system prompt - it will be built dynamically 

  headers: {
    "HTTP-Referer": "https://www.carsiqai.com",
    "X-Title": "Car Service Chat - CarsiqAi",
  },
}

// Enhanced OpenRouter client with retry logic
const createOpenRouterClient = () => {
  return createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Car Service Chat - CarsiqAi"
    }
  })
}

// Check if error message indicates token limit reached
function isTokenLimitError(error: any): boolean {
  if (!error || !error.message) return false
  
  const errorMsg = error.message.toLowerCase()
  return (
    errorMsg.includes('token') && 
    (errorMsg.includes('limit') || errorMsg.includes('exceeded') || errorMsg.includes('quota')) ||
    errorMsg.includes('billing') ||
    errorMsg.includes('payment required') ||
    errorMsg.includes('insufficient funds')
  )
}

// Reset API status if enough time has passed
function checkAndResetTokenLimitStatus(): void {
  if (apiStatus.isTokenLimitReached && apiStatus.lastErrorTime) {
    // Reset after 24 hours
    const resetTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    if (Date.now() - apiStatus.lastErrorTime.getTime() > resetTime) {
      console.log('Resetting token limit status after 24 hours')
      apiStatus.isTokenLimitReached = false
      apiStatus.errorCount = 0
      apiStatus.lastError = undefined
      apiStatus.lastErrorTime = undefined
    }
  }
}

/**
 * Enhanced car data extraction with better accuracy
 */
function enhancedExtractCarData(query: string): ExtractedCarData {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Enhanced brand detection with common Arabic variations
  const brandMappings = {
    'تويوتا': ['تويوتا', 'toyota'],
    'هيونداي': ['هيونداي', 'هيوندا', 'hyundai'],
    'كيا': ['كيا', 'kia'],
    'نيسان': ['نيسان', 'nissan'],
    'هوندا': ['هوندا', 'honda'],
    'مرسيدس': ['مرسيدس', 'mercedes', 'بنز'],
    'بي ام دبليو': ['بي ام دبليو', 'bmw', 'بمو'],
    'لكزس': ['لكزس', 'lexus'],
    'جينيسيس': ['جينيسيس', 'genesis'],
    'فولكس واجن': ['فولكس واجن', 'volkswagen', 'vw'],
    'اودي': ['اودي', 'audi'],
    'مازدا': ['مازدا', 'mazda'],
    'سوزوكي': ['سوزوكي', 'suzuki'],
    'ميتسوبيشي': ['ميتسوبيشي', 'mitsubishi'],
    'شيفروليت': ['شيفروليت', 'chevrolet', 'شفروليه', 'شيفي', 'شيفي', 'شيفروليه'],
    'فورد': ['فورد', 'ford'],
    'بيجو': ['بيجو', 'peugeot'],
    'رينو': ['رينو', 'renault'],
    'جيب': ['جيب', 'jeep']
  }

Jaguar

A210937: F-Pace, F-Type, XE, XF

A211036: E-Pace, F-Pace, XE, XF

A210718: XJ, Xj12, Xj6

A210722: S-Type (CCX), XK

BMW

A210738: 320i, 323i, 325i, 328i, 330i, 335i, 520i, 523i, 525i, 528i, 530i, 730i, 740i, X3, X5, Z4

A210101: M3, M Coupe, M Roadster

A210519: 316i, 318i

A210736: 320d, 325d, 330d, 530d, 730d

Suzuki

A210159: Grand Vitara

A211059: Alto, Alto Lapin, Celerio, Every, Hustler, Ignis, Solio, Spacia, Swift V, Wagon R

Hyundai

A210931: Azera, Grand Santa V6, Palisade, Santa FE

A211067: Creta, Elantra, Santa FE, Tucson, Venue

A211070: Elantra 2.0L, Tucson 2.0L, Sonata 2.0L

A211089: Genesis G80, Gv70, Gv80, Staria

A210420: Azera, Grandeur TG, iX 55, Santa Fe 06, Sonata 04, Veracruz

A210618: Genesis, Veracruz, K5, K9, K900, Mohave, Optima, Sorento

A210616: Genesis G80, G90, Palisade, Cadenza, Carnival / Sedona (2018), Lexus Rx270, RX330/350

Kia

A210931: Cadenza, Carnival/Sedona, K7, Sorento V6 (USA), Sorento V6

A211067: Sonet, Sorento

A211089: Carnival / Sedona, Sorento

A210420: Opirus, Sorento

A210618: K5, K9, K900, Mohave, Optima, Sorento

Mitsubishi

A211066: Challenger, Chariot, Delica, L200, L300, L400, Lancer, Pajero

Mercedes-Benz

A211037: C 220d, CLS 350/400, E 200/220, GLC 300d, GLE 300, S 350 (2016~)

A210963: A-Class (A180 to A45 AMG), B-Class, C-Class, CLA, E-Class, GLA, GLC, SLK

A210076: C180, C200, CLK 200, E200 Kompressor, E250, E350, SLK 200, SLK 250

A210977: S-Class (S 250 to S 600), E-Class (E 200 to E 500), G-Class, M-Class, SL-Class, CLK, CLA, CLS, GLK, GLA, GL, GLE, X-Class, R-Class

Chevrolet / GM

A210721PL: Aveo (T300), Cruze, Optra, Orlando, Sonic, Trax, Camaro

A211062: Aveo (T300), Cruze, Malibu, Optra, Trax, Tracker

A210050: Captiva, Equinox, Malibu, Camaro, Impala, Silverado, Spark, Tahoe, Traverse

A210191: Impala, Silverado, Tahoe, Trail Blazer

Opel

A210050: Astra, Vectra, Vectra C

A211033: Astra H, Agila (A), Combo-C, Corsa, Meriva

Nissan / Infiniti

A210021: All Nissan models, Patrol, Pickup, Truck

A210492: Infiniti FX30, M37, Q70, QX70

Renault

A210021: Duster, Fluence, Koleos, Megane, Sandero, Talisman

Audi / VW / Skoda / Porsche

A210723: Audi A3, VW Golf, Skoda Octavia, Porsche Macan

A210963: Audi A4, A5, Q5, VW Passat, Tiguan, Skoda Superb, Porsche Cayenne

Mazda / Subaru

A210021: Mazda 3, Mazda 6, BT-50, Subaru Forester, Impreza, Outback

Jeep / Dodge / Chrysler

A210021: Jeep Grand Cherokee, Dodge Ram, Charger, Challenger, Chrysler 300

Volvo

A210963: S40, S60, S80, V40, XC60, XC70, XC90

Mini

A210963: Mini Cooper, Clubman, Countryman

Daewoo / Chery / Peugeot / SsangYong

A210021: Daewoo Lanos, Nubira, Chery Tiggo, Arrizo, Peugeot 206, 207, SsangYong Rexton, Korando 

🔧 العلامات التجارية المسموح بها لفلاتر الهواء:
Denkermann  
❌ لا تقترح أي فلتر خارج هذه القائمة، حتى كمثال
الفلاتر الهواء الرسميه من Denkermann: DENCKERMANN AIR FILTER CATALOG - ORGANIZED
TOYOTA & LEXUS
A140819
LEXUS:

ES350 2007~2012

TOYOTA:

Alphard
Avalon 2007~2012
Camry 3.5L 06~13
Camry/Aurion
RAV 4 2006~2012

A141632
LEXUS:

ES350 2012~2018 3.5L
NX200T
RX200T
RX270
RX350
RX450H

TOYOTA:

Avalon 2012~ 3.5L
Camry 2011~2018 3.5L
Harrier 2017~

A140316
TOYOTA:

Fortuner 2.7L 3.0L 4.0L
Hilux 2.7L 3.0L

A140796
TOYOTA:

4 Runner V6
FJ Cruiser V6
Fortuner V6
Hilux V6
Land Cruiser 4.0L V6
Prado 120 V6
Tacoma (USA) V6
Tundra V6

A140826
LEXUS:

LX460 4.6L
LX570 5.7L

TOYOTA:

Land Cruiser 200 4.6L 4.7L 5.7L
Sequoia (USA)
Tundra 4.0L

A146922
TOYOTA:

Fortuner 2015~ 2.7L, 2.8L, 3.0L, 4.0L
Hilux 2015~ 2.7L, 2.8L, 3.0L, 4.0L

A146953
LEXUS:
NX250
NX350

TOYOTA:
Avalon
Camry
Harrier
Highlander
RAV 4
Yaris

A140793
LEXUS:
ES300H
UX200

TOYOTA:
86
Avalon/Auris
C-HR
Camry
Corolla
Highlander
RAV 4
Venza

A140817
LEXUS:
GX470
LX470

TOYOTA:
4 Runner
FJ Cruiser
Prado 120
Prado 150
Sequoia (USA)
Tundra

A140818
LEXUS:
NX200
RC350

TOYOTA:
Avensis
Corolla
Corolla Altis
Corolla Axio/Fielder
Corolla Rumion
Yaris
Yaris (USA)

A140828

DAIHATSU:
Altis
LEXUS:
ES240
ES250

TOYOTA:
Camry
Camry/Aurion
Venza

A146906

LEXUS:
LS600H
ES200
ES300H
HS250H
LS460

TOYOTA:
Avalon
Camry
RAV 4

A141781

LEXUS:
GX460 4.6L

TOYOTA:
4 Runner 4.0L
FJ Cruiser 4.0L
Prado 150 4.0L

AF12377
TOYOTA:

Avanza 2018~
Rush 2018~
Vios 2018~
Yaris 2018~

DAIHATSU:

Terios 2018~

MITSUBISHI:

Attrage 2018~
Mirage 2018~

A146934
LEXUS:

GS300

TOYOTA:

Crown
Crown Comfort
Crown Majesta
Lexus GS (Aristo)
Mark II

A140273
LEXUS:

GS200T
GS250
GS350
GS450H
IS200T
IS250
IS300H
IS350
RC350

TOYOTA:

Crown
Crown Athlete
Crown Majesta
Crown Royal Saloon
RAV 4 2.2L

A140380
TOYOTA:

Hiace
Hiace Commuter
Hiace Regius
Hiace Van

A142188
TOYOTA:

GranAce
Hiace 2019~

A146952
TOYOTA:

Land Cruiser 300 3.3L 2021~

A140087
BYD:

F3

GEELY:

Emgrand

LEXUS:

RX300
RX450H

TOYOTA:

Corolla 2000~2007
Avensis
Wish
Land Cruiser 300 3.5L

A140907
TOYOTA:

C-HR
Corolla
Corolla Axio
Corolla Cross
Corolla Fielder
Corolla Spacio
Prius
Yaris
Yaris/Hybrid

A140815
LEXUS:

GS350
GS430
IS250
IS250/300
IS250C
IS300C
IS350

TOYOTA:

Crown Athlete
Lexus GS (Aristo)
Lexus IS (Altezza)

NISSAN & INFINITI
A141171
INFINITI:

Q50

NISSAN:

Micra
Note
NV200 Van
Qashqai
Sunny
Tiida
Tiida Latio
Tiida Sedan
Versa

A141174
NISSAN:

Altima 2006~2013
Altima Coupe
Altima Hybrid
Murano

A141039
MITSUBISHI:

Outlander 2.5L 2021~

NISSAN:

Altima 2.5L 2019~
Qashqai
Rogue (USA)
Rogue Sport
X-Trail

RENAULT:

Kadjar
Koleos

A147017
NISSAN:

Kicks 2016~
Versa Sedan 2019~

A141797
NISSAN:

Navara
Navara NP300
NP300 2014~
NP300 Frontier
Terra

A141825
NISSAN:

Altima 2.5L 2013~2019
Maxima 2.5L 2013~2019
Teana 2.5L 2013~2019

A142139
NISSAN:

Kicks 2016~
Versa Sedan 2019~

A140056
INFINITI:

QX56
QX80

NISSAN:

Patrol

A140035
INFINITI:

FX35

NISSAN:

350Z
Maxima 1994~2021
Murano
Sentra
Sunny
X-Trail 2000~2007

SUZUKI:

Swift
Vitara

A140319
INFINITI:

FX35, FX37
FX50, M37
Q50, Q60
Q70, QX70

NISSAN:

Juke
Rogue (USA)
Sentra
Sunny
Tiida
X-Trail

A142194
NISSAN:

Sentra 2019
Sylphy 2019

A140251
INFINITI:

QX56

NISSAN:

NV350 2012~
NV350 Caravan
NV350 Urvan
Urvan 2012~
Caravan
Armada (USA)
Frontier
NV
NV3500
Pathfinder
Titan (USA)
Xterra

A146909
INFINITI:

EX35
EX37
G25
G35
G37
M37
QX50 I

NISSAN:

350Z
Fairlady Z
Skyline

A142222
NISSAN:

Qashqai 2021~ 1.3L
Rogue (USA) 2021~ 1.5L, 2020~ 2.5L

RENAULT:

Austral 2022~ 1.3L

HYUNDAI & KIA
A141685
HYUNDAI:

Grandeur IG
Sonata 2014~

KIA:

K5
Optima
Optima (USA)

A141641
HYUNDAI:

Tucson 2015~

KIA:

Sportage 2015~

A146915
HYUNDAI:

Palisade 2018~
Santa FE 2018~

KIA:

Carnival/Sedona 2014~
Carnival/Sedona 2018~
Sorento (USA) 2014~
Sorento 2014~

A140905
HYUNDAI:

Azera 2011~
Grandeur IG

KIA:

Cadenza 2016~
K7

A141642
HYUNDAI:

Grand Santa FE
Santa FE
Santa FE 2012~

KIA:

Sorento (USA) 2012~
Sorento 2012~

A140943
KIA:

K5 2015~
Optima 2015~

A142140
HYUNDAI:

Accent 2011~
Solaris 2011~
Veloster 2012~

KIA:

Rio 2012~
Soul

A141042
HYUNDAI:

Azera
i45
Santa FE 10
Sonata 10

KIA:

Cadenza
K5
K7
Optima + Optima USA
Sorento (USA)
Sorento 2009

A140320
HYUNDAI:

Avante/Elantra 2016
i30
i30 SW
Kona
Kona/Kauai
Veloster

KIA:

Cee'd
Cerato 18
K3
Soul

A142092
HYUNDAI:

Avante/Elantra 2011~
Creta 2012~
i30

KIA:

Cee'd 2012~
Cerato III Forte Coupe
Cerato III Forte Sedan
Cerato III Forte Sedan 16
K3
Pro Cee'd
Seltos
Sportage 2011-2018

A147005
GENESIS:

G70 3.3L 2017~

KIA:

Stinger 3.3L 2017~

A142232
GENESIS:

G70 3.3L 2017~ (R/L versions)

KIA:

Stinger 3.3L 2017~ (R/L versions)

A140394
HYUNDAI:

Accent 2003~2012
Accent 2005~2012

KIA:

Rio 2003~2011

A141731
HYUNDAI:

Grand Starex
H1 Starex
H1 Starex [H1 Cargo] 07

A141065
GENESIS:

3.3L G80 2018
5.0L G80 2018
3.3L G90 2018

HYUNDAI:

Genesis 2014~2018

KIA:

K900 3.3L 2019~
Quoris

A140940
HYUNDAI:

Centennial/Equus
Genesis

A146951
HYUNDAI:

Avante/Elantra 06
i30

KIA:

Cee'd
Cerato
Forte

A146944
HYUNDAI:

Accent 2018~
i20

KIA:

Seltos 2019~
Sonet 2020~
Picanto 2017~

A141063
HYUNDAI:

Santa FE
Sonata 19

KIA:

Carnival/Sedona
K5
Sorento

A141062
KIA:

Bongo 2004~2016
K2700 2000~
Bongo
K4000

A140320
HYUNDAI:

Azera 2005~2012 3.3L
Grandeur TG 2006~2012 3.3L
Sonata 08 2007~2011 3.3L

A142094
HYUNDAI:

Accent 2018~
Solaris 2017~

KIA:

Rio 2017~
Rio/Stonic 2017~

A140943
HYUNDAI:

Creta
i40
iX 35
Tucson 2010~

KIA:

Carens 2012
Rondo
Seltos
Sportage 2010~ 2020~

A142189
HYUNDAI:

Entourage

KIA:

Carnival/Sedona
Carnival/Sedona 06

A142094
HYUNDAI:

Palisade
Santa FE

KIA:

Carnival/Sedona
Carnival/Sedona 18
Sorento 15 2.0L 2.2L
Sorento 18

A141731
HYUNDAI:

i10 2007~2016

KIA:

Morning 2011~2017
Picanto 2011~2017

A141722
HYUNDAI:

i10 2007~2013 1.2L

A146913
HYUNDAI:

Eon 2013~2018
i10 2013~

A147004
GENESIS:

G80 2014~
G90 2014~

HYUNDAI:

Genesis 2014~

KIA:

K9 2014~
K900 2014~

A141040
KIA:

Borrego 2008~2016 3.8L
Mohave 20082022 3.0L, 20082017 3.8L

A142142
HYUNDAI:

Venue 2019~ 1.6L

A140410
HYUNDAI:

Sonata 2004~2007 2.0L 2.04L 3.3L
Sonata 2008~2013 2.0L 2.4L

A140509
HYUNDAI:

Santa Fe 2006~2010 2.0L 2.2L 2.7L 3.3L

A141023
HYUNDAI:

i10 2007~2016 1.1L

MITSUBISHI & RENAULT
A140112
MITSUBISHI:

Galant
Lancer
Lancer (USA)
Lancer Cargo
Lancer Cedia
Lancer Evolution
Lancer Evolution IX
Outlander
Outlander (USA)
Pajero IO

RENAULT:

Symbol
Logan
Megane
Sandero
Clio II
Clio Symbol

A142130
RENAULT:

Duster
Espace
Kangoo
Kangoo II
Talisman
Megane IV
Megane IV Sedan
Espace V
Grand Scenic IV
Scenic IV

A141434
RENAULT:

Fluence
Megane III
Scenic III

A142125
SSANGYONG:

Actyon
Actyon Sports
Actyon Sports II
Kyron
Rodius/Stavic
Rodius/Stavic II
Korando
NEW Actyon (Korando C)

A141425
MITSUBISHI:

ASX
Galant Fortis
Lancer
Lancer Evolution X
Lancer EX
Lancer Sportback
Outlander
Outlander (USA)
Outlander Sport
RVR

A141252
MITSUBISHI:

ASX
Eclipse Cross
Galant Fortis
Grandis
Outlander
Outlander Sport
RVR

A142129
MITSUBISHI:

L200
Nativa
Pajero/Montero
Pajero/Montero Sport
Pajero Sport
Triton

A140092
MITSUBISHI:

Pajero
Pajero/Montero
Shogun

PEUGEOT:

206 Hatchback (2A/C)
307 (3A/C)
307 Break (3E)
307 CC (3B)
307 SW (3H)

A141422
SSANGYONG:

Actyon Sports
Actyon Sports II
Musso
Rexton Sports
Rodius/Stavic
Rodius/Stavic II

A146992
CHERY:

Chery Tiggo 1.6L 20122013, 1.8L 20082012, 2.0L 2006~

A141365
RENAULT:

Koleos
Kadjar

VOLKSWAGEN, AUDI, SKODA & SEAT
A140853
AUDI:

A3, Q3, TT

SKODA:

Octavia II, Octavia RS

VOLKSWAGEN:

Beetle
Caddy III
Golf V, VI
Jetta V, VI
New Beetle
Passat
Passat CC
Tiguan

A141837
AUDI:

A3 III
Q2, Q3, TT

SKODA:

Octavia

VOLKSWAGEN:

Arteon
Golf
Jetta
Passat
Tiguan
Touran

A141242
AUDI:

Q7

VOLKSWAGEN:

Touareg

A140460
AUDI:

A8 3.0L 4.0L 4.2L

A140750
AUDI:

A3, A3 II

SKODA:

Octavia II

VOLKSWAGEN:

Caddy III
Golf, Golf V, Golf VI
Jetta V, Jetta VI
New Passat
Passat
Tiguan
Touran

A141700
AUDI:

A4
A5
Q5
S4
S5
SQ5

A140894
AUDI:

A6 2.8L 3.0L 4.0L
A7 2.8L 3.0L 4.0L

A141727
AUDI:

A6
A6L
A7

A142198
VOLKSWAGEN:

Golf VIII 2019~ 1.8L
Jetta 2019~ 1.4L

A141933
VOLKSWAGEN:

Atlas 2017~ 2.0L, 2016~ 3.6L
Teramont 2017~ 2.0L, 2019~ 3.6L

A146948
AUDI:

A4 2015~ 2.0L
Q5 2016~ 2.0L

A140012
AUDI:

A4 2007~2013 1.8L 2.0L
A4 Allroad 2008~2016
A4L 2008~2016
A5 2009~2017
Q5 2009~2017

A140860
AUDI:

A3, A3 I, TT

SEAT:

Leon I
Toledo II

SKODA:

Octavia I

VOLKSWAGEN:

Beetle Convertible
Bora
Golf Estate
Golf IV
New Beetle
Jetta V, VI
Passat
Beetle (5C1, 5C2)
Beetle Convertible (5C7, 5C8) 2.5L 2005~2018

A142018
PORSCHE:

Panamera
Panamera 4
Panamera 4S
Panamera S
Panamera TURBO S

A140852
AUDI:

Q7

LAND ROVER:

Range Rover III
Range Rover Sport

PORSCHE:

Cayenne
Cayenne GTS
Cayenne S
Cayenne TURBO
Cayenne TURBO S

VOLKSWAGEN:

Touareg

A141783
AUDI:

A1
A3 III
Q2, Q3

SEAT:

Alhambra II
Ateca
Ibiza MK IV
Leon
Leon III
Tarraco
Toledo IV

SKODA:

Fabia
Karoq
Kodiaq
Octavia I
Octavia III
Octavia IV
Rapid
SuperB III

VOLKSWAGEN:

CC
Golf Sportsvan
Golf Variant
Golf VII
Jetta VI
Polo V
Polo V Sedan
Taos
Tiguan
Tiguan II
Touran

A141453
AUDI:

A1
A3 III
Q2

SKODA:

Fabia
Karoq
Octavia III

VOLKSWAGEN:

Golf VII
Polo VI
T-Roc
UP

A141934
PORSCHE:

Macan
Macan S
Macan Turbo

A140336
SKODA:

Fabia
Octavia II
Praktik
Rapid
Roomster

VOLKSWAGEN:

Golf VI
Jetta VI
Polo IV
Polo V Sedan
Vento

A140890
VOLKSWAGEN:

Caddy I
Golf Cabriolet
Golf II
Scirocco

BMW & MINI
A142136
BMW:

116i, 118i, 120i
316i, 318i, 320i, 320si
X1 sDrive 18 I

A146932
BMW:

216i, 218d, 218i
220d, 220i, 225i
X1 sDrive
X2 xDrive

MINI:

Cooper, Cooper D
Cooper S, Cooper S ALL4
Cooper SD
F54 Clubman
One, One D
One First

A146993
BMW:

730, 735i, 740, 745
750i, 760

BMW (ALPINA):

B7

ROLLS-ROYCE:

Phantom

A146938
BMW:

125i
320i
320i xDrive
330e
330i
M140i
M240i

A142088
BMW:

316i, 318
320, 323, 325
328i
330, 520i, 523i
525i
528i, 530i
728i
M3
X3
Z3 (2000~2006)

A147006
BMW:

520i
528i
X1 sDrive 20 i
X1 xDrive 28 i
Z4

A141696
BMW:

520d, 520i, 525d
530d, 530i, 530Li
540iX
730d, 730Li
740i, 740Ld, 740LeX, 740Li
840d, 840i
X3 sDrive 20 i
X3 xDrive 20 d, 20 i, 30 i
X5 xDrive 30d

A146981
BMW:

520i, 523i, 525i
530i, 630i
Z4 (2016~)

A146980
BMW:

750i 1994~2001 5.4L
X5 3.0i 2000~2006 3.0L

A141220
BMW:

535i, 640i, 740i, 740Li
Active Hybrid 5, 7
X3 xDrive 35 i
X4 xDrive 35 i
X6 xDrive 35 i
xDrive 35i

A140073
BMW:

xDrive 40e 2015~2018 2.0L

A146977
BMW:

316i, 318Ci, 318i
320Ci, 320i
323 ti, 323Ci, 323i
325 ti, 325Ci, 325i, 325iX
328i
330Ci, 330i
520i, 523i, 525i
528i, 530i
728i

A141736
BMW:

114d, 116d, 118d
120d, 120d xDrive
225d, 316d, 318d
320d, 325d, 420d

A141737
BMW:

114i, 116i, 118i, 125i
218i, 220i, 228i
316i, 318i, 320i
320i xDrive
328i, 328i xDrive

A140903
BMW:

1 M Coupe
135i, 335i, 535i
Z4
X3 sDrive 20 i
X3 xDrive 20 i, 28 i
X4 xDrive 20 i, 28 I

A141058
BMW:

550i, 550i GT, 550i xDrive
650i, 750i, 750Li
Active Hybrid 7
X5 xDrive 50i
X6 ActiveHybrid
X6 xDrive 50 i (RIGHT)

A140902
BMW:

550i, 550i GT, 550i xDrive
650i, 750i, 750Li
Active Hybrid 7
X5 xDrive 50i
X6 ActiveHybrid
X6 xDrive 50 i (LEFT)

A141725
BMW:

125i, 130i
323i, 325i, 328i
330i, 330xi
X1 xDrive 28 I
X5 3.0d, 3.0sd
X6 xDrive 35 d

A141019
BMW:

118d, 120d, 123d, 316d
318d, 320d, 320xd
325d, 330d
330d xDrive, 330xd
X1 sDrive 18 d, 20 d
X1 xDrive 20 d

A140076
BMW:

520i, 525 iX, 525i
M5 (1990~1997)

A141031
BMW:

X5 3.0si
X5 xDrive 30i (2006~2010)

A140291
BMW:

760i, 760Li

FORD:

Focus I
Tourneo
Transit Connect Tc7
Transit VI

FORD (USA):

Focus I, II

ROLLS-ROYCE:

Ghost

A141225
BMW:

730i, 730Li
735i, 735Li
740d, 740i, 740Li
745d, 745i, 745Li
750i, 760Li

BMW (ALPINA):

B7

ROLLS-ROYCE:

Phantom
Phantom Drophead Coupe

MERCEDES-BENZ
A142115
MERCEDES-BENZ:

C-Classe (W205/A205/C205/S205)
E-Classe (W/S212) (W/S213, A/C238)
GLC/GLC Coupé (X253/C253)
GLE/GLS/GLE Coupe (W167)
SLC (R172)
SLK (R172)

A141686
MERCEDES-BENZ:

C 230, C 240, C 250, C 280, C 300, C 320, C 350, C 55 AMG
CL 500, CL 55 AMG
CLC 230, CLC 350
CLK 240, CLK 280, CLK 320, CLK 350, CLK 500
CLS 350, CLS 500
E 230, E 230 AMG, E 240, E 280, E 300, E 320, E 350, E 500
G 320, G 500, G 55 AMG
GL 450, GL 500
GLK 280
ML 300, ML 350, ML 500
R 280, R 350, R 500
S 280, S 300, S 320L, S 350, S 350 AMG, S 350L, S 430, S 450, S 500, S 55 AMG
SL 280, SL 300, SL 320, SL 350, SL 500, SL 55 AMG
SLK 280

A1401982X
MERCEDES-BENZ:

C 450 AMG Sport
CLS 400
E 400, E 400 4MATIC
E 450, E 500, E320
GL 400
GLC 450 AMG Sport
GLE 400, GLE 450 AMG
ML 400
S 320L, S 400
SL 400

A142117
MERCEDES-BENZ:

X 220d
X 220d 4-matic
X 250
X 250d
X 250d 4-matic

A141066
MERCEDES-BENZ:

C 300, C 350
CLS 350
E 300, E 350
GLE 350, GLK 300
GLK 350
ML 300, ML 350
S 350, S 400
SL 350
SLK 350

A146936
MERCEDES-BENZ:

C 180, C 200, C 230
CLC 160, CLC 180, CLC 200
CLK 200
E 200
SLK 200

A140209
MERCEDES-BENZ:

C 180, C 200, C 250
E 200, E 250
GLC 250, GLC 300, GLC 350 e (PLUG-IN HYBRID)

INFINITI:

Q50, Q60

A141748
MERCEDES-BENZ:

C 180, C 200, C 220d, C 250
CLS 250
E 200, E 220, E 250, E 300
GLK 220

A142108
MERCEDES-BENZ:

C 220d
CLS 350, CLS 400
E 200, E 220
GLC 300d
GLE 300, GLE 450 EQ Boost
S 350, S 350d, S 450

A141714
MERCEDES-BENZ:

CL 55 AMG
CLK 55 AMG
CLS 55 AMG
E 55 AMG
G 55 AMG
S 55 AMG
SL 350, SL 55 AMG
SLK 350

A141791
MERCEDES-BENZ:

A 180, A 200, A 220, A 250
B 180, B 200, B 250
CLA 180, CLA 200, CLA 250
GLA 180, GLA 250

A141705
MERCEDES-BENZ:

CL 500, CL 63 AMG
CLS 500, CLS 63 AMG
E 500
E 63 AMG, G 63 AMG
GL 450, GL 500, GL 63 AMG
GLE 63 S AMG
ML 500, ML 63 AMG
S 500, S 500L, S 63 AMG
SL 500, SL 63 AMG

A142097
MERCEDES-BENZ:

C 180, C 200, C 250
E 200, E 250
SLK 200, SLK 250

A146983
MERCEDES-BENZ:

A 180, A 200
B 200
CLA 180 AMG, CLA 200
GLA 200
GLB 180, GLB 200 (2015~ 2009~2015)

A141799
MERCEDES-BENZ:

C 250
E 200, E 220, E 250, E 300
GLK 220
ML 250
S 250

A146940
MERCEDES-BENZ:

CLS 350
E 300, E 350
G 350
GL 320, GL 350
GLE 350d
GLK 350
ML 350
R 350
S 350

A141689
MERCEDES-BENZ:

A 45 AMG
CLA 45 AMG
GLA 45 AMG
SL 280, SL 320

SSANGYONG:

Rexton

A146950
MERCEDES-BENZ:

E 200, E 220, E 230, E 240
E 250, E 280, E 290, E 300
E 320, E 420, E 430
G 300

A140069
MERCEDES-BENZ:

X 220d
X 220d 4-matic
X 250, X 250d
X 250d 4-matic

A146984
MERCEDES-BENZ:

A 250
AMG A 35, AMG CLA 35
CLA 250
GLA 250
GLB 250 (2019~)

A140861
MERCEDES-BENZ:

209 D, 210 D, 211 CDI, 214 CDI
215 D, 216 D, 218 D
311 CDI, 313 D, 315 D, 315 KA
316, 319 D, 411 D, 416 CDI
424, 511 CDI, 513 D
515 CDI, 515 D, 519 D

A146933
INFINITI:

Q50

MERCEDES-BENZ:

C 220d, C 250, C 300
GLC 220 d, GLC 250 d (2015~)

LAND ROVER & JAGUAR
A142088
LAND ROVER:

Discovery IV, Discovery V
Range Rover, Range Rover III, Range Rover IV
Range Rover Sport
Range Rover Vogue

A141741
LAND ROVER:

Discovery Sport
Freelander II

RANGE ROVER:

Evoque

A146932
JAGUAR:

E-Pace 2.0L

LAND ROVER:

Discovery Sport 1.5L 2.0L

RANGE ROVER:

Evoque 1.5L 2.0L

A146993
JAGUAR:

F-Pace, XE, XF

LAND ROVER:

Range Rover Velar

A146938
LAND ROVER:

Freelander II 20062014 2.2L, 20062014 3.2L

JAGUAR:

F-Pace, XE, XF

LAND ROVER:

Range Rover Velar (RIGHT/LEFT)

A141444
JAGUAR:

S-Type, XF, XFR, XJ
XJ6, XJ8, XJ8L, XJR

GENERAL MOTORS (CHEVROLET, CADILLAC, GMC, BUICK)
A142101
CADILLAC (GM):

ATS

CHEVROLET (GM):

Cruze

OPEL:

Astra K

A142100
CHEVROLET (GM):

Aveo (T300)
Cobalt, Optra, Sonic, Spin

DAEWOO:

Aveo

HOLDEN:

Barina

RAVON:

R4

A146924
CHEVROLET (GM):

Malibu 2016~ 1.5L

OPEL:

Insignia 2017~ 1.5L

A141105
CHRYSLER:

200 2015-2017

A142039
CHEVROLET (GM):

Spark

OPEL:

Karl

A146972
BUICK:

REGAL 2014-2017

CADILLAC:

XTS 2013-2019

CHEVROLET:

IMPALA 2014-2019
MALIBU 2013-2015
MALIBU LIMITED 2016

A141143
CHEVROLET (GM):

Aveo (T250)
Aveo (T250/T255)
Aveo (T300)
Optra 2003~2014
Lacetti Hatchback
Nubira

A142193
DODGE:

Journey 2009-2020

A141648
CHRYSLER:

300C

DODGE:

CHALLENGER, Charger

CHEVROLET:

Impala Limited 3.6L 2014
Impala 3.6L V6 2012

A146963
CADILLAC (GM):

Escalade, Escalade ESV

CHEVROLET (GM):

Avalanche, Silverado, Suburban, Tahoe

GMC (TRUCK):

Yukon Denali, Yukon XL 2500

A141728
CADILLAC (GM):

ATS, CTS

CHEVROLET (GM):

Camaro

AF9401
CHEVROLET:

EQUINOX 2012-2017 2.4L 3.0L 3.6L

GMC (TRUCK):

Terrain 2012-2017 2.4L 3.0L 3.6L

A141759
CHEVROLET (GM):

Cruze, Cruze Hatchback
Cruze Station Wagon, Orlando

DAEWOO:

Lacetti

HOLDEN:

Cruze

OPEL:

Astra, Astra J

A146967
CHEVROLET (GM):

Equinox 2017~ 1.5L 1.6L

GMC (TRUCK):

Terrain 2017~ 1.5L 2.0L

A142197
CHEVROLET:

Camaro 3.6L V6, 6.2L V8

AF11251
CADILLAC (GM):

Escalade 2020~ 6.2L

A141021
DODGE:

Avenger 2010~2014 3.6L

A146994
CHEVROLET (GM):

Tracker/Trax, Trax

OPEL:

Mokka, Mokka X

A140972
CHEVROLET (GM):

Camaro 2015~ 6.2L

A142141
CADILLAC (GM):

ATS, CTS

CHEVROLET (GM):

Camaro

CHRYSLER:

Grand Caravan 3.6L V6, Pacifica 3.6L V6

CHRYSLER, DODGE, JEEP
A142137
JEEP:

Grand Cherokee

MITSUBISHI:

L200
Pajero/Montero
Pajero/Montero Sport
Pajero Sport
Triton

A146968
JEEP:

Cherokee

A141009
CHRYSLER:

300C

DODGE:

Charger, Magnum

JEEP:

Cherokee, Cherokee Pioneer
Grand Cherokee, Liberty
Wrangler 20112018 3.6L, 20062012 3.8L

A142192
JEEP:

Wrangler 2018~ 2.0L, 2017~ 3.6L
Cherokee 2019~

A141632
JEEP:

COMPASS 2018-2021
RENEGADE 2015-2021

RAM:

PROMASTER CITY 2015-2021

A140966
DODGE:

Caliber 2006~2012

JEEP:

Compass 2.0L 20062012, 2.4L 20062017
Patriot 2006~2017

A142146
JEEP:

Cherokee, Grand Cherokee (1990~)

A141800
INFINITI:

FX30 2010~2013
M37 2010~2013
Q70 2010~2019
QX70 2010~2016

FORD & LINCOLN
A140929
FORD:

Edge, Explorer, Flex, Taurus V

LINCOLN:

MKS, MKT, MKX

MAZDA:

CX-9, Mazda 6

A146926
FORD:

FUSION 2006-2012

MAZDA:

6 2009-2013

MERCURY:

MILAN 2006-2011

A141796
FORD:

Edge, Fusion, Galaxy
Mondeo V, S-Max

LINCOLN:

MKZ

A141131
FORD:

Ranger

MAZDA:

BT-50

A140914
FORD:

EXPEDITION 2007-2020
F-150 2009-2021
F-250 SUPER DUTY, F-350 SUPER DUTY 2008-2016
F-450 SUPER DUTY 2008-2016

LINCOLN:

NAVIGATOR 2007-2020

A141254
FORD:

C-Max, Escape, Focus
Focus III Turnier, Kuga

LINCOLN:

MKC

MAZDA:

Mazda 3, Mazda 5

VOLVO:

C30, S40, V40
V40 Cross Country, V50

A147015
FORD:

Mustang 2014~

A146962
FORD:

EcoSport, Fiesta, Fiesta VI
KA+, Tourneo Courier

FORD (USA):
Fiesta

MAZDA:
Mazda 2

A142190
FORD:
Mustang 2014~

A146945
FORD:
Explorer L4 2.3L, V6 3.3L
Police Interceptor Utility V6 3.3L 2020~

A142173
FORD:
EcoSport, Fiesta, KA+
Tourneo Courier
Escape 2.5L L4, Kuga
Transit Connect

A146960
FORD:
Fusion 20122020 2.0L, 20152019 2.7L
Mondeo V 2014~ 2.0L

LINCOLN:
MKZ 2012~2020 2.0L

A142174
FORD:
Escape, Focus IV
Focus IV Turnier, Kuga
Maverick

FORD (USA):
Bronco Sport

LINCOLN:
Corsair

A146961
FORD:
Ranger 2019~ 2.0

FORD (USA):
Ranger 2018~ 2.3L

A142221
FORD:
Mustang 20102014 3.7L, 20102014 5.0L

A141713
FORD:
Focus I, Tourneo
Transit Connect Tc7, Transit VI

FORD (USA):
Focus I, II

ROLLS-ROYCE:
Ghost

A146986
BMW:
730i, 730Li, 735i, 735Li
740d, 740i, 740Li
745d, 745i, 745Li
750i, 760Li

BMW (ALPINA):
B7

ROLLS-ROYCE:
Phantom, Phantom Drophead Coupe

A141780
FORD:
Edge, Explorer, Flex, Taurus V

LINCOLN:
MKS, MKT, MKX

MAZDA:
CX-9, Mazda 6

A141345
FORD:
FUSION 2006-2012

MAZDA:
6 2009-2013

MERCURY:
MILAN 2006-2011

A146901
FORD:
Edge, Fusion, Galaxy
Mondeo V, S-Max

LINCOLN:
MKZ

A142195
FORD:
Ranger
MAZDA:

BT-50

A142196
FORD:
EXPEDITION 2007-2020
F-150 2009-2021
F-250 SUPER DUTY, F-350 SUPER DUTY 2008-2016
F-450 SUPER DUTY 2008-2016

LINCOLN:
NAVIGATOR 2007-2020

HONDA & ACURA
A147007
HONDA:
Civic, Civic (USA)
Accord 2017~ 1.5L

A146918
HONDA:
CR-V 2011~2016 2.4L
CR-V (USA) 2011~2014 2.4L

ACURA:
ILX 2012~2015 2000

A141795
HONDA:
Civic 20112018 1.6L, 20112017 1.8L 2.0L
Civic (USA) 2012~2014 1800
Civic Coupe 2014~2015 1.8L

A142135
ACURA:
TLX
HONDA:
Accord 2012~2018
Accord Coupe

A146998
MG (SAIC):
GS 1,5 2,0 TGI
HS 2,0 T 2015
RX5 1,5 T 2,0 T 2016
RX8

A140342
HONDA:
Civic, Civic (USA)
Civic Coupe
Civic VIII (EUR)
Crossroad, FR-V, Stream (2001~2012)

A147008
HONDA:
Accord 2013~ 2.0L
CR-V 2018~ 2.0L

A142230
MG (Morris Garages):
MG 5

A142228
MG (Morris Garages):
ZS

A142229
MG (Morris Garages):
MG 6

MAZDA
A141795
MAZDA:
CX-4, CX-5, CX-8
Mazda 3, Mazda 5
Mazda 6, Mazda 6 Wagon

A146918
MAZDA:
Mazda 3 1.6L 2013~2019

A142135
MAZDA:
Axela 1.5L
CX-3 1.5L
Demio 1.5L
Mazda 2 1.5L
Mazda 3 1.5L

TOYOTA:
Scion IA/Yaris R/IA 1.5L

A140342
MAZDA:
CX-3 2018~ 1.8L
CX-30 2019~ 1.8L 2019~ 2.0L
Mazda 3 2019~ 1.8L 2019~ 2.0L

A140595
FORD:
Ranger
MAZDA:
BT-50
MITSUBISHI:
Aspire, Galant, RVR

VOLVO
A140595
VOLVO:
S60, S60 II, S80
V60, V70
XC60, XC70

A141011
VOLVO:
S40, S60, S80
V70, XC70

A147014
VOLVO:
[Additional models - specific part applications]

A142015
VOLVO:
[Additional models - specific part applications]

A147009
VOLVO:
[Additional models - specific part applications]

A141809
VOLVO:
[Additional models - specific part applications]

A146949
VOLVO:
[Additional models - specific part applications]
CHINESE BRANDS (HAVAL, GREAT WALL, MG)

A142225
HAVAL:
H9

A142226
HAVAL:
H2

A142227
HAVAL:
H6
GREAT WALL:
PICKUP POER
WINGLE 5

A147004
HAVAL:
H6 2021
Dargo
Jolion 2021~
GREAT WALL: 7

A147007
MG (Morris Garages):
ZS 2017~
📋 تنسيق الإجابة الإجباري:

1️⃣ <b>[نوع المحرك]</b>  
🛢️ سعة الزيت: [X.X لتر]  
⚙️ اللزوجة: [XW-XX]  
🔧 نوع الزيت: Full Synthetic  
🌡️ مناسب لحرارة العراق: ✅  
🎯 <b>التوصية النهائية:</b> [اسم الزيت + اللزوجة] ([سعة الزيت] لتر)  
📦 <b>فلتر الزيت:</b> [رقم فلتر الزيت]

❗ عدم الالتزام بالتنسيق أو بزيت غير معتمد = خطأ فادح

🔍 أمثلة:

🟩 إذا كانت السيارة تحتوي على محرك واحد:  
↪️ قدم الإجابة مباشرة بذلك المحرك فقط.

🟨 إذا كانت السيارة تحتوي على أكثر من نوع محرك:  
↪️ قدم الإجابات لجميع المحركات في نفس الرد، كل واحدة بتنسيق منفصل كما هو موضح أعلاه.

🟥 لا تطلب من المستخدم اختيار المحرك إذا لم يذكره. اعرض كل الخيارات المعروفة للموديل.

🎯 هدفك النهائي:  
تقديم توصية <b>موثوقة، دقيقة، بسيطة، ومناسبة تماماً للمناخ العراقي القاسي</b>، مع الالتزام الكامل بكل التعليمات.

`,
  headers: {
    "HTTP-Referer": "https://www.carsiqai.com",
    "X-Title": "Car Service Chat - CarsiqAi",
  },
}

// Enhanced OpenRouter client with retry logic
const createOpenRouterClient = () => {
  return createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Car Service Chat - CarsiqAi"
    }
  })
}

// Check if error message indicates token limit reached
function isTokenLimitError(error: any): boolean {
  if (!error || !error.message) return false
  
  const errorMsg = error.message.toLowerCase()
  return (
    errorMsg.includes('token') && 
    (errorMsg.includes('limit') || errorMsg.includes('exceeded') || errorMsg.includes('quota')) ||
    errorMsg.includes('billing') ||
    errorMsg.includes('payment required') ||
    errorMsg.includes('insufficient funds')
  )
}

// Reset API status if enough time has passed
function checkAndResetTokenLimitStatus(): void {
  if (apiStatus.isTokenLimitReached && apiStatus.lastErrorTime) {
    // Reset after 24 hours
    const resetTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    if (Date.now() - apiStatus.lastErrorTime.getTime() > resetTime) {
      console.log('Resetting token limit status after 24 hours')
      apiStatus.isTokenLimitReached = false
      apiStatus.errorCount = 0
      apiStatus.lastError = undefined
      apiStatus.lastErrorTime = undefined
    }
  }
}

/**
 * Enhanced car data extraction with better accuracy
 */
function enhancedExtractCarData(query: string): ExtractedCarData {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Enhanced brand detection with common Arabic variations
  const brandMappings = {
    'تويوتا': ['تويوتا', 'toyota'],
    'هيونداي': ['هيونداي', 'هيوندا', 'hyundai'],
    'كيا': ['كيا', 'kia'],
    'نيسان': ['نيسان', 'nissan'],
    'هوندا': ['هوندا', 'honda'],
    'مرسيدس': ['مرسيدس', 'mercedes', 'بنز'],
    'بي ام دبليو': ['بي ام دبليو', 'bmw', 'بمو'],
    'لكزس': ['لكزس', 'lexus'],
    'جينيسيس': ['جينيسيس', 'genesis'],
    'فولكس واجن': ['فولكس واجن', 'volkswagen', 'vw'],
    'اودي': ['اودي', 'audi'],
    'مازدا': ['مازدا', 'mazda'],
    'سوزوكي': ['سوزوكي', 'suzuki'],
    'ميتسوبيشي': ['ميتسوبيشي', 'mitsubishi'],
    'شيفروليت': ['شيفروليت', 'chevrolet', 'شفروليه', 'شيفي', 'شيفي', 'شيفروليه'],
    'فورد': ['فورد', 'ford'],
    'بيجو': ['بيجو', 'peugeot'],
    'رينو': ['رينو', 'renault'],
    'جيب': ['جيب', 'jeep']
  }
  
  let detectedBrand = ''
  let confidence = 0
  
  for (const [brand, variations] of Object.entries(brandMappings)) {
    for (const variation of variations) {
      if (normalizedQuery.includes(variation)) {
        detectedBrand = brand
        confidence += 30
        break
      }
    }
    if (detectedBrand) break
  }
  
  // Enhanced model detection
  const commonModels = [
    'كامري', 'كورولا', 'rav4', 'هايلندر', 'برادو', 'لاند كروزر',
    'النترا', 'سوناتا', 'توسان', 'سنتافي', 'أكسنت', 'i10', 'i20', 'i30',
    'سيراتو', 'اوبتيما', 'سورنتو', 'كادينزا', 'ريو',
    'التيما', 'سنترا', 'اكس تريل', 'باترول', 'مورانو',
    'سيفيك', 'اكورد', 'crv', 'hrv', 'بايلوت',
    'c200', 'c300', 'e200', 'e300', 's500', 'glc', 'gle',
    '320i', '330i', '520i', '530i', 'x3', 'x5',
    'es300', 'is300', 'rx350', 'lx570',
    'g70', 'g80', 'g90', 'gv70', 'gv80',
    'كومباس', 'compass', 'شيروكي', 'cherokee', 'رانجلر', 'wrangler', 'رينيجيد', 'renegade',
    'كامارو', 'camaro', 'كمارو', 'كمارو', 'كامرو', 'كامارو',
    'كروز', 'cruze', 'ماليبو', 'malibu', 'سيلفرادو', 'silverado', 'تاهو', 'tahoe'
  ]
  
  let detectedModel = ''
  for (const model of commonModels) {
    if (normalizedQuery.includes(model)) {
      detectedModel = model
      confidence += 25
      
      // Special handling for Camaro model
      if (model === 'كامارو' || model === 'camaro' || model === 'كمارو' || model === 'كامرو') {
        detectedModel = 'camaro'
        confidence += 5 // Extra confidence for this specific model
      }
      
      break
    }
  }
  
  // Enhanced year extraction with multiple patterns
  let year: number | undefined
  let maxConfidence = 0
  
  // Array of regex patterns to try for year extraction
  const yearPatterns = [
    /\b(20[0-2][0-9])\b/, // Standard 20XX format
    /\bموديل\s+(\d{4})\b/, // "موديل YYYY"
    /\bmodel\s+(\d{4})\b/i, // "model YYYY"
    /\b(\d{4})\s+model\b/i, // "YYYY model"
    /\b(\d{4})\s+موديل\b/ // "YYYY موديل"
  ]
  
  // Helper function to convert Arabic digits to English
  function convertDigitsToEnglish(str: string): string {
    return str.replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632));
  }
  
  // Try each pattern and keep the result with highest confidence
  for (const pattern of yearPatterns) {
    const matches = normalizedQuery.match(pattern);
    if (matches && matches.length > 0) {
      for (const match of matches) {
        // Extract the year from the match
        const extractedYear = match.match(/\d{4}/) ? 
                            match.match(/\d{4}/)![0] : 
                            convertDigitsToEnglish(match);
        
        // Validate the year is within reasonable range
        const yearNum = parseInt(extractedYear);
        if (yearNum >= 1980 && yearNum <= new Date().getFullYear() + 1) {
          // Calculate confidence based on position in text and format
          const positionInText = normalizedQuery.indexOf(match) / normalizedQuery.length;
          const patternConfidence = 15 + (positionInText < 0.5 ? 5 : 0);
          
          if (patternConfidence > maxConfidence) {
            year = yearNum;
            maxConfidence = patternConfidence;
          }
        }
      }
    }
  }
  
  // Specific handling for Camaro 2016
  if (detectedModel === 'camaro' && !year) {
    // Look for "16" or "2016" patterns that might indicate a 2016 Camaro
    const camaroYearMatches = normalizedQuery.match(/\b(16|2016)\b/);
    if (camaroYearMatches) {
      const extractedYear = camaroYearMatches[1];
      year = extractedYear === '16' ? 2016 : parseInt(extractedYear);
      maxConfidence = 15;
      logger.debug("Extracted year from text", { year, confidence: maxConfidence });
    }
  }
  
  // Add the year confidence to total confidence
  if (year) {
    confidence += maxConfidence;
  }
  
  // Enhanced mileage extraction
  const mileagePatterns = [
    /(\d+)\s*ألف/,
    /(\d+)\s*الف/,
    /(\d+)\s*k/i,
    /(\d+)\s*km/i,
    /(\d+)\s*كيلو/,
    /ماشية\s+(\d+)/,
    /قاطع\s+(\d+)/,
    /عداد\s+(\d+)/,
    /(\d+)\s*كم/
  ]
  
  let mileage: number | undefined
  for (const pattern of mileagePatterns) {
    const match = normalizedQuery.match(pattern)
    if (match) {
      // Check if this is "X ألف" format (thousands)
      const isThousands = pattern.toString().includes('ألف') || 
                          pattern.toString().includes('الف') || 
                          pattern.toString().includes('k');
      
      mileage = parseInt(match[1]);
      if (isThousands) {
        mileage *= 1000;
      }
      confidence += 15
      break
    }
  }
  
  // VIN extraction from query
  let vinNumber: string | undefined;
  const vinPatterns = [
    /\bVIN\s*[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/i,
    /\bرقم الهيكل\s*[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/i,
    /\b([A-HJ-NPR-Z0-9]{17})\b/i
  ];
  
  for (const pattern of vinPatterns) {
    const match = normalizedQuery.match(pattern);
    if (match && match[1]) {
      // Verify this looks like a valid VIN (17 characters, no I,O,Q)
      const potentialVin = match[1].toUpperCase();
      if (/^[A-HJ-NPR-Z0-9]{17}$/.test(potentialVin) && !potentialVin.includes('I') && !potentialVin.includes('O') && !potentialVin.includes('Q')) {
        vinNumber = potentialVin;
        confidence += 35; // High confidence for VIN detection
        break;
      }
    }
  }
  
  // Special handling for Chevrolet Camaro
  if (detectedBrand === 'شيفروليت' && detectedModel === 'camaro') {
    if (!year) {
      // If we couldn't detect a year but it's a Camaro, default to 2016 with lower confidence
      year = 2016;
      confidence += 5;
      logger.debug("Defaulting to 2016 for Chevrolet Camaro", { confidence: 5 });
    }
    
    // Increase confidence for Chevrolet Camaro detection
    confidence += 10;
    
    // Check for specific engine type indicators in the query
    const isV8 = normalizedQuery.includes('v8') || 
                normalizedQuery.includes('ss') || 
                normalizedQuery.includes('اس اس') ||
                normalizedQuery.includes('zl1') ||
                normalizedQuery.includes('زد ال 1') ||
                normalizedQuery.includes('6.2');
                
    const isV6 = normalizedQuery.includes('v6') || 
               normalizedQuery.includes('3.6');
               
    // Add engine information to the return object
    if (isV8) {
      return {
        carBrand: detectedBrand,
        carModel: detectedModel,
        year,
        mileage,
        engineSize: '6.2L V8',
        isValid: true,
        confidence: confidence + 15
      };
    } else if (isV6) {
      return {
        carBrand: detectedBrand,
        carModel: detectedModel,
        year,
        mileage,
        engineSize: '3.6L V6',
        isValid: true,
        confidence: confidence + 10
      };
    } else {
      // Default to 2.0L L4 if no specific engine mentioned (base model)
      return {
        carBrand: detectedBrand,
        carModel: detectedModel,
        year,
        mileage,
        engineSize: '2.0L L4',
        isValid: true,
        confidence: confidence + 5
      };
    }
  }
  
  return {
    carBrand: detectedBrand,
    carModel: detectedModel,
    year,
    mileage,
    vin: vinNumber, // Add VIN to extracted data
    isValid: confidence >= 50,
    confidence
  }
}

/**
 * Enhanced analytics with better error handling and validation
 */
async function saveQueryToAnalytics(
  query: string | undefined, 
  carData?: ExtractedCarData,
  recommendation?: OilRecommendation
) {
  if (!isSupabaseConfigured() || !query || query.trim() === '') {
    console.log('Supabase not configured or empty query. Skipping analytics tracking.')
    return
  }

  try {
    const analyticsData = {
      query: query.trim(),
      car_model: carData?.carModel,
      car_brand: carData?.carBrand,
      car_year: carData?.year,
      mileage: carData?.mileage,
      query_type: determineQueryType(query),
      confidence_score: carData?.confidence || 0,
      recommended_oil: recommendation?.primaryOil?.[0],
      oil_viscosity: recommendation?.viscosity,
      oil_capacity: recommendation?.capacity,
      source: 'web',
      timestamp: new Date().toISOString(),
      session_id: generateSessionId()
    }

    const { error } = await supabase.from('user_queries').insert(analyticsData)

    if (error) {
      console.error('Error saving query to analytics:', error)
      // Log to external service if needed
      logger.error('Analytics save failed', { error, query })
    } else {
      console.log('Successfully saved query to analytics:', query.substring(0, 50))
      
      // Update counters asynchronously
      if (carData?.carModel) {
        updateModelQueryCount(carData.carModel).catch(console.error)
      }
      
      if (carData?.carBrand) {
        updateBrandQueryCount(carData.carBrand).catch(console.error)
      }
    }
  } catch (err) {
    console.error('Error in analytics tracking:', err)
    logger.error('Analytics tracking failed', { error: err, query })
  }
}

/**
 * Enhanced query type determination with better accuracy
 */
function determineQueryType(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  // Car Specifications
  if (
    lowerQuery.includes('مواصفات') || 
    lowerQuery.includes('سعة المحرك') || 
    lowerQuery.includes('engine size') || 
    lowerQuery.includes('cc') ||
    lowerQuery.includes('سي سي')
  ) {
    return 'SPECIFICATIONS'
  }
  
  // Oil Change/Service
  if (
    lowerQuery.includes('زيت') ||
    lowerQuery.includes('oil') ||
    lowerQuery.includes('تغيير') ||
    lowerQuery.includes('فلتر الزيت') ||
    lowerQuery.includes('oil filter')
  ) {
    return 'SERVICE'
  }
  
  // Air Filter
  if (
    lowerQuery.includes('فلتر الهواء') ||
    lowerQuery.includes('air filter') ||
    lowerQuery.includes('فلتر هواء')
  ) {
    return 'SERVICE'
  }
  
  // Maintenance
  if (
    lowerQuery.includes('صيانة') || 
    lowerQuery.includes('maintenance') ||
    lowerQuery.includes('خدمة')
  ) {
    return 'MAINTENANCE'
  }
  
  // Price
  if (
    lowerQuery.includes('سعر') || 
    lowerQuery.includes('تكلفة') || 
    lowerQuery.includes('price') || 
    lowerQuery.includes('cost')
  ) {
    return 'PRICE'
  }
  
  // Comparison
  if (
    lowerQuery.includes('مقارنة') || 
    lowerQuery.includes('أفضل من') || 
    lowerQuery.includes('vs') || 
    lowerQuery.includes('compare')
  ) {
    return 'COMPARISON'
  }
  
  // Features
  if (
    lowerQuery.includes('ميزات') || 
    lowerQuery.includes('خصائص') || 
    lowerQuery.includes('features')
  ) {
    return 'FEATURES'
  }
  
  // Fuel consumption
  if (
    lowerQuery.includes('استهلاك الوقود') || 
    lowerQuery.includes('fuel') || 
    lowerQuery.includes('كم يصرف')
  ) {
    return 'FUEL_CONSUMPTION'
  }
  
  // Insurance
  if (
    lowerQuery.includes('تأمين') || 
    lowerQuery.includes('insurance')
  ) {
    return 'INSURANCE'
  }
  
  // Reviews
  if (
    lowerQuery.includes('تقييم') || 
    lowerQuery.includes('review') ||
    lowerQuery.includes('رأي')
  ) {
    return 'REVIEWS'
  }
  
  return 'OTHER'
}

/**
 * Enhanced model and brand query count updates with better error handling
 */
async function updateModelQueryCount(modelName: string): Promise<void> {
  if (!isSupabaseConfigured() || !modelName) return
  
  try {
    const { data: models, error: fetchError } = await supabase
      .from('car_models')
      .select('id, queries, name')
      .ilike('name', `%${modelName}%`)
      .limit(1)
      
    if (fetchError) {
      console.error('Error fetching car model:', fetchError)
      return
    }
    
    if (models && models.length > 0) {
      const { error: updateError } = await supabase
        .from('car_models')
        .update({ 
          queries: (models[0].queries || 0) + 1,
          last_queried: new Date().toISOString()
        })
        .eq('id', models[0].id)
        
      if (updateError) {
        console.error('Error updating car model query count:', updateError)
      }
    } else {
      // Create new model entry if not exists
      const { error: insertError } = await supabase
        .from('car_models')
        .insert({
          name: modelName,
          brand: 'Unknown', // Set default brand to avoid NOT NULL constraint
          year: 0,          // Set default year to avoid NOT NULL constraint
          queries: 1,
          last_queried: new Date().toISOString()
        })
        
      if (insertError) {
        console.error('Error creating new car model entry:', insertError)
      }
    }
  } catch (err) {
    console.error('Error in updateModelQueryCount:', err)
  }
}

async function updateBrandQueryCount(brandName: string): Promise<void> {
  if (!isSupabaseConfigured() || !brandName) return
  
  try {
    const { data: brands, error: fetchError } = await supabase
      .from('car_brands')
      .select('id, queries, name')
      .ilike('name', `%${brandName}%`)
      .limit(1)
      
    if (fetchError) {
      console.error('Error fetching car brand:', fetchError)
      return
    }
    
    if (brands && brands.length > 0) {
      const { error: updateError } = await supabase
        .from('car_brands')
        .update({ 
          queries: (brands[0].queries || 0) + 1,
          last_queried: new Date().toISOString()
        })
        .eq('id', brands[0].id)
        
      if (updateError) {
        console.error('Error updating car brand query count:', updateError)
      }
    } else {
      // Create new brand entry if not exists
      const { error: insertError } = await supabase
        .from('car_brands')
        .insert({
          name: brandName,
          queries: 1,
          last_queried: new Date().toISOString()
        })
        
      if (insertError) {
        console.error('Error creating new car brand entry:', insertError)
      }
    }
  } catch (err) {
    console.error('Error in updateBrandQueryCount:', err)
  }
}

/**
 * Generate unique session ID for tracking
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Enhanced request validation and sanitization
 */
function validateAndSanitizeRequest(body: any) {
  try {
    const validatedBody = RequestBodySchema.parse(body)
    
    // Additional sanitization
    validatedBody.messages = validatedBody.messages.map(message => ({
      ...message,
      content: message.content.trim().substring(0, 2000) // Limit message length
    }))
    
    return { success: true, data: validatedBody }
  } catch (error) {
    console.error('Request validation failed:', error)
    return { 
      success: false, 
      error: error instanceof z.ZodError ? error.errors : 'Invalid request format' 
    }
  }
}

/**
 * Main POST handler with comprehensive error handling
 */
export async function POST(req: Request) {
  const startTime = Date.now()
  let requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    console.log(`[${requestId}] Processing new request`)
    
    // Enhanced request parsing with timeout
    let body: any
    try {
      const bodyText = await Promise.race([
        req.text(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
      ])
      
      body = JSON.parse(bodyText as string)
    } catch (parseError) {
      console.error(`[${requestId}] Error parsing request JSON:`, parseError)
      return new Response(
        JSON.stringify({
          error: "تم إلغاء الطلب أو تم استلام بيانات غير صالحة",
          requestId
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }
    
    // Validate request format
    const validation = validateAndSanitizeRequest(body)
    if (!validation.success) {
      console.error(`[${requestId}] Request validation failed:`, validation.error)
      return new Response(
        JSON.stringify({
          error: "صيغة الطلب غير صحيحة",
          details: validation.error,
          requestId
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }
    
    // Type assertion to ensure data exists since we've checked validation.success
    const { messages } = validation.data as { messages: { role: "user" | "assistant" | "system"; content: string; }[] }
    
    // Process first user message to extract car data
    const userQuery = messages.find(m => m.role === 'user')?.content || '';
    
    // Check for special cases in the query
    const isJeepCompassQuery = userQuery.toLowerCase().includes('جيب كومباس') || userQuery.toLowerCase().includes('jeep compass');
    const isJeepLaredoQuery = userQuery.toLowerCase().includes('جيب لاريدو') || 
                              userQuery.toLowerCase().includes('jeep laredo') || 
                              userQuery.toLowerCase().includes('جييب لاريدو') ||
                              (userQuery.toLowerCase().includes('جيب') && userQuery.includes('لاريدو')) ||
                              (userQuery.toLowerCase().includes('jeep') && userQuery.toLowerCase().includes('laredo'));
    const isNissanSunnyQuery = userQuery.toLowerCase().includes('نيسان صني') || 
                               userQuery.toLowerCase().includes('nissan sunny') ||
                              (userQuery.toLowerCase().includes('نيسان') && 
                               (userQuery.toLowerCase().includes('صني') || userQuery.toLowerCase().includes('sunny')));
    const isToyotaCorollaQuery = userQuery.toLowerCase().includes('تويوتا كورولا') || 
                              userQuery.toLowerCase().includes('toyota corolla') ||
                             (userQuery.toLowerCase().includes('تويوتا') && 
                              (userQuery.toLowerCase().includes('كورولا') || userQuery.toLowerCase().includes('corolla')));
    const isKiaCeratoQuery = userQuery.toLowerCase().includes('كيا سيراتو') || 
                          userQuery.toLowerCase().includes('kia cerato') ||
                         (userQuery.toLowerCase().includes('كيا') && 
                          (userQuery.toLowerCase().includes('سيراتو') || userQuery.toLowerCase().includes('cerato')));
    
    // Get car data for oil recommendations
    let carData: ExtractedCarData | undefined;
    let carSpecsPrompt = '';
    let carTrimData = null;
    
    try {
      // First, try to use enhanced CarQuery API
      const normalizedData = await normalizeArabicCarInput(userQuery);
      
      // Check for VIN in query for more accurate info
      let extractedVin = '';
      const vinPatterns = [
        /\bVIN\s*[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/i,
        /\bرقم الهيكل\s*[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/i,
        /\b([A-HJ-NPR-Z0-9]{17})\b/i
      ];
      
      for (const pattern of vinPatterns) {
        const match = userQuery.match(pattern);
        if (match && match[1]) {
          const potentialVin = match[1].toUpperCase();
          if (/^[A-HJ-NPR-Z0-9]{17}$/.test(potentialVin)) {
            extractedVin = potentialVin;
            console.log('Detected VIN:', extractedVin);
            
            // Try to decode the VIN for enhanced info
            try {
              const vinData = await decodeVIN(extractedVin);
              console.log('Decoded VIN data:', vinData);
              
              // If VIN is decoded successfully, update normalized data
              if (vinData) {
                if (!normalizedData.make || !normalizedData.model) {
                  // Use vinData to improve car identification
                  console.log('Enhanced car identification using VIN');
                }
              }
            } catch (vinError) {
              console.error('Error decoding VIN:', vinError);
            }
            break;
          }
        }
      }
      
      // Special handling for specific car models not well-detected by default algorithms
      if (isJeepCompassQuery && !normalizedData.make) {
        console.log('Special handling for Jeep Compass');
        normalizedData.make = 'jeep';
        normalizedData.model = 'compass';
        normalizedData.confidence = 80;
      }
      
      // Special handling for Jeep Grand Cherokee (Laredo)
      if (isJeepLaredoQuery && (!normalizedData.make || !normalizedData.model)) {
        console.log('Special handling for Jeep Grand Cherokee (Laredo)');
        normalizedData.make = 'jeep';
        normalizedData.model = 'grand cherokee';
        normalizedData.confidence = 80;
      }
      
      // Special handling for Nissan Sunny
      if (isNissanSunnyQuery && (!normalizedData.make || !normalizedData.model)) {
        console.log('Special handling for Nissan Sunny');
        normalizedData.make = 'nissan';
        normalizedData.model = 'sunny';
        normalizedData.confidence = 80;
      }

      // Special handling for Toyota Corolla
      if (isToyotaCorollaQuery && (!normalizedData.make || !normalizedData.model)) {
        console.log('Special handling for Toyota Corolla');
        normalizedData.make = 'toyota';
        normalizedData.model = 'corolla';
        normalizedData.confidence = 80;
      }

      // Special handling for Kia Cerato
      if (isKiaCeratoQuery && (!normalizedData.make || !normalizedData.model)) {
        console.log('Special handling for Kia Cerato');
        normalizedData.make = 'kia';
        normalizedData.model = 'cerato';
        normalizedData.confidence = 80;
      }
      
      if (normalizedData.make && normalizedData.model) {
        // If we have make and model, get detailed car specifications
        // Always include year parameter when available for more accurate results
        const trims = await getCarModels(
          normalizedData.make,
          normalizedData.model,
          normalizedData.year
        );
        
        if (trims && trims.length > 0) {
          // Use the first trim for demonstration purposes
          // In a future update, we could allow selecting from multiple trims
          carTrimData = trims[0];
          const specs = extractOilRecommendationData(carTrimData);
          const oilRecommendation = suggestOil(specs);
          
          // Log successful car data retrieval
          logger.info("Successfully retrieved car data from CarQuery API", {
            make: normalizedData.make,
            model: normalizedData.model,
            year: normalizedData.year,
            trimCount: trims.length,
            selectedTrim: carTrimData.model_trim
          });
          
          // Special handling for Jeep Compass to ensure correct data
          if (isJeepCompassQuery && normalizedData.year && parseInt(normalizedData.year) >= 2017) {
            oilRecommendation.viscosity = '0W-20';
            oilRecommendation.capacity = '5.2 لتر';
            console.log('Applied special Jeep Compass oil correction');
          }
          
          // Special handling for Jeep Grand Cherokee (Laredo) to ensure correct data
          if (isJeepLaredoQuery) {
            // Check for engine size indicators in the query
            const isV8 = userQuery.toLowerCase().includes('5.7') || 
                        userQuery.toLowerCase().includes('v8') || 
                        userQuery.toLowerCase().includes('هيمي') ||
                        userQuery.toLowerCase().includes('hemi');
                        
            if (isV8) {
              oilRecommendation.viscosity = '5W-20';
              oilRecommendation.capacity = '6.6 لتر';
              console.log('Applied special Jeep Grand Cherokee V8 oil correction');
            } else {
              // Default to V6 specs (most common)
              oilRecommendation.viscosity = '0W-20';
              oilRecommendation.capacity = '5.7 لتر';
              console.log('Applied special Jeep Grand Cherokee V6 oil correction');
            }
          }
          
          // Special handling for Chevrolet Camaro 2016-2018
          const isCamaroQuery = userQuery.toLowerCase().includes('كامارو') || 
                               userQuery.toLowerCase().includes('camaro') ||
                               userQuery.toLowerCase().includes('كمارو');
                               
          if (isCamaroQuery) {
            // Extract year if available
            const yearMatch = userQuery.match(/20(\d{2})/);
            const year = yearMatch ? `20${yearMatch[1]}` : '2016'; // Default to 2016 if not specified
            
            // Check for engine size indicators in the query
            const isV8 = userQuery.toLowerCase().includes('v8') || 
                        userQuery.toLowerCase().includes('ss') || 
                        userQuery.toLowerCase().includes('اس اس') ||
                        userQuery.toLowerCase().includes('zl1') ||
                        userQuery.toLowerCase().includes('زد ال 1') ||
                        userQuery.toLowerCase().includes('6.2');
                        
            const isV6 = userQuery.toLowerCase().includes('v6') || 
                        userQuery.toLowerCase().includes('3.6');
                        
            const engineSpecified = isV8 || isV6 || userQuery.toLowerCase().includes('l4') || 
                                   userQuery.toLowerCase().includes('2.0') || 
                                   userQuery.toLowerCase().includes('تيربو') || 
                                   userQuery.toLowerCase().includes('turbo');
            
            if (isV8) {
              // Add exact Chevrolet Camaro V8 specifications to the prompt
              oilRecommendation.viscosity = '5W-30';
              oilRecommendation.capacity = '9.5 لتر';
              console.log('Applied special Chevrolet Camaro V8 oil correction');
            } else if (isV6) {
              // Add exact Chevrolet Camaro V6 specifications to the prompt
              oilRecommendation.viscosity = '5W-30';
              oilRecommendation.capacity = '5.7 لتر';
              console.log('Applied special Chevrolet Camaro V6 oil correction');
            } else if (!engineSpecified) {
              // If no specific engine is mentioned, don't set a default capacity
              // This will trigger the multi-option response in the prompt
              console.log('No specific Camaro engine mentioned - will show all options');
            } else {
              // Add exact Chevrolet Camaro L4 specifications to the prompt (base model)
              oilRecommendation.viscosity = '5W-30';
              oilRecommendation.capacity = '4.7 لتر';
              console.log('Applied special Chevrolet Camaro L4 oil correction');
            }
          }
          
          // Add car specifications to the system prompt
          carSpecsPrompt = `
الآن لديك معلومات دقيقة عن هذه السيارة من قاعدة بيانات CarQuery:
- النوع: ${normalizedData.make} ${normalizedData.model} ${normalizedData.year || ''}
- المحرك: ${carTrimData.model_engine_type || 'غير معروف'} ${carTrimData.model_engine_cc || '0'}cc
- نوع الوقود: ${carTrimData.model_engine_fuel || 'غير معروف'}
${carTrimData.model_engine_compression ? `- نسبة الانضغاط: ${carTrimData.model_engine_compression}` : ''}
${carTrimData.model_weight_kg ? `- وزن السيارة: ${carTrimData.model_weight_kg} كغم` : ''}
${carTrimData.model_lkm_city ? `- استهلاك الوقود: ${carTrimData.model_lkm_city} لتر/كم` : ''}
${carTrimData.model_drive ? `- نظام الدفع: ${carTrimData.model_drive}` : ''}

توصية الزيت بناء على المواصفات:
- اللزوجة المقترحة: ${oilRecommendation.viscosity}
- نوع الزيت: ${oilRecommendation.quality}
- كمية الزيت المطلوبة: ${oilRecommendation.capacity}
- السبب: ${oilRecommendation.reason}

استخدم هذه المعلومات لتقديم توصية دقيقة، لكن يمكنك تعديل التوصية بناء على معرفتك المتخصصة.
`;
        } else {
          logger.warn("No car trims found for the normalized car data", {
            make: normalizedData.make,
            model: normalizedData.model,
            year: normalizedData.year
          });
        }
      }
      
      // Also try the legacy car data extraction as fallback
      if (!carTrimData) {
        carData = enhancedExtractCarData(userQuery);
        logger.info("Using fallback car data extraction", { 
          carData,
          confidence: carData?.confidence || 0
        });
      }
    } catch (carDataError) {
      logger.error("Error extracting car data", { error: carDataError });
      // Continue execution - this is not a fatal error
    }
    
    // If we have car data or specs, update the system prompt
    let enhancedSystemPrompt = openRouter.systemPrompt;
    if (carSpecsPrompt) {
      enhancedSystemPrompt += "\n\n" + carSpecsPrompt;
    } else if (carData && carData.isValid) {
      enhancedSystemPrompt += `\n\nالمستخدم سأل عن ${carData.carBrand} ${carData.carModel} ${carData.year || ''}`;
        
        // استخدام vinEngineResolver إذا تم اكتشاف VIN
        if (carData.vin) {
          try {
            // الحصول على توصيات الزيت باستخدام VIN
            const vinRecommendations = await getAccurateOilRecommendation(
              carData.carBrand,
              carData.carModel,
              carData.year || new Date().getFullYear(),
              carData.vin
            );
            
            if (vinRecommendations) {
              console.log('Successfully retrieved oil recommendations using VIN');
              enhancedSystemPrompt += `\n\nتم استخراج بيانات دقيقة باستخدام رقم الهيكل (VIN).`;
            }
          } catch (vinError) {
            console.error('Failed to get VIN recommendations:', vinError);
          }
        }
    }
    
    // Special handling for specific car models that require exact specifications
    // This is a fallback when the API and other methods don't provide accurate data
      
      // ✅ Nissan Sunny override
      if (isNissanSunnyQuery) {
      // Extract year if available
      const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2019';
      
      enhancedSystemPrompt += `\n\n
🚗 نيسان صني ${year} تأتي بمحركين حسب السوق:

1️⃣ <b>HR15DE - سعة 1.5 لتر (الأكثر شيوعًا)</b>
🛢️ سعة الزيت: 3.4 لتر (مع الفلتر)
⚙️ اللزوجة: 5W-30
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Mobil 1 5W-30 Full Synthetic (3.4 لتر)

2️⃣ <b>HR16DE - سعة 1.6 لتر (أقل شيوعًا)</b>
🛢️ سعة الزيت: 4.4 لتر (مع الفلتر)
⚙️ اللزوجة: 5W-30
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Valvoline 5W-30 Full Synthetic (4.4 لتر)

⚠️ لا تفترض نوع المحرك. إذا لم يذكر المستخدم النوع، اطلب منه تحديده بدقة.`;
        
        console.log('Added Nissan Sunny override specifications');
      }
      
      // ✅ Toyota Corolla override
      if (isToyotaCorollaQuery) {
        const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2018';
        
        // استخدام بيانات officialSpecs بدلاً من تكرار القيم بشكل ثابت
        let corollaSpecs: Record<string, any> = {};
        try {
          const toyotaData = officialSpecs['toyota']?.['corolla'] || {};
          const isOlderModel = parseInt(year) < 2020;
          
          // اختيار نطاق السنوات المناسب
          const yearRange = isOlderModel ? '2014-2019' : '2020-2024';
          corollaSpecs = toyotaData[yearRange] || {};
          
          console.log(`Using officialSpecs for Toyota Corolla ${year}, year range: ${yearRange}`);
        } catch (specError) {
          console.error('Error accessing officialSpecs for Toyota Corolla:', specError);
        }
        
        // استخدام بيانات officialSpecs إذا كانت متوفرة، وإلا استخدام قيم افتراضية
        const newModel: Record<string, string> = {
          capacity: corollaSpecs['capacity'] || '4.4L',
          viscosity: corollaSpecs['viscosity'] || '0W-20',
          engineSize: corollaSpecs['engineSize'] || '2.0L',
          oilType: corollaSpecs['oilType'] || 'Full Synthetic',
          recommended: 'Castrol EDGE 0W-20'
        };
        
        const oldModel: Record<string, string> = {
          capacity: corollaSpecs['capacity'] || '4.2L',
          viscosity: corollaSpecs['viscosity'] || '5W-30',
          engineSize: corollaSpecs['engineSize'] || '1.8L',
          oilType: corollaSpecs['oilType'] || 'Full Synthetic',
          recommended: 'Mobil 1 5W-30'
        };
        
        const isOlderModel = parseInt(year) < 2020;
        
        enhancedSystemPrompt += `\n\n
🚗 تويوتا كورولا ${year} تأتي بمحركين حسب السوق:

1️⃣ <b>${isOlderModel ? '1.8L 4-cylinder 2ZR-FE' : '2.0L 4-cylinder M20A-FKS'}</b>
🛢️ سعة الزيت: ${isOlderModel ? oldModel.capacity.replace('L', '') : newModel.capacity.replace('L', '')} لتر
⚙️ اللزوجة: ${isOlderModel ? oldModel.viscosity : newModel.viscosity}
🔧 نوع الزيت: ${isOlderModel ? oldModel.oilType : newModel.oilType}
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: ${isOlderModel ? oldModel.recommended : newModel.recommended} ${isOlderModel ? oldModel.viscosity : newModel.viscosity} ${isOlderModel ? oldModel.oilType : newModel.oilType} (${isOlderModel ? oldModel.capacity.replace('L', '') : newModel.capacity.replace('L', '')} لتر)

2️⃣ <b>1.6L 4-cylinder 1ZR-FE (أقل شيوعًا)</b>
🛢️ سعة الزيت: 3.7 لتر
⚙️ اللزوجة: 5W-30
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Mobil 1 5W-30 Full Synthetic (3.7 لتر)

⚠️ لا تفترض نوع المحرك. إذا لم يذكر المستخدم النوع، اطلب منه تحديده بدقة.`;
        
        console.log('Added Toyota Corolla override specifications');
      }
      
      // ✅ Kia Cerato override
      if (isKiaCeratoQuery) {
        const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2018';
        
        // استخدام بيانات officialSpecs إذا كانت متوفرة لكيا سيراتو
        let ceratoSpecs: Record<string, any> = {};
        try {
          const kiaData = officialSpecs['kia']?.['cerato'] || {};
          
          // محاولة العثور على نطاق سنوات مناسب
          for (const yearRange of Object.keys(kiaData)) {
            const rangeParts = yearRange.split('-');
            if (rangeParts.length === 2) {
              const startYear = parseInt(rangeParts[0]);
              const endYear = parseInt(rangeParts[1]);
              if (parseInt(year) >= startYear && parseInt(year) <= endYear) {
                ceratoSpecs = kiaData[yearRange] || {};
                console.log(`Found matching year range ${yearRange} for Kia Cerato ${year}`);
                break;
              }
            }
          }
        } catch (specError) {
          console.error('Error accessing officialSpecs for Kia Cerato:', specError);
        }
        
        // استخدام البيانات من officialSpecs أو القيم الافتراضية
        const model20L: Record<string, string> = {
          capacity: ceratoSpecs['capacity'] || '4.0L',
          viscosity: ceratoSpecs['viscosity'] || '5W-30',
          engineSize: ceratoSpecs['engineSize'] || '2.0L',
          oilType: ceratoSpecs['oilType'] || 'Full Synthetic',
          recommended: 'Liqui Moly 5W-30'
        };
        
        enhancedSystemPrompt += `\n\n
🚗 كيا سيراتو ${year} تأتي بمحركين حسب السوق:

1️⃣ <b>2.0L 4-cylinder Nu MPI (الأكثر شيوعًا)</b>
🛢️ سعة الزيت: ${model20L.capacity.replace('L', '')} لتر
⚙️ اللزوجة: ${model20L.viscosity}
🔧 نوع الزيت: ${model20L.oilType}
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: ${model20L.recommended} ${model20L.viscosity} ${model20L.oilType} (${model20L.capacity.replace('L', '')} لتر)

2️⃣ <b>1.6L 4-cylinder Gamma MPI (أقل شيوعًا)</b>
🛢️ سعة الزيت: 3.3 لتر
⚙️ اللزوجة: 5W-30
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Motul 8100 5W-30 Full Synthetic (3.3 لتر)

⚠️ لا تفترض نوع المحرك. إذا لم يذكر المستخدم النوع، اطلب منه تحديده بدقة.`;
        
        console.log('Added Kia Cerato override specifications');
      }
      
      // ✅ Jeep Compass override
      if (isJeepCompassQuery) {
        const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2019';
      
        enhancedSystemPrompt += `\n\n
🚗 جيب كومباس ${year}:
🛢️ سعة الزيت: 5.2 لتر
⚙️ اللزوجة: 0W-20
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Mobil 1 0W-20 Full Synthetic (5.2 لتر)`;
      
      console.log('Added Jeep Compass override specifications');
    }
    
      // ✅ Jeep Grand Cherokee (Laredo) override
    if (isJeepLaredoQuery) {
      const yearMatch = userQuery.match(/20(\d{2})/);
        const year = yearMatch ? `20${yearMatch[1]}` : '2020';
      
      const isV8 = userQuery.toLowerCase().includes('5.7') || 
                  userQuery.toLowerCase().includes('v8') || 
                  userQuery.toLowerCase().includes('هيمي') ||
                  userQuery.toLowerCase().includes('hemi');
      
      if (isV8) {
        enhancedSystemPrompt += `\n\n
🚗 جيب جراند شيروكي (لاريدو) ${year} - محرك V8 HEMI:
🛢️ سعة الزيت: 6.6 لتر
⚙️ اللزوجة: 5W-20
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Castrol EDGE 5W-20 Full Synthetic (6.6 لتر)`;
      } else {
        enhancedSystemPrompt += `\n\n
🚗 جيب جراند شيروكي (لاريدو) ${year} - محرك V6:
🛢️ سعة الزيت: 5.7 لتر
⚙️ اللزوجة: 0W-20
🔧 نوع الزيت: Full Synthetic
🌡️ مناسب لحرارة العراق: ✅
🎯 التوصية النهائية: Mobil 1 0W-20 Full Synthetic (5.7 لتر)`;
      }
      
      console.log('Added Jeep Grand Cherokee (Laredo) override specifications');
    }
      
    
    // Special handling for Chevrolet Camaro 2016-2018
    const isCamaroQuery = userQuery.toLowerCase().includes('كامارو') || 
                         userQuery.toLowerCase().includes('camaro') ||
                         userQuery.toLowerCase().includes('كمارو');
                         
    if (isCamaroQuery) {
      // Extract year if available
      const yearMatch = userQuery.match(/20(\d{2})/);
      const year = yearMatch ? `20${yearMatch[1]}` : '2016'; // Default to 2016 if not specified
      
      // Check for engine size indicators in the query
      const isV8 = userQuery.toLowerCase().includes('v8') || 
                  userQuery.toLowerCase().includes('ss') || 
                  userQuery.toLowerCase().includes('اس اس') ||
                  userQuery.toLowerCase().includes('zl1') ||
                  userQuery.toLowerCase().includes('زد ال 1') ||
                  userQuery.toLowerCase().includes('6.2');
                  
      const isV6 = userQuery.toLowerCase().includes('v6') || 
                  userQuery.toLowerCase().includes('3.6');
                  
      const engineSpecified = isV8 || isV6 || 
                             userQuery.toLowerCase().includes('l4') || 
                             userQuery.toLowerCase().includes('2.0') || 
                             userQuery.toLowerCase().includes('تيربو') || 
                             userQuery.toLowerCase().includes('turbo');
      
      if (isV8) {
        // Add exact Chevrolet Camaro V8 specifications to the prompt
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن شيفروليت كامارو ${year} بمحرك V8:
- سعة زيت المحرك: 9.5 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
- فترة تغيير الزيت: كل 8000 كم في الظروف العراقية
- نوع المحرك: 6.2L V8 (LT1/LT4)

يجب التأكد من ذكر هذه المعلومات الدقيقة في إجابتك، خاصة سعة الزيت الكبيرة (9.5 لتر) التي تختلف كثيراً عن الطرازات الأخرى.
التوصية النهائية: Mobil 1 5W-30 Full Synthetic (9.5 لتر)
`;
      } else if (isV6) {
        // Add exact Chevrolet Camaro V6 specifications to the prompt
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن شيفروليت كامارو ${year} بمحرك V6:
- سعة زيت المحرك: 5.7 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
- فترة تغيير الزيت: كل 8000 كم في الظروف العراقية
- نوع المحرك: 3.6L V6 (LGX)

يجب التأكد من ذكر هذه المعلومات الدقيقة في إجابتك.
التوصية النهائية: Valvoline MaxLife 5W-30 Full Synthetic (5.7 لتر)
`;
      } else if (!engineSpecified) {
        // When no specific engine is mentioned, show all options
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن شيفروليت كامارو ${year}:
شيفروليت كامارو ${year} تأتي بثلاثة خيارات من المحركات، كل منها يتطلب كمية مختلفة من الزيت:

1️⃣ محرك 2.0L تيربو – 4 سلندر (LTG)
- سعة زيت المحرك: 4.7 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
التوصية النهائية للمحرك 2.0L: Liqui Moly 5W-40 Full Synthetic (4.7 لتر)

2️⃣ محرك 3.6L V6 (LGX)
- سعة زيت المحرك: 5.7 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
التوصية النهائية للمحرك 3.6L: Mobil 1 5W-30 Full Synthetic (5.7 لتر)

3️⃣ محرك 6.2L V8 (LT1 / LT4)
- سعة زيت المحرك: 9.5 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
التوصية النهائية للمحرك 6.2L: Castrol EDGE 5W-30 Full Synthetic (9.5 لتر)

⚠️ تحذير مهم: يجب عليك عرض جميع الخيارات الثلاثة للمستخدم! لا تختر خيارًا واحدًا فقط!
استخدام كمية غير صحيحة من الزيت قد يسبب أضرارًا بالغة للمحرك.

⚠️ قاعدة إلزامية: عندما لا يحدد المستخدم نوع المحرك بوضوح، يجب عليك:
1. عرض جميع الخيارات الثلاثة كاملة
2. التأكيد على أهمية معرفة نوع المحرك بالضبط
3. الطلب من المستخدم تحديد نوع المحرك للحصول على توصية دقيقة

لا تقدم توصية نهائية واحدة فقط! لا تفترض أن المحرك هو 6.2L! لا تستخدم حجم المحرك (6.2L) كسعة للزيت!
`;
      } else {
        // Add exact Chevrolet Camaro L4 specifications to the prompt (base model)
        enhancedSystemPrompt += `\n\n
معلومات دقيقة عن شيفروليت كامارو ${year} بمحرك L4:
- سعة زيت المحرك: 4.7 لتر
- نوع الزيت الموصى به: 5W-30 Full Synthetic
- المناسب للظروف العراقية: يتحمل درجات الحرارة العالية
- فترة تغيير الزيت: كل 8000 كم في الظروف العراقية
- نوع المحرك: 2.0L L4 Turbo (LTG)

يجب التأكد من ذكر هذه المعلومات الدقيقة في إجابتك.
التوصية النهائية: Castrol EDGE 5W-30 Full Synthetic (4.7 لتر)
`;
      }
      
      console.log('Added Chevrolet Camaro override specifications');
    }
    
    // Create OpenRouter client
    const openrouter = createOpenRouterClient();
    
    // Check and potentially reset token limit status
    checkAndResetTokenLimitStatus();
    
    // Determine which model to use based on token limit status
    let modelToUse = openRouter.primaryModel;
    if (apiStatus.isTokenLimitReached) {
      console.log('Token limit reached, using Mistral model');
      modelToUse = openRouter.mistralModel;
    }
    
    // Update analytics asynchronously (don't await)
    try {
      saveQueryToAnalytics(userQuery, carData).catch(err => {
        console.error("Error saving analytics:", err);
      });
    } catch (analyticsError) {
      console.error("Failed to trigger analytics:", analyticsError);
      // Non-fatal error, continue
    }
    
    // Create stream response using streamText
    const result = streamText({
      model: openrouter(modelToUse),
      system: enhancedSystemPrompt,
      messages,
      maxTokens: 900,
      temperature: 0.3,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
    });
    
    // Return the data stream response directly
    return result.toDataStreamResponse();
    
  } catch (error: any) {
    console.error(`[${requestId}] Error processing request:`, error);
    logger.error("Chat API error", { error, requestId });
    
    return new Response(
      JSON.stringify({
        error: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        requestId,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
