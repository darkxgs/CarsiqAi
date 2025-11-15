# إصلاح سريع - جدول التصحيحات مفقود

## المشكلة
```
relation "public.corrections" does not exist
```

## الحل السريع (5 دقائق)

### 1. اذهب إلى Supabase
- https://supabase.com/dashboard
- اختر مشروعك
- SQL Editor → New Query

### 2. انسخ والصق هذا الكود:
```sql
CREATE TABLE IF NOT EXISTS public.corrections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  car_make TEXT NOT NULL,
  car_model TEXT NOT NULL,
  car_year TEXT,
  current_recommendation TEXT NOT NULL,
  user_correction TEXT NOT NULL,
  user_email TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.corrections FOR ALL USING (true);
```

### 3. انقر Run

### 4. أعد تشغيل الخادم
```bash
npm run dev
```

## ✅ تم الإصلاح!
الآن يمكنك الدخول إلى `/admin` بدون أخطاء.