import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

const sampleProducts = [
  // Castrol Products
  {
    name: 'Castrol EDGE 0W-20 Full Synthetic',
    brand: 'Castrol',
    productLine: 'EDGE',
    viscosity: '0W-20',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN Plus',
    aceaSpec: 'ACEA C5',
    otherSpecs: ['ILSAC GF-6'],
    capacity: 4.0,
    price: 28000,
    stock: 8,
    isActive: true,
    description: 'زيت محرك صناعي بالكامل للسيارات الحديثة',
    compatibleFor: ['asian', 'american']
  },
  {
    name: 'Castrol EDGE 5W-30 Full Synthetic',
    brand: 'Castrol',
    productLine: 'EDGE',
    viscosity: '5W-30',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN',
    aceaSpec: 'ACEA C3',
    otherSpecs: ['BMW LL-04', 'MB 229.51'],
    capacity: 4.0,
    price: 26000,
    stock: 12,
    isActive: true,
    description: 'زيت محرك صناعي متعدد الاستخدامات',
    compatibleFor: ['asian', 'european', 'american']
  },
  {
    name: 'Castrol GTX 5W-40 Semi Synthetic',
    brand: 'Castrol',
    productLine: 'GTX',
    viscosity: '5W-40',
    type: 'SEMI_SYNTHETIC' as const,
    apiSpec: 'API SN',
    aceaSpec: 'ACEA A3/B4',
    otherSpecs: [],
    capacity: 4.0,
    price: 22000,
    stock: 15,
    isActive: true,
    description: 'زيت محرك نصف صناعي للحماية اليومية',
    compatibleFor: ['asian', 'european', 'american']
  },

  // Valvoline Products
  {
    name: 'Valvoline Advanced 0W-20 Full Synthetic',
    brand: 'Valvoline',
    productLine: 'Advanced',
    viscosity: '0W-20',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN Plus',
    aceaSpec: 'ACEA C5',
    otherSpecs: ['ILSAC GF-6', 'Dexos1 Gen 2'],
    capacity: 4.0,
    price: 25000,
    stock: 10,
    isActive: true,
    description: 'زيت محرك صناعي متقدم للسيارات اليابانية والأمريكية',
    compatibleFor: ['asian', 'american']
  },
  {
    name: 'Valvoline MaxLife 5W-30 Full Synthetic',
    brand: 'Valvoline',
    productLine: 'MaxLife',
    viscosity: '5W-30',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN Plus',
    aceaSpec: 'ACEA A1/B1',
    otherSpecs: ['ILSAC GF-6'],
    capacity: 4.0,
    price: 24000,
    stock: 14,
    isActive: true,
    description: 'زيت محرك للسيارات ذات الأميال العالية',
    compatibleFor: ['asian', 'american']
  },
  {
    name: 'Valvoline Premium 5W-20 Full Synthetic',
    brand: 'Valvoline',
    productLine: 'Premium',
    viscosity: '5W-20',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN',
    aceaSpec: 'ACEA A1/B1',
    otherSpecs: ['ILSAC GF-5'],
    capacity: 4.0,
    price: 23000,
    stock: 9,
    isActive: true,
    description: 'زيت محرك صناعي للسيارات الأمريكية',
    compatibleFor: ['american', 'asian']
  },

  // Liqui Moly Products
  {
    name: 'Liqui Moly Top Tec 4200 5W-30 Full Synthetic',
    brand: 'Liqui Moly',
    productLine: 'Top Tec 4200',
    viscosity: '5W-30',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN',
    aceaSpec: 'ACEA C3',
    otherSpecs: ['BMW LL-04', 'MB 229.51', 'VW 504.00/507.00'],
    capacity: 5.0,
    price: 35000,
    stock: 6,
    isActive: true,
    description: 'زيت محرك ألماني عالي الجودة للسيارات الأوروبية',
    compatibleFor: ['european']
  },
  {
    name: 'Liqui Moly Top Tec 6600 0W-20 Full Synthetic',
    brand: 'Liqui Moly',
    productLine: 'Top Tec 6600',
    viscosity: '0W-20',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN Plus',
    aceaSpec: 'ACEA C5',
    otherSpecs: ['ILSAC GF-6'],
    capacity: 4.0,
    price: 32000,
    stock: 5,
    isActive: true,
    description: 'زيت محرك صناعي منخفض اللزوجة',
    compatibleFor: ['asian', 'european']
  },
  {
    name: 'Liqui Moly Leichtlauf 5W-40 Full Synthetic',
    brand: 'Liqui Moly',
    productLine: 'Leichtlauf',
    viscosity: '5W-40',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN',
    aceaSpec: 'ACEA A3/B4',
    otherSpecs: ['MB 229.5', 'VW 502.00/505.00'],
    capacity: 5.0,
    price: 30000,
    stock: 8,
    isActive: true,
    description: 'زيت محرك صناعي متعدد الاستخدامات',
    compatibleFor: ['european', 'asian']
  },

  // Meguin Products
  {
    name: 'Meguin Megol 5W-30 Full Synthetic',
    brand: 'Meguin',
    productLine: 'Megol',
    viscosity: '5W-30',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN',
    aceaSpec: 'ACEA C3',
    otherSpecs: ['BMW LL-04', 'MB 229.51'],
    capacity: 5.0,
    price: 30000,
    stock: 7,
    isActive: true,
    description: 'زيت محرك ألماني اقتصادي للسيارات الأوروبية',
    compatibleFor: ['european']
  },
  {
    name: 'Meguin Megol 5W-40 Full Synthetic',
    brand: 'Meguin',
    productLine: 'Megol',
    viscosity: '5W-40',
    type: 'FULL_SYNTHETIC' as const,
    apiSpec: 'API SN',
    aceaSpec: 'ACEA A3/B4',
    otherSpecs: ['MB 229.5', 'VW 502.00/505.00'],
    capacity: 5.0,
    price: 28000,
    stock: 10,
    isActive: true,
    description: 'زيت محرك صناعي للسيارات الأوروبية',
    compatibleFor: ['european', 'asian']
  },
  {
    name: 'Meguin Megol 10W-40 Semi Synthetic',
    brand: 'Meguin',
    productLine: 'Megol',
    viscosity: '10W-40',
    type: 'SEMI_SYNTHETIC' as const,
    apiSpec: 'API SN',
    aceaSpec: 'ACEA A3/B4',
    otherSpecs: [],
    capacity: 4.0,
    price: 20000,
    stock: 12,
    isActive: true,
    description: 'زيت محرك نصف صناعي اقتصادي',
    compatibleFor: ['asian', 'european', 'american']
  }
]

async function main() {
  console.log('🌱 Seeding oil products...')

  for (const product of sampleProducts) {
    const created = await prisma.oilProduct.create({
      data: product
    })
    console.log(`✅ Created: ${created.name}`)
  }

  console.log('✨ Seeding completed!')
  console.log(`📦 Total products: ${sampleProducts.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding oil products:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
