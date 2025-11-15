# Troubleshoot Supabase Connection

## Current Issue
```
Error: P1001: Can't reach database server at `db.eahpeenipvwubqwqtvel.supabase.co:5432`
```

This means Prisma cannot connect to your Supabase database.

## Quick Checks

### 1. Check if Supabase Project is Active

1. Go to: https://supabase.com/dashboard
2. Find your project: **eahpeenipvwubqwqtvel**
3. Check the status indicator:
   - 🟢 **Active** - Good, continue to next step
   - 🟡 **Paused** - Click "Restore" or "Resume"
   - 🔴 **Inactive** - Project may be deleted

**If paused:** Supabase pauses free projects after inactivity. Just click the "Restore" button.

### 2. Verify Connection String

Your current connection info:
```
Host: db.eahpeenipvwubqwqtvel.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: NScU0sI12EkKjnY5
```

**Double-check in Supabase:**
1. Go to Settings → Database
2. Look at "Connection string"
3. Make sure the host matches: `db.eahpeenipvwubqwqtvel.supabase.co`

### 3. Try Connection Pooler Instead

Supabase has two connection types:

**Direct Connection (what you're using):**
```
postgresql://postgres:NScU0sI12EkKjnY5@db.eahpeenipvwubqwqtvel.supabase.co:5432/postgres
```

**Pooled Connection (try this):**
```
postgresql://postgres.eahpeenipvwubqwqtvel:NScU0sI12EkKjnY5@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

To get the correct pooled connection:
1. Supabase Dashboard → Settings → Database
2. Connection string → **Session mode** (not Transaction mode)
3. Copy that URL

### 4. Check Your Network

**Firewall/Antivirus:**
- Some firewalls block PostgreSQL port 5432
- Try temporarily disabling firewall
- Or add exception for Supabase domains

**VPN:**
- If using VPN, try disconnecting
- Some VPNs block database connections

**Corporate Network:**
- If on company network, it might block external databases
- Try from home network or mobile hotspot

### 5. Test with Supabase Studio

Instead of Prisma, try connecting through Supabase's web interface:

1. Go to: https://supabase.com/dashboard/project/eahpeenipvwubqwqtvel
2. Click "Table Editor" in left sidebar
3. If you can see tables, database is working
4. If you get errors, project might be paused

## Solutions to Try

### Solution 1: Use Supabase Direct (Recommended for Development)

Since you're having connection issues, use Supabase's REST API instead of direct Prisma connection for now:

Your app already has Supabase configured:
```env
NEXT_PUBLIC_SUPABASE_URL=https://eahpeenipvwubqwqtvel.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

This means your app can work without Prisma migrations!

### Solution 2: Create Tables Manually in Supabase

1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL to create the oil_product table:

```sql
-- Create OilType enum
CREATE TYPE "OilType" AS ENUM ('FULL_SYNTHETIC', 'SEMI_SYNTHETIC', 'MINERAL');

-- Create oil_product table
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

-- Create indexes
CREATE INDEX "oil_product_brand_idx" ON "oil_product"("brand");
CREATE INDEX "oil_product_viscosity_idx" ON "oil_product"("viscosity");
CREATE INDEX "oil_product_is_active_idx" ON "oil_product"("is_active");
```

3. Click "Run" to execute
4. Check Table Editor to verify table was created

### Solution 3: Wait and Retry

Sometimes Supabase has temporary issues:
1. Wait 5-10 minutes
2. Try `npx prisma db push` again
3. Check Supabase status: https://status.supabase.com/

### Solution 4: Use Different Region

If your Supabase project is in a region far from you:
1. Create a new Supabase project in a closer region
2. Update your .env with new credentials
3. Try connection again

## After Connection Works

Once you can connect:

```bash
# 1. Push schema to database
npx prisma db push

# 2. Generate Prisma Client
npx prisma generate

# 3. Seed sample products
npm run seed-oil-products

# 4. Restart dev server
npm run dev
```

## Alternative: Skip Prisma for Now

Your app uses Supabase client for most operations. You can:

1. Create tables manually in Supabase (SQL above)
2. Use Supabase Table Editor to add products manually
3. Your app will work without Prisma migrations

The oil products API will still work because it uses Prisma Client, which can connect even if migrations can't run.

## Still Can't Connect?

If nothing works:

1. **Check Supabase project status** - Is it paused?
2. **Verify password** - Copy it again from Supabase
3. **Try from different network** - Mobile hotspot?
4. **Contact Supabase support** - They can check server-side issues
5. **Create new project** - If this is a test project

## Quick Test Command

Try this to test connection:
```bash
npx prisma db pull
```

If this works, your connection is good and you can proceed with `db push`.

---

**Your Connection Details:**
- Project: eahpeenipvwubqwqtvel
- Host: db.eahpeenipvwubqwqtvel.supabase.co
- Password: NScU0sI12EkKjnY5
- Dashboard: https://supabase.com/dashboard/project/eahpeenipvwubqwqtvel
