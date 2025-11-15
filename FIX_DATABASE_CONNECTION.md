# Fix Database Connection Error

## Problem
You're getting this error:
```
Error parsing connection string: invalid IPv6 address in database URL
```

This is because your `DATABASE_URL` in `.env` has placeholder values like `[password]` and `[host]`.

## Solution

### Step 1: Get Your Supabase Connection String

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **fswxxezphkrdqoicowap**
3. Go to **Settings** → **Database**
4. Scroll down to **Connection string**
5. Select **URI** format
6. Copy the connection string

It will look like this:
```
postgresql://postgres.fswxxezphkrdqoicowap:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 2: Replace [YOUR-PASSWORD] with Your Actual Password

The connection string has `[YOUR-PASSWORD]` - you need to replace this with your actual database password.

**Where to find your password:**
- If you saved it when creating the project, use that
- If you forgot it, you can reset it in Supabase Dashboard → Settings → Database → Database Password → Reset

### Step 3: Update Your .env File

Open `.env` and replace the DATABASE_URL line:

**Before:**
```env
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

**After (example):**
```env
DATABASE_URL="postgresql://postgres.fswxxezphkrdqoicowap:YourActualPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Important:** 
- Put the URL in quotes if it contains special characters
- Make sure there are no spaces
- Use your actual password, not "YourActualPassword123"

### Step 4: Test the Connection

```bash
# Test if Prisma can connect
npx prisma db pull

# If successful, generate the client
npx prisma generate

# Run the migration
npx prisma migrate dev --name add_oil_products
```

### Step 5: Seed the Database (Optional)

```bash
npm run seed-oil-products
```

## Alternative: Use Direct Connection (Not Pooled)

If the pooled connection doesn't work, try the direct connection:

1. In Supabase Dashboard → Settings → Database
2. Look for **Connection string** → **Direct connection**
3. Copy that URL instead
4. It will look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.fswxxezphkrdqoicowap.supabase.co:5432/postgres
```

## Common Issues

### Issue 1: Special Characters in Password
If your password has special characters like `@`, `#`, `$`, etc., you need to URL-encode them:

| Character | Encoded |
|-----------|---------|
| @         | %40     |
| #         | %23     |
| $         | %24     |
| %         | %25     |
| &         | %26     |
| +         | %2B     |
| =         | %3D     |

Example:
- Password: `MyPass@123#`
- Encoded: `MyPass%40123%23`

### Issue 2: Connection Timeout
If you get timeout errors:
- Check your internet connection
- Make sure Supabase project is not paused
- Try the direct connection instead of pooled

### Issue 3: SSL Error
Add `?sslmode=require` to the end of your connection string:
```
DATABASE_URL="postgresql://...?pgbouncer=true&sslmode=require"
```

## Quick Test

After updating your `.env`, restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

Then try accessing the admin dashboard:
1. Go to http://localhost:3000/admin/login
2. Login with: admin / carsiq01@
3. Click "منتجات الزيوت" tab
4. If you see the table (even if empty), the connection works!

## Still Having Issues?

If you're still getting errors:

1. **Check your .env file** - Make sure there are no typos
2. **Restart your terminal** - Sometimes environment variables need a fresh terminal
3. **Check Supabase status** - Go to your project dashboard and make sure it's active
4. **Try Prisma Studio** - Run `npx prisma studio` to test the connection

## Need Your Password Reset?

1. Go to Supabase Dashboard
2. Settings → Database
3. Scroll to "Database Password"
4. Click "Reset database password"
5. Copy the new password
6. Update your `.env` file
7. Restart your dev server

---

**Once your connection works, you can proceed with:**
- ✅ Running migrations
- ✅ Seeding oil products
- ✅ Using the admin dashboard
- ✅ Testing AI recommendations
