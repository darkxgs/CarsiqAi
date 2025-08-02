import { createClient } from '@supabase/supabase-js'

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Types for expanded car database
export interface EnhancedCarSpec {
  // Basic specs (existing)
  capacity: string
  viscosity: string
  oilType: "Full Synthetic" | "Semi Synthetic" | "Conventional" | "High Mileage"
  filterNumber: string
  engineSize: string
  apiSpec?: string
  changeInterval?: string
  
  // Enhanced metadata (new)
  transmissionType?: "Automatic" | "Manual" | "CVT" | "DCT"
  driveType?: "FWD" | "RWD" | "AWD" | "4WD"
  recommendedBrands?: string[]
  temperatureRange?: {
    min: number
    max: number
  }
  serviceBulletinUrl?: string
  notes?: string
  fuelType?: "Gasoline" | "Diesel" | "Hybrid" | "Electric" | "Plug-in Hybrid"
  vinPattern?: string
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Function to fetch car specs from Supabase
export async function getCarSpecs(brand: string, model: string, year: number): Promise<EnhancedCarSpec | null> {
  try {
    // Find the year range that contains this year
    const { data: yearRanges, error: yearError } = await supabase
      .from('car_year_ranges')
      .select('*')
      .eq('brand', brand)
      .eq('model', model)
      .lte('start_year', year)
      .gte('end_year', year)
    
    if (yearError || !yearRanges || yearRanges.length === 0) {
      console.error('Year range not found:', yearError || 'No matching year ranges')
      return null
    }
    
    const yearRangeId = yearRanges[0].id
    
    // Get the car specs for this year range
    const { data: specs, error: specsError } = await supabase
      .from('car_specs')
      .select('*')
      .eq('year_range_id', yearRangeId)
      .single()
    
    if (specsError || !specs) {
      console.error('Car specs not found:', specsError || 'No specs available')
      return null
    }
    
    // Increment the query counter for analytics
    await incrementModelQueries(brand, model)
    
    return mapToCarSpec(specs)
  } catch (error) {
    console.error('Error fetching car specs:', error)
    return null
  }
}

// Function to search cars by VIN
export async function getCarByVIN(vin: string): Promise<{
  brand: string;
  model: string;
  year: number;
  specs: EnhancedCarSpec | null;
} | null> {
  try {
    // First try our database
    const { data: carData, error: carError } = await supabase
      .from('cars_by_vin')
      .select('*')
      .eq('vin_pattern', vin.substring(0, 8))
      .single()
    
    if (!carError && carData) {
      const specs = await getCarSpecs(carData.brand, carData.model, carData.year)
      return {
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        specs
      }
    }
    
    // If not found, use external VIN API
    // This would call an external API like NHTSA
    // For now, returning null
    return null
  } catch (error) {
    console.error('Error searching by VIN:', error)
    return null
  }
}

// Function to increment model queries
async function incrementModelQueries(brand: string, model: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_model_queries', {
      brand_name: brand,
      model_name: model
    })
    
    if (error) {
      console.error('Error incrementing model queries:', error)
    }
  } catch (error) {
    console.error('Failed to increment model queries:', error)
  }
}

// Function to get all supported car brands
export async function getSupportedBrands(): Promise<string[]> {
  const { data, error } = await supabase
    .from('car_brands')
    .select('name')
    .order('name')
  
  if (error || !data) {
    console.error('Error fetching brands:', error)
    return []
  }
  
  return data.map(brand => brand.name)
}

// Function to get models for a specific brand
export async function getModelsForBrand(brand: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('car_models')
    .select('name')
    .eq('brand', brand)
    .order('name')
  
  if (error || !data) {
    console.error('Error fetching models:', error)
    return []
  }
  
  return data.map(model => model.name)
}

// Function to get top car models
export async function getTopModels(limit: number = 10): Promise<Array<{
  brand: string;
  model: string;
  year: number;
  queries: number;
}>> {
  try {
    const { data, error } = await supabase.rpc('get_top_models', {
      limit_count: limit
    })
    
    if (error || !data) {
      console.error('Error fetching top models:', error)
      return []
    }
    
    return data
  } catch (error) {
    console.error('Failed to get top models:', error)
    return []
  }
}

// Function to get car recommendations
export async function getCarRecommendations(brand: string, model: string, year: number): Promise<Array<{
  brand: string;
  model: string;
  year: number;
  similarity: number;
}>> {
  try {
    const { data, error } = await supabase.rpc('get_car_recommendations', {
      brand_name: brand,
      model_name: model,
      model_year: year
    })
    
    if (error || !data) {
      console.error('Error fetching car recommendations:', error)
      return []
    }
    
    return data
  } catch (error) {
    console.error('Failed to get car recommendations:', error)
    return []
  }
}

// Function to add service bulletin
export async function addServiceBulletin(bulletin: {
  brand: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  title: string;
  description: string;
  url: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}) {
  const { error } = await supabase
    .from('service_bulletins')
    .insert({
      brand: bulletin.brand,
      model: bulletin.model,
      year_start: bulletin.yearStart,
      year_end: bulletin.yearEnd,
      title: bulletin.title,
      description: bulletin.description,
      url: bulletin.url,
      severity: bulletin.severity || 'Medium'
    })
  
  if (error) {
    console.error('Error adding service bulletin:', error)
    return false
  }
  
  return true
}

// Helper function to map database results to EnhancedCarSpec
function mapToCarSpec(dbSpec: any): EnhancedCarSpec {
  return {
    capacity: dbSpec.capacity,
    viscosity: dbSpec.viscosity,
    oilType: dbSpec.oil_type,
    filterNumber: dbSpec.filter_number,
    engineSize: dbSpec.engine_size,
    apiSpec: dbSpec.api_spec,
    changeInterval: dbSpec.change_interval,
    transmissionType: dbSpec.transmission_type,
    driveType: dbSpec.drive_type,
    recommendedBrands: dbSpec.recommended_brands,
    temperatureRange: dbSpec.min_temperature && dbSpec.max_temperature ? {
      min: dbSpec.min_temperature,
      max: dbSpec.max_temperature
    } : undefined,
    serviceBulletinUrl: dbSpec.service_bulletin_url,
    notes: dbSpec.notes,
    fuelType: dbSpec.fuel_type
  }
}

export default supabase 