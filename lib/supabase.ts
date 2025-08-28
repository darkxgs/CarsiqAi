import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate that Supabase credentials are provided
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', // Fallback to avoid client-side errors
  supabaseKey || 'placeholder'
)

// Type definitions for our database tables
export type CarModel = {
  id: string
  name: string
  brand: string
  year: number
  queries: number
  trends: string[]
  features: Record<string, any>
  created_at: string
  updated_at: string
}

export type CarBrand = {
  id: string
  name: string
  queries: number
  market_share: number
  trends: string[]
  created_at: string
  updated_at: string
}

export type UserQuery = {
  id: string
  query: string
  timestamp: string
  user_id?: string
  car_model?: string
  car_brand?: string
  query_type: 'SPECIFICATIONS' | 'PRICE' | 'MAINTENANCE' | 'COMPARISON' | 'FEATURES' | 'REVIEWS' | 'FUEL_CONSUMPTION' | 'INSURANCE' | 'SERVICE' | 'OTHER'
  source: string
  location?: string
  confidence_score?: number
  oil_capacity?: string
  recommended_oil?: string
  oil_viscosity?: string
  session_id?: string
  car_year?: number
  mileage?: number
  created_at: string
}

export type MarketInsight = {
  id: string
  type: 'TREND' | 'SEGMENT' | 'PREFERENCE' | 'MARKET_SHIFT' | 'TECHNOLOGY' | 'CONSUMER_BEHAVIOR'
  value: string
  timestamp: string
  importance: number
  source: string
  created_at: string
}

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseKey)
} 