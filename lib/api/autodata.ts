import logger from "@/utils/logger"
import officialSpecs from "@/data/officialSpecs"
import type { CarSpec } from "@/data/officialSpecs"

/**
 * Interface for Autodata API response
 */
interface AutodataResponse {
  vehicles: AutodataVehicle[]
}

interface AutodataVehicle {
  id: string
  make: string
  model: string
  year: number
  variant?: string
  engineCode?: string
}

interface AutodataMaintenanceData {
  oilCapacity: string
  oilViscosity: string
  oilType: string
  filterPartNumber: string
  serviceInterval: string
  oilSpecification: string
  engineSize: string
}

/**
 * Interface for cache entries to reduce API calls
 */
interface ApiCacheEntry {
  data: any
  timestamp: number
  expiryTime: number
}

/**
 * Class for handling Autodata API requests with fallback to local database
 */
export class OilSpecsAPI {
  private apiKey: string
  private baseURL: string
  private cache: Map<string, ApiCacheEntry> = new Map()
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private useLocalFallback = true // Always use local fallback if API fails

  constructor() {
    this.apiKey = process.env.AUTODATA_API_KEY || ''
    this.baseURL = 'https://api.autodata-group.com/v1/'
    
    // Check if API key is configured
    if (!this.apiKey) {
      logger.warn('Autodata API key not configured. Using local database only.')
      this.useLocalFallback = true
    }
  }

  /**
   * Main method to get oil specifications
   */
  async getOilSpecifications(make: string, model: string, year: number, engine?: string): Promise<CarSpec | null> {
    const cacheKey = `${make.toLowerCase()}_${model.toLowerCase()}_${year}_${engine || ''}`
    
    try {
      // Check cache first
      const cachedData = this.getCachedData(cacheKey)
      if (cachedData) {
        logger.info('Retrieved oil specifications from cache', { make, model, year })
        return cachedData
      }

      // If API key is not configured or explicitly using fallback, use local database
      if (!this.apiKey || this.useLocalFallback) {
        return await this.getDatabaseFallback(make, model, year)
      }

      // Try getting data from API
      const vehicleId = await this.findVehicleId(make, model, year)
      if (!vehicleId) {
        logger.warn('Vehicle not found in Autodata API', { make, model, year })
        return await this.getDatabaseFallback(make, model, year)
      }

      const oilSpecs = await this.getMaintenanceData(vehicleId)
      const formattedSpecs = this.formatOilSpecs(oilSpecs, make, model, year)
      
      // Cache the data
      this.setCachedData(cacheKey, formattedSpecs)
      
      return formattedSpecs
    } catch (error) {
      logger.error('Error fetching oil specifications from API', { error, make, model, year })
      // Fallback to local database
      return await this.getDatabaseFallback(make, model, year)
    }
  }

  /**
   * Find vehicle ID in Autodata API
   */
  private async findVehicleId(make: string, model: string, year: number): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseURL}vehicles/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ make, model, year })
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json() as AutodataResponse
      return data.vehicles[0]?.id || null
    } catch (error) {
      logger.error('Error finding vehicle ID in Autodata API', { error, make, model, year })
      return null
    }
  }

  /**
   * Get maintenance data from Autodata API
   */
  private async getMaintenanceData(vehicleId: string): Promise<AutodataMaintenanceData> {
    try {
      const response = await fetch(`${this.baseURL}vehicles/${vehicleId}/maintenance`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }
      
      return await response.json() as AutodataMaintenanceData
    } catch (error) {
      logger.error('Error fetching maintenance data from Autodata API', { error, vehicleId })
      throw error
    }
  }

  /**
   * Format API response to match our CarSpec interface
   */
  private formatOilSpecs(apiData: AutodataMaintenanceData, make: string, model: string, year: number): CarSpec {
    // Map oil type string to our enum values
    let oilType: "Full Synthetic" | "Semi Synthetic" | "Conventional" | "High Mileage" = "Full Synthetic"
    
    if (apiData.oilType.toLowerCase().includes('synthetic')) {
      oilType = "Full Synthetic"
    } else if (apiData.oilType.toLowerCase().includes('semi')) {
      oilType = "Semi Synthetic"
    } else if (apiData.oilType.toLowerCase().includes('high mileage')) {
      oilType = "High Mileage"
    } else {
      oilType = "Conventional"
    }
    
    return {
      capacity: apiData.oilCapacity,
      viscosity: apiData.oilViscosity,
      oilType: oilType,
      filterNumber: apiData.filterPartNumber,
      engineSize: apiData.engineSize,
      apiSpec: apiData.oilSpecification,
      changeInterval: apiData.serviceInterval
    }
  }

  /**
   * Fallback to local database if API fails
   */
  private async getDatabaseFallback(make: string, model: string, year: number): Promise<CarSpec | null> {
    try {
      // Map make/model to our database format (handle naming differences)
      const mappedMake = this.mapManufacturerName(make)
      const mappedModel = this.mapModelName(model)
      
      // Find appropriate year range in our database
      const yearCategory = this.findYearCategory(mappedMake, mappedModel, year)
      if (!yearCategory) {
        logger.warn('No matching year category found in local database', { make, model, year })
        return null
      }
      
      const carSpecs = officialSpecs[mappedMake]?.[mappedModel]?.[yearCategory]
      if (!carSpecs) {
        logger.warn('No specs found in local database', { make, model, year, yearCategory })
        return null
      }
      
      logger.info('Retrieved oil specifications from local database', { make, model, year })
      return carSpecs
    } catch (error) {
      logger.error('Error retrieving data from local database', { error, make, model, year })
      return null
    }
  }

  /**
   * Map manufacturer names to match our database
   */
  private mapManufacturerName(make: string): string {
    const makeLower = make.toLowerCase()
    const manufacturerMap: Record<string, string> = {
      'chevrolet': 'chevrolet',
      'chevy': 'chevrolet',
      'toyota': 'toyota',
      'hyundai': 'hyundai',
      'kia': 'kia',
      'honda': 'honda',
      'nissan': 'nissan',
      'bmw': 'bmw',
      'mercedes': 'mercedes',
      'mercedes-benz': 'mercedes',
      'volkswagen': 'volkswagen',
      'vw': 'volkswagen',
      'ford': 'ford',
      'genesis': 'genesis',
      'mitsubishi': 'mitsubishi'
    }
    
    return manufacturerMap[makeLower] || makeLower
  }

  /**
   * Map model names to match our database
   */
  private mapModelName(model: string): string {
    const modelLower = model.toLowerCase()
    const modelMap: Record<string, string> = {
      'elantra': 'elantra',
      'sonata': 'sonata',
      'tuscon': 'tucson',
      'tucson': 'tucson',
      'accent': 'accent',
      'creta': 'creta',
      'camry': 'camry',
      'corolla': 'corolla',
      'rav4': 'rav4',
      'rav-4': 'rav4',
      'civic': 'civic',
      'accord': 'accord',
      'cr-v': 'crv',
      'crv': 'crv',
      '3-series': '3_series',
      '3 series': '3_series',
      '5-series': '5_series',
      '5 series': '5_series',
      'c-class': 'c_class',
      'c class': 'c_class',
      'e-class': 'e_class',
      'e class': 'e_class',
      'g70': 'g70',
      'equinox': 'equinox'
    }
    
    return modelMap[modelLower] || modelLower
  }

  /**
   * Find appropriate year range in our database
   */
  private findYearCategory(make: string, model: string, year: number): string | null {
    try {
      const models = officialSpecs[make]
      if (!models) return null
      
      const yearCategories = models[model]
      if (!yearCategories) return null
      
      // Find a matching year range
      for (const [yearRange, specs] of Object.entries(yearCategories)) {
        const [startYear, endYear] = yearRange.split('-').map(y => parseInt(y))
        if (year >= startYear && year <= endYear) {
          return yearRange
        }
      }
      
      return null
    } catch (error) {
      logger.error('Error finding year category', { error, make, model, year })
      return null
    }
  }

  /**
   * Cache handling methods
   */
  private getCachedData(key: string): CarSpec | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() > entry.expiryTime) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  private setCachedData(key: string, data: CarSpec): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiryTime: Date.now() + this.CACHE_DURATION
    })
  }
}

// Singleton instance for use throughout the application
export const oilSpecsAPI = new OilSpecsAPI() 