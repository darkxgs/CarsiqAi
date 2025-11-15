# How to Get Your Supabase Database URL

## Visual Step-by-Step Guide

### Step 1: Go to Supabase Dashboard
```
🌐 Open: https://supabase.com/dashboard
```

### Step 2: Select Your Project
```
📁 Click on: fswxxezphkrdqoicowap
```

### Step 3: Navigate to Database Settings
```
⚙️ Click: Settings (left sidebar)
   └─ 🗄️ Click: Database
```

### Step 4: Find Connection String
```
📜 Scroll down to: "Connection string"
   └─ 🔘 Select: URI (not Session mode)
   └─ 📋 Click: Copy button
```

### Step 5: What You'll See
```
postgresql://postgres.fswxxezphkrdqoicowap:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 6: Replace [YOUR-PASSWORD]
```
❌ Wrong:
DATABASE_URL=postgresql://postgres.fswxxezphkrdqoicowap:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

✅ Correct (example):
DATABASE_URL="postgresql://postgres.fswxxezphkrdqoicowap:MySecretPass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## Quick Copy-Paste Template

Open your `.env` file and replace this line:

```env
DATABASE_URL="postgresql://postgres.fswxxezphkrdqoicowap:YOUR_PASSWORD_HERE@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Replace `YOUR_PASSWORD_HERE` with your actual Supabase database password**

## Don't Know Your Password?

### Option 1: Check Your Notes
- Did you save it when you created the project?
- Check your password manager
- Check your email for Supabase welcome message

### Option 2: Reset It
1. Supabase Dashboard → Settings → Database
2. Find "Database Password" section
3. Click "Reset database password"
4. Copy the new password immediately
5. Save it somewhere safe!

## Test Your Connection

After updating `.env`:

```bash
# Test 1: Can Prisma connect?
npx prisma db pull

# Test 2: Generate client
npx prisma generate

# Test 3: Check database
npx prisma studio
```

If all three work, your connection is good! ✅

## Common Mistakes to Avoid

❌ **Don't do this:**
```env
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

❌ **Don't do this:**
```env
DATABASE_URL=postgresql://postgres.fswxxezphkrdqoicowap:[YOUR-PASSWORD]@...
```

✅ **Do this:**
```env
DATABASE_URL="postgresql://postgres.fswxxezphkrdqoicowap:ActualPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## Your Supabase Project Info

Based on your `.env` file, here's what I can see:

```
Project Reference: fswxxezphkrdqoicowap
Supabase URL: https://fswxxezphkrdqoicowap.supabase.co
Region: Likely US East (based on typical Supabase setup)
```

Your connection string should start with:
```
postgresql://postgres.fswxxezphkrdqoicowap:
```

## Still Stuck?

If you can't find your password and can't reset it:

1. **Create a new Supabase project** (if this is a test project)
2. **Contact Supabase support** (if this is production)
3. **Check if you have database backups** with the password saved

## Next Steps After Connection Works

Once your `DATABASE_URL` is correct:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Run migrations to create tables
npx prisma migrate dev --name add_oil_products

# 3. Seed sample oil products
npm run seed-oil-products

# 4. Start your app
npm run dev

# 5. Test it
# Go to: http://localhost:3000/admin/login
# Login: admin / carsiq01@
# Check: منتجات الزيوت tab
```

---

**Need Help?** Check `FIX_DATABASE_CONNECTION.md` for detailed troubleshooting.
