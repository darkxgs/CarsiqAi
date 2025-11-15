-- ============================================
-- CREATE ANALYTICS TABLES (SIMPLE VERSION)
-- Run this in Supabase SQL Editor
-- No enums - uses TEXT instead
-- ============================================

-- Step 1: Create user_queries table (if not exists)
CREATE TABLE IF NOT EXISTS "user_queries" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "car_model" TEXT,
    "car_brand" TEXT,
    "query_type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "location" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "oil_capacity" TEXT,
    "recommended_oil" TEXT,
    "oil_viscosity" TEXT,
    "session_id" TEXT,
    "car_year" INTEGER,
    "mileage" INTEGER,

    CONSTRAINT "user_queries_pkey" PRIMARY KEY ("id")
);

-- Step 2: Create car_models table (if not exists)
CREATE TABLE IF NOT EXISTS "car_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "queries" INTEGER NOT NULL DEFAULT 0,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trends" TEXT[],
    "features" JSONB NOT NULL,

    CONSTRAINT "car_models_pkey" PRIMARY KEY ("id")
);

-- Step 3: Create car_brands table (if not exists)
CREATE TABLE IF NOT EXISTS "car_brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "queries" INTEGER NOT NULL DEFAULT 0,
    "market_share" DOUBLE PRECISION NOT NULL,
    "trends" TEXT[],
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_brands_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
    ALTER TABLE "car_brands" ADD CONSTRAINT "car_brands_name_key" UNIQUE ("name");
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Step 4: Create market_insights table (if not exists)
CREATE TABLE IF NOT EXISTS "market_insights" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importance" INTEGER NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "market_insights_pkey" PRIMARY KEY ("id")
);

-- Step 5: Create user_sessions table (if not exists)
CREATE TABLE IF NOT EXISTS "user_sessions" (
    "id" TEXT NOT NULL,
    "session_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_end" TIMESTAMP(3),
    "user_id" TEXT,
    "queries" INTEGER NOT NULL DEFAULT 0,
    "interactions" JSONB NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- Step 6: Create indexes (if not exists)
CREATE INDEX IF NOT EXISTS "user_queries_car_brand_idx" ON "user_queries"("car_brand");
CREATE INDEX IF NOT EXISTS "user_queries_car_model_idx" ON "user_queries"("car_model");
CREATE INDEX IF NOT EXISTS "user_queries_timestamp_idx" ON "user_queries"("timestamp");
CREATE INDEX IF NOT EXISTS "user_queries_query_type_idx" ON "user_queries"("query_type");

CREATE INDEX IF NOT EXISTS "car_models_brand_idx" ON "car_models"("brand");
CREATE INDEX IF NOT EXISTS "car_models_year_idx" ON "car_models"("year");

-- Step 7: Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 8: Create triggers (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS update_car_models_updated_at ON "car_models";
CREATE TRIGGER update_car_models_updated_at 
    BEFORE UPDATE ON "car_models"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_car_brands_updated_at ON "car_brands";
CREATE TRIGGER update_car_brands_updated_at 
    BEFORE UPDATE ON "car_brands"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Insert sample data (only if tables are empty)

-- Sample car brands
INSERT INTO "car_brands" ("id", "name", "queries", "market_share", "trends")
SELECT * FROM (VALUES
    ('brand1', 'Toyota', 150, 18.5, ARRAY['Hybrid Technology', 'Reliability']),
    ('brand2', 'Hyundai', 120, 12.3, ARRAY['Value for Money', 'Warranty']),
    ('brand3', 'Kia', 95, 9.8, ARRAY['Design', 'Technology']),
    ('brand4', 'Nissan', 80, 8.2, ARRAY['SUVs', 'Electric Vehicles']),
    ('brand5', 'Honda', 75, 7.5, ARRAY['Fuel Efficiency', 'Reliability']),
    ('brand6', 'Mercedes-Benz', 60, 5.2, ARRAY['Luxury', 'Performance']),
    ('brand7', 'BMW', 55, 4.8, ARRAY['Performance', 'Technology']),
    ('brand8', 'Chevrolet', 45, 4.2, ARRAY['American Muscle', 'Trucks'])
) AS v("id", "name", "queries", "market_share", "trends")
WHERE NOT EXISTS (SELECT 1 FROM "car_brands" WHERE "id" = v."id")
ON CONFLICT ("name") DO NOTHING;

-- Sample car models
INSERT INTO "car_models" ("id", "name", "brand", "year", "queries", "trends", "features")
SELECT * FROM (VALUES
    ('model1', 'Camry', 'Toyota', 2023, 45, ARRAY['Best Seller', 'Reliable'], '{"engine": "2.5L", "transmission": "Automatic", "fuel_type": "Gasoline"}'::jsonb),
    ('model2', 'Corolla', 'Toyota', 2023, 38, ARRAY['Fuel Efficient', 'Affordable'], '{"engine": "1.8L", "transmission": "CVT", "fuel_type": "Gasoline"}'::jsonb),
    ('model3', 'Elantra', 'Hyundai', 2023, 32, ARRAY['Stylish', 'Tech-Loaded'], '{"engine": "2.0L", "transmission": "Automatic", "fuel_type": "Gasoline"}'::jsonb),
    ('model4', 'Tucson', 'Hyundai', 2023, 28, ARRAY['SUV', 'Spacious'], '{"engine": "2.5L", "transmission": "Automatic", "fuel_type": "Gasoline"}'::jsonb),
    ('model5', 'Sportage', 'Kia', 2023, 25, ARRAY['SUV', 'Modern Design'], '{"engine": "2.4L", "transmission": "Automatic", "fuel_type": "Gasoline"}'::jsonb),
    ('model6', 'Altima', 'Nissan', 2023, 22, ARRAY['Comfortable', 'Spacious'], '{"engine": "2.5L", "transmission": "CVT", "fuel_type": "Gasoline"}'::jsonb),
    ('model7', 'Civic', 'Honda', 2023, 20, ARRAY['Sporty', 'Reliable'], '{"engine": "2.0L", "transmission": "CVT", "fuel_type": "Gasoline"}'::jsonb),
    ('model8', 'C-Class', 'Mercedes-Benz', 2023, 18, ARRAY['Luxury', 'Premium'], '{"engine": "2.0L Turbo", "transmission": "Automatic", "fuel_type": "Gasoline"}'::jsonb)
) AS v("id", "name", "brand", "year", "queries", "trends", "features")
WHERE NOT EXISTS (SELECT 1 FROM "car_models" WHERE "id" = v."id");

-- Sample user queries
INSERT INTO "user_queries" ("id", "query", "car_brand", "car_model", "car_year", "query_type", "source", "confidence_score", "oil_viscosity")
SELECT * FROM (VALUES
    ('query1', 'تويوتا كامري 2023 زيت', 'Toyota', 'Camry', 2023, 'SERVICE', 'web', 0.95, '0W-20'),
    ('query2', 'هيونداي النترا 2023 زيت محرك', 'Hyundai', 'Elantra', 2023, 'SERVICE', 'web', 0.92, '5W-30'),
    ('query3', 'كيا سبورتاج 2023 مواصفات', 'Kia', 'Sportage', 2023, 'SPECIFICATIONS', 'web', 0.88, NULL),
    ('query4', 'نيسان التيما 2023 سعر', 'Nissan', 'Altima', 2023, 'PRICE', 'web', 0.85, NULL),
    ('query5', 'هوندا سيفيك 2023 استهلاك الوقود', 'Honda', 'Civic', 2023, 'FUEL_CONSUMPTION', 'web', 0.90, NULL),
    ('query6', 'تويوتا كورولا 2023 زيت', 'Toyota', 'Corolla', 2023, 'SERVICE', 'web', 0.93, '0W-20'),
    ('query7', 'مرسيدس C-Class 2023 صيانة', 'Mercedes-Benz', 'C-Class', 2023, 'MAINTENANCE', 'web', 0.87, NULL),
    ('query8', 'BMW 320i 2023 زيت محرك', 'BMW', '3 Series', 2023, 'SERVICE', 'web', 0.89, '5W-30')
) AS v("id", "query", "car_brand", "car_model", "car_year", "query_type", "source", "confidence_score", "oil_viscosity")
WHERE NOT EXISTS (SELECT 1 FROM "user_queries" WHERE "id" = v."id");

-- Sample market insights
INSERT INTO "market_insights" ("id", "type", "value", "importance", "source")
SELECT * FROM (VALUES
    ('insight1', 'TREND', 'Hybrid vehicles gaining popularity', 8, 'market_analysis'),
    ('insight2', 'PREFERENCE', 'Customers prefer SUVs over sedans', 7, 'user_queries'),
    ('insight3', 'TECHNOLOGY', 'Advanced safety features in demand', 9, 'feature_requests'),
    ('insight4', 'MARKET_SHIFT', 'Electric vehicle interest increasing', 8, 'search_trends'),
    ('insight5', 'TREND', 'Synthetic oil becoming standard', 7, 'service_data'),
    ('insight6', 'PREFERENCE', 'Customers value fuel efficiency', 8, 'user_feedback')
) AS v("id", "type", "value", "importance", "source")
WHERE NOT EXISTS (SELECT 1 FROM "market_insights" WHERE "id" = v."id");

-- Verification query
SELECT 
    'user_queries' as table_name, 
    COUNT(*) as row_count 
FROM "user_queries"
UNION ALL
SELECT 'car_models', COUNT(*) FROM "car_models"
UNION ALL
SELECT 'car_brands', COUNT(*) FROM "car_brands"
UNION ALL
SELECT 'market_insights', COUNT(*) FROM "market_insights"
ORDER BY table_name;

-- Success message
SELECT 'Analytics tables created successfully!' as status;
