"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqs = [
    {
      question: "ما هي خدمة هندسة السيارات؟",
      answer: "هي خدمة ذكية تقدم توصيات لاختيار أفضل زيت محرك لسيارتك بناءً على نوع السيارة والظروف المناخية العراقية. الخدمة مجانية وتستخدم الذكاء الاصطناعي لتقديم توصيات دقيقة."
    },
    {
      question: "هل الخدمة مجانية؟",
      answer: "نعم، الخدمة مجانية تماماً. لا توجد رسوم أو اشتراكات مطلوبة. يمكنك استخدام الخدمة كما تريد دون أي تكلفة."
    },
    {
      question: "ما أنواع السيارات المدعومة؟",
      answer: "ندعم جميع أنواع السيارات الشائعة في العراق مثل تويوتا، جيب، هيونداي، كيا، نيسان، هوندا، فورد، شيفروليه، وغيرها من الماركات."
    },
    {
      question: "كيف تعمل الخدمة؟",
      answer: "ببساطة، ابدأ المحادثة وأخبرنا بنوع وموديل سيارتك، وسنقدم لك توصية فورية لزيت المحرك المناسب مع مراعاة الظروف المناخية العراقية."
    },
    {
      question: "هل التوصيات دقيقة؟",
      answer: "نعم، نستخدم قاعدة بيانات شاملة وذكاء اصطناعي متقدم لتقديم توصيات دقيقة. ومع ذلك، ننصح دائماً باستشارة ميكانيكي محترف للتأكد."
    },
    {
      question: "ما الفرق بين أنواع الزيوت المختلفة؟",
      answer: "تختلف الزيوت في اللزوجة والتركيب الكيميائي. الزيوت الاصطناعية (Full Synthetic) أفضل للأداء والحماية، بينما الزيوت المعدنية أقل تكلفة. نوصي بالزيوت المناسبة لسيارتك."
    },
    {
      question: "كم مرة يجب تغيير زيت المحرك؟",
      answer: "يختلف حسب نوع السيارة والزيت المستخدم. عادةً كل 5000-10000 كم للزيوت المعدنية، وكل 10000-15000 كم للزيوت الاصطناعية. راجع دليل سيارتك للحصول على التوصية الدقيقة."
    },
    {
      question: "هل يمكنني استخدام زيت مختلف عن الموصى به؟",
      answer: "ننصح دائماً باستخدام الزيت الموصى به من الشركة المصنعة. استخدام زيت غير مناسب قد يضر بالمحرك ويؤثر على الأداء."
    },
    {
      question: "ما تأثير المناخ العراقي على اختيار الزيت؟",
      answer: "المناخ العراقي الحار يتطلب زيوت بدرجة لزوجة مناسبة للحرارة المرتفعة. نوصي بزيوت 5W-30 أو 10W-30 للحصول على أفضل حماية في الظروف الحارة."
    },
    {
      question: "هل الخدمة متوفرة على الهاتف المحمول؟",
      answer: "نعم، الخدمة متوافقة تماماً مع الهواتف المحمولة والأجهزة اللوحية. يمكنك استخدامها من أي جهاز متصل بالإنترنت."
    },
    {
      question: "ماذا لو لم أجد سيارتي في القائمة؟",
      answer: "إذا لم تكن سيارتك مدرجة، يمكنك إخبارنا بالماركة والموديل العام، وسنحاول تقديم أفضل توصية ممكنة بناءً على المعلومات المتوفرة."
    },
    {
      question: "هل يمكنني الحصول على توصيات لسيارات أخرى؟",
      answer: "نعم، يمكنك الحصول على توصيات لأي عدد من السيارات. كل محادثة جديدة تبدأ من الصفر، لذا يمكنك الاستفسار عن سيارات مختلفة."
    }
  ]

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
              الأسئلة الشائعة
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              إجابات على أكثر الأسئلة شيوعاً حول خدمة زيوت السيارات
            </p>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4 mb-12">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-right flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <span className={`text-2xl text-primary transition-transform ${openItems.includes(index) ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">لم تجد إجابة لسؤالك؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/contact" className="block">
                <div className="p-6 border-2 border-primary/20 rounded-xl hover:border-primary/40 transition-colors text-center">
                  <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📧</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">اتصل بنا</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">راسلنا مباشرة للحصول على إجابة</p>
                </div>
              </Link>
              <Link href="/chat" className="block">
                <div className="p-6 border-2 border-secondary/20 rounded-xl hover:border-secondary/40 transition-colors text-center">
                  <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">جرب الخدمة</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">ابدأ المحادثة واحصل على توصية فورية</p>
                </div>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-primary/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">جاهز لتجربة الخدمة؟</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              احصل على أفضل توصية لزيت محرك سيارتك الآن
            </p>
            <Link href="/chat">
              <Button size="lg" className="rounded-full px-8 py-4 text-lg">
                ابدأ المحادثة الآن
              </Button>
            </Link>
          </section>
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