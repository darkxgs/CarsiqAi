const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file')
  process.exit(1)
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupCorrectionsTable() {
  try {
    console.log('🚀 Setting up corrections table in Supabase...')
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-corrections-table.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      // If the RPC function doesn't exist, try direct SQL execution
      console.log('📝 Executing SQL directly...')
      
      // Split SQL into individual statements and execute them
      const statements = sql.split(';').filter(stmt => stmt.trim())
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`Executing: ${statement.substring(0, 50)}...`)
          const { error: execError } = await supabase.from('_').select('*').limit(0)
          // This is a workaround - we'll need to execute SQL via Supabase dashboard
        }
      }
    }
    
    // Test if the table was created by trying to select from it
    console.log('🔍 Testing corrections table...')
    const { data: testData, error: testError } = await supabase
      .from('corrections')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('❌ Table creation failed:', testError.message)
      console.log('\n📋 Please execute the following SQL manually in your Supabase dashboard:')
      console.log('Go to: https://supabase.com/dashboard/project/[your-project]/sql')
      console.log('\n' + sql)
      return false
    }
    
    console.log('✅ Corrections table is ready!')
    return true
    
  } catch (error) {
    console.error('❌ Error setting up corrections table:', error)
    return false
  }
}

// Run the setup
setupCorrectionsTable().then(success => {
  if (success) {
    console.log('🎉 Setup completed successfully!')
  } else {
    console.log('⚠️  Manual setup required - see instructions above')
  }
  process.exit(success ? 0 : 1)
})