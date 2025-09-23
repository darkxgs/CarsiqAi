/**
 * DuckDuckGo Search Service - Free Alternative to Brave Search
 * No API key required, completely free
 */

interface DDGResult {
  title: string;
  url: string;
  description: string;
}

interface DDGResponse {
  results: DDGResult[];
  sources: string[];
  confidence: 'high' | 'medium' | 'low';
}

export class DuckDuckGoService {
  private baseUrl = 'https://api.duckduckgo.com/';

  /**
   * Search using DuckDuckGo Instant Answer API
   */
  async search(query: string): Promise<DDGResult[]> {
    try {
      console.log('🦆 DuckDuckGo search for:', query);
      
      // DuckDuckGo Instant Answer API
      const response = await fetch(`${this.baseUrl}?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
      
      if (!response.ok) {
        console.error('DuckDuckGo API error:', response.status);
        return [];
      }

      const data = await response.json();
      const results: DDGResult[] = [];

      // Extract results from different sections
      if (data.RelatedTopics) {
        data.RelatedTopics.forEach((topic: any) => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 100),
              description: topic.Text,
              url: topic.FirstURL
            });
          }
        });
      }

      // Extract from Abstract if available
      if (data.Abstract && data.AbstractURL) {
        results.push({
          title: data.Heading || 'Car Oil Information',
          description: data.Abstract,
          url: data.AbstractURL
        });
      }

      console.log(`🦆 DuckDuckGo found ${results.length} results`);
      return results.slice(0, 10); // Limit to top 10

    } catch (error) {
      console.error('DuckDuckGo search error:', error);
      return [];
    }
  }

  /**
   * Search for car oil specifications
   */
  async searchCarOilSpecs(brand: string, model: string, year?: number): Promise<DDGResponse> {
    const yearStr = year ? ` ${year}` : '';
    
    const queries = [
      `${brand} ${model}${yearStr} oil capacity quarts liters`,
      `${brand} ${model}${yearStr} oil viscosity 0W-20 5W-30`,
      `${brand} ${model}${yearStr} engine oil specifications`
    ];

    const allResults: DDGResult[] = [];
    const sources: Set<string> = new Set();

    for (const query of queries) {
      const results = await this.search(query);
      
      results.forEach(result => {
        // Avoid duplicates
        if (!allResults.some(r => r.url === result.url)) {
          allResults.push(result);
          
          try {
            const domain = new URL(result.url).hostname;
            sources.add(domain);
          } catch (e) {
            // Invalid URL, skip
          }
        }
      });

      // Small delay between queries
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Calculate confidence based on results and sources
    let confidence: 'high' | 'medium' | 'low' = 'low';
    if (allResults.length >= 5 && sources.size >= 3) confidence = 'high';
    else if (allResults.length >= 2 && sources.size >= 2) confidence = 'medium';

    return {
      results: allResults,
      sources: Array.from(sources),
      confidence
    };
  }
}

export const duckDuckGoService = new DuckDuckGoService();