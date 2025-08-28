/**
 * Brave Search API Service for Real-time Car Data Retrieval
 * Provides intelligent search capabilities for accurate oil recommendations
 */

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  published?: string;
  thumbnail?: {
    src: string;
  };
}

interface BraveSearchResponse {
  web?: {
    results: BraveSearchResult[];
    total: number;
  };
}

interface SearchQuery {
  carBrand: string;
  carModel: string;
  year?: number;
  engineSize?: string;
  queryType: 'oil_capacity' | 'oil_viscosity' | 'oil_filter' | 'maintenance';
}

export class BraveSearchService {
  private apiKey: string;
  private endpoint: string;
  private maxResults: number;
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 1100; // 1.1 seconds for free tier

  constructor() {
    this.apiKey = process.env.BRAVE_SEARCH_API_KEY || '';
    this.endpoint = 'https://api.search.brave.com/res/v1/web/search';
    this.maxResults = 15; // Increased for better coverage
  }

  /**
   * Get brand-specific search patterns and common viscosities
   */
  private getBrandSpecificInfo(brand: string): { 
    commonViscosities: string[], 
    sitePattern: string,
    brandVariations: string[]
  } {
    const brandLower = brand.toLowerCase();
    
    const brandInfo = {
      toyota: {
        commonViscosities: ['0W-20', '5W-30', '5W-20'],
        sitePattern: 'toyota.com OR support.toyota.com',
        brandVariations: ['Toyota', 'TOYOTA', 'toyota']
      },
      honda: {
        commonViscosities: ['0W-20', '5W-30', '5W-20'],
        sitePattern: 'honda.com OR hondatech.com',
        brandVariations: ['Honda', 'HONDA', 'honda']
      },
      hyundai: {
        commonViscosities: ['5W-30', '5W-20', '0W-20'],
        sitePattern: 'hyundai.com OR hyundaiusa.com',
        brandVariations: ['Hyundai', 'HYUNDAI', 'hyundai']
      },
      nissan: {
        commonViscosities: ['5W-30', '0W-20', '5W-20'],
        sitePattern: 'nissan.com OR nissanusa.com',
        brandVariations: ['Nissan', 'NISSAN', 'nissan']
      },
      kia: {
        commonViscosities: ['5W-30', '5W-20', '0W-20'],
        sitePattern: 'kia.com OR kiamotors.com',
        brandVariations: ['Kia', 'KIA', 'kia']
      },
      ford: {
        commonViscosities: ['5W-30', '5W-20', '0W-20'],
        sitePattern: 'ford.com',
        brandVariations: ['Ford', 'FORD', 'ford']
      },
      chevrolet: {
        commonViscosities: ['5W-30', '0W-20', '5W-20'],
        sitePattern: 'chevrolet.com OR gm.com',
        brandVariations: ['Chevrolet', 'CHEVROLET', 'chevrolet', 'Chevy', 'chevy']
      },
      bmw: {
        commonViscosities: ['5W-30', '0W-30', '5W-40'],
        sitePattern: 'bmw.com OR bmwusa.com',
        brandVariations: ['BMW', 'bmw']
      },
      mercedes: {
        commonViscosities: ['5W-30', '0W-30', '5W-40'],
        sitePattern: 'mercedes-benz.com OR mbusa.com',
        brandVariations: ['Mercedes', 'Mercedes-Benz', 'mercedes', 'mercedes-benz']
      },
      jeep: {
        commonViscosities: ['5W-30', '0W-20', '5W-20'],
        sitePattern: 'jeep.com',
        brandVariations: ['Jeep', 'JEEP', 'jeep']
      }
    };
    
    return brandInfo[brandLower] || {
      commonViscosities: ['5W-30', '0W-20', '5W-20'],
      sitePattern: `${brandLower}.com`,
      brandVariations: [brand, brand.toLowerCase(), brand.toUpperCase()]
    };
  }

  /**
   * Generate optimized search queries for different data types
   */
  private generateSearchQueries(searchQuery: SearchQuery): string[] {
    const { carBrand, carModel, year, engineSize, queryType } = searchQuery;
    const yearStr = year ? ` ${year}` : '';
    const engineStr = engineSize ? ` ${engineSize}` : '';
    
    // Get brand-specific information
    const brandInfo = this.getBrandSpecificInfo(carBrand);
    const viscosityOptions = brandInfo.commonViscosities.map(v => `"${v}"`).join(' OR ');

    const queries: string[] = [];

    switch (queryType) {
      case 'oil_capacity':
        // Highly focused oil capacity queries with common automotive terms
        queries.push(
          `"${carBrand} ${carModel}" ${yearStr} oil capacity quarts liters "with filter" "oil change" specifications`,
          `${carBrand} ${carModel} ${yearStr} "oil capacity" "engine oil" "motor oil" "how much oil" manual`,
          `"${carBrand} ${carModel}" ${yearStr} "oil drain and fill" "oil refill capacity" "crankcase capacity"`,
          `${carBrand} ${carModel} ${yearStr} "oil change capacity" "oil service" quarts liters maintenance`,
          `"${carBrand} ${carModel}" ${yearStr} "owner manual" "service manual" oil capacity specifications`,
          `${carBrand} ${carModel} ${yearStr} "oil capacity guide" "maintenance guide" "how many quarts"`
        );
        
        // Add brand-specific detailed queries
        if (carBrand.toLowerCase() === 'honda') {
          queries.push(
            `"Honda ${carModel}" ${yearStr} "1.5L turbo" oil capacity "3.7 quarts" "3.5 liters"`,
            `"Honda ${carModel}" ${yearStr} "2.0L" oil capacity "4.4 quarts" "4.2 liters"`,
            `Honda ${carModel} ${yearStr} oil capacity specifications site:honda.com OR site:hondanews.com`
          );
        } else if (carBrand.toLowerCase() === 'toyota') {
          queries.push(
            `"Toyota ${carModel}" ${yearStr} "2.5L" oil capacity "4.6 quarts" "4.4 liters"`,
            `"Toyota ${carModel}" ${yearStr} "3.5L V6" oil capacity "6.4 quarts" "6.1 liters"`,
            `Toyota ${carModel} ${yearStr} oil capacity site:toyota.com OR site:toyotanews.com OR site:toyotanation.com`
          );
        } else if (carBrand.toLowerCase() === 'hyundai') {
          queries.push(
            `"Hyundai ${carModel}" ${yearStr} "2.0L MPI" oil capacity "4.5 quarts" "4.3 liters"`,
            `"Hyundai ${carModel}" ${yearStr} "1.6L" "1.8L" oil capacity "3.6 liters" "4.2 liters"`,
            `Hyundai ${carModel} ${yearStr} "oil change" "how much oil" capacity specifications`,
            `"Hyundai ${carModel}" ${yearStr} "0W-20" "5W-30" oil viscosity recommendations`
          );
        } else if (carBrand.toLowerCase() === 'kia') {
          queries.push(
            `"Kia ${carModel}" ${yearStr} oil capacity "1.6L turbo" "4.8 liters" "5.0 liters"`,
            `"Kia ${carModel}" ${yearStr} oil capacity "2.0L" "4.2 liters" "4.4 liters"`,
            `"Kia ${carModel}" ${yearStr} oil capacity "2.4L" "4.73 liters" maintenance manual`,
            `Kia ${carModel} ${yearStr} "oil change" "how much oil" "different engines" capacity`
          );
        } else if (carBrand.toLowerCase() === 'mazda') {
          queries.push(
            `"Mazda ${carModel}" ${yearStr} "SkyActiv-G 2.5L" oil capacity "4.8 liters" "5.1 quarts"`,
            `"Mazda ${carModel}" ${yearStr} "0W-20" "5W-30" oil viscosity recommendations`,
            `Mazda ${carModel} ${yearStr} "oil change" "how much oil" capacity specifications`,
            `"Mazda ${carModel}" ${yearStr} "turbo" "non-turbo" oil capacity differences`
          );
        } else if (carBrand.toLowerCase() === 'chrysler' || carBrand.toLowerCase() === 'كرايسلر') {
          // Force Chrysler 300 search regardless of detected model
          const chryslerModel = carModel === '3' ? '300' : carModel;
          queries.push(
            `"Chrysler 300" ${yearStr} "3.6L V6" oil capacity "6.0 quarts" "5.7 liters"`,
            `"Chrysler 300C" ${yearStr} "5.7L HEMI" oil capacity "7.0 quarts" "6.6 liters"`,
            `"Chrysler 300" ${yearStr} oil capacity "with filter" specifications manual`,
            `Chrysler 300 ${yearStr} "oil change" "how much oil" capacity maintenance guide`,
            `"Chrysler 300" ${yearStr} "recommended oil" "5W-20" viscosity specifications`,
            `"2012 Chrysler 300" oil capacity "6.0 liters" "7.0 liters" specifications`
          );
        }
        
        // Universal queries for any brand not specifically handled above
        if (!['honda', 'toyota', 'hyundai', 'kia', 'mazda', 'chrysler', 'كرايسلر'].includes(carBrand.toLowerCase())) {
          queries.push(
            `"${carBrand} ${carModel}" ${yearStr} oil capacity "with filter" quarts liters specifications`,
            `${carBrand} ${carModel} ${yearStr} "oil change" "how much oil" capacity manual`,
            `"${carBrand} ${carModel}" ${yearStr} "recommended oil" viscosity specifications`,
            `${carBrand} ${carModel} ${yearStr} "owner manual" oil capacity maintenance guide`
          );
        }
        
        // Add general automotive site searches for any brand
        queries.push(
          `"${carBrand} ${carModel}" ${yearStr} oil capacity site:edmunds.com OR site:autotrader.com`,
          `${carBrand} ${carModel} ${yearStr} "oil capacity" site:carfax.com OR site:kbb.com OR site:cargurus.com`
        );
        break;

      case 'oil_viscosity':
        queries.push(
          `"${carBrand} ${carModel}" ${yearStr} "recommended oil" "oil viscosity" ${viscosityOptions}`,
          `${carBrand} ${carModel} ${yearStr} "what oil" "oil type" "oil grade" ${viscosityOptions} specifications`,
          `"${carBrand} ${carModel}" ${yearStr} "engine oil" "motor oil" ${viscosityOptions} manual guide`,
          `${carBrand} ${carModel} ${yearStr} oil viscosity "recommended" "specified" ${viscosityOptions}`,
          `"${carBrand} ${carModel}" ${yearStr} "oil specification" "OEM oil" ${viscosityOptions}`,
          `${carBrand} ${carModel} ${yearStr} "factory oil" "original oil" ${viscosityOptions} engine`
        );
        break;

      case 'oil_filter':
        queries.push(
          `${carBrand} ${carModel}${yearStr} oil filter part number site:${carBrand.toLowerCase()}.com`,
          `${carBrand} ${carModel}${yearStr} oil filter Denckermann part number`,
          `"${carBrand} ${carModel}"${yearStr} "oil filter" "part number" OR "filter number"`,
          `${carBrand} ${carModel}${yearStr} maintenance schedule oil filter replacement`
        );
        break;

      case 'maintenance':
        queries.push(
          `${carBrand} ${carModel}${yearStr} maintenance schedule oil change interval site:${carBrand.toLowerCase()}.com`,
          `${carBrand} ${carModel}${yearStr} service intervals oil change kilometers miles`,
          `"${carBrand} ${carModel}"${yearStr} "oil change" "interval" "km" OR "miles"`,
          `${carBrand} ${carModel}${yearStr} owner manual maintenance PDF`
        );
        break;
    }

    return queries;
  }

  /**
   * Execute Brave search with retry logic and rate limiting
   */
  private async executeBraveSearch(query: string): Promise<BraveSearchResult[]> {
    if (!this.apiKey) {
      console.warn('Brave Search API key not configured');
      return [];
    }

    console.log(`🔍 Executing Brave search query: "${query}"`);

    // Rate limiting for free tier
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();

    try {
      const url = new URL(this.endpoint);
      url.searchParams.append('q', query);
      url.searchParams.append('count', this.maxResults.toString());
      url.searchParams.append('country', 'US');
      url.searchParams.append('search_lang', 'en');
      url.searchParams.append('ui_lang', 'en-US');
      url.searchParams.append('safesearch', 'moderate');

      console.log(`🌐 Brave Search URL: ${url.toString()}`);

      const response = await fetch(url.toString(), {
        headers: {
          'X-Subscription-Token': this.apiKey,
          'Accept': 'application/json',
          'User-Agent': 'CarsiqAi-SearchBot/1.0'
        }
      });

      console.log(`📡 Brave Search response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        console.error('Brave Search API error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return [];
      }

      const data: BraveSearchResponse = await response.json();
      const results = data.web?.results || [];
      console.log(`📊 Brave Search returned ${results.length} results (total: ${data.web?.total || 0})`);
      
      if (results.length > 0) {
        console.log(`📝 First result: ${results[0].title} - ${results[0].url}`);
      }
      
      return results;

    } catch (error) {
      console.error('Brave Search execution error:', error);
      return [];
    }
  }

  /**
   * Search for car oil specifications with intelligent query optimization
   */
  async searchCarOilSpecs(searchQuery: SearchQuery): Promise<{
    results: BraveSearchResult[];
    sources: string[];
    confidence: 'high' | 'medium' | 'low';
  }> {
    const queries = this.generateSearchQueries(searchQuery);
    const allResults: BraveSearchResult[] = [];
    const sources: Set<string> = new Set();

    // Execute searches sequentially for free tier rate limits
    const searchResults: BraveSearchResult[][] = [];

    // Use more oil-focused queries for better coverage
    const limitedQueries = queries.slice(0, 4); // Increased to 4 for better oil-specific coverage

    for (let i = 0; i < limitedQueries.length; i++) {
      const query = limitedQueries[i];
      const results = await this.executeBraveSearch(query);
      searchResults.push(results);

      // Add delay between requests for free tier (except for the last request)
      if (i < limitedQueries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2 second delay
      }
    }

    // Combine and deduplicate results
    for (const results of searchResults) {
      for (const result of results) {
        // Check if we already have this URL
        if (!allResults.some(r => r.url === result.url)) {
          allResults.push(result);

          // Extract domain for source tracking
          try {
            const domain = new URL(result.url).hostname;
            sources.add(domain);
          } catch (e) {
            // Invalid URL, skip
          }
        }
      }
    }

    // Determine confidence based on source quality and result count
    let confidence: 'high' | 'medium' | 'low' = 'low';

    const officialSources = Array.from(sources).filter(source =>
      // Manufacturer official sites
      source.includes('toyota.com') ||
      source.includes('honda.com') ||
      source.includes('hyundai.com') ||
      source.includes('hyundaiusa.com') ||
      source.includes('nissan.com') ||
      source.includes('nissanusa.com') ||
      source.includes('ford.com') ||
      source.includes('chevrolet.com') ||
      source.includes('gm.com') ||
      source.includes('bmw.com') ||
      source.includes('bmwusa.com') ||
      source.includes('mercedes-benz.com') ||
      source.includes('mbusa.com') ||
      source.includes('kia.com') ||
      source.includes('kiamotors.com') ||
      source.includes('mazda.com') ||
      source.includes('mazdausa.com') ||
      source.includes('subaru.com') ||
      source.includes('volkswagen.com') ||
      source.includes('vw.com') ||
      source.includes('audi.com') ||
      source.includes('audiusa.com') ||
      source.includes('lexus.com') ||
      source.includes('infiniti.com') ||
      source.includes('acura.com') ||
      source.includes('genesis.com') ||
      source.includes('mitsubishi.com') ||
      source.includes('jeep.com') ||
      source.includes('dodge.com') ||
      source.includes('chrysler.com') ||
      source.includes('ram.com') ||
      // Oil company official sites
      source.includes('mobil1.com') ||
      source.includes('mobil.com') ||
      source.includes('castrol.com') ||
      source.includes('liquimoly.com') ||
      source.includes('valvoline.com') ||
      source.includes('motul.com') ||
      source.includes('amsoil.com') ||
      source.includes('pennzoil.com') ||
      source.includes('shell.com') ||
      // Automotive knowledge sources as semi-official
      source.includes('toyotanation.com') ||
      source.includes('hondatech.com') ||
      source.includes('bobistheoilguy.com') ||
      source.includes('edmunds.com') ||
      source.includes('motortrend.com') ||
      source.includes('caranddriver.com') ||
      // Dealership sites (dynamic pattern)
      source.includes('toyota') && source.includes('dealer') ||
      source.includes('honda') && source.includes('dealer') ||
      source.includes('hyundai') && source.includes('dealer') ||
      source.includes('nissan') && source.includes('dealer') ||
      source.includes('ford') && source.includes('dealer') ||
      source.includes('chevrolet') && source.includes('dealer') ||
      source.includes('bmw') && source.includes('dealer') ||
      source.includes('mercedes') && source.includes('dealer')
    );

    // Debug logging
    console.log(`🔍 Search confidence calculation:`, {
      totalResults: allResults.length,
      totalSources: sources.size,
      officialSources: officialSources.length,
      officialSourcesList: officialSources,
      allSources: Array.from(sources)
    });

    // Adjusted thresholds for free tier - be more lenient
    if (officialSources.length >= 1 && allResults.length >= 3) {
      confidence = 'high';
    } else if (allResults.length >= 2) {
      confidence = 'medium';
    }

    return {
      results: allResults.slice(0, 15), // Limit to top 15 results
      sources: Array.from(sources),
      confidence
    };
  }

  /**
   * Search for multiple data types sequentially (for free tier rate limits)
   */
  async searchComprehensiveCarData(carBrand: string, carModel: string, year?: number, engineSize?: string) {
    const baseQuery = { carBrand, carModel, year, engineSize };

    // For free tier: make requests sequentially with delays to avoid rate limits
    console.log('🔍 Starting sequential search for free tier...');

    // Search for oil capacity first (most important)
    let oilCapacityResults = await this.searchCarOilSpecs({ ...baseQuery, queryType: 'oil_capacity' });
    
    // If no capacity results, try alternative search terms
    if (oilCapacityResults.results.length === 0) {
      console.log('🔍 No capacity results, trying alternative search...');
      oilCapacityResults = await this.searchCarOilSpecs({ 
        carBrand: carBrand || 'car', 
        carModel: `${carModel} oil capacity`, 
        year, 
        queryType: 'oil_capacity' 
      });
    }

    // Wait 1.5 seconds between requests for free tier
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Search for oil viscosity second (also important)
    let viscosityResults = await this.searchCarOilSpecs({ ...baseQuery, queryType: 'oil_viscosity' });
    
    // If no viscosity results, try alternative search
    if (viscosityResults.results.length === 0) {
      console.log('🔍 No viscosity results, trying alternative search...');
      viscosityResults = await this.searchCarOilSpecs({ 
        carBrand: carBrand || 'car', 
        carModel: `${carModel} oil viscosity`, 
        year, 
        queryType: 'oil_viscosity' 
      });
    }

    // For free tier, we'll skip filter and maintenance searches to avoid hitting limits
    // These are less critical since we have Denckermann filter database
    console.log('🔍 Completed essential searches (capacity + viscosity) for free tier');

    return {
      oilCapacity: oilCapacityResults,
      viscosity: viscosityResults,
      filter: { results: [], sources: [], confidence: 'low' as const }, // Skip for free tier
      maintenance: { results: [], sources: [], confidence: 'low' as const }, // Skip for free tier
      overallConfidence: this.calculateOverallConfidence([
        oilCapacityResults.confidence,
        viscosityResults.confidence,
        'low', // filter placeholder
        'low'  // maintenance placeholder
      ])
    };
  }

  /**
   * Calculate overall confidence from multiple search results
   */
  private calculateOverallConfidence(confidences: ('high' | 'medium' | 'low')[]): 'high' | 'medium' | 'low' {
    const highCount = confidences.filter(c => c === 'high').length;
    const mediumCount = confidences.filter(c => c === 'medium').length;

    if (highCount >= 2) return 'high';
    if (highCount >= 1 || mediumCount >= 2) return 'medium';
    return 'low';
  }

  /**
   * Extract structured data from search results using intelligent analysis like ChatGPT
   */
  public extractStructuredData(results: BraveSearchResult[], dataType: 'oil_capacity' | 'oil_viscosity' | 'oil_filter') {
    const extractedData: any[] = [];

    // Sort results by relevance and source quality
    const sortedResults = results
      .filter(result => result.title && result.description)
      .sort((a, b) => {
        // Prioritize official sources and automotive sites
        const aScore = this.getSourceReliabilityScore(a.url);
        const bScore = this.getSourceReliabilityScore(b.url);
        return bScore - aScore;
      })
      .slice(0, 5); // Take top 5 most relevant results

    for (const result of sortedResults) {
      const fullText = `${result.title} ${result.description}`.toLowerCase();
      const domain = new URL(result.url).hostname;

      switch (dataType) {
        case 'oil_capacity':
          // Enhanced capacity extraction with engine size context and Arabic support
          const capacityPatterns = [
            // English patterns
            // Pattern: "4.4 quarts with filter" or "4.2 liters with filter"
            /(\d+\.?\d*)\s*(quarts?|qt|liters?|litres?|l)\s*(?:with\s*filter|including\s*filter)?/gi,
            // Pattern: "oil capacity: 4.4 qt" or "capacity is 4.2L"
            /(?:oil\s*)?capacity\s*(?:is|:)?\s*(\d+\.?\d*)\s*(quarts?|qt|liters?|litres?|l)/gi,
            // Pattern: "takes 4.4 quarts" or "needs 4.2 liters"
            /(?:takes|needs|requires)\s*(\d+\.?\d*)\s*(quarts?|qt|liters?|litres?|l)/gi,
            // Pattern: "~4.4 qt" or "≈4.2L"
            /[~≈]\s*(\d+\.?\d*)\s*(quarts?|qt|liters?|litres?|l)/gi,
            // More specific patterns for car manuals
            /engine\s*oil\s*capacity\s*:?\s*(\d+\.?\d*)\s*(quarts?|qt|liters?|litres?|l)/gi,
            /crankcase\s*capacity\s*:?\s*(\d+\.?\d*)\s*(quarts?|qt|liters?|litres?|l)/gi,
            // Pattern for specifications tables
            /oil\s*(?:pan\s*)?capacity\s*(?:with\s*filter)?\s*:?\s*(\d+\.?\d*)\s*(quarts?|qt|liters?|litres?|l)/gi,
            // Pattern for maintenance info
            /change\s*(?:oil\s*)?capacity\s*:?\s*(\d+\.?\d*)\s*(quarts?|qt|liters?|litres?|l)/gi,
            // Arabic patterns
            /سعة\s*الزيت\s*:?\s*(\d+\.?\d*)\s*(لتر|ليتر)/gi,
            /كمية\s*الزيت\s*:?\s*(\d+\.?\d*)\s*(لتر|ليتر)/gi
          ];

          for (const pattern of capacityPatterns) {
            const matches = [...fullText.matchAll(pattern)];
            for (const match of matches) {
              const amount = parseFloat(match[1]);
              const unit = match[2].toLowerCase();
              
              if (amount > 0 && amount < 20) { // Reasonable range for car oil capacity
                // Try to extract engine size context
                const engineContext = this.extractEngineContext(fullText);
                
                extractedData.push({
                  capacity: amount,
                  unit: unit,
                  engineContext: engineContext,
                  source: domain,
                  sourceUrl: result.url,
                  title: result.title,
                  confidence: this.getSourceReliabilityScore(result.url) > 80 ? 'high' : 'medium',
                  fullMatch: match[0]
                });
              }
            }
          }
          break;

        case 'oil_viscosity':
          // Enhanced viscosity extraction with temperature context
          const viscosityPatterns = [
            // Standard viscosity patterns
            /\b(\d+w-\d+)\b/gi,
            // With context like "recommended 0W-20" or "use 5W-30"
            /(?:recommended|use|requires?|spec(?:ified)?)\s*(\d+w-\d+)/gi,
            // OEM specification patterns
            /(?:oem|factory|original)\s*(?:spec|specification)?\s*(\d+w-\d+)/gi
          ];

          for (const pattern of viscosityPatterns) {
            const matches = [...fullText.matchAll(pattern)];
            for (const match of matches) {
              const viscosity = match[1].toUpperCase();
              
              extractedData.push({
                viscosity: viscosity,
                source: domain,
                sourceUrl: result.url,
                title: result.title,
                confidence: this.getSourceReliabilityScore(result.url) > 80 ? 'high' : 'medium',
                fullMatch: match[0]
              });
            }
          }
          break;

        case 'oil_filter':
          // Enhanced filter number extraction
          const filterPatterns = [
            // Standard automotive filter patterns
            /\b([a-z]\d{6}|[a-z]{1,3}\d{3,6}|ph\d{4}[a-z]?|wix\d{5}|fram\w{2,8})\b/gi,
            // OEM part numbers
            /(?:part\s*(?:number|#)|p\/n|oem)\s*:?\s*([a-z0-9\-]{5,15})/gi,
            // Filter with context
            /(?:oil\s*)?filter\s*(?:number|#|part)?\s*:?\s*([a-z0-9\-]{5,15})/gi
          ];

          for (const pattern of filterPatterns) {
            const matches = [...fullText.matchAll(pattern)];
            for (const match of matches) {
              const filterNumber = match[1].toUpperCase();
              
              extractedData.push({
                filterNumber: filterNumber,
                source: domain,
                sourceUrl: result.url,
                title: result.title,
                confidence: this.getSourceReliabilityScore(result.url) > 80 ? 'high' : 'medium',
                fullMatch: match[0]
              });
            }
          }
          break;
      }
    }

    return extractedData;
  }

  /**
   * Extract engine context from text (like "2.0L", "1.5T", etc.)
   */
  private extractEngineContext(text: string): string[] {
    const enginePatterns = [
      /\b(\d+\.?\d*)\s*l(?:iter)?\b/gi,
      /\b(\d+\.?\d*)\s*t(?:urbo)?\b/gi,
      /\b(\d+\.?\d*)\s*v\d+\b/gi,
      /\b(\d+\.?\d*)\s*(?:cylinder|cyl)\b/gi
    ];

    const engines: string[] = [];
    for (const pattern of enginePatterns) {
      const matches = [...text.matchAll(pattern)];
      for (const match of matches) {
        engines.push(match[0].trim());
      }
    }

    return [...new Set(engines)]; // Remove duplicates
  }

  /**
   * Get source reliability score (0-100)
   */
  private getSourceReliabilityScore(url: string): number {
    const domain = new URL(url).hostname.toLowerCase();
    
    // Official manufacturer sites (highest priority)
    if (domain.includes('honda.com') || domain.includes('toyota.com') || 
        domain.includes('hyundai.com') || domain.includes('nissan.com') ||
        domain.includes('ford.com') || domain.includes('chevrolet.com') ||
        domain.includes('bmw.com') || domain.includes('mercedes-benz.com')) {
      return 100;
    }

    // Automotive specialty sites (high priority)
    if (domain.includes('oilcapacityguide.com') || domain.includes('wheelsgreed.com') ||
        domain.includes('autopadre.com') || domain.includes('ahgautoservice.com') ||
        domain.includes('bobistheoilguy.com') || domain.includes('amsoil.com')) {
      return 90;
    }

    // General automotive sites (medium-high priority)
    if (domain.includes('civicx.com') || domain.includes('civicforums.com') ||
        domain.includes('reddit.com') || domain.includes('justanswer.com')) {
      return 75;
    }

    // General sites (medium priority)
    if (domain.includes('.com') || domain.includes('.org')) {
      return 60;
    }

    return 40; // Low priority for unknown domains
  }
}

export const braveSearchService = new BraveSearchService();