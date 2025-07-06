"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

// Import the chat component with SSR disabled (we'll use this on a different route)
const ChatPageClient = dynamic(
  () => import('@/components/chat/ChatPage'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-4">🛢️</div>
          <p className="text-gray-600">جاري تحميل مساعد زيوت السيارات...</p>
        </div>
      </div>
    )
  }
)

export default function LandingPage() {
  const [featuredTab, setFeaturedTab] = useState('jeep')
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="relative w-full py-6 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="هندسة السيارات" width={48} height={48} className="rounded-full" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">هندسة السيارات</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="outline" className="rounded-full px-6">بدء المحادثة</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-28 px-4 bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-primary/20 dark:via-gray-900 dark:to-secondary/20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-96 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur-3xl opacity-40 -z-10"></div>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight drop-shadow-lg">
            مساعدك الذكي <span className="text-primary">لاختيار زيوت</span> سيارتك
          </h1>
          <h2 className="text-2xl md:text-3xl text-secondary font-semibold mb-4">أول خدمة في العراق لتوصيات زيوت المحرك حسب سيارتك وبيئتك</h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            استشارة فورية لاختيار أفضل زيت محرك لسيارتك بناءً على الموديل والظروف المناخية العراقية. جرب الخدمة الآن مجاناً!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chat">
              <Button size="lg" className="rounded-full px-10 py-6 text-xl shadow-lg bg-primary hover:bg-primary/90 text-white">
                ابدأ المحادثة الآن
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-xl border-2 border-primary text-primary hover:bg-primary/10">
                شاهد كيف يعمل
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-14 text-gray-900 dark:text-white">مميزات الخدمة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 border-2 border-primary/20 dark:border-primary/30 rounded-2xl bg-primary/5 dark:bg-primary/10 shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary text-white mb-5 text-3xl shadow-md">
                🚗
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">دعم جميع السيارات</h3>
              <p className="text-gray-700 dark:text-gray-300">توصيات مخصصة لجميع أنواع وموديلات السيارات المتوفرة في العراق</p>
            </div>
            {/* Feature 2 */}
            <div className="p-8 border-2 border-secondary/20 dark:border-secondary/30 rounded-2xl bg-secondary/5 dark:bg-secondary/10 shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-secondary text-white mb-5 text-3xl shadow-md">
                ⚡
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">استجابة فورية</h3>
              <p className="text-gray-700 dark:text-gray-300">احصل على توصيات فورية دقيقة خلال ثوانٍ من طرح سؤالك</p>
            </div>
            {/* Feature 3 */}
            <div className="p-8 border-2 border-yellow-400/20 dark:border-yellow-400/30 rounded-2xl bg-yellow-100/10 dark:bg-yellow-900/10 shadow-lg flex flex-col items-center text-center transition-transform hover:scale-105">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-yellow-400 text-white mb-5 text-3xl shadow-md">
                ☀️
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">مناسب للمناخ العراقي</h3>
              <p className="text-gray-700 dark:text-gray-300">توصيات مخصصة للظروف المناخية العراقية القاسية والحرارة المرتفعة</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Car Models Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">نماذج السيارات المدعومة</h2>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button 
              onClick={() => setFeaturedTab('jeep')}
              className={`px-4 py-2 rounded-full ${featuredTab === 'jeep' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              جيب
            </button>
            <button 
              onClick={() => setFeaturedTab('toyota')}
              className={`px-4 py-2 rounded-full ${featuredTab === 'toyota' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              تويوتا
            </button>
            <button 
              onClick={() => setFeaturedTab('hyundai')}
              className={`px-4 py-2 rounded-full ${featuredTab === 'hyundai' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              هيونداي
            </button>
            <button 
              onClick={() => setFeaturedTab('kia')}
              className={`px-4 py-2 rounded-full ${featuredTab === 'kia' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              كيا
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredTab === 'jeep' && (
              <>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">جيب كومباس</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 0W-20 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 5.2 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">جيب جراند شيروكي (V6)</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 0W-20 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 5.7 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">جيب جراند شيروكي (V8)</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-20 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 6.6 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">جيب رانجلر</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 5.0 لتر</p>
                </div>
              </>
            )}
            {featuredTab === 'toyota' && (
              <>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">تويوتا كامري</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 0W-20 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 4.5 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">تويوتا كورولا</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 0W-20 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 4.2 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">تويوتا لاندكروزر</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 6.8 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">تويوتا RAV4</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 0W-20 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 4.8 لتر</p>
                </div>
              </>
            )}
            {featuredTab === 'hyundai' && (
              <>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">هيونداي النترا</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 4.5 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">هيونداي سوناتا</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 4.8 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">هيونداي توسان</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 4.8 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">هيونداي سانتافي</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 5.0 لتر</p>
                </div>
              </>
            )}
            {featuredTab === 'kia' && (
              <>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">كيا سيراتو</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 4.2 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">كيا سبورتاج</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 4.6 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">كيا K5</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 4.8 لتر</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h3 className="font-bold mb-2">كيا سورينتو</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نوع الزيت: 5W-30 Full Synthetic</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">السعة: 5.2 لتر</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">احصل على أفضل توصية الآن</h2>
          <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
            المساعد الذكي الأول في العراق للحصول على توصيات زيوت المحرك المناسبة لسيارتك
          </p>
          <Link href="/chat">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg">
              ابدأ المحادثة
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="هندسة السيارات" width={32} height={32} className="rounded-full" />
              <span className="font-bold text-gray-900 dark:text-white">هندسة السيارات</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              مساعد ذكي لاختيار أفضل زيت مناسب لسيارتك بناءً على الظروف المناخية العراقية
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/chat" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">المحادثة</Link></li>
              <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">عن الخدمة</Link></li>
              <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">الشروط والأحكام</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">الأسئلة الشائعة</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">اتصل بنا</Link></li>
              <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">تواصل معنا</h4>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2023 هندسة السيارات. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
