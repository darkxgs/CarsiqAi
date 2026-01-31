import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch all oil products with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get('brand')
    const viscosity = searchParams.get('viscosity')
    const type = searchParams.get('type')
    const isActive = searchParams.get('isActive')
    const compatibleFor = searchParams.get('compatibleFor')

    let query = supabase.from('oil_product').select('*')
    
    if (brand) query = query.eq('brand', brand)
    if (viscosity) query = query.eq('viscosity', viscosity)
    if (type) query = query.eq('type', type)
    if (isActive !== null) query = query.eq('is_active', isActive === 'true')
    if (compatibleFor) query = query.contains('compatible_for', [compatibleFor])

    query = query.order('is_active', { ascending: false })
      .order('brand', { ascending: true })
      .order('viscosity', { ascending: true })

    const { data: products, error } = await query

    if (error) throw error

    return NextResponse.json({ success: true, products })
  } catch (error: any) {
    console.error('Error fetching oil products:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new oil product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: product, error } = await supabase
      .from('oil_product')
      .insert({
        id: crypto.randomUUID(),
        name: body.name,
        brand: body.brand,
        product_line: body.productLine,
        viscosity: body.viscosity,
        type: body.type,
        api_spec: body.apiSpec,
        acea_spec: body.aceaSpec,
        other_specs: body.otherSpecs || [],
        capacity: body.capacity ? parseFloat(body.capacity) : null,
        price: body.price ? parseFloat(body.price) : null,
        stock: body.stock || 0,
        is_active: body.isActive !== undefined ? body.isActive : true,
        description: body.description,
        image_url: body.imageUrl,
        compatible_for: body.compatibleFor || []
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating oil product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
