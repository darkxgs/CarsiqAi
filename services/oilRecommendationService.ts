import { getAccurateOilRecommendation } from '../utils/vinEngineResolver';

/**
 * واجهة توصية الزيت المنسقة للعرض
 */
export interface FormattedOilRecommendation {
  engineDescription: string;
  engineCode: string;
  capacity: string;
  capacityL: number;
  viscosity: string;
  oilType: string;
  filterNumber: string;
  airFilterNumber?: string;          // رقم فلتر الهواء
  airFilterChangeInterval?: string;  // فترة تغيير فلتر الهواء (بالكيلومتر)
  airFilterPrice?: string;          // سعر فلتر الهواء (اختياري)
  airFilterImageUrl?: string;       // رابط لصورة فلتر الهواء (اختياري)
  changeInterval: string;
  apiSpec: string;
  cylinders: number;
  notes: string;
}

/**
 * واجهة استجابة خدمة توصيات الزيت
 */
export interface OilRecommendationResponse {
  success: boolean;
  message: string;
  data: FormattedOilRecommendation | FormattedOilRecommendation[] | null;
}

// واجهة توصية الزيت من vinEngineResolver
interface OilRecommendation {
  capacity: string;
  capacityL?: number;
  viscosity: string;
  oilType: string;
  filterNumber: string;
  engineSize: string;
  apiSpec?: string;
  changeInterval?: string | { miles: number; months: number };
  engineCode?: string;
  vinEngineChar?: string;
  cylinders?: number;
  source?: string;
  lastVerifiedDate?: string;
  notes?: string;
  airFilterNumber?: string;          // رقم فلتر الهواء
  airFilterChangeInterval?: string;  // فترة تغيير فلتر الهواء (بالكيلومتر)
  airFilterPrice?: string;          // سعر فلتر الهواء (اختياري)
  airFilterImageUrl?: string;       // رابط لصورة فلتر الهواء (اختياري)
}

/**
 * خدمة توصيات الزيت التي يمكن استخدامها في واجهة المستخدم
 */
export async function getOilRecommendationForVehicle(
  make: string,
  model: string,
  year: number,
  vin?: string
): Promise<OilRecommendationResponse> {
  try {
    const recommendations = await getAccurateOilRecommendation(make, model, year, vin);
    
    // معالجة النتائج
    if (Array.isArray(recommendations)) {
      if (recommendations.length === 0) {
        return {
          success: false,
          message: "لم نتمكن من العثور على توصيات زيت لهذه السيارة.",
          data: null
        };
      } else if (recommendations.length === 1) {
        return {
          success: true,
          message: "تم العثور على توصية زيت مناسبة.",
          data: formatRecommendation(recommendations[0])
        };
      } else {
        // عدة خيارات محتملة - مرتبة بالفعل حسب عدد الأسطوانات
        return {
          success: true,
          message: "وجدنا عدة خيارات محتملة. يرجى اختيار نوع المحرك:",
          data: recommendations.map(formatRecommendation)
        };
      }
    } else {
      // توصية واحدة
      return {
        success: true,
        message: "تم العثور على توصية زيت مناسبة.",
        data: formatRecommendation(recommendations)
      };
    }
  } catch (error) {
    console.error('خطأ في الحصول على توصيات الزيت:', error);
    return {
      success: false,
      message: "حدث خطأ أثناء البحث عن توصيات الزيت.",
      data: null
    };
  }
}

/**
 * تنسيق توصية الزيت للعرض
 */
function formatRecommendation(recommendation: OilRecommendation): FormattedOilRecommendation {
  // تحويل changeInterval إلى نص إذا كان كائناً
  const changeInterval = typeof recommendation.changeInterval === 'object' 
    ? `${recommendation.changeInterval.miles}` 
    : recommendation.changeInterval || "10000";
  
  return {
    engineDescription: recommendation.engineSize,
    engineCode: recommendation.engineCode || 'unknown',
    capacity: recommendation.capacity,
    capacityL: recommendation.capacityL || parseFloat(recommendation.capacity?.replace('L', '') || '0'),
    viscosity: recommendation.viscosity,
    oilType: recommendation.oilType,
    filterNumber: recommendation.filterNumber,
    airFilterNumber: recommendation.airFilterNumber,
    airFilterChangeInterval: recommendation.airFilterChangeInterval,
    airFilterPrice: recommendation.airFilterPrice,
    airFilterImageUrl: recommendation.airFilterImageUrl,
    changeInterval,
    apiSpec: recommendation.apiSpec || "API SN / SN PLUS",
    cylinders: recommendation.cylinders || 0,
    notes: recommendation.notes || ""
  };
} 