/**
 * Bing Search API Service for Real-time Car Data Retrieval
 * Integrates with current free AI model for enhanced recommendations
 */

interface BingSearchResult {
  name: string;
  url: string;
  snippet: string;
  displayUrl: string;
}

interface BingSearchResponse {
  webPages?: {
    value: BingSearchResult[];
    totalEstimatedMatches: number;
  };
}

export class BingSearchService {
  private apiKey: string;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.BING_SEARCH_API_KEY || '';
    this.endpoint = 'https://api.bing.microsoft.com/v7.0/search';
  }

  /**
   * Generate search query for car oil specifications
   */
  generateCarOilQuery(brand: string, model: string, year?: number, engineSize?: string): string {
    const yearStr = year ? ` ${year}` : '';
    const engineStr = engineSize ? ` ${engineSize}` : '';
    
    return `${brand} ${model}${yearStr}${engineStr} oil capacity viscosity site:${brand.toLowerCase()}.com OR site:mobil1.com OR site:castrol.com`;
  }

  /**
   * Search for car oil specifications
   */
  async searchCarOilSpecs(brand: string, model: string, year?: number, engineSize?: string): Promise<{
    results: BingSearchResult[];
    query: string;
    success: boolean;
  }> {
    if (!this.apiKey) {
      console.warn('Bing Search API key not configured');
      return { results: [], query: '', success: false };
    }

    const searchQuery = this.generateCarOilQuery(brand, model, year, engineSize);
    console.log('🔍 Bing Search Query:', searchQuery);

    try {
      const url = new URL(this.endpoint);
      url.searchParams.append('q', searchQuery);
      url.searchParams.append('count', '10');
      url.searchParams.append('mkt', 'en-US');
      url.searchParams.append('safesearch', 'Moderate');

      const response = await fetch(url.toString(), {
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'User-Agent': 'CarsiqAi-SearchBot/1.0'
        }
      });

      if (!response.ok) {
        console.error('Bing Search API error:', response.status, response.statusText);
        return { results: [], query: searchQuery, success: false };
      }

      const data: BingSearchResponse = await response.json();
      const results = data.webPages?.value || [];
      
      console.log(`✅ Bing Search successful: ${results.length} results found`);
      
      return {
        results,
        query: searchQuery,
        success: true
      };

    } catch (error) {
      console.error('Bing Search execution error:', error);
      return { results: [], query: searchQuery, success: false };
    }
  }

  /**
   * Format search results for AI analysis
   */
  formatSearchResultsForAI(searchResults: BingSearchResult[]): string {
    if (searchResults.length === 0) {
      return 'لم يتم العثور على نتائج بحث من المصادر الرسمية.';
    }

    let formattedResults = '🔍 **نتائج البحث من المصادر الرسمية:**\n\n';
    
    searchResults.slice(0, 5).forEach((result, index) => {
      formattedResults += `${index + 1}. **${result.name}**\n`;
      formattedResults += `   🔗 المصدر: ${result.displayUrl}\n`;
      formattedResults += `   📄 المعلومات: ${result.snippet}\n\n`;
    });

    formattedResults += '⚠️ **تعليمات للذكاء الاصطناعي:** استخدم هذه المعلومات المحدثة من المصادر الرسمية لتقديم توصية دقيقة. اذكر المصادر في إجابتك.\n\n';

    return formattedResults;
  }
}

export const bingSearchService = new BingSearchService();