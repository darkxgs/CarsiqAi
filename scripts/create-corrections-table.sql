-- Create corrections table in Supabase
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

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_corrections_status ON public.corrections(status);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_corrections_created_at ON public.corrections(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for admin interface)
CREATE POLICY "Allow public read access" ON public.corrections
    FOR SELECT USING (true);

-- Create policy to allow public insert (for user submissions)
CREATE POLICY "Allow public insert" ON public.corrections
    FOR INSERT WITH CHECK (true);

-- Create policy to allow public update (for admin actions)
CREATE POLICY "Allow public update" ON public.corrections
    FOR UPDATE USING (true);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_corrections_updated_at 
    BEFORE UPDATE ON public.corrections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();