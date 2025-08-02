import { NextRequest, NextResponse } from 'next/server';
import { getOilRecommendationForVehicle } from '../../../services/oilRecommendationService';

export async function POST(req: NextRequest) {
  try {
    const { make, model, year, vin } = await req.json();

    // التحقق من البيانات المطلوبة
    if (!make || !model || !year) {
      return NextResponse.json(
        { success: false, message: 'يرجى توفير الشركة المصنعة والموديل والسنة' },
        { status: 400 }
      );
    }

    // الحصول على توصيات الزيت
    const recommendations = await getOilRecommendationForVehicle(make, model, parseInt(year, 10), vin);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('خطأ في الحصول على توصيات الزيت:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const make = url.searchParams.get('make');
    const model = url.searchParams.get('model');
    const year = url.searchParams.get('year');
    const vin = url.searchParams.get('vin') || undefined;

    // التحقق من البيانات المطلوبة
    if (!make || !model || !year) {
      return NextResponse.json(
        { success: false, message: 'يرجى توفير الشركة المصنعة والموديل والسنة' },
        { status: 400 }
      );
    }

    // الحصول على توصيات الزيت
    const recommendations = await getOilRecommendationForVehicle(make, model, parseInt(year, 10), vin);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('خطأ في الحصول على توصيات الزيت:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
} 