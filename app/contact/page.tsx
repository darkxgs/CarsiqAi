"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              اتصل بنا
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              نحن هنا للإجابة على أسئلتك ومساعدتك في أي شيء تحتاجه
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الموضوع *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="مشكلة تقنية">مشكلة تقنية</option>
                    <option value="اقتراح">اقتراح</option>
                    <option value="شكوى">شكوى</option>
                    <option value="تعاون">تعاون</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الرسالة *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <Button type="submit" className="w-full rounded-lg py-3 text-lg">
                  إرسال الرسالة
                </Button>
              </form>
            </section>

            {/* Contact Information */}
            <section className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">معلومات الاتصال</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">البريد الإلكتروني</h3>
                      <p className="text-gray-600 dark:text-gray-300">support@carsiq.ai</p>
                      <p className="text-sm text-gray-500">الرد خلال 24 ساعة</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">الموقع الإلكتروني</h3>
                      <p className="text-gray-600 dark:text-gray-300">www.carsiq.ai</p>
                      <p className="text-sm text-gray-500">متوفر على مدار الساعة</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">الموقع</h3>
                      <p className="text-gray-600 dark:text-gray-300">العراق</p>
                      <p className="text-sm text-gray-500">خدمة رقمية متوفرة في جميع أنحاء العراق</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">المساعدة السريعة</h2>
                <div className="space-y-4">
                  <Link href="/faq" className="block">
                    <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary/40 transition-colors">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">الأسئلة الشائعة</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">إجابات على أكثر الأسئلة شيوعاً</p>
                    </div>
                  </Link>
                  <Link href="/support" className="block">
                    <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary/40 transition-colors">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">الدعم الفني</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">حلول للمشاكل التقنية</p>
                    </div>
                  </Link>
                  <Link href="/chat" className="block">
                    <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary/40 transition-colors">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">جرب الخدمة</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">ابدأ المحادثة واحصل على توصية فورية</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-primary/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">وقت الاستجابة</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">البريد الإلكتروني</span>
                    <span className="font-semibold text-gray-900 dark:text-white">24 ساعة</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">الأسئلة الشائعة</span>
                    <span className="font-semibold text-gray-900 dark:text-white">فوري</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">المحادثة المباشرة</span>
                    <span className="font-semibold text-gray-900 dark:text-white">فوري</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* CTA */}
          <section className="text-center bg-primary/10 rounded-2xl p-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">هل تريد تجربة الخدمة؟</h2>
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
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 هندسة السيارات. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  )
} 