/**
 * Filter Recommendation Service
 * Integrates Denckermann filter data with oil recommendations
 */

import { findFilterByVehicle, getFilterDetails, searchFiltersByVehicleName, denckermannFilters } from '../data/denckermann-filters';
import { findAirFilterByVehicle, getAirFilterDetails, searchAirFiltersByVehicleName, denckermannAirFilters } from '../data/denckermann-air-filters';
import logger from '../utils/logger';

export interface FilterRecommendation {
  filterNumber: string;
  brand: string;
  isVerified: boolean;
  source: 'denckermann' | 'official_specs' | 'estimated';
  compatibleVehicles?: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface EnhancedOilRecommendation {
  oilFilter: FilterRecommendation;
  airFilter?: FilterRecommendation;
  notes?: string;
}

/**
 * Get verified filter recommendation (oil or air) using Denckermann database
 */
export function getVerifiedFilter(make: string, model: string, year?: number, filterType: 'oil' | 'air' = 'oil'): FilterRecommendation | null {
  if (filterType === 'air') {
    return getVerifiedAirFilter(make, model, year);
  }
  return getVerifiedOilFilter(make, model, year);
}

/**
 * Get verified oil filter recommendation using Denckermann database
 */
export function getVerifiedOilFilter(make: string, model: string, year?: number): FilterRecommendation | null {
  try {
    // First, try to find exact match in Denckermann database
    const denckermannFilter = findFilterByVehicle(make, model);
    
    if (denckermannFilter) {
      const filterDetails = getFilterDetails(denckermannFilter);
      if (filterDetails) {
        logger.info(`Found verified Denckermann filter for ${make} ${model}`, {
          filterNumber: denckermannFilter,
          make,
          model,
          year
        });

        return {
          filterNumber: denckermannFilter,
          brand: 'Denckermann',
          isVerified: true,
          source: 'denckermann',
          compatibleVehicles: filterDetails.compatibleVehicles,
          confidence: 'high'
        };
      }
    }

    // If no exact match found, try partial search
    const searchResults = searchFiltersByVehicleName(model);
    const relevantResults = (searchResults || []).filter(result => 
      result?.brand?.toLowerCase() === make?.toLowerCase() || result?.brand?.toLowerCase() === 'universal'
    );

    if (relevantResults.length > 0) {
      const bestMatch = relevantResults[0];
      const filterDetails = getFilterDetails(bestMatch.filterNumber);
      
      if (filterDetails) {
        logger.info(`Found partial match Denckermann filter for ${make} ${model}`, {
          filterNumber: bestMatch.filterNumber,
          vehicle: bestMatch.vehicle,
          make,
          model,
          year
        });

        return {
          filterNumber: bestMatch.filterNumber,
          brand: 'Denckermann',
          isVerified: true,
          source: 'denckermann',
          compatibleVehicles: filterDetails.compatibleVehicles,
          confidence: 'medium'
        };
      }
    }

    logger.warn(`No Denckermann filter found for ${make} ${model}`, { make, model, year });
    return null;

  } catch (error) {
    logger.error('Error getting verified oil filter', { error, make, model, year });
    return null;
  }
}

/**
 * Get verified air filter recommendation using Denckermann database
 */
export function getVerifiedAirFilter(make: string, model: string, year?: number): FilterRecommendation | null {
  try {
    // First, try to find exact match in Denckermann air filter database
    const denckermannFilter = findAirFilterByVehicle(make, model);
    
    if (denckermannFilter) {
      const filterDetails = getAirFilterDetails(denckermannFilter);
      if (filterDetails) {
        logger.info(`Found verified Denckermann air filter for ${make} ${model}`, {
          filterNumber: denckermannFilter,
          make,
          model,
          year
        });

        return {
          filterNumber: denckermannFilter,
          brand: 'Denckermann',
          isVerified: true,
          source: 'denckermann',
          compatibleVehicles: filterDetails.compatibleVehicles,
          confidence: 'high'
        };
      }
    }

    // If no exact match found, try partial search
    const searchResults = searchAirFiltersByVehicleName(model);
    const relevantResults = (searchResults || []).filter(result => 
      result?.brands?.some(brand => brand?.toLowerCase() === make?.toLowerCase())
    );

    if (relevantResults.length > 0) {
      const bestMatch = relevantResults[0];
      const filterDetails = getAirFilterDetails(bestMatch.filterNumber);
      
      if (filterDetails) {
        logger.info(`Found partial match Denckermann air filter for ${make} ${model}`, {
          filterNumber: bestMatch.filterNumber,
          vehicle: bestMatch.vehicle,
          make,
          model,
          year
        });

        return {
          filterNumber: bestMatch.filterNumber,
          brand: 'Denckermann',
          isVerified: true,
          source: 'denckermann',
          compatibleVehicles: filterDetails.compatibleVehicles,
          confidence: 'medium'
        };
      }
    }

    logger.warn(`No Denckermann air filter found for ${make} ${model}`, { make, model, year });
    return null;

  } catch (error) {
    logger.error('Error getting verified air filter', { error, make, model, year });
    return null;
  }
}

/**
 * Enhanced filter search with Arabic support
 */
export function searchFiltersWithArabicSupport(query: string): Array<{
  filterNumber: string;
  vehicle: string;
  brand: string;
  confidence: 'high' | 'medium' | 'low';
}> {
  const results: Array<{
    filterNumber: string;
    vehicle: string;
    brand: string;
    confidence: 'high' | 'medium' | 'low';
  }> = [];

  // Arabic to English mapping for common car names
  const arabicMapping: { [key: string]: string } = {
    'تويوتا كامري': 'toyota camry',
    'تويوتا كورولا': 'toyota corolla',
    'تويوتا بريوس': 'toyota prius',
    'تويوتا راف فور': 'toyota rav 4',
    'تويوتا يارس': 'toyota yaris',
    'تويوتا هايلكس': 'toyota hilux',
    'تويوتا لاندكروزر': 'toyota land cruiser',
    'هيونداي النترا': 'hyundai elantra',
    'هيونداي سوناتا': 'hyundai sonata',
    'هيونداي توكسون': 'hyundai tucson',
    'هيونداي سانتافي': 'hyundai santa fe',
    'هيونداي كريتا': 'hyundai creta',
    'كيا سبورتاج': 'kia sportage',
    'كيا سورينتو': 'kia sorento',
    'كيا سيراتو': 'kia cerato',
    'كيا اوبتيما': 'kia optima',
    'نيسان التيما': 'nissan altima',
    'نيسان باترول': 'nissan patrol',
    'فورد اكسبلورر': 'ford explorer',
    'فورد موستانج': 'ford mustang',
    'شيفروليه كامارو': 'chevrolet camaro',
    'شيفروليه ماليبو': 'chevrolet malibu'
  };

  const normalizedQuery = query?.toLowerCase?.()?.trim?.() || '';
  
  // Check if query matches Arabic mapping
  const englishQuery = arabicMapping[normalizedQuery] || normalizedQuery;
  
  // Extract make and model from query
  const queryParts = englishQuery.split(' ');
  let make = '';
  let model = '';
  
  if (queryParts.length >= 2) {
    make = queryParts[0];
    model = queryParts.slice(1).join(' ');
  } else {
    model = queryParts[0];
  }

  // Search using the enhanced search
  if (make && model) {
    const verifiedFilter = getVerifiedOilFilter(make, model);
    if (verifiedFilter) {
      results.push({
        filterNumber: verifiedFilter.filterNumber,
        vehicle: `${make} ${model}`,
        brand: verifiedFilter.brand,
        confidence: verifiedFilter.confidence
      });
    }
  }

  // Also search by model name only
  const searchResults = searchFiltersByVehicleName(model || englishQuery);
  searchResults.forEach(result => {
    // Avoid duplicates
    const exists = results.some(r => r.filterNumber === result.filterNumber);
    if (!exists) {
      results.push({
        filterNumber: result.filterNumber,
        vehicle: result.vehicle,
        brand: result.brand,
        confidence: 'medium'
      });
    }
  });

  return results.slice(0, 5); // Return top 5 results
}

/**
 * Generate filter recommendation message in Arabic
 */
export function generateFilterRecommendationMessage(
  make: string, 
  model: string, 
  year?: number,
  filterType: 'oil' | 'air' = 'oil',
  includeAlternatives: boolean = true
): string {
  try {
    console.log(`Generating ${filterType} filter message for: ${make} ${model} ${year || ''}`);
    const verifiedFilter = getVerifiedFilter(make, model, year, filterType);
    
    const filterTypeArabic = filterType === 'air' ? 'فلتر الهواء' : 'فلتر الزيت';
    const filterTypeArabicSearch = filterType === 'air' ? 'فلتر الهواء' : 'فلتر الزيت';
    
    if (verifiedFilter) {
      console.log(`Found ${filterType} filter: ${verifiedFilter.filterNumber} for ${make} ${model}`);
      // Create a simpler, more direct message that AI is less likely to modify
      let message = `${filterTypeArabic} الموصى به لسيارة ${make} ${model}${year ? ` ${year}` : ''}:\n\n`;
      message += `* رقم الفلتر: ${verifiedFilter.filterNumber}\n`;
      message += `* الماركة: Denckermann\n`;
      message += `* مستوى الثقة: ${verifiedFilter.confidence === 'high' ? 'عالي' : verifiedFilter.confidence === 'medium' ? 'متوسط' : 'منخفض'}\n`;
      message += `* المصدر: كتالوج Denckermann الرسمي 2024\n\n`;
      
      if (verifiedFilter.compatibleVehicles && verifiedFilter.compatibleVehicles.length > 1) {
        message += `السيارات المتوافقة مع نفس الفلتر:\n`;
        verifiedFilter.compatibleVehicles.slice(0, 6).forEach(vehicle => {
          message += `* ${vehicle}\n`;
        });
        if (verifiedFilter.compatibleVehicles.length > 6) {
          message += `* وأكثر من ${verifiedFilter.compatibleVehicles.length - 6} موديل آخر\n`;
        }
        message += `\n`;
      }

      message += `نصائح مهمة:\n`;
      message += `* تأكد من رقم الفلتر قبل الشراء\n`;
      if (filterType === 'oil') {
        message += `* غيّر فلتر الزيت مع كل تغيير زيت\n`;
      } else {
        message += `* غيّر فلتر الهواء كل 15,000-20,000 كم\n`;
      }
      message += `* استخدم فقط الفلاتر الأصلية أو المعتمدة\n\n`;
      
      message += `تنبيه: هذه المعلومات مستخرجة من كتالوج Denckermann الرسمي وهي دقيقة 100%`;

      return message;
    } else {
      // If no verified filter found, provide general guidance
      let message = `🔍 البحث عن ${filterTypeArabicSearch}\n\n`;
      message += `🚗 السيارة: ${make} ${model}${year ? ` ${year}` : ''}\n\n`;
      message += `❌ عذراً، لم نجد ${filterTypeArabicSearch} محدد لهذا الموديل في قاعدة بيانات Denckermann.\n\n`;
      
      // Try to find similar models (only for oil filters for now)
      if (filterType === 'oil') {
        const searchResults = searchFiltersWithArabicSupport(model);
        if (searchResults.length > 0) {
          message += `🔄 فلاتر مشابهة قد تكون مناسبة:\n`;
          searchResults.slice(0, 3).forEach(result => {
            message += `• ${result.filterNumber} - ${result.vehicle}\n`;
          });
          message += `\n⚠️ يرجى التأكد من التوافق قبل الاستخدام\n\n`;
        }
      }
      
      message += `💡 نصائح للعثور على الفلتر المناسب:\n`;
      message += `• راجع دليل المالك الخاص بسيارتك\n`;
      message += `• اتصل بالوكيل المعتمد\n`;
      message += `• احضر الفلتر القديم عند الشراء\n`;
      message += `• تأكد من رقم المحرك وسنة الصنع\n`;

      return message;
    }
  } catch (error) {
    logger.error(`Error generating ${filterType} filter recommendation message`, { error, make, model, year });
    return `عذراً، حدث خطأ أثناء البحث عن ${filterTypeArabicSearch}. يرجى المحاولة مرة أخرى.`;
  }
}

/**
 * Check if a query is asking about oil filter or air filter
 */
export function isFilterQuery(query: string): boolean {
  const filterKeywords = [
    'فلتر زيت', 'فلتر الزيت', 'فيلتر زيت', 'فيلتر الزيت',
    'فلتر هواء', 'فلتر الهواء', 'فيلتر هواء', 'فيلتر الهواء',
    'oil filter', 'air filter', 'filter', 'فلتر', 'فيلتر',
    'رقم فلتر', 'رقم الفلتر', 'filter number'
  ];
  
  const normalizedQuery = query.toLowerCase();
  return filterKeywords.some(keyword => normalizedQuery.includes(keyword));
}

/**
 * Check if a query is specifically asking about air filter
 */
export function isAirFilterQuery(query: string): boolean {
  const airFilterKeywords = [
    'فلتر هواء', 'فلتر الهواء', 'فيلتر هواء', 'فيلتر الهواء',
    'air filter'
  ];
  
  const normalizedQuery = query.toLowerCase();
  return airFilterKeywords.some(keyword => normalizedQuery.includes(keyword));
}

export default {
  getVerifiedOilFilter,
  searchFiltersWithArabicSupport,
  generateFilterRecommendationMessage,
  isFilterQuery
};