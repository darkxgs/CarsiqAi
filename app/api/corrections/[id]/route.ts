import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import logger from '@/utils/logger'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const { status, adminNotes, reviewedBy, reviewedAt } = body

    if (!status) {
      return NextResponse.json(
        { error: 'الحالة الجديدة مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من صحة الحالة
    const validStatuses = ['pending', 'approved', 'rejected', 'implemented']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'حالة غير صحيحة' },
        { status: 400 }
      )
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'قاعدة البيانات غير متاحة' },
        { status: 503 }
      )
    }

    // تحديث التصحيح في قاعدة البيانات
    const { data, error } = await supabase
      .from('corrections')
      .update({
        status,
        admin_notes: adminNotes || null,
        reviewed_by: reviewedBy || null,
        reviewed_at: reviewedAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      logger.error('Error updating correction:', error)
      return NextResponse.json(
        { error: 'فشل في تحديث التصحيح' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'التصحيح غير موجود' },
        { status: 404 }
      )
    }

    logger.info('Correction updated successfully', { 
      correctionId: id, 
      newStatus: status,
      reviewedBy 
    })

    return NextResponse.json({ 
      success: true, 
      message: 'تم تحديث التصحيح بنجاح',
      correction: data[0]
    })

  } catch (error) {
    logger.error('Error in PATCH correction:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث التصحيح' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'قاعدة البيانات غير متاحة' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from('corrections')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logger.error('Error fetching correction:', error)
      return NextResponse.json(
        { error: 'فشل في استرجاع التصحيح' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'التصحيح غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      correction: data 
    })

  } catch (error) {
    logger.error('Error in GET correction:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء استرجاع التصحيح' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'قاعدة البيانات غير متاحة' },
        { status: 503 }
      )
    }

    const { error } = await supabase
      .from('corrections')
      .delete()
      .eq('id', id)

    if (error) {
      logger.error('Error deleting correction:', error)
      return NextResponse.json(
        { error: 'فشل في حذف التصحيح' },
        { status: 500 }
      )
    }

    logger.info('Correction deleted successfully', { correctionId: id })

    return NextResponse.json({ 
      success: true, 
      message: 'تم حذف التصحيح بنجاح' 
    })

  } catch (error) {
    logger.error('Error in DELETE correction:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف التصحيح' },
      { status: 500 }
    )
  }
}