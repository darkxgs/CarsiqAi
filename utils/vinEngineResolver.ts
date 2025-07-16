import axios from 'axios';
import officialSpecs from '../data/officialSpecs';

// واجهات البيانات
interface EngineInfo {
  engineCode: string;
  engineSize: string;
  cylinders: number;
  description?: string;
  vinEngineChar?: string;
}

interface OilRecommendation {
  capacity: string;
  capacityL: number;
  viscosity: string;
  oilType: string;
  filterNumber: string;
  airFilterNumber?: string;          // رقم فلتر الهواء
  airFilterChangeInterval?: string;  // فترة تغيير فلتر الهواء (بالكيلومتر)
  airFilterPrice?: string;          // سعر فلتر الهواء (اختياري)
  airFilterImageUrl?: string;       // رابط لصورة فلتر الهواء (اختياري)
  engineSize: string;
  apiSpec?: string;
  changeInterval?: string;
  engineCode?: string;
  vinEngineChar?: string;
  cylinders?: number;
  source?: string;
  lastVerifiedDate?: string;
  notes?: string;
}

// كاش بسيط للمحركات المتاحة
const engineCache = new Map<string, { data: EngineInfo[], timestamp: number }>();
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 ساعة بالميلي ثانية

/**
 * استخراج معلومات المحرك من رقم VIN باستخدام NHTSA API
 */
export async function decodeVIN(vin: string): Promise<EngineInfo | null> {
  try {
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
    
    if (response.data && response.data.Results) {
      // استخراج معلومات المحرك من نتائج API
      const results = response.data.Results;
      
      // البحث عن المعلومات المتعلقة بالمحرك
      const engineSize = results.find(item => item.Variable === 'Engine Displacement (L)')?.Value;
      const cylindersRaw = results.find(item => item.Variable === 'Engine Number of Cylinders')?.Value;
      const engineModel = results.find(item => item.Variable === 'Engine Model')?.Value;
      
      // استخراج الحرف الثامن من VIN وتحويله إلى حرف كبير
      const vinEngineChar = vin.charAt(7).toUpperCase();
      
      // التحقق من قيمة الأسطوانات وتحويلها إلى رقم
      const cylinders = cylindersRaw ? Number(cylindersRaw) || 0 : 0;
      
      if (engineSize) {
        return {
          engineCode: engineModel || '',
          engineSize: `${engineSize}L`,
          cylinders,
          vinEngineChar,
          description: `${engineSize}L ${cylinders} سلندر`
        };
      }
    }
    return null;
  } catch (error) {
    console.error('خطأ في استدعاء NHTSA API:', error);
    return null;
  }
}

/**
 * الحصول على قائمة المحركات المتاحة لموديل وسنة محددين من CarQueryAPI
 */
async function getAvailableEngines(make: string, model: string, year: number): Promise<EngineInfo[]> {
  try {
    // التحقق من الكاش أولاً
    const cacheKey = `${make}-${model}-${year}`;
    const cachedData = engineCache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return cachedData.data;
    }
    
    const response = await axios.get('https://www.carqueryapi.com/api/0.3/', {
      params: {
        cmd: 'getTrims',
        make,
        model,
        year,
        fmt: 'json' // تجنب JSONP
      }
    });
    
    if (response.data && response.data.Trims) {
      // استخراج معلومات المحركات المختلفة من الطرازات المتاحة
      const engines: EngineInfo[] = [];
      const uniqueEngines = new Set();
      
      response.data.Trims.forEach(trim => {
        const engineKey = `${trim.model_engine_cc}_${trim.model_engine_cyl}`;
        
        if (!uniqueEngines.has(engineKey)) {
          uniqueEngines.add(engineKey);
          
          // تحويل سم مكعب إلى لتر
          const engineSizeL = (parseInt(trim.model_engine_cc, 10) / 1000).toFixed(1);
          
          engines.push({
            engineCode: trim.model_engine_code || '',
            engineSize: `${engineSizeL}L`,
            cylinders: Number(trim.model_engine_cyl) || 0,
            description: `${engineSizeL}L ${trim.model_engine_cyl} سلندر`
          });
        }
      });
      
      // حفظ النتائج في الكاش
      engineCache.set(cacheKey, {
        data: engines,
        timestamp: Date.now()
      });
      
      return engines;
    }
    return [];
  } catch (error) {
    console.error('خطأ في استدعاء CarQueryAPI:', error);
    return [];
  }
}

/**
 * تحويل نص changeInterval إلى كائن
 */
function parseChangeInterval(interval: string): { miles: number; months: number } {
  if (!interval) {
    return { miles: 10000, months: 12 };
  }
  
  // افتراض أن الصيغة هي "miles / months"
  const parts = interval.split('/');
  const miles = parseInt(parts[0].trim(), 10) || 10000;
  const months = parts.length > 1 ? parseInt(parts[1].trim(), 10) || 12 : 12;
  
  return { miles, months };
}

/**
 * تحويل نص السعة إلى رقم
 */
function parseCapacity(capacity: string): number {
  if (!capacity) return 0;
  
  // إزالة "L" والتحويل إلى رقم
  return parseFloat(capacity.replace('L', '')) || 0;
}

/**
 * مطابقة معلومات المحرك مع بيانات officialSpecs واسترجاع توصيات الزيت
 */
function getOilRecommendations(
  make: string, 
  model: string, 
  year: number, 
  engineInfo: EngineInfo
): OilRecommendation | OilRecommendation[] {
  try {
    // تحويل الاسم إلى الصيغة المستخدمة في officialSpecs
    const manufacturer = make.toLowerCase();
    const modelName = model.toLowerCase().replace(/\s+/g, '_');
    const yearStr = `${year}`;
    
    // البحث عن الشركة المصنعة في قاعدة البيانات
    const manufacturerData = officialSpecs[manufacturer];
    if (!manufacturerData) return [];
    
    // البحث عن الموديل
    const modelData = manufacturerData[modelName];
    if (!modelData) return [];
    
    // البحث عن نطاق السنوات المناسب
    const matchingYearRanges: string[] = [];
    
    Object.keys(modelData).forEach(yearRange => {
      // تحليل نطاق السنوات (مثل "2016-2018" أو "2016-2018-v8")
      const baseParts = yearRange.split('-');
      if (baseParts.length >= 2) {
        const startYear = parseInt(baseParts[0], 10);
        const endYear = parseInt(baseParts[1], 10);
        
        // التحقق مما إذا كانت السنة ضمن النطاق
        if (year >= startYear && year <= endYear) {
          matchingYearRanges.push(yearRange);
        }
      }
    });
    
    if (matchingYearRanges.length === 0) return [];
    
    // البحث عن المحرك المطابق
    const matchingEngineSpecs: OilRecommendation[] = [];
    
    // المرحلة 1: البحث عن تطابق دقيق باستخدام vinEngineChar أو engineCode
    if (engineInfo.vinEngineChar || engineInfo.engineCode) {
      for (const yearRange of matchingYearRanges) {
        const specs = modelData[yearRange];
        
        // التحقق من تطابق vinEngineChar أو engineCode
        if ((engineInfo.vinEngineChar && specs.vinEngineChar === engineInfo.vinEngineChar) ||
            (engineInfo.engineCode && specs.engineCode === engineInfo.engineCode)) {
          
          // إنشاء توصية مع تحويل البيانات إلى الصيغة المناسبة
          const recommendation: OilRecommendation = {
            ...specs,
            capacityL: specs.capacityL || parseCapacity(specs.capacity)
          };
          
          return recommendation; // تطابق دقيق، نعيد النتيجة مباشرة
        }
      }
    }
    
    // المرحلة 2: البحث عن تطابق باستخدام حجم المحرك وعدد الأسطوانات
    for (const yearRange of matchingYearRanges) {
      const specs = modelData[yearRange];
      
      // التحقق من تطابق حجم المحرك أو عدد الأسطوانات
      if (specs.engineSize.includes(engineInfo.engineSize) || 
          (engineInfo.cylinders > 0 && specs.cylinders === engineInfo.cylinders) ||
          (engineInfo.cylinders > 0 && specs.engineSize.includes(`V${engineInfo.cylinders}`))) {
        
        matchingEngineSpecs.push({
          ...specs,
          capacityL: specs.capacityL || parseCapacity(specs.capacity),
          engineCode: specs.engineCode || engineInfo.engineCode
        });
      }
    }
    
    // إذا وجدنا مطابقة واحدة فقط، نعيدها مباشرة
    if (matchingEngineSpecs.length === 1) {
      return matchingEngineSpecs[0];
    }
    
    // إذا وجدنا عدة مطابقات، نرتبها حسب عدد الأسطوانات
    if (matchingEngineSpecs.length > 0) {
      return matchingEngineSpecs.sort((a, b) => (a.cylinders || 0) - (b.cylinders || 0));
    }
    
    // إذا لم نجد أي مطابقة، نعيد جميع الخيارات المتاحة
    return matchingYearRanges.map(yr => {
      const specs = modelData[yr];
      return {
        ...specs,
        capacityL: specs.capacityL || parseCapacity(specs.capacity),
        engineCode: 'unknown'
      };
    }).sort((a, b) => (a.cylinders || 0) - (b.cylinders || 0));
    
  } catch (error) {
    console.error('خطأ في استرجاع توصيات الزيت:', error);
    return [];
  }
}

/**
 * الدالة الرئيسية للحصول على توصيات الزيت المناسبة
 */
export async function getAccurateOilRecommendation(
  make: string, 
  model: string, 
  year: number, 
  vin?: string
): Promise<OilRecommendation | OilRecommendation[]> {
  try {
    // تحويل الاسم إلى الصيغة المستخدمة في officialSpecs
    const manufacturer = make.toLowerCase();
    const modelName = model.toLowerCase().replace(/\s+/g, '_');
    
    // معالجة خاصة لسيارة Camaro 2016
    if (manufacturer === 'chevrolet' && modelName === 'camaro' && year === 2016) {
      console.log(`Special handling for Chevrolet Camaro 2016`);
      
      // إذا كان VIN متاحًا، نحاول استخدامه أولاً
      if (vin && vin.length === 17) {
        try {
          const engineInfo = await decodeVIN(vin);
          if (engineInfo && engineInfo.vinEngineChar) {
            // التحقق من رمز المحرك في VIN
            const vinChar = engineInfo.vinEngineChar.toUpperCase();
            
            if (vinChar === 'A') {
              // محرك 2.0L L4 LTG
              return getOilRecommendations(make, model, year, { 
                engineCode: "LTG", 
                engineSize: "2.0L", 
                cylinders: 4,
                vinEngineChar: 'A'
              });
            } else if (vinChar === 'F') {
              // محرك 3.6L V6 LGX
              return getOilRecommendations(make, model, year, { 
                engineCode: "LGX", 
                engineSize: "3.6L", 
                cylinders: 6,
                vinEngineChar: 'F'
              });
            } else if (vinChar === 'J') {
              // محرك 6.2L V8 LT1
              return getOilRecommendations(make, model, year, { 
                engineCode: "LT1", 
                engineSize: "6.2L", 
                cylinders: 8,
                vinEngineChar: 'J'
              });
            } else if (vinChar === 'K') {
              // محرك 6.2L V8 LT4 Supercharged
              return getOilRecommendations(make, model, year, { 
                engineCode: "LT4", 
                engineSize: "6.2L", 
                cylinders: 8,
                vinEngineChar: 'K'
              });
            }
          }
        } catch (vinError) {
          console.error('خطأ في تحليل VIN لسيارة Camaro 2016:', vinError);
          // نستمر إلى الخطوة التالية
        }
      }
      
      // إذا لم نتمكن من تحديد المحرك من VIN، نعيد جميع خيارات المحركات المتاحة
      return [
        await getOilRecommendations(make, model, year, { engineCode: "LTG", engineSize: "2.0L", cylinders: 4 }) as OilRecommendation,
        await getOilRecommendations(make, model, year, { engineCode: "LGX", engineSize: "3.6L", cylinders: 6 }) as OilRecommendation,
        await getOilRecommendations(make, model, year, { engineCode: "LT1", engineSize: "6.2L", cylinders: 8 }) as OilRecommendation,
        await getOilRecommendations(make, model, year, { engineCode: "LT4", engineSize: "6.2L", cylinders: 8 }) as OilRecommendation
      ];
    }
    
    // إذا كان VIN متاحًا، نحاول استخدامه أولاً
    if (vin && vin.length === 17) {
      try {
        const engineInfo = await decodeVIN(vin);
        if (engineInfo) {
          return getOilRecommendations(make, model, year, engineInfo);
        }
      } catch (vinError) {
        console.error('خطأ في تحليل VIN:', vinError);
        // نستمر إلى الخطوة التالية
      }
    }
    
    // إذا لم يكن VIN متاحًا أو فشل التحليل، نحصل على قائمة المحركات المتاحة
    try {
      const availableEngines = await getAvailableEngines(make, model, year);
      
      if (availableEngines.length === 1) {
        // إذا كان هناك محرك واحد فقط متاح، نستخدمه
        return getOilRecommendations(make, model, year, availableEngines[0]);
      } else if (availableEngines.length > 1) {
        // إذا كان هناك عدة محركات، نعيد جميع التوصيات المحتملة
        const allRecommendations: OilRecommendation[] = [];
        
        for (const engine of availableEngines) {
          const recommendations = getOilRecommendations(make, model, year, engine);
          if (Array.isArray(recommendations)) {
            allRecommendations.push(...recommendations);
          } else {
            allRecommendations.push(recommendations);
          }
        }
        
        // ترتيب النتائج حسب عدد الأسطوانات
        return allRecommendations.sort((a, b) => (a.cylinders || 0) - (b.cylinders || 0));
      }
    } catch (enginesError) {
      console.error('خطأ في الحصول على المحركات المتاحة:', enginesError);
      // نستمر إلى الخطوة التالية
    }
    
    // إذا لم نتمكن من العثور على معلومات المحرك، نعيد جميع التوصيات المحتملة للموديل والسنة
    return getOilRecommendations(make, model, year, { 
      engineCode: 'unknown', 
      engineSize: '', 
      cylinders: 0 
    });
    
  } catch (error) {
    console.error('خطأ في الحصول على توصيات الزيت الدقيقة:', error);
    return [];
  }
}

/**
 * فحص صحة البيانات في قاعدة البيانات
 * يمكن تشغيلها كمهمة دورية (cron job)
 */
export function validateDatabaseEntries(): { needsVerification: string[] } {
  const needsVerification: string[] = [];
  const currentDate = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
  
  // فحص جميع الإدخالات في قاعدة البيانات
  for (const manufacturer in officialSpecs) {
    for (const model in officialSpecs[manufacturer]) {
      for (const yearRange in officialSpecs[manufacturer][model]) {
        const specs = officialSpecs[manufacturer][model][yearRange];
        
        // التحقق من تاريخ آخر تحقق
        if (specs.lastVerifiedDate) {
          const lastVerified = new Date(specs.lastVerifiedDate);
          if (lastVerified < oneYearAgo) {
            needsVerification.push(`${manufacturer} ${model} ${yearRange}`);
          }
        } else {
          // إذا لم يكن هناك تاريخ تحقق، نضيفه إلى القائمة
          needsVerification.push(`${manufacturer} ${model} ${yearRange}`);
        }
      }
    }
  }
  
  return { needsVerification };
} 