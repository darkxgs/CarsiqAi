-- Create car brands table
CREATE TABLE car_brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name_en TEXT,
  display_name_ar TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car models table
CREATE TABLE car_models (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL REFERENCES car_brands(name),
  name TEXT NOT NULL,
  display_name_en TEXT,
  display_name_ar TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (brand, name)
);

-- Create year ranges table
CREATE TABLE car_year_ranges (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  generation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (brand, model) REFERENCES car_models(brand, name),
  UNIQUE (brand, model, start_year, end_year)
);

-- Create car specs table with enhanced metadata
CREATE TABLE car_specs (
  id SERIAL PRIMARY KEY,
  year_range_id INTEGER NOT NULL REFERENCES car_year_ranges(id),
  capacity TEXT NOT NULL,
  viscosity TEXT NOT NULL,
  oil_type TEXT NOT NULL CHECK (oil_type IN ('Full Synthetic', 'Semi Synthetic', 'Conventional', 'High Mileage')),
  filter_number TEXT NOT NULL,
  engine_size TEXT NOT NULL,
  api_spec TEXT,
  change_interval TEXT,
  transmission_type TEXT CHECK (transmission_type IN ('Automatic', 'Manual', 'CVT', 'DCT')),
  drive_type TEXT CHECK (drive_type IN ('FWD', 'RWD', 'AWD', '4WD')),
  recommended_brands TEXT[],
  min_temperature INTEGER,
  max_temperature INTEGER,
  service_bulletin_url TEXT,
  notes TEXT,
  fuel_type TEXT CHECK (fuel_type IN ('Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (year_range_id)
);

-- Create VIN patterns table
CREATE TABLE cars_by_vin (
  id SERIAL PRIMARY KEY,
  vin_pattern TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  engine_code TEXT,
  transmission_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (brand, model) REFERENCES car_models(brand, name)
);

-- Create service bulletins table
CREATE TABLE service_bulletins (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year_start INTEGER NOT NULL,
  year_end INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT,
  severity TEXT CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (brand, model) REFERENCES car_models(brand, name)
);

-- Create data source tracking table
CREATE TABLE data_sources (
  id SERIAL PRIMARY KEY,
  source_type TEXT NOT NULL CHECK (source_type IN ('PDF', 'Website', 'API', 'CSV', 'Excel', 'Manual')),
  source_name TEXT NOT NULL,
  source_url TEXT,
  last_imported TIMESTAMP WITH TIME ZONE,
  record_count INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE car_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_year_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars_by_vin ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

-- Read-only policy for authenticated users
CREATE POLICY "Allow read access for all authenticated users" 
ON car_brands FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow read access for all authenticated users" 
ON car_models FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow read access for all authenticated users" 
ON car_year_ranges FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow read access for all authenticated users" 
ON car_specs FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow read access for all authenticated users" 
ON cars_by_vin FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow read access for all authenticated users" 
ON service_bulletins FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow read access for all authenticated users" 
ON data_sources FOR SELECT 
TO authenticated 
USING (true);

-- Admin policies for service role
CREATE POLICY "Allow full access for service role" 
ON car_brands 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow full access for service role" 
ON car_models 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow full access for service role" 
ON car_year_ranges 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow full access for service role" 
ON car_specs 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow full access for service role" 
ON cars_by_vin 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow full access for service role" 
ON service_bulletins 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow full access for service role" 
ON data_sources 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Create search functions
CREATE OR REPLACE FUNCTION search_cars(search_term TEXT)
RETURNS TABLE (
  brand TEXT,
  model TEXT,
  display_name_en TEXT,
  display_name_ar TEXT,
  start_year INTEGER,
  end_year INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.brand,
    m.name,
    m.display_name_en,
    m.display_name_ar,
    yr.start_year,
    yr.end_year
  FROM 
    car_models m
  JOIN
    car_year_ranges yr ON m.brand = yr.brand AND m.name = yr.model
  WHERE
    m.brand ILIKE '%' || search_term || '%' OR
    m.name ILIKE '%' || search_term || '%' OR
    m.display_name_en ILIKE '%' || search_term || '%' OR
    m.display_name_ar ILIKE '%' || search_term || '%'
  ORDER BY
    m.brand, m.name, yr.start_year DESC;
END;
$$ LANGUAGE plpgsql; 