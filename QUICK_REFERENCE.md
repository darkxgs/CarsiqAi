# Oil Products System - Quick Reference

## 🚀 Quick Start

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Run Migration (after fixing DATABASE_URL)
npx prisma migrate dev --name add_oil_products

# 3. Seed Sample Data (optional)
npm run seed-oil-products

# 4. Start Dev Server
npm run dev

# 5. Access Admin
http://localhost:3000/admin/login
```

## 📁 File Structure

```
├── prisma/
│   └── schema.prisma                    # Database schema with OilProduct model
├── app/
│   ├── admin/
│   │   └── page.tsx                     # Admin dashboard (updated)
│   └── api/
│       └── oil-products/
│           ├── route.ts                 # GET, POST endpoints
│           ├── [id]/route.ts            # GET, PUT, DELETE by ID
│           └── recommendations/route.ts # AI recommendation endpoint
├── components/
│   └── admin/
│       └── OilProductsManager.tsx       # Admin UI for products
├── services/
│   ├── oilProductService.ts             # Product matching logic
│   └── oilProductIntegration.ts         # AI integration
└── scripts/
    └── seed-oil-products.ts             # Sample data seeder
```

## 🎯 Key Functions

### Service Functions

```typescript
// Find matching products
findMatchingOilProducts(requirement, limit)

// Get products by brand priority
getProductsByBrandPriority(viscosity, carType, brands)

// Format for AI response
formatProductRecommendations(products, hasStock)

// Get car type from brand
getCarType(brand) // Returns: 'american' | 'european' | 'asian'

// Get brand priority
getBrandPriority(carType) // Returns: string[]

// Get recommendations for AI
getOilProductRecommendations(requirement)
```

## 🗄️ Database Model

```typescript
interface OilProduct {
  id: string
  name: string              // "Castrol EDGE 0W-20"
  brand: string             // "Castrol"
  productLine: string       // "EDGE"
  viscosity: string         // "0W-20"
  type: OilType            // FULL_SYNTHETIC | SEMI_SYNTHETIC | MINERAL
  apiSpec?: string         // "API SN"
  aceaSpec?: string        // "ACEA C3"
  otherSpecs: string[]     // ["Dexos1", "BMW LL-04"]
  capacity?: number        // 4.0
  price?: number           // 25000
  stock: number            // 10
  isActive: boolean        // true
  description?: string
  imageUrl?: string
  compatibleFor: string[]  // ["american", "european", "asian"]
  createdAt: Date
  updatedAt: Date
}
```

## 🔌 API Endpoints

### List Products
```http
GET /api/oil-products?brand=Castrol&viscosity=0W-20&isActive=true
```

### Create Product
```http
POST /api/oil-products
Content-Type: application/json

{
  "name": "Castrol EDGE 0W-20",
  "brand": "Castrol",
  "productLine": "EDGE",
  "viscosity": "0W-20",
  "type": "FULL_SYNTHETIC",
  "stock": 10,
  "price": 28000,
  "compatibleFor": ["asian", "american"]
}
```

### Update Product
```http
PUT /api/oil-products/{id}
Content-Type: application/json

{
  "stock": 15,
  "price": 27000
}
```

### Delete Product
```http
DELETE /api/oil-products/{id}
```

### Get Recommendations (AI)
```http
POST /api/oil-products/recommendations
Content-Type: application/json

{
  "viscosity": "0W-20",
  "carType": "asian",
  "brands": ["Valvoline", "Castrol"]
}
```

## 🎨 Admin UI

### Access
```
URL: /admin
Tab: منتجات الزيوت
```

### Actions
- **Add**: Click "إضافة منتج"
- **Edit**: Click pencil icon
- **Delete**: Click trash icon
- **Filter**: Use table filters

### Required Fields
- Brand ✓
- Product Line ✓
- Viscosity ✓
- Type ✓
- Stock ✓
- Compatible For ✓ (at least one)

## 🧪 Test Queries

```
# Arabic
"تويوتا كامري 2020 زيت"
"هيونداي النترا 2022 زيت محرك"
"مرسيدس C200 2021 زيت"
"BMW 320i 2020 زيت"

# English
"Toyota Camry 2020 oil"
"Hyundai Elantra 2022 engine oil"
"Mercedes C200 2021 oil"
"BMW 320i 2020 oil"
```

## 🎯 Brand Priority Rules

| Car Type | Priority Order |
|----------|---------------|
| American | Valvoline → Castrol |
| European | Liqui Moly → Meguin |
| Asian    | Valvoline/Castrol → Liqui Moly → Meguin |

## 🔍 Matching Criteria

| Criterion | Weight | Required |
|-----------|--------|----------|
| Viscosity | +50    | ✓ Yes    |
| Oil Type  | +30    | No       |
| API Spec  | +20    | No       |
| ACEA Spec | +20    | No       |
| In Stock  | +10    | No       |

## 💡 Common Tasks

### Add New Product
1. Go to `/admin`
2. Click "منتجات الزيوت"
3. Click "إضافة منتج"
4. Fill form
5. Click "إضافة"

### Update Stock
1. Find product in table
2. Click edit icon
3. Update stock number
4. Click "تحديث"

### Deactivate Product
1. Edit product
2. Uncheck "منتج نشط"
3. Save

### Check AI Response
1. Add product
2. Go to `/chat`
3. Ask about matching car
4. Verify product appears

## 🐛 Troubleshooting

### Products Not Showing
- [ ] Check `isActive = true`
- [ ] Check `stock > 0` (or will show "out of stock")
- [ ] Verify viscosity matches exactly
- [ ] Check compatibleFor includes car type

### Database Error
```bash
npx prisma generate
npx prisma migrate dev
```

### Admin Access
- Go to `/admin/login` first
- Check localStorage: `adminAuth = 'true'`

### AI Not Suggesting Products
- Check product exists in database
- Verify viscosity from specs matches product
- Check car type detection
- Look at console logs

## 📊 Sample Products

### Toyota Camry 2020 (0W-20)
```json
{
  "name": "Valvoline Advanced 0W-20",
  "brand": "Valvoline",
  "productLine": "Advanced",
  "viscosity": "0W-20",
  "type": "FULL_SYNTHETIC",
  "stock": 10,
  "price": 25000,
  "compatibleFor": ["asian"]
}
```

### Mercedes C-Class (5W-30)
```json
{
  "name": "Liqui Moly Top Tec 4200 5W-30",
  "brand": "Liqui Moly",
  "productLine": "Top Tec 4200",
  "viscosity": "5W-30",
  "type": "FULL_SYNTHETIC",
  "apiSpec": "API SN",
  "aceaSpec": "ACEA C3",
  "stock": 6,
  "price": 35000,
  "compatibleFor": ["european"]
}
```

## 🔐 Environment Variables

```env
# Required
DATABASE_URL=postgresql://...

# Optional (for full features)
OPENROUTER_API_KEY=sk-or-v1-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📝 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Database
npx prisma generate
npx prisma migrate dev
npx prisma studio

# Seeding
npm run seed-oil-products
```

## 🎓 Learning Resources

- **Full Docs**: `OIL_PRODUCTS_SYSTEM.md`
- **Setup Guide**: `SETUP_OIL_PRODUCTS.md`
- **Architecture**: `OIL_PRODUCTS_ARCHITECTURE.md`
- **Summary**: `OIL_PRODUCTS_SUMMARY.md`

## 🆘 Support Checklist

Before asking for help:
- [ ] Ran `npx prisma generate`
- [ ] Database URL is correct
- [ ] Migration completed successfully
- [ ] Can access admin dashboard
- [ ] Products show in admin table
- [ ] Checked browser console for errors
- [ ] Checked server logs

## 📞 Quick Commands

```bash
# Check database connection
npx prisma db pull

# View database in browser
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# Check Prisma version
npx prisma --version

# Format schema
npx prisma format
```

---

**Quick Reference Version**: 1.0  
**Last Updated**: 2025-01-15
