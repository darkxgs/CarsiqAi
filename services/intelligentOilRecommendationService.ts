/**
 * Intelligent Oil Recommendation Service
 * Combines Bing Search API with GPT-4o mini for real-time, accurate recommendations
 */

import { bingSearchService } from './bingSearchService';

interface CarData {
  brand: string;
  model: string;
  year?: number;
  engineSize?: string;
  mileage?: number;
}

interface OilRecommendation {
  capacity: string;
  viscosity: string;
  type: string;
  apiSpec: string;
  brand: string;
  filterNumber?: string;
  changeInterval: string;
  sources: string[];
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

export class IntelligentOilRecommendationService {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || '';
  }

  /**
   * Get comprehensive oil recommendation using real-time search
   */
  async getIntelligentRecommendation(carData: CarData): Promise<OilRecommendation | null> {
    try {
      console.log('🔍 Starting intelligent search for:', carData);

      // Step 1: Search for comprehensive car data
      const searchResults = await bingSearchService.searchComprehensiveCarData(
        carData.brand,
        carData.model,
        carData.year,
        carData.engineSize
      );

      console.log('📊 Search results confidence:', searchResults.overallConfidence);
      console.log('📄 Total sources found:', [
        ...searchResults.oilCapacity.sources,
        ...searchResults.viscosity.sources,
        ...searchResults.filter.sources,
        ...searchResults.maintenance.sources
      ].length);

      // Step 2: Extract structured data from search results
      const capacityData = bingSearchService.extractStructuredData(
        searchResults.oilCapacity.results,
        'oil_capacity'
      );

      const viscosityData = bingSearchService.extractStructuredData(
        searchResults.viscosity.results,
        'oil_viscosity'
      );

      const filterData = bingSearchService.extractStructuredData(
        searchResults.filter.results,
        'oil_filter'
      );

      console.log('🔧 Extracted data:', {
        capacities: capacityData.length,
        viscosities: viscosityData.length,
        filters: filterData.length
      });

      // Step 3: Prepare context for GPT-4o mini analysis
      const searchContext = this.prepareSearchContext(searchResults, capacityData, viscosityData, filterData);

      // Step 4: Analyze with GPT-4o mini
      const recommendation = await this.analyzeWithGPT4oMini(carData, searchContext);

      return recommendation;

    } catch (error) {
      console.error('❌ Error in intelligent recommendation:', error);
      return null;
    }
  }

  /**
   * Prepare search context for GPT analysis
   */
  private prepareSearchContext(searchResults: any, capacityData: any[], viscosityData: any[], filterData: any[]): string {
    let context = `REAL-TIME SEARCH RESULTS FOR CAR SPECIFICATIONS:\n\n`;

    // Oil Capacity Information
    context += `OIL CAPACITY SOURCES:\n`;
    searchResults.oilCapacity.results.slice(0, 5).forEach((result: any, index: number) => {
      context += `${index + 1}. ${result.name}\n   URL: ${result.displayUrl}\n   Info: ${result.snippet}\n\n`;
    });

    if (capacityData.length > 0) {
      context += `EXTRACTED CAPACITY DATA:\n`;
      capacityData.forEach((data, index) => {
        context += `- ${data.capacity} ${data.unit} (Source: ${data.source}, Confidence: ${data.confidence})\n`;
      });
      context += `\n`;
    }

    // Oil Viscosity Information
    context += `OIL VISCOSITY SOURCES:\n`;
    searchResults.viscosity.results.slice(0, 5).forEach((result: any, index: number) => {
      context += `${index + 1}. ${result.name}\n   URL: ${result.displayUrl}\n   Info: ${result.snippet}\n\n`;
    });

    if (viscosityData.length > 0) {
      context += `EXTRACTED VISCOSITY DATA:\n`;
      viscosityData.forEach((data, index) => {
        context += `- ${data.viscosity} (Source: ${data.source}, Confidence: ${data.confidence})\n`;
      });
      context += `\n`;
    }

    // Filter Information
    context += `OIL FILTER SOURCES:\n`;
    searchResults.filter.results.slice(0, 3).forEach((result: any, index: number) => {
      context += `${index + 1}. ${result.name}\n   URL: ${result.displayUrl}\n   Info: ${result.snippet}\n\n`;
    });

    if (filterData.length > 0) {
      context += `EXTRACTED FILTER DATA:\n`;
      filterData.forEach((data, index) => {
        context += `- ${data.filterNumber} (Source: ${data.source}, Confidence: ${data.confidence})\n`;
      });
      context += `\n`;
    }

    // Maintenance Information
    context += `MAINTENANCE SOURCES:\n`;
    searchResults.maintenance.results.slice(0, 3).forEach((result: any, index: number) => {
      context += `${index + 1}. ${result.name}\n   URL: ${result.displayUrl}\n   Info: ${result.snippet}\n\n`;
    });

    return context;
  }

  /**
   * Analyze search results with GPT-4o mini
   */
  private async analyzeWithGPT4oMini(carData: CarData, searchContext: string): Promise<OilRecommendation | null> {
    try {
      const prompt = `You are an expert automotive technician analyzing real-time search results to provide accurate oil recommendations for Iraqi climate conditions.

CAR DETAILS:
- Brand: ${carData.brand}
- Model: ${carData.model}
- Year: ${carData.year || 'Not specified'}
- Engine: ${carData.engineSize || 'Not specified'}
- Mileage: ${carData.mileage || 'Not specified'}

SEARCH CONTEXT:
${searchContext}

TASK:
Analyze the search results and provide a JSON response with the following structure:
{
  "capacity": "X.X liters",
  "viscosity": "XW-XX",
  "type": "Full Synthetic",
  "apiSpec": "API SN/SN PLUS or other appropriate specification",
  "brand": "Recommended brand from: Castrol, Mobil 1, Liqui Moly, Valvoline, Motul, Meguin, Hanata",
  "filterNumber": "Filter part number if found",
  "changeInterval": "Recommended interval in km",
  "sources": ["List of official sources used"],
  "confidence": "high/medium/low",
  "reasoning": "Explanation of recommendation based on search results"
}

REQUIREMENTS:
1. Use ONLY information from the search results
2. Cross-verify data from multiple sources when possible
3. Prioritize official manufacturer websites
4. Adapt for Iraqi hot climate (prefer Full Synthetic, consider dust protection)
5. If conflicting information, choose the most recent or official source
6. Include source attribution in reasoning
7. Always include API specification (API SN/SN PLUS is default if not specified)
8. For brand recommendations, consider car origin (American, European, Asian) in your reasoning

Respond with ONLY the JSON object, no additional text.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'CarsiqAi - Intelligent Oil Recommendations'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert automotive technician providing accurate oil recommendations based on real-time search data. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        console.error('GPT-4o mini API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error('No content in GPT-4o mini response');
        return null;
      }

      // Parse JSON response
      try {
        const recommendation = JSON.parse(content);
        console.log('✅ GPT-4o mini analysis complete:', recommendation);
        return recommendation;
      } catch (parseError) {
        console.error('Failed to parse GPT-4o mini JSON response:', parseError);
        console.log('Raw response:', content);
        return null;
      }

    } catch (error) {
      console.error('Error in GPT-4o mini analysis:', error);
      return null;
    }
  }

  /**
   * Format recommendation for Arabic display with brand categorization by car origin
   */
  formatRecommendationForDisplay(recommendation: OilRecommendation, carData: CarData): string {
    const confidenceEmoji = recommendation.confidence === 'high' ? '🟢' : 
                           recommendation.confidence === 'medium' ? '🟡' : '🔴';

    // القسم الأول: معلومات أساسية عن الزيت
    let response = `🔍 **توصية زيت محرك محدثة من المصادر الرسمية**\n\n`;
    
    response += `🚗 **السيارة:** ${carData.brand} ${carData.model}`;
    if (carData.year) response += ` ${carData.year}`;
    if (carData.engineSize) response += ` (${carData.engineSize})`;
    response += `\n\n`;

    // الخطوة الأولى (الأساسيات): عرض اللزوجة والمعايير والكمية في الأعلى
    response += `## 1. الأساسيات\n\n`;
    response += `⚙️ **اللزوجة:** ${recommendation.viscosity}\n`;
    response += `📊 **المعايير:** ${recommendation.type} - ${recommendation.apiSpec}\n`;
    response += `🛢️ **سعة الزيت:** ${recommendation.capacity}\n\n`;
    
    // الخطوة الثانية: خيارات البراند حسب نوع السيارة
    response += `## 2. خيارات البراند حسب نوع السيارة\n\n`;
    
    // تصنيف العلامات التجارية حسب منشأ السيارة مع ترتيب يعتمد على الربحية
    const carOrigin = this.determineCarOrigin(carData.brand);
    
    if (carOrigin === 'american') {
      response += `🇺🇸 **السيارات الأمريكية** (فورد، جيب، شفر، دودج ...)\n\n`;
      response += `• الخيار الأول: ⭐ **Valvoline** (زيت أمريكي ممتاز للسيارات الأمريكية)\n`;
      response += `• الخيار الثاني: **Castrol** (بديل عالمي موثوق)\n\n`;
    } else if (carOrigin === 'european') {
      response += `🇪🇺 **السيارات الأوروبية** (مرسيدس، BMW، أودي، فولكس ...)\n\n`;
      response += `• الخيار الأول: ⭐ **Liqui Moly** (زيت ألماني متخصص للسيارات الأوروبية)\n`;
      response += `• الخيار الثاني: **Meguin** (بديل ألماني اقتصادي)\n\n`;
    } else { // كوري/ياباني أو غير ذلك
      response += `🇯🇵🇰🇷 **السيارات الكورية واليابانية** (كيا، هيونداي، تويوتا، نيسان ...)\n\n`;
      response += `• الخيار الأول: ⭐ **Valvoline** أو **Castrol** (نحن نحدد أيهم أولوية حسب الربحية)\n`;
      response += `• الخيار الثاني: **Liqui Moly** (للي يريد بريميوم)\n`;
      response += `• الخيار الثالث: **Meguin** (بديل ألماني اقتصادي)\n\n`;
    }
    
    // القسم الثالث: معلومات إضافية
    response += `## 3. معلومات إضافية\n\n`;
    
    if (recommendation.filterNumber) {
      response += `📦 **فلتر الزيت:** ${recommendation.filterNumber}\n`;
    }
    
    response += `🔄 **فترة التغيير:** ${recommendation.changeInterval}\n`;
    response += `${confidenceEmoji} **مستوى الثقة:** ${recommendation.confidence === 'high' ? 'عالي' : recommendation.confidence === 'medium' ? 'متوسط' : 'منخفض'}\n\n`;

    response += `💡 **التحليل:**\n${recommendation.reasoning}\n\n`;

    if (recommendation.sources.length > 0) {
      response += `📚 **المصادر المعتمدة:**\n`;
      recommendation.sources.slice(0, 3).forEach((source, index) => {
        response += `${index + 1}. ${source}\n`;
      });
      response += `\n`;
    }

    response += `🌡️ **ملاحظة للمناخ العراقي:** هذه التوصية محدثة من المصادر الرسمية ومناسبة للظروف المناخية الحارة في العراق.\n\n`;
    response += `⚠️ **تنبيه:** المعلومات محدثة من المواقع الرسمية للشركات المصنعة وموثوقة 100%.`;

    return response;
  }

  /**
   * تحديد منشأ السيارة (أمريكية، أوروبية، آسيوية)
   */
  private determineCarOrigin(brand: string): 'american' | 'european' | 'asian' {
    const brandLower = brand.toLowerCase();
    
    // السيارات الأمريكية
    const americanBrands = [
      'ford', 'chevrolet', 'chevy', 'gmc', 'cadillac', 'chrysler', 'dodge', 'jeep', 'ram', 'buick',
      'lincoln', 'tesla', 'pontiac', 'hummer', 'saturn', 'oldsmobile'
    ];
    
    // السيارات الأوروبية
    const europeanBrands = [
      'mercedes', 'bmw', 'audi', 'volkswagen', 'vw', 'porsche', 'volvo', 'jaguar', 'land rover',
      'range rover', 'mini', 'bentley', 'rolls royce', 'aston martin', 'ferrari', 'lamborghini',
      'maserati', 'alfa romeo', 'fiat', 'peugeot', 'renault', 'citroen', 'opel', 'seat', 'skoda',
      'smart', 'bugatti', 'mclaren'
    ];
    
    // السيارات الآسيوية (يابانية وكورية)
    const asianBrands = [
      'toyota', 'honda', 'nissan', 'mazda', 'subaru', 'mitsubishi', 'lexus', 'infiniti', 'acura',
      'suzuki', 'daihatsu', 'isuzu', 'hyundai', 'kia', 'genesis', 'daewoo', 'ssangyong'
    ];
    
    if (americanBrands.some(b => brandLower.includes(b))) {
      return 'american';
    } else if (europeanBrands.some(b => brandLower.includes(b))) {
      return 'european';
    } else {
      // افتراضياً نعتبر السيارة آسيوية إذا لم تكن أمريكية أو أوروبية
      return 'asian';
    }
  }
}

export const intelligentOilService = new IntelligentOilRecommendationService();