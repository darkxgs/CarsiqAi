"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function SupportPage() {
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
              الدعم
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              نحن هنا لمساعدتك في أي وقت تحتاج إليه
            </p>
          </div>

          <div className="space-y-8">
            {/* Quick Help */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">المساعدة السريعة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/faq" className="block">
                  <div className="p-6 border-2 border-primary/20 rounded-xl hover:border-primary/40 transition-colors">
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">❓</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الأسئلة الشائعة</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">إجابات على أكثر الأسئلة شيوعاً</p>
                  </div>
                </Link>
                <Link href="/contact" className="block">
                  <div className="p-6 border-2 border-secondary/20 rounded-xl hover:border-secondary/40 transition-colors">
                    <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">📧</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">اتصل بنا</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">راسلنا مباشرة للحصول على المساعدة</p>
                  </div>
                </Link>
              </div>
            </section>

            {/* Common Issues */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">المشاكل الشائعة</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">لا تظهر التوصية</h3>
                  <p className="text-gray-600 dark:text-gray-300">تأكد من إدخال معلومات صحيحة عن سيارتك. إذا استمرت المشكلة، جرب تحديث الصفحة.</p>
                </div>
                <div className="border-l-4 border-secondary pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">الخدمة بطيئة</h3>
                  <p className="text-gray-600 dark:text-gray-300">تحقق من اتصال الإنترنت لديك. قد تستغرق الخدمة بضع ثوانٍ للرد.</p>
                </div>
                <div className="border-l-4 border-yellow-400 pl-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">خطأ في التطبيق</h3>
                  <p className="text-gray-600 dark:text-gray-300">إذا واجهت خطأ، يرجى إعادة تحميل الصفحة أو الاتصال بنا.</p>
                </div>
              </div>
            </section>

            {/* How to Use */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">كيفية استخدام الخدمة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">ابدأ المحادثة</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">اضغط على "بدء المحادثة" في الصفحة الرئيسية</p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">أدخل المعلومات</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">اخبرنا بنوع وموديل سيارتك</p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">احصل على التوصية</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">ستحصل على توصية فورية ومناسبة</p>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">نصائح للحصول على أفضل النتائج</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">أدخل معلومات دقيقة عن سيارتك</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">اذكر الظروف المناخية في منطقتك</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">اسأل عن نوع القيادة التي تمارسها</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">استشر ميكانيكي محترف للتأكد</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Options */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">خيارات الاتصال</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📧</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">البريد الإلكتروني</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">support@carsiq.ai</p>
                  <p className="text-xs text-gray-500">الرد خلال 24 ساعة</p>
                </div>
                <div className="text-center p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">المحادثة المباشرة</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">استخدم نموذج الاتصال</p>
                  <Link href="/contact">
                    <Button size="sm" className="rounded-full">
                      ابدأ المحادثة
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center bg-primary/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">هل تحتاج مساعدة إضافية؟</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                لا تتردد في الاتصال بنا. نحن هنا لمساعدتك!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <Button variant="outline" className="rounded-full px-6">
                    جرب الخدمة
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-8 py-4 text-lg">
                    اتصل بنا الآن
                  </Button>
                </Link>
              </div>
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