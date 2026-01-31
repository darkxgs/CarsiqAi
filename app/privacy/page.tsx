import Link from 'next/link'

export const metadata = {
  title: 'سياسة الخصوصية - هندسة السيارات',
  description: 'سياسة الخصوصية لتطبيق هندسة السيارات'
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
          ← العودة للرئيسية
        </Link>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          سياسة الخصوصية
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            <strong>آخر تحديث:</strong> 19 أكتوبر 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              نظرة عامة
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              تطبيق هندسة السيارات للهاتف المحمول هو تطبيق WebView يعرض موقعنا الإلكتروني. 
              نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              جمع البيانات
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              <strong>التطبيق المحمول:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
              <li>لا نجمع أي بيانات شخصية من خلال التطبيق نفسه</li>
              <li>لا نستخدم أي أدوات تتبع أو تحليلات في التطبيق</li>
              <li>لا نخزن أي معلومات على جهازك</li>
            </ul>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              <strong>الموقع الإلكتروني:</strong>
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              عند استخدام التطبيق، تصل إلى موقعنا الإلكتروني (carsiqai.com) والذي قد يجمع 
              بيانات كما هو موضح في سياسة خصوصية الموقع.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              الأذونات المطلوبة
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>الإنترنت:</strong> مطلوب لتحميل الموقع الإلكتروني</li>
              <li><strong>حالة الشبكة:</strong> للكشف عن الاتصال وعرض الرسائل المناسبة</li>
              <li><strong>حالة WiFi:</strong> لتحسين تجربة المستخدم عند التبديل بين الشبكات</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              استخدام البيانات
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              نحن لا نستخدم أو نشارك أو نبيع أي بيانات شخصية. التطبيق هو مجرد واجهة لعرض 
              موقعنا الإلكتروني بطريقة محسّنة للهواتف المحمولة.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              الخدمات الخارجية
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              التطبيق لا يستخدم أي خدمات خارجية للتتبع أو التحليلات. جميع المحتوى يتم 
              تحميله من موقعنا الإلكتروني مباشرة.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              أمان البيانات
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              نحن نستخدم HTTPS لتأمين الاتصال بين التطبيق وموقعنا الإلكتروني. جميع 
              البيانات المنقولة محمية بتشفير SSL/TLS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              حقوق المستخدم
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              لديك الحق في:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>معرفة البيانات التي نجمعها (لا شيء من خلال التطبيق)</li>
              <li>طلب حذف أي بيانات (إن وجدت)</li>
              <li>إلغاء تثبيت التطبيق في أي وقت</li>
              <li>الاتصال بنا لأي استفسارات</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              خصوصية الأطفال
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              التطبيق مناسب لجميع الأعمار. نحن لا نجمع عمداً معلومات من الأطفال دون سن 13 عاماً.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              التغييرات على سياسة الخصوصية
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي تغييرات 
              من خلال نشر السياسة الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث".
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              اتصل بنا
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا:
            </p>
            <ul className="list-none text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>البريد الإلكتروني:</strong> support@carsiqai.com</li>
              <li><strong>الموقع:</strong> <a href="https://www.carsiqai.com" className="text-blue-600 hover:text-blue-700">www.carsiqai.com</a></li>
            </ul>
          </section>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>ملاحظة:</strong> هذه السياسة تنطبق على تطبيق الهاتف المحمول فقط. 
              لمعرفة المزيد عن كيفية معالجة موقعنا الإلكتروني للبيانات، يرجى زيارة 
              سياسة الخصوصية الكاملة على موقعنا.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
