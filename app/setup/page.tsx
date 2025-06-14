'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function SetupPage() {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [step, setStep] = useState(1)

  const testConnection = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await supabase.from('car_brands').select('count')
      
      if (error) throw error
      
      setSuccess('تم الاتصال بقاعدة البيانات بنجاح!')
      setStep(2)
    } catch (err) {
      console.error('Connection error:', err)
      setError('فشل الاتصال بقاعدة البيانات. الرجاء التحقق من البيانات المدخلة.')
    } finally {
      setIsLoading(false)
    }
  }

  const setupTables = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Add tables
      await executeSql(supabase, `
        CREATE TABLE IF NOT EXISTS car_models (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          brand TEXT NOT NULL,
          year INT NOT NULL,
          queries INT DEFAULT 0,
          trends TEXT[] DEFAULT '{}',
          features JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `)
      
      await executeSql(supabase, `
        CREATE TABLE IF NOT EXISTS car_brands (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          queries INT DEFAULT 0,
          market_share FLOAT DEFAULT 0,
          trends TEXT[] DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `)
      
      await executeSql(supabase, `
        CREATE TABLE IF NOT EXISTS user_queries (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          query TEXT NOT NULL,
          timestamp TIMESTAMPTZ DEFAULT NOW(),
          user_id TEXT,
          car_model TEXT,
          car_brand TEXT,
          query_type TEXT NOT NULL,
          source TEXT NOT NULL,
          location TEXT,
          confidence_score FLOAT DEFAULT 0,
          oil_capacity TEXT,
          recommended_oil TEXT,
          oil_viscosity TEXT,
          session_id TEXT,
          car_year INT,
          mileage INT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `)
      
      await executeSql(supabase, `
        CREATE TABLE IF NOT EXISTS market_insights (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          type TEXT NOT NULL,
          value TEXT NOT NULL,
          timestamp TIMESTAMPTZ DEFAULT NOW(),
          importance INT DEFAULT 0,
          source TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `)
      
      setSuccess('تم إنشاء الجداول بنجاح!')
      setStep(3)
    } catch (err) {
      console.error('Setup error:', err)
      setError('حدث خطأ أثناء إنشاء الجداول. الرجاء التحقق من الصلاحيات.')
    } finally {
      setIsLoading(false)
    }
  }

  const executeSql = async (supabase: any, sql: string) => {
    const { error } = await supabase.rpc('exec_sql', { query_text: sql })
    if (error) throw error
    return true
  }

  const copyEnvFile = () => {
    const envContent = `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey}`
    
    navigator.clipboard.writeText(envContent)
      .then(() => setSuccess('تم نسخ محتويات الملف بنجاح! قم بإنشاء ملف .env.local في مجلد المشروع والصق المحتوى فيه.'))
      .catch(() => setError('فشل نسخ المحتوى'))
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 rtl">
      <h1 className="text-3xl font-bold mb-8 text-center">إعداد قاعدة بيانات Supabase</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          الخطوات:
        </h2>
        <ol className="list-decimal mr-6 space-y-2">
          <li className={step >= 1 ? "font-semibold" : ""}>إنشاء حساب وقاعدة بيانات في Supabase</li>
          <li className={step >= 2 ? "font-semibold" : ""}>إنشاء الجداول قاعدة البيانات</li>
          <li className={step >= 3 ? "font-semibold" : ""}>تكوين ملف البيئة</li>
          <li className={step >= 4 ? "font-semibold" : ""}>إضافة البيانات الأولية</li>
        </ol>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">الخطوة 1: ربط قاعدة البيانات</h3>
        <p className="mb-4">قم بإنشاء مشروع في <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase</a> ثم أدخل عنوان URL ومفتاح API الخاص بك:</p>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2">عنوان Supabase URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="https://your-project.supabase.co"
            />
          </div>
          
          <div>
            <label className="block mb-2">مفتاح API (anon/public)</label>
            <input
              type="text"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="your-anon-key"
            />
          </div>
          
          <button
            onClick={testConnection}
            disabled={!supabaseUrl || !supabaseKey || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'جاري الاتصال...' : 'اختبار الاتصال'}
          </button>
        </div>
      </div>

      {step >= 2 && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">الخطوة 2: إنشاء الجداول</h3>
          <p className="mb-4">تأكد من تمكين وظيفة SQL المخصصة في إعدادات Supabase الخاصة بك ثم قم بإنشاء الجداول:</p>
          
          <button
            onClick={setupTables}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'جاري الإنشاء...' : 'إنشاء الجداول'}
          </button>
        </div>
      )}

      {step >= 3 && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">الخطوة 3: تكوين ملف البيئة</h3>
          <p className="mb-4">أنشئ ملف .env.local في مجلد المشروع الرئيسي وأضف المعلومات التالية:</p>
          
          <div className="bg-gray-100 p-4 rounded mb-4 font-mono text-sm">
            NEXT_PUBLIC_SUPABASE_URL={supabaseUrl}<br />
            NEXT_PUBLIC_SUPABASE_ANON_KEY={supabaseKey}
          </div>
          
          <button
            onClick={copyEnvFile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            نسخ المحتوى
          </button>
          
          <div className="mt-4">
            <p className="font-semibold">بعد إنشاء الملف، قم بإعادة تشغيل الخادم المحلي:</p>
            <div className="bg-gray-100 p-2 rounded font-mono mt-2">
              npm run dev
            </div>
          </div>
        </div>
      )}

      {step >= 3 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">الخطوة 4: إضافة البيانات الأولية</h3>
          <p className="mb-4">لإضافة بيانات السيارات الحقيقية إلى قاعدة البيانات، قم بتنفيذ:</p>
          
          <div className="bg-gray-100 p-2 rounded font-mono mb-4">
            npm run seed
          </div>
          
          <a
            href="/admin"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
          >
            الانتقال إلى لوحة التحكم
          </a>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-6">
          {success}
        </div>
      )}
    </div>
  )
} 