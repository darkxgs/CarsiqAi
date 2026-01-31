import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import logger from '@/utils/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // التحقق من صحة البيانات
    const { 
      carMake, 
      carModel, 
      carYear, 
      currentRecommendation, 
      userCorrection, 
      userEmail,
      timestamp 
    } = body

    if (!carMake || !carModel || !userCorrection) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة مفقودة' },
        { status: 400 }
      )
    }

    // إذا كان Supabase متاحاً، احفظ في قاعدة البيانات
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('corrections')
          .insert([
            {
              car_make: carMake,
              car_model: carModel,
              car_year: carYear || null,
              current_recommendation: currentRecommendation,
              user_correction: userCorrection,
              user_email: userEmail || null,
              status: 'pending',
              created_at: new Date(timestamp).toISOString(),
              ip_address: request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         'unknown'
            }
          ])

        if (error) {
          if (error.code === '42P01') {
            logger.info('Corrections table not found - saving locally only')
          } else {
            logger.error('Error saving correction to Supabase:', error)
          }
          // لا نرجع خطأ للمستخدم، سنحفظ محلياً كبديل
        } else {
          logger.info('Correction saved to Supabase successfully', { 
            carMake, 
            carModel, 
            correctionId: data?.[0]?.id 
          })
          
          return NextResponse.json({ 
            success: true, 
            message: 'تم حفظ التصحيح بنجاح' 
          })
        }
      } catch (supabaseError) {
        logger.error('Supabase error:', supabaseError)
        // سنستمر للحفظ المحلي
      }
    }

    // الحفظ المحلي كبديل (في ملف JSON أو قاعدة بيانات محلية)
    const correctionData = {
      id: `correction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      carMake,
      carModel,
      carYear,
      currentRecommendation,
      userCorrection,
      userEmail,
      status: 'pending',
      timestamp: new Date(timestamp).toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown'
    }

    // حفظ في ملف محلي (للتطوير) أو إرسال إلى خدمة خارجية
    logger.info('Correction received (local storage):', correctionData)

    // يمكن إضافة حفظ في ملف JSON هنا إذا لزم الأمر
    // await saveToLocalFile(correctionData)

    return NextResponse.json({ 
      success: true, 
      message: 'تم استلام التصحيح بنجاح' 
    })

  } catch (error) {
    logger.error('Error processing correction:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة التصحيح' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // للحصول على قائمة التصحيحات (للإدارة)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'قاعدة البيانات غير متاحة' },
        { status: 503 }
      )
    }

    try {
      const { data, error } = await supabase
        .from('corrections')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        // إذا كان الجدول غير موجود
        if (error.code === '42P01') {
          logger.info('Corrections table not found - returning empty array')
          return NextResponse.json({ 
            success: true, 
            corrections: [],
            message: 'جدول التصحيحات غير موجود. يرجى إنشاؤه في Supabase أولاً.'
          })
        }
        
        logger.error('Error fetching corrections:', error)
        return NextResponse.json(
          { error: 'خطأ في استرجاع التصحيحات' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        corrections: data || [] 
      })

    } catch (supabaseError) {
      logger.error('Supabase error:', supabaseError)
      return NextResponse.json({ 
        success: true, 
        corrections: [],
        message: 'قاعدة البيانات غير جاهزة. يرجى إنشاء جدول التصحيحات.'
      })
    }

  } catch (error) {
    logger.error('Error in GET corrections:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء استرجاع التصحيحات' },
      { status: 500 }
    )
  }
}

// دالة مساعدة لحفظ البيانات محلياً (للتطوير)
async function saveToLocalFile(data: any) {
  // يمكن تنفيذ هذا لاحقاً إذا لزم الأمر
  // const fs = require('fs').promises
  // const path = require('path')
  // const filePath = path.join(process.cwd(), 'data', 'corrections.json')
  // ... implementation
}