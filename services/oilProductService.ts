import { supabase } from '@/lib/supabase'

export interface OilRequirement {
  viscosity: string
  type?: 'FULL_SYNTHETIC' | 'SEMI_SYNTHETIC' | 'MINERAL'
  apiSpec?: string
  aceaSpec?: string
  carType: 'american' | 'european' | 'asian'
}

export interface MatchedProduct {
  id: string
  name: string
  brand: string
  productLine: string
  viscosity: string
  type: string
  price?: number
  stock: number
  matchScore: number
  inStock: boolean
}

/**
 * Find matching oil products based on car requirements
 */
export async function findMatchingOilProducts(
  requirement: OilRequirement,
  limit: number = 3
): Promise<MatchedProduct[]> {
  try {
    // Fetch all active products
    const { data: products, error } = await supabase
      .from('oil_product')
      .select('*')
      .eq('is_active', true)
      .eq('viscosity', requirement.viscosity)
      .contains('compatible_for', [requirement.carType])
      .order('stock', { ascending: false })
      .order('brand', { ascending: true })

    if (error) throw error
    if (!products) return []

    // Score and rank products
    const scoredProducts = products.map((product: any) => {
      let score = 100

      // Exact viscosity match (already filtered)
      score += 50

      // Type match
      if (requirement.type && product.type === requirement.type) {
        score += 30
      }

      // API spec match
      if (requirement.apiSpec && product.api_spec?.includes(requirement.apiSpec)) {
        score += 20
      }

      // ACEA spec match
      if (requirement.aceaSpec && product.acea_spec?.includes(requirement.aceaSpec)) {
        score += 20
      }

      // Stock availability bonus
      if (product.stock > 0) {
        score += 10
      }

      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        productLine: product.product_line,
        viscosity: product.viscosity,
        type: product.type,
        price: product.price || undefined,
        stock: product.stock,
        matchScore: score,
        inStock: product.stock > 0
      }
    })

    // Sort by score and return top matches
    return scoredProducts
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
  } catch (error) {
    console.error('Error finding matching oil products:', error)
    return []
  }
}

/**
 * Get product recommendations by brand priority
 */
export async function getProductsByBrandPriority(
  viscosity: string,
  carType: 'american' | 'european' | 'asian',
  brands: string[]
): Promise<MatchedProduct[]> {
  try {
    const results: MatchedProduct[] = []

    for (const brand of brands) {
      const { data: products, error } = await supabase
        .from('oil_product')
        .select('*')
        .eq('is_active', true)
        .eq('brand', brand)
        .eq('viscosity', viscosity)
        .contains('compatible_for', [carType])
        .order('stock', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Error fetching product:', error)
        continue
      }

      if (products && products.length > 0) {
        const product = products[0]
        results.push({
          id: product.id,
          name: product.name,
          brand: product.brand,
          productLine: product.product_line,
          viscosity: product.viscosity,
          type: product.type,
          price: product.price || undefined,
          stock: product.stock,
          matchScore: 100,
          inStock: product.stock > 0
        })
      }
    }

    return results
  } catch (error) {
    console.error('Error getting products by brand priority:', error)
    return []
  }
}

/**
 * Format product recommendations for AI response
 */
export function formatProductRecommendations(
  products: MatchedProduct[],
  hasStock: boolean = true
): string {
  if (products.length === 0) {
    return ''
  }

  const lines: string[] = []
  
  products.forEach((product, index) => {
    const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
    const stockInfo = hasStock && product.inStock ? ` (متوفر: ${product.stock})` : ''
    const priceInfo = product.price ? ` - ${product.price} دينار` : ''
    
    lines.push(`${emoji} **الخيار ${index === 0 ? 'الأول' : index === 1 ? 'الثاني' : 'الثالث'}:** ${product.brand} ${product.productLine} ${product.viscosity}${priceInfo}${stockInfo}`)
  })

  return lines.join('\n')
}
