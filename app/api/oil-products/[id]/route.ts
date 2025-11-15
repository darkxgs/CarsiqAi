import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Fetch single oil product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: product, error } = await supabase
      .from('oil_product')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Error fetching oil product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update oil product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const { data: product, error } = await supabase
      .from('oil_product')
      .update({
        name: body.name,
        brand: body.brand,
        product_line: body.productLine,
        viscosity: body.viscosity,
        type: body.type,
        api_spec: body.apiSpec,
        acea_spec: body.aceaSpec,
        other_specs: body.otherSpecs,
        capacity: body.capacity ? parseFloat(body.capacity) : null,
        price: body.price ? parseFloat(body.price) : null,
        stock: body.stock,
        is_active: body.isActive,
        description: body.description,
        image_url: body.imageUrl,
        compatible_for: body.compatibleFor,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error('Error updating oil product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete oil product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('oil_product')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error: any) {
    console.error('Error deleting oil product:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
