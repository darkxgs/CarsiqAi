# Oil Products Management System

## Overview
This system allows you to manage oil products inventory and have the AI automatically suggest available products to customers. When no matching products are found, the AI falls back to its default recommendations.

## Features

### 1. Admin Dashboard
- **Location**: `/admin` → "منتجات الزيوت" tab
- **Capabilities**:
  - Add new oil products
  - Edit existing products
  - Delete products
  - Manage stock levels
  - Set prices
  - Activate/deactivate products

### 2. Product Management
Each oil product includes:
- **Brand**: Castrol, Liqui Moly, Valvoline, Meguin
- **Product Line**: EDGE, Top Tec, Advanced, etc.
- **Viscosity**: 0W-20, 5W-30, 5W-40, etc.
- **Type**: Full Synthetic, Semi Synthetic, Mineral
- **Specifications**: API, ACEA, and other specs
- **Capacity**: Available sizes in liters
- **Price**: Price in dinars
- **Stock**: Available quantity
- **Compatible For**: American, European, Asian cars

### 3. AI Integration
The AI automatically:
- Detects car brand and model from user queries
- Determines car type (American/European/Asian)
- Searches for matching products in inventory
- Suggests products based on brand priority:
  - **American cars**: Valvoline → Castrol
  - **European cars**: Liqui Moly → Meguin
  - **Asian cars**: Valvoline/Castrol → Liqui Moly → Meguin
- Falls back to default recommendations if no products match

### 4. Smart Matching
Products are matched based on:
- **Viscosity** (exact match required)
- **Car type compatibility**
- **Oil type** (synthetic, semi-synthetic, mineral)
- **API/ACEA specifications**
- **Stock availability** (prioritizes in-stock items)

## Setup Instructions

### Step 1: Database Migration
Run the Prisma migration to create the oil products table:

```bash
npx prisma migrate dev --name add_oil_products
```

Or generate the Prisma client:

```bash
npx prisma generate
```

### Step 2: Access Admin Dashboard
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Go to "منتجات الزيوت" tab

### Step 3: Add Products
Click "إضافة منتج" and fill in:
- Brand (required)
- Product Line (required)
- Viscosity (required)
- Type (required)
- Stock quantity (required)
- Compatible car types (required)
- Optional: API spec, ACEA spec, price, capacity

### Step 4: Test AI Integration
Ask the AI about oil recommendations:
- "تويوتا كامري 2020 زيت"
- "هيونداي النترا 2022 زيت محرك"
- "BMW 320i 2021 oil recommendation"

The AI will:
1. Check inventory for matching products
2. Suggest available products with prices and stock
3. Fall back to default recommendations if nothing matches

## API Endpoints

### Get All Products
```
GET /api/oil-products
Query params: brand, viscosity, type, isActive, compatibleFor
```

### Get Single Product
```
GET /api/oil-products/[id]
```

### Create Product
```
POST /api/oil-products
Body: { name, brand, productLine, viscosity, type, ... }
```

### Update Product
```
PUT /api/oil-products/[id]
Body: { name, brand, productLine, viscosity, type, ... }
```

### Delete Product
```
DELETE /api/oil-products/[id]
```

### Get Recommendations (Used by AI)
```
POST /api/oil-products/recommendations
Body: { viscosity, carType, brands?, type?, apiSpec?, aceaSpec? }
```

## Database Schema

```prisma
model OilProduct {
  id            String   @id @default(cuid())
  name          String
  brand         String
  productLine   String
  viscosity     String
  type          OilType
  apiSpec       String?
  aceaSpec      String?
  otherSpecs    String[]
  capacity      Float?
  price         Float?
  stock         Int      @default(0)
  isActive      Boolean  @default(true)
  description   String?
  imageUrl      String?
  compatibleFor String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum OilType {
  FULL_SYNTHETIC
  SEMI_SYNTHETIC
  MINERAL
}
```

## How It Works

### 1. User Query
User asks: "تويوتا كامري 2020 زيت"

### 2. AI Processing
- Extracts: brand=toyota, model=camry, year=2020
- Gets official specs or searches online
- Finds: viscosity=0W-20, capacity=4.8L

### 3. Product Lookup
- Determines car type: Asian
- Brand priority: Valvoline, Castrol, Liqui Moly, Meguin
- Searches inventory for 0W-20 products compatible with Asian cars

### 4. AI Response
**If products found:**
```
🛢️ سعة الزيت: 4.8 لتر
⚙️ اللزوجة: 0W-20
🔧 نوع الزيت: Full Synthetic

🥇 الخيار الأول: Valvoline Advanced 0W-20 - 25000 دينار (متوفر: 5)
🥈 الخيار الثاني: Castrol EDGE 0W-20 - 28000 دينار (متوفر: 3)
🥉 الخيار الثالث: Liqui Moly Top Tec 6600 0W-20 - 32000 دينار (متوفر: 2)
```

**If no products found:**
```
🛢️ سعة الزيت: 4.8 لتر
⚙️ اللزوجة: 0W-20
🔧 نوع الزيت: Full Synthetic

🥇 الخيار الأول: Valvoline Advanced 0W-20
🥈 الخيار الثاني: Castrol EDGE 0W-20
🥉 الخيار الثالث: Liqui Moly Top Tec 6600 0W-20

💡 ملاحظة: يرجى التواصل معنا للتحقق من التوفر والأسعار
```

## Example Products to Add

### For Toyota Camry 2020 (0W-20)
1. **Valvoline Advanced 0W-20**
   - Type: Full Synthetic
   - Compatible: Asian
   - Stock: 10
   - Price: 25000

2. **Castrol EDGE 0W-20**
   - Type: Full Synthetic
   - Compatible: Asian
   - Stock: 8
   - Price: 28000

### For Mercedes C-Class (5W-30)
1. **Liqui Moly Top Tec 4200 5W-30**
   - Type: Full Synthetic
   - API: SN, ACEA: C3
   - Compatible: European
   - Stock: 6
   - Price: 35000

2. **Meguin Megol 5W-30**
   - Type: Full Synthetic
   - ACEA: C3
   - Compatible: European
   - Stock: 4
   - Price: 30000

### For Ford F-150 (5W-20)
1. **Valvoline MaxLife 5W-20**
   - Type: Full Synthetic
   - API: SN Plus
   - Compatible: American
   - Stock: 12
   - Price: 22000

2. **Castrol GTX 5W-20**
   - Type: Full Synthetic
   - API: SN
   - Compatible: American
   - Stock: 10
   - Price: 24000

## Benefits

1. **Real-time Inventory**: AI suggests only available products
2. **Dynamic Pricing**: Show current prices to customers
3. **Stock Management**: Track inventory levels
4. **Flexible Fallback**: AI provides recommendations even without inventory
5. **Brand Priority**: Follows your business rules for product suggestions
6. **Multi-language**: Works with Arabic and English queries

## Troubleshooting

### Products not showing in AI responses
- Check product is marked as "Active" (isActive = true)
- Verify stock > 0 (or AI will note "out of stock")
- Ensure viscosity matches exactly
- Check compatibleFor includes correct car type

### AI not detecting car info
- Make sure query includes brand and model
- Try adding year for better accuracy
- Use common car names (e.g., "كامري" not "كامري الجديدة")

### Database errors
- Run `npx prisma generate` after schema changes
- Check DATABASE_URL in .env file
- Verify Prisma client is imported correctly

## Future Enhancements

- [ ] Bulk import products from CSV/Excel
- [ ] Product images and galleries
- [ ] Customer reviews and ratings
- [ ] Automatic reorder alerts
- [ ] Sales analytics and reports
- [ ] Discount and promotion management
- [ ] Integration with POS systems
- [ ] Multi-location inventory tracking
