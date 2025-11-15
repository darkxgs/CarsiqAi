import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    // Get Supabase credentials from env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase credentials not configured' 
      }, { status: 500 })
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Execute SQL to add missing columns
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE IF EXISTS user_queries 
        ADD COLUMN IF NOT EXISTS confidence_score FLOAT DEFAULT 0,
        ADD COLUMN IF NOT EXISTS oil_capacity TEXT,
        ADD COLUMN IF NOT EXISTS recommended_oil TEXT,
        ADD COLUMN IF NOT EXISTS oil_viscosity TEXT,
        ADD COLUMN IF NOT EXISTS session_id TEXT,
        ADD COLUMN IF NOT EXISTS car_year INT,
        ADD COLUMN IF NOT EXISTS mileage INT;
      `
    })

    if (error) {
      console.error('Error updating database schema:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    // Refresh the schema cache
    const { error: refreshError } = await supabase.rpc('exec_sql', {
      sql_query: `SELECT pg_catalog.pg_reload_conf();`
    })

    if (refreshError) {
      console.error('Error refreshing schema cache:', refreshError)
      return NextResponse.json({ 
        success: false, 
        error: refreshError.message,
        note: 'Schema updated but cache refresh failed'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database schema updated successfully' 
    }, { status: 200 })

  } catch (error: any) {
    console.error('Unexpected error in update-db:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unknown error occurred' 
    }, { status: 500 })
  }
} 