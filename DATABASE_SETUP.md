# إعداد قاعدة البيانات - Database Setup

## المشكلة الحالية
التطبيق يحاول الوصول إلى جدول `corrections` في Supabase ولكن الجدول غير موجود، مما يسبب الخطأ:
```
relation "public.corrections" does not exist
```

## الحل - إنشاء جدول التصحيحات

### الطريقة 1: عبر Supabase Dashboard (الموصى بها)

1. **اذهب إلى Supabase Dashboard:**
   - افتح https://supabase.com/dashboard
   - اختر مشروعك: `fswxxezphkrdqoicowap`

2. **افتح SQL Editor:**
   - من القائمة الجانبية، اختر "SQL Editor"
   - انقر على "New query"

3. **نفذ الكود التالي:**
```sql
-- إنشاء جدول التصحيحات
CREATE TABLE IF NOT EXISTS public.corrections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  car_make TEXT NOT NULL,
  car_model TEXT NOT NULL,
  car_year TEXT,
  current_recommendation TEXT NOT NULL,
  user_correction TEXT NOT NULL,
  user_email TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'IMPLEMENTED')),
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_corrections_status ON public.corrections(status);
CREATE INDEX IF NOT EXISTS idx_corrections_created_at ON public.corrections(created_at DESC);

-- تفعيل Row Level Security
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "Allow all operations" ON public.corrections FOR ALL USING (true);

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_corrections_updated_at 
    BEFORE UPDATE ON public.corrections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

4. **انقر على "Run" لتنفيذ الكود**

### الطريقة 2: عبر Command Line (اختيارية)

إذا كان لديك Supabase CLI مثبت:

```bash
# تسجيل الدخول
supabase login

# ربط المشروع
supabase link --project-ref fswxxezphkrdqoicowap

# تنفيذ SQL
supabase db push
```

## التحقق من نجاح الإعداد

بعد تنفيذ الكود:

1. **في Supabase Dashboard:**
   - اذهب إلى "Table Editor"
   - يجب أن ترى جدول `corrections` في القائمة

2. **في التطبيق:**
   - أعد تشغيل الخادم: `npm run dev`
   - اذهب إلى `/admin/login`
   - سجل دخول بـ: `admin` / `carsiq01@`
   - يجب أن تختفي رسالة الخطأ

## هيكل الجدول

| العمود | النوع | الوصف |
|--------|-------|--------|
| id | TEXT | المعرف الفريد |
| car_make | TEXT | ماركة السيارة |
| car_model | TEXT | موديل السيارة |
| car_year | TEXT | سنة الصنع |
| current_recommendation | TEXT | التوصية الحالية |
| user_correction | TEXT | تصحيح المستخدم |
| user_email | TEXT | بريد المستخدم |
| status | TEXT | الحالة (PENDING, APPROVED, REJECTED, IMPLEMENTED) |
| admin_notes | TEXT | ملاحظات الإدارة |
| reviewed_by | TEXT | تمت المراجعة بواسطة |
| reviewed_at | TIMESTAMPTZ | تاريخ المراجعة |
| ip_address | TEXT | عنوان IP |
| created_at | TIMESTAMPTZ | تاريخ الإنشاء |
| updated_at | TIMESTAMPTZ | تاريخ التحديث |

## ملاحظات مهمة

- **الأمان:** تم تفعيل Row Level Security مع سياسة تسمح بجميع العمليات للتطوير
- **الأداء:** تم إنشاء فهارس على `status` و `created_at`
- **التحديث التلقائي:** يتم تحديث `updated_at` تلقائياً عند تعديل السجل

## استكشاف الأخطاء

### إذا استمر الخطأ:
1. تأكد من تنفيذ SQL بنجاح
2. تحقق من أن الجدول موجود في Table Editor
3. أعد تشغيل الخادم
4. تحقق من متغيرات البيئة في `.env`

### إذا كانت هناك مشاكل في الأذونات:
```sql
-- إعادة تعيين سياسات الأمان
DROP POLICY IF EXISTS "Allow all operations" ON public.corrections;
CREATE POLICY "Allow all operations" ON public.corrections FOR ALL USING (true);
```

## الدعم

إذا واجهت مشاكل، تحقق من:
- Supabase Dashboard > Settings > API
- متغيرات البيئة في `.env`
- سجلات الخادم في Terminal