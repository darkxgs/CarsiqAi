import { NextRequest, NextResponse } from 'next/server'
import { findMatchingOilProducts, getProductsByBrandPriority, formatProductRecommendations } from '@/services/oilProductService'

// Note: Removed edge runtime to support Prisma

/**
 * API endpoint for getting oil product recommendations
 * Used by the AI chat to suggest available products
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { viscosity, carType, brands, type, apiSpec, aceaSpec } = body

    if (!viscosity || !carType) {
      return NextResponse.json(
        { success: false, error: 'viscosity and carType are required' },
        { status: 400 }
      )
    }

    let products

    // If specific brands are provided, get products by brand priority
    if (brands && Array.isArray(brands) && brands.length > 0) {
      products = await getProductsByBrandPriority(viscosity, carType, brands)
    } else {
      // Otherwise, find best matching products
      products = await findMatchingOilProducts({
        viscosity,
        carType,
        type,
        apiSpec,
        aceaSpec
      }, 3)
    }

    // Format for AI response
    const formattedRecommendations = formatProductRecommendations(products, true)

    return NextResponse.json({
      success: true,
      products,
      formattedRecommendations,
      hasProducts: products.length > 0
    })
  } catch (error: any) {
    console.error('Error getting oil product recommendations:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
