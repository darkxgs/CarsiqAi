/**
 * Authoritative Scraping Service
 * Scrapes reliable automotive sources for accurate oil specifications
 */

interface ScrapedResult {
  title: string;
  content: string;
  url: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
}

export class AuthoritativeScrapingService {
  private authoritativeSources = [
    'toyota.com',
    'honda.com',
    'hyundai.com',
    'kia.com',
    'nissan.com',
    'ford.com',
    'bobistheoilguy.com',
    'oilcapacityguide.com',
    'amsoil.com',
    'mobil.com'
  ];

  /**
   * Check if a URL is from an authoritative source
   */
  private isAuthoritativeSource(url: string): boolean {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      return this.authoritativeSources.some(source => domain.includes(source));
    } catch {
      return false;
    }
  }

  /**
   * Extract oil capacity from text using advanced patterns
   */
  private extractOilCapacity(text: string): string[] {
    const capacityPatterns = [
      // Pattern: "4.5 quarts with filter"
      /(\d+\.?\d*)\s*(quarts?|qt)\s*(?:with\s*filter)?/gi,
      // Pattern: "4.2 liters with filter"
      /(\d+\.?\d*)\s*(liters?|litres?|l)\s*(?:with\s*filter)?/gi,
      // Pattern: "oil capacity: 4.4 qt"
      /oil\s*capacity\s*:?\s*(\d+\.?\d*)\s*(quarts?|qt|liters?|l)/gi,
      // Pattern: "takes 4.4 quarts"
      /takes\s*(\d+\.?\d*)\s*(quarts?|qt|liters?|l)/gi
    ];

    const results: string[] = [];
    
    for (const pattern of capacityPatterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        const amount = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        
        if (amount > 0 && amount < 15) { // Reasonable range
          results.push(`${amount} ${unit}`);
        }
      }
    }

    return [...new Set(results)]; // Remove duplicates
  }

  /**
   * Extract oil viscosity from text
   */
  private extractOilViscosity(text: string): string[] {
    const viscosityPatterns = [
      // Standard viscosity patterns
      /\b(\d+w-\d+)\b/gi,
      // With context
      /(?:recommended|use|requires?)\s*(\d+w-\d+)/gi,
      // OEM specification
      /(?:oem|factory)\s*(?:spec)?\s*(\d+w-\d+)/gi
    ];

    const results: string[] = [];
    
    for (const pattern of viscosityPatterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        results.push(match[1].toUpperCase());
      }
    }

    return [...new Set(results)]; // Remove duplicates
  }

  /**
   * Scrape a specific URL for oil information
   */
  async scrapeUrl(url: string): Promise<ScrapedResult | null> {
    try {
      console.log('🔍 Scraping:', url);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      
      // Simple text extraction (remove HTML tags)
      const textContent = html
        .replace(/<script[^>]*>.*?<\/script>/gis, '')
        .replace(/<style[^>]*>.*?<\/style>/gis, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Extract oil-related information
      const capacities = this.extractOilCapacity(textContent);
      const viscosities = this.extractOilViscosity(textContent);

      if (capacities.length === 0 && viscosities.length === 0) {
        return null;
      }

      const domain = new URL(url).hostname;
      const confidence = this.isAuthoritativeSource(url) ? 'high' : 'medium';

      return {
        title: `Oil specifications from ${domain}`,
        content: `Capacities: ${capacities.join(', ')} | Viscosities: ${viscosities.join(', ')}`,
        url,
        source: domain,
        confidence
      };

    } catch (error) {
      console.error('Scraping error for', url, error);
      return null;
    }
  }

  /**
   * Search and scrape authoritative sources
   */
  async searchAuthoritativeSources(brand: string, model: string, year?: number): Promise<ScrapedResult[]> {
    const yearStr = year ? ` ${year}` : '';
    const searchQuery = `${brand} ${model}${yearStr} oil capacity viscosity`;
    
    // For now, we'll use a simple approach
    // In a real implementation, you might use Google Custom Search API
    // or scrape search results to find authoritative URLs
    
    const potentialUrls = [
      `https://www.${brand.toLowerCase()}.com`,
      `https://bobistheoilguy.com/forums/search/?q=${encodeURIComponent(searchQuery)}`,
      `https://oilcapacityguide.com/${brand.toLowerCase()}-${model.toLowerCase()}-oil-capacity/`
    ];

    const results: ScrapedResult[] = [];

    for (const url of potentialUrls) {
      try {
        const result = await this.scrapeUrl(url);
        if (result) {
          results.push(result);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error scraping', url, error);
      }
    }

    return results;
  }
}

export const authoritativeScrapingService = new AuthoritativeScrapingService();