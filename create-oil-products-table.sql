-- ============================================
-- CREATE OIL PRODUCTS TABLE
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create OilType enum
CREATE TYPE "OilType" AS ENUM ('FULL_SYNTHETIC', 'SEMI_SYNTHETIC', 'MINERAL');

-- Step 2: Create oil_product table
CREATE TABLE "oil_product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "product_line" TEXT NOT NULL,
    "viscosity" TEXT NOT NULL,
    "type" "OilType" NOT NULL,
    "api_spec" TEXT,
    "acea_spec" TEXT,
    "other_specs" TEXT[],
    "capacity" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "image_url" TEXT,
    "compatible_for" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oil_product_pkey" PRIMARY KEY ("id")
);

-- Step 3: Create indexes for better performance
CREATE INDEX "oil_product_brand_idx" ON "oil_product"("brand");
CREATE INDEX "oil_product_viscosity_idx" ON "oil_product"("viscosity");
CREATE INDEX "oil_product_is_active_idx" ON "oil_product"("is_active");

-- Step 4: Create updated_at trigger (optional but recommended)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_oil_product_updated_at 
    BEFORE UPDATE ON "oil_product"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Insert sample data (optional)
INSERT INTO "oil_product" ("id", "name", "brand", "product_line", "viscosity", "type", "api_spec", "acea_spec", "other_specs", "capacity", "price", "stock", "is_active", "description", "compatible_for") VALUES
('sample1', 'Castrol EDGE 0W-20 Full Synthetic', 'Castrol', 'EDGE', '0W-20', 'FULL_SYNTHETIC', 'API SN Plus', 'ACEA C5', ARRAY['ILSAC GF-6'], 4.0, 28000, 8, true, 'زيت محرك صناعي بالكامل للسيارات الحديثة', ARRAY['asian', 'american']),
('sample2', 'Castrol EDGE 5W-30 Full Synthetic', 'Castrol', 'EDGE', '5W-30', 'FULL_SYNTHETIC', 'API SN', 'ACEA C3', ARRAY['BMW LL-04', 'MB 229.51'], 4.0, 26000, 12, true, 'زيت محرك صناعي متعدد الاستخدامات', ARRAY['asian', 'european', 'american']),
('sample3', 'Valvoline Advanced 0W-20 Full Synthetic', 'Valvoline', 'Advanced', '0W-20', 'FULL_SYNTHETIC', 'API SN Plus', 'ACEA C5', ARRAY['ILSAC GF-6', 'Dexos1 Gen 2'], 4.0, 25000, 10, true, 'زيت محرك صناعي متقدم للسيارات اليابانية والأمريكية', ARRAY['asian', 'american']),
('sample4', 'Valvoline MaxLife 5W-30 Full Synthetic', 'Valvoline', 'MaxLife', '5W-30', 'FULL_SYNTHETIC', 'API SN Plus', 'ACEA A1/B1', ARRAY['ILSAC GF-6'], 4.0, 24000, 14, true, 'زيت محرك للسيارات ذات الأميال العالية', ARRAY['asian', 'american']),
('sample5', 'Liqui Moly Top Tec 4200 5W-30 Full Synthetic', 'Liqui Moly', 'Top Tec 4200', '5W-30', 'FULL_SYNTHETIC', 'API SN', 'ACEA C3', ARRAY['BMW LL-04', 'MB 229.51', 'VW 504.00/507.00'], 5.0, 35000, 6, true, 'زيت محرك ألماني عالي الجودة للسيارات الأوروبية', ARRAY['european']),
('sample6', 'Liqui Moly Top Tec 6600 0W-20 Full Synthetic', 'Liqui Moly', 'Top Tec 6600', '0W-20', 'FULL_SYNTHETIC', 'API SN Plus', 'ACEA C5', ARRAY['ILSAC GF-6'], 4.0, 32000, 5, true, 'زيت محرك صناعي منخفض اللزوجة', ARRAY['asian', 'european']),
('sample7', 'Meguin Megol 5W-30 Full Synthetic', 'Meguin', 'Megol', '5W-30', 'FULL_SYNTHETIC', 'API SN', 'ACEA C3', ARRAY['BMW LL-04', 'MB 229.51'], 5.0, 30000, 7, true, 'زيت محرك ألماني اقتصادي للسيارات الأوروبية', ARRAY['european']),
('sample8', 'Castrol GTX 5W-40 Semi Synthetic', 'Castrol', 'GTX', '5W-40', 'SEMI_SYNTHETIC', 'API SN', 'ACEA A3/B4', ARRAY[]::TEXT[], 4.0, 22000, 15, true, 'زيت محرك نصف صناعي للحماية اليومية', ARRAY['asian', 'european', 'american']);

-- Verification query
SELECT COUNT(*) as total_products FROM "oil_product";
