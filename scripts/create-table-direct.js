const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createCorrectionsTable() {
  try {
    console.log('🚀 Creating corrections table...')
    
    // Try to create the table using raw SQL
    const { data, error } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.corrections (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          car_make TEXT NOT NULL,
          car_model TEXT NOT NULL,
          car_year TEXT,
          current_recommendation TEXT NOT NULL,
          user_correction TEXT NOT NULL,
          user_email TEXT,
          status TEXT NOT NULL DEFAULT 'PENDING',
          admin_notes TEXT,
          reviewed_by TEXT,
          reviewed_at TIMESTAMPTZ,
          ip_address TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })
    
    if (error) {
      console.log('⚠️  Direct SQL execution not available')
      console.log('📋 Please create the table manually in Supabase dashboard')
      return false
    }
    
    console.log('✅ Table created successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

// Alternative: Try to insert a test record to see if table exists
async function testTableExists() {
  try {
    const { data, error } = await supabase
      .from('corrections')
      .select('id')
      .limit(1)
    
    if (error && error.code === '42P01') {
      console.log('❌ Table does not exist')
      return false
    }
    
    console.log('✅ Table exists and is accessible')
    return true
    
  } catch (error) {
    console.log('❌ Error testing table:', error.message)
    return false
  }
}

async function main() {
  console.log('🔍 Checking if corrections table exists...')
  
  const exists = await testTableExists()
  
  if (!exists) {
    console.log('\n📋 MANUAL SETUP REQUIRED:')
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Execute the following SQL:')
    console.log('\n' + `
CREATE TABLE IF NOT EXISTS public.corrections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  car_make TEXT NOT NULL,
  car_model TEXT NOT NULL,
  car_year TEXT,
  current_recommendation TEXT NOT NULL,
  user_correction TEXT NOT NULL,
  user_email TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'IMPLEMENTED')),
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations" ON public.corrections FOR ALL USING (true);
    `)
    console.log('\n4. After executing the SQL, restart your development server')
  }
}

main()