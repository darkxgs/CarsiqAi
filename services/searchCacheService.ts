/**
 * Search Cache Service - Cache search results to reduce API calls
 * Stores results in memory with TTL (Time To Live)
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface SearchCacheKey {
  brand: string;
  model: string;
  year?: number;
  queryType: string;
}

export class SearchCacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generate cache key from search parameters
   */
  private generateKey(params: SearchCacheKey): string {
    const { brand, model, year, queryType } = params;
    return `${brand.toLowerCase()}_${model.toLowerCase()}_${year || 'any'}_${queryType}`;
  }

  /**
   * Get cached search results
   */
  get(params: SearchCacheKey): any | null {
    const key = this.generateKey(params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    console.log(`📦 Cache HIT for: ${key}`);
    return entry.data;
  }

  /**
   * Store search results in cache
   */
  set(params: SearchCacheKey, data: any, customTTL?: number): void {
    const key = this.generateKey(params);
    const ttl = customTTL || this.defaultTTL;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });

    console.log(`📦 Cache SET for: ${key} (TTL: ${ttl / 1000 / 60} minutes)`);
  }

  /**
   * Clear expired cache entries
   */
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`📦 Cache cleanup: removed ${cleaned} expired entries`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    console.log('📦 Cache cleared');
  }
}

export const searchCacheService = new SearchCacheService();

// Run cleanup every hour
setInterval(() => {
  searchCacheService.cleanup();
}, 60 * 60 * 1000);