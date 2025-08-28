"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function PrivacyPage() {
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
              سياسة الخصوصية
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              آخر تحديث: ديسمبر 2025
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. مقدمة</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نحن في "هندسة السيارات" نلتزم بحماية خصوصيتك. هذه السياسة توضح كيف نجمع ونستخدم ونحمي معلوماتك الشخصية عند استخدام خدمتنا.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. المعلومات التي نجمعها</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">معلومات السيارة</h3>
                  <p className="text-gray-700 dark:text-gray-300">نحتفظ بمعلومات سيارتك (النوع، الموديل) لتقديم التوصيات المناسبة. هذه المعلومات لا تحتوي على بيانات شخصية.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">معلومات الاستخدام</h3>
                  <p className="text-gray-700 dark:text-gray-300">نحتفظ بإحصائيات الاستخدام العامة لتحسين الخدمة. لا نربط هذه المعلومات بهوية محددة.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">معلومات الاتصال</h3>
                  <p className="text-gray-700 dark:text-gray-300">عند الاتصال بنا، نحتفظ بمعلوماتك (الاسم، البريد الإلكتروني) للرد على استفساراتك فقط.</p>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. كيف نستخدم المعلومات</h2>
              <div className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>تقديم توصيات دقيقة لزيوت المحرك</li>
                  <li>تحسين جودة الخدمة وتطويرها</li>
                  <li>الرد على استفساراتك وطلباتك</li>
                  <li>إرسال تحديثات مهمة عن الخدمة</li>
                  <li>حماية الخدمة من الاستخدام الضار</li>
                </ul>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. مشاركة المعلومات</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أي طرف ثالث لأغراض تجارية. قد نشارك معلومات محدودة في الحالات التالية:
              </p>
              <div className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>عندما يطلب القانون ذلك</li>
                  <li>لحماية حقوقنا وممتلكاتنا</li>
                  <li>في حالات الطوارئ لحماية السلامة العامة</li>
                  <li>مع موافقتك الصريحة</li>
                </ul>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. حماية المعلومات</h2>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">التشفير</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">جميع البيانات محمية بتشفير قوي</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">المراقبة</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">مراقبة مستمرة للأنظمة الأمنية</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                نستخدم ملفات تعريف الارتباط لتحسين تجربة المستخدم وتذكر تفضيلاتك. يمكنك إدارة إعدادات ملفات تعريف الارتباط في متصفحك.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. حقوقك</h2>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  لديك الحق في:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>الوصول إلى معلوماتك الشخصية</li>
                  <li>تصحيح المعلومات غير الدقيقة</li>
                  <li>حذف معلوماتك الشخصية</li>
                  <li>الاعتراض على معالجة معلوماتك</li>
                  <li>نقل معلوماتك إلى خدمة أخرى</li>
                </ul>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. التغييرات على السياسة</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                قد نحدث هذه السياسة من وقت لآخر. سنقوم بإخطارك بأي تغييرات جوهرية من خلال تحديث التاريخ أعلاه أو إرسال إشعار عبر البريد الإلكتروني.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. الاتصال بنا</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>البريد الإلكتروني: privacy@carsiq.ai</p>
                <p>الموقع: www.carsiq.ai</p>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center bg-primary/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">هل لديك أسئلة؟</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                نحن هنا للإجابة على استفساراتك حول الخصوصية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="outline" className="rounded-full px-6">
                    اتصل بنا
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" className="rounded-full px-8 py-4 text-lg">
                    جرب الخدمة
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