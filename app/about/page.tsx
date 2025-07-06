"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="relative w-full py-6 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="هندسة السيارات" width={48} height={48} className="rounded-full" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">هندسة السيارات</span>
          </Link>
          <Link href="/chat">
            <Button variant="outline" className="rounded-full px-6">بدء المحادثة</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              عن الخدمة
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              تعرف على مساعد زيوت السيارات الذكي الأول في العراق
            </p>
          </div>

          <div className="space-y-12">
            {/* Mission Section */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">مهمتنا</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                نسعى لتقديم أفضل خدمة استشارية لاختيار زيوت المحرك المناسبة لسيارتك، مع مراعاة الظروف المناخية العراقية القاسية. نهدف إلى حماية محرك سيارتك وضمان أدائه الأمثل.
              </p>
            </section>

            {/* How It Works */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">كيف تعمل الخدمة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">أدخل معلومات سيارتك</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">اخبرنا بنوع وموديل سيارتك</p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">احصل على التوصية</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">نحلل البيانات ونقدم أفضل توصية</p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">استخدم التوصية</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">احصل على زيت المحرك المناسب</p>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">مميزات الخدمة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">دعم جميع السيارات</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">توصيات لجميع أنواع وموديلات السيارات</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">مناسب للمناخ العراقي</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">توصيات مخصصة للظروف المناخية المحلية</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">استجابة فورية</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">احصل على التوصيات خلال ثوانٍ</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">مجاني تماماً</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">لا توجد رسوم أو اشتراكات</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center bg-primary/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">جرب الخدمة الآن</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                احصل على أفضل توصية لزيت محرك سيارتك مجاناً
              </p>
              <Link href="/chat">
                <Button size="lg" className="rounded-full px-8 py-4 text-lg">
                  ابدأ المحادثة الآن
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 هندسة السيارات. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  )
} 