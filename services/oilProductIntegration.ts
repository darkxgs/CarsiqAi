/**
 * Oil Product Integration Service
 * Integrates oil product inventory with AI chat recommendations
 */

import { findMatchingOilProducts, getProductsByBrandPriority, formatProductRecommendations } from './oilProductService'

export interface CarOilRequirement {
  brand: string
  model: string
  year?: number
  viscosity: string
  capacity?: string
  type?: 'FULL_SYNTHETIC' | 'SEMI_SYNTHETIC' | 'MINERAL'
  apiSpec?: string
  aceaSpec?: string
}

/**
 * Determine car type based on brand
 */
export function getCarType(brand: string): 'american' | 'european' | 'asian' {
  const brandLower = brand.toLowerCase()
  
  // American brands
  if (['ford', 'jeep', 'chevrolet', 'dodge', 'cadillac', 'gmc', 'lincoln', 'chrysler'].includes(brandLower)) {
    return 'american'
  }
  
  // European brands
  if (['mercedes', 'bmw', 'audi', 'volkswagen', 'porsche', 'volvo', 'peugeot', 'renault', 'mercedes-benz', 'mercedes_benz'].includes(brandLower)) {
    return 'european'
  }
  
  // Asian brands (default)
  return 'asian'
}

/**
 * Get brand priority based on car type
 */
export function getBrandPriority(carType: 'american' | 'european' | 'asian'): string[] {
  switch (carType) {
    case 'american':
      return ['Valvoline', 'Castrol']
    case 'european':
      return ['Liqui Moly', 'Meguin']
    case 'asian':
      return ['Valvoline', 'Castrol', 'Liqui Moly', 'Meguin']
    default:
      return ['Castrol', 'Liqui Moly', 'Valvoline', 'Meguin']
  }
}

/**
 * Get oil product recommendations for a car
 * Returns formatted text to inject into AI context
 */
export async function getOilProductRecommendations(
  requirement: CarOilRequirement
): Promise<{ hasProducts: boolean; contextText: string; products: any[] }> {
  try {
    const carType = getCarType(requirement.brand)
    const brandPriority = getBrandPriority(carType)

    // Try to get products by brand priority first
    let products = await getProductsByBrandPriority(
      requirement.viscosity,
      carType,
      brandPriority
    )

    // If no products found by brand priority, try general matching
    if (products.length === 0) {
      products = await findMatchingOilProducts({
        viscosity: requirement.viscosity,
        carType,
        type: requirement.type,
        apiSpec: requirement.apiSpec,
        aceaSpec: requirement.aceaSpec
      }, 3)
    }

    if (products.length === 0) {
      return {
        hasProducts: false,
        contextText: '',
        products: []
      }
    }

    // Format products for AI context
    const contextLines: string[] = [
      '\n\n📦 منتجات الزيوت المتوفرة في المتجر (للاستخدام الداخلي - استخدم هذه المنتجات في التوصية):',
      ''
    ]

    products.forEach((product, index) => {
      const stockInfo = product.inStock ? `متوفر (${product.stock})` : 'غير متوفر'
      const priceInfo = product.price ? `${product.price} دينار` : 'السعر غير محدد'
      
      contextLines.push(
        `${index + 1}. ${product.brand} ${product.productLine} ${product.viscosity}`,
        `   - النوع: ${product.type.replace('_', ' ')}`,
        `   - السعر: ${priceInfo}`,
        `   - الحالة: ${stockInfo}`,
        ''
      )
    })

    contextLines.push(
      '⚠️ تعليمات مهمة:',
      '• استخدم المنتجات المتوفرة أعلاه في توصياتك',
      '• اذكر السعر والتوفر لكل منتج',
      '• إذا كان المنتج غير متوفر، اذكر ذلك بوضوح',
      '• إذا لم تجد منتجات مناسبة، قدم توصيات عامة حسب النظام الأساسي',
      ''
    )

    return {
      hasProducts: true,
      contextText: contextLines.join('\n'),
      products
    }
  } catch (error) {
    console.error('Error getting oil product recommendations:', error)
    return {
      hasProducts: false,
      contextText: '',
      products: []
    }
  }
}

/**
 * Extract oil requirements from AI context or search results
 */
export function extractOilRequirements(
  carBrand: string,
  carModel: string,
  year: number | undefined,
  externalContext: string
): CarOilRequirement | null {
  try {
    // Extract viscosity from context
    const viscosityMatch = externalContext.match(/اللزوجة[:\s]+([0-9]+W-[0-9]+)/i) ||
                          externalContext.match(/viscosity[:\s]+([0-9]+W-[0-9]+)/i) ||
                          externalContext.match(/([0-9]+W-[0-9]+)/i)
    
    if (!viscosityMatch) {
      return null
    }

    const viscosity = viscosityMatch[1]

    // Extract capacity
    const capacityMatch = externalContext.match(/سعة الزيت[:\s]+([0-9.]+)\s*لتر/i) ||
                         externalContext.match(/oil capacity[:\s]+([0-9.]+)\s*l/i)
    
    const capacity = capacityMatch ? capacityMatch[1] : undefined

    // Extract API spec
    const apiMatch = externalContext.match(/API\s+([A-Z]+)/i)
    const apiSpec = apiMatch ? `API ${apiMatch[1]}` : undefined

    // Extract ACEA spec
    const aceaMatch = externalContext.match(/ACEA\s+([A-Z0-9]+)/i)
    const aceaSpec = aceaMatch ? `ACEA ${aceaMatch[1]}` : undefined

    // Determine oil type (default to full synthetic for modern cars)
    let type: 'FULL_SYNTHETIC' | 'SEMI_SYNTHETIC' | 'MINERAL' = 'FULL_SYNTHETIC'
    if (externalContext.includes('semi') || externalContext.includes('نصف')) {
      type = 'SEMI_SYNTHETIC'
    } else if (externalContext.includes('mineral') || externalContext.includes('معدني')) {
      type = 'MINERAL'
    }

    return {
      brand: carBrand,
      model: carModel,
      year,
      viscosity,
      capacity,
      type,
      apiSpec,
      aceaSpec
    }
  } catch (error) {
    console.error('Error extracting oil requirements:', error)
    return null
  }
}
