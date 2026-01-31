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

    // Direct SQL execution through REST API
    const { data, error } = await supabase.from('user_queries')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database query failed: ' + error.message,
        suggestion: 'Make sure your database is properly configured and the user_queries table exists.'
      }, { status: 500 })
    }

    // Try to add the missing columns one by one
    const updates = [
      { column: 'confidence_score', type: 'FLOAT DEFAULT 0' },
      { column: 'oil_capacity', type: 'TEXT' },
      { column: 'recommended_oil', type: 'TEXT' },
      { column: 'oil_viscosity', type: 'TEXT' },
      { column: 'session_id', type: 'TEXT' },
      { column: 'car_year', type: 'INT' },
      { column: 'mileage', type: 'INT' }
    ]
    
    const results = []
    
    for (const update of updates) {
      try {
        // Check if column exists before trying to add it
        const { data: columnData, error: columnError } = await supabase.rpc('exec_sql', {
          sql_query: `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'user_queries' AND column_name = '${update.column}';
          `
        })
        
        // If column doesn't exist, add it
        if (!columnError && (!columnData || columnData.length === 0)) {
          const { error: updateError } = await supabase.rpc('exec_sql', {
            sql_query: `
              ALTER TABLE user_queries 
              ADD COLUMN IF NOT EXISTS ${update.column} ${update.type};
            `
          })
          
          results.push({
            column: update.column,
            success: !updateError,
            error: updateError ? updateError.message : null
          })
        } else {
          results.push({
            column: update.column,
            success: true,
            message: 'Column already exists or check failed'
          })
        }
      } catch (err: any) {
        results.push({
          column: update.column,
          success: false,
          error: err.message || 'Unknown error'
        })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Schema update operation completed',
      results: results
    }, { status: 200 })

  } catch (error: any) {
    console.error('Unexpected error in direct-update:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unknown error occurred' 
    }, { status: 500 })
  }
} 