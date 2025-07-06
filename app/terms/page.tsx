"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function TermsPage() {
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
              الشروط والأحكام
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              آخر تحديث: ديسمبر 2025
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. قبول الشروط</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                باستخدام خدمة "هندسة السيارات"، فإنك توافق على هذه الشروط والأحكام بالكامل. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الخدمة.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. وصف الخدمة</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                "هندسة السيارات" هي خدمة استشارية ذكية تقدم توصيات لاختيار زيوت المحرك المناسبة بناءً على معلومات السيارة والظروف المناخية. الخدمة مجانية وتقدم لأغراض إعلامية فقط.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. الاستخدام المقبول</h2>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  يمكنك استخدام الخدمة للأغراض التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>الحصول على توصيات لاختيار زيت المحرك المناسب</li>
                  <li>الاستفسار عن أنواع الزيوت المختلفة</li>
                  <li>معرفة متطلبات الصيانة الأساسية</li>
                  <li>الاستشارة حول العناية بالمحرك</li>
                </ul>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. الاستخدام المحظور</h2>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  يحظر عليك استخدام الخدمة لأي من الأغراض التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>إرسال محتوى مسيء أو ضار</li>
                  <li>محاولة اختراق النظام أو إتلافه</li>
                  <li>استخدام الخدمة لأغراض تجارية غير مصرح بها</li>
                  <li>نشر معلومات كاذبة أو مضللة</li>
                </ul>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. إخلاء المسؤولية</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                الخدمة مقدمة "كما هي" دون أي ضمانات. نحن لا نضمن دقة التوصيات أو ملاءمتها لسيارتك. يرجى استشارة ميكانيكي محترف قبل اتخاذ أي قرارات متعلقة بصيانة سيارتك.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. الخصوصية</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نحن نحترم خصوصيتك. لا نخزن معلومات شخصية دائمة. المعلومات التي تقدمها تستخدم فقط لتقديم التوصيات المطلوبة.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. التعديلات</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية من خلال تحديث التاريخ أعلاه.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. الاتصال</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا من خلال صفحة "اتصل بنا".
              </p>
            </section>

            {/* CTA */}
            <section className="text-center bg-primary/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">هل لديك أسئلة؟</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                نحن هنا لمساعدتك. اتصل بنا أو راجع الأسئلة الشائعة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="outline" className="rounded-full px-6">
                    اتصل بنا
                  </Button>
                </Link>
                <Link href="/faq">
                  <Button size="lg" className="rounded-full px-8 py-4 text-lg">
                    الأسئلة الشائعة
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