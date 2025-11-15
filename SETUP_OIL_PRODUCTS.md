# Quick Setup Guide - Oil Products System

## Step 1: Run Database Migration

```bash
npx prisma migrate dev --name add_oil_products
```

This will create the `OilProduct` table in your database.

## Step 2: Generate Prisma Client

```bash
npx prisma generate
```

## Step 3: Seed Sample Products (Optional)

```bash
npm run seed-oil-products
```

This will add 12 sample oil products to your database:
- 3 Castrol products
- 3 Valvoline products
- 3 Liqui Moly products
- 3 Meguin products

## Step 4: Access Admin Dashboard

1. Go to: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. Click on "منتجات الزيوت" tab
4. You should see the seeded products (if you ran step 3)

## Step 5: Add Your Own Products

Click "إضافة منتج" and fill in:
- **Brand**: Choose from Castrol, Liqui Moly, Valvoline, Meguin
- **Product Line**: e.g., EDGE, Top Tec, Advanced
- **Viscosity**: e.g., 0W-20, 5W-30, 5W-40
- **Type**: Full Synthetic, Semi Synthetic, or Mineral
- **Stock**: How many units you have
- **Price**: Price in dinars (optional)
- **Compatible For**: Check American, European, and/or Asian

## Step 6: Test AI Integration

Go to the chat and ask:
- "تويوتا كامري 2020 زيت"
- "هيونداي النترا 2022 زيت محرك"
- "مرسيدس C200 2021 زيت"

The AI will now suggest your actual products with prices and stock availability!

## How It Works

### When Products Are Available:
```
🛢️ سعة الزيت: 4.8 لتر
⚙️ اللزوجة: 0W-20
🔧 نوع الزيت: Full Synthetic

🥇 الخيار الأول: Valvoline Advanced 0W-20 - 25000 دينار (متوفر: 10)
🥈 الخيار الثاني: Castrol EDGE 0W-20 - 28000 دينار (متوفر: 8)
🥉 الخيار الثالث: Liqui Moly Top Tec 6600 0W-20 - 32000 دينار (متوفر: 5)
```

### When No Products Match:
The AI falls back to generic recommendations:
```
🛢️ سعة الزيت: 4.8 لتر
⚙️ اللزوجة: 0W-20
🔧 نوع الزيت: Full Synthetic

🥇 الخيار الأول: Valvoline Advanced 0W-20
🥈 الخيار الثاني: Castrol EDGE 0W-20
🥉 الخيار الثالث: Liqui Moly Top Tec 6600 0W-20
```

## Product Matching Logic

The system matches products based on:
1. **Viscosity** (must match exactly)
2. **Car Type** (American/European/Asian)
3. **Brand Priority**:
   - American cars: Valvoline → Castrol
   - European cars: Liqui Moly → Meguin
   - Asian cars: Valvoline/Castrol → Liqui Moly → Meguin
4. **Stock Availability** (in-stock products prioritized)
5. **Specifications** (API, ACEA specs if provided)

## Managing Products

### Edit Product
1. Click the edit icon (pencil) next to any product
2. Update the fields
3. Click "تحديث"

### Delete Product
1. Click the delete icon (trash) next to any product
2. Confirm deletion

### Deactivate Product
1. Edit the product
2. Uncheck "منتج نشط"
3. Save

Inactive products won't appear in AI recommendations but remain in your database.

## Troubleshooting

### "Products not showing in AI"
- Make sure product is Active (isActive = true)
- Check viscosity matches exactly (e.g., "0W-20" not "0w20")
- Verify compatibleFor includes the correct car type
- Check stock > 0 (or AI will say "out of stock")

### "Database error"
- Run `npx prisma generate` again
- Check your DATABASE_URL in .env
- Make sure migration completed successfully

### "Can't access admin"
- Go to `/admin/login` first
- Check localStorage has 'adminAuth' = 'true'

## Next Steps

1. **Add more products** - Build your complete inventory
2. **Update prices** - Keep prices current
3. **Manage stock** - Update quantities as you sell
4. **Monitor AI responses** - See what customers are asking for
5. **Add missing products** - Fill gaps in your inventory

## Support

For detailed documentation, see: `OIL_PRODUCTS_SYSTEM.md`

For questions or issues, check the troubleshooting section or contact support.
