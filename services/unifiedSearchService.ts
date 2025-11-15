/**
 * Unified Search Service - Multi-tier search system
 * 1. Brave Search (primary)
 * 2. DuckDuckGo (fallback)
 * 3. Authoritative Scraping (verification)
 * 4. Caching layer (performance)
 */

import { braveSearchService } from './braveSearchService';
import { duckDuckGoService } from './duckDuckGoService';
import { authoritativeScrapingService } from './authoritativeScrapingService';
import { searchCacheService } from './searchCacheService';

interface UnifiedSearchResult {
  oilCapacity: {
    results: any[];
    confidence: 'high' | 'medium' | 'low';
    sources: string[];
  };
  viscosity: {
    results: any[];
    confidence: 'high' | 'medium' | 'low';
    sources: string[];
  };
  overallConfidence: 'high' | 'medium' | 'low';
  searchMethod: string;
  cached: boolean;
}

export class UnifiedSearchService {
  /**
   * Main search method with multi-tier fallback
   */
  async searchCarOilSpecs(brand: string, model: string, year?: number): Promise<UnifiedSearchResult> {
    console.log(`🔍 Unified search for: ${brand} ${model} ${year || ''}`);

    // Check cache first
    const cacheKey = { brand, model, year, queryType: 'oil_specs' };
    const cachedResult = searchCacheService.get(cacheKey);
    
    if (cachedResult) {
      return { ...cachedResult, cached: true };
    }

    let result: UnifiedSearchResult;

    // Tier 1: Brave Search (primary)
    try {
      console.log('🔍 Tier 1: Trying Brave Search...');
      const braveResult = await braveSearchService.searchComprehensiveCarData(brand, model, year);
      
      if (this.isGoodResult(braveResult)) {
        result = this.formatResult(braveResult, 'Brave Search', false);
        console.log('✅ Brave Search successful');
      } else {
        throw new Error('Brave Search returned insufficient results');
      }
    } catch (braveError) {
      console.log('⚠️ Brave Search failed, trying DuckDuckGo...');
      
      // Tier 2: DuckDuckGo (fallback)
      try {
        console.log('🔍 Tier 2: Trying DuckDuckGo...');
        const ddgResult = await duckDuckGoService.searchCarOilSpecs(brand, model, year);
        
        if (ddgResult.results.length > 0) {
          result = this.formatDDGResult(ddgResult, 'DuckDuckGo', false);
          console.log('✅ DuckDuckGo successful');
        } else {
          throw new Error('DuckDuckGo returned no results');
        }
      } catch (ddgError) {
        console.log('⚠️ DuckDuckGo failed, trying authoritative scraping...');
        
        // Tier 3: Authoritative Scraping (last resort)
        try {
          console.log('🔍 Tier 3: Trying authoritative scraping...');
          const scrapedResults = await authoritativeScrapingService.searchAuthoritativeSources(brand, model, year);
          
          if (scrapedResults.length > 0) {
            result = this.formatScrapedResult(scrapedResults, 'Authoritative Scraping', false);
            console.log('✅ Authoritative scraping successful');
          } else {
            // Final fallback: return empty result with guidance
            result = this.createFallbackResult();
            console.log('⚠️ All search methods failed, using fallback');
          }
        } catch (scrapingError) {
          result = this.createFallbackResult();
          console.log('❌ All search methods failed');
        }
      }
    }

    // Cache the result (shorter TTL for fallback results)
    const ttl = result.overallConfidence === 'high' ? 24 * 60 * 60 * 1000 : 6 * 60 * 60 * 1000;
    searchCacheService.set(cacheKey, result, ttl);

    return result;
  }

  /**
   * Check if Brave Search result is good enough
   */
  private isGoodResult(result: any): boolean {
    return result.overallConfidence !== 'low' && 
           (result.oilCapacity.results.length > 0 || result.viscosity.results.length > 0);
  }

  /**
   * Format Brave Search result
   */
  private formatResult(braveResult: any, method: string, cached: boolean): UnifiedSearchResult {
    return {
      oilCapacity: braveResult.oilCapacity,
      viscosity: braveResult.viscosity,
      overallConfidence: braveResult.overallConfidence,
      searchMethod: method,
      cached
    };
  }

  /**
   * Format DuckDuckGo result
   */
  private formatDDGResult(ddgResult: any, method: string, cached: boolean): UnifiedSearchResult {
    return {
      oilCapacity: {
        results: ddgResult.results.filter((r: any) => 
          r.description.toLowerCase().includes('capacity') || 
          r.description.toLowerCase().includes('quart') ||
          r.description.toLowerCase().includes('liter')
        ),
        confidence: ddgResult.confidence,
        sources: ddgResult.sources
      },
      viscosity: {
        results: ddgResult.results.filter((r: any) => 
          r.description.match(/\b\d+w-\d+\b/i) ||
          r.description.toLowerCase().includes('viscosity')
        ),
        confidence: ddgResult.confidence,
        sources: ddgResult.sources
      },
      overallConfidence: ddgResult.confidence,
      searchMethod: method,
      cached
    };
  }

  /**
   * Format scraped result
   */
  private formatScrapedResult(scrapedResults: any[], method: string, cached: boolean): UnifiedSearchResult {
    const sources = scrapedResults.map(r => r.source);
    const confidence = scrapedResults.some(r => r.confidence === 'high') ? 'high' : 'medium';

    return {
      oilCapacity: {
        results: scrapedResults.filter(r => r.content.includes('Capacities:')),
        confidence,
        sources
      },
      viscosity: {
        results: scrapedResults.filter(r => r.content.includes('Viscosities:')),
        confidence,
        sources
      },
      overallConfidence: confidence,
      searchMethod: method,
      cached
    };
  }

  /**
   * Create fallback result when all searches fail
   */
  private createFallbackResult(): UnifiedSearchResult {
    return {
      oilCapacity: {
        results: [],
        confidence: 'low',
        sources: []
      },
      viscosity: {
        results: [],
        confidence: 'low',
        sources: []
      },
      overallConfidence: 'low',
      searchMethod: 'Fallback (No Search Results)',
      cached: false
    };
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return searchCacheService.getStats();
  }

  /**
   * Clear search cache
   */
  clearCache() {
    searchCacheService.clear();
  }
}

export const unifiedSearchService = new UnifiedSearchService();