# 🚗 Car Service Chat

<div align="center">
  <img src="/public/logo.png" alt="Car Service Chat Logo" width="200"/>
  <br/>
  <strong>مساعد خدمة السيارات - تطبيق دردشة ذكي مخصص لخدمات السيارات في العراق</strong>
  <br/><br/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
</div>

## 📋 نظرة عامة

<p dir="rtl">
تطبيق Car Service Chat هو منصة ذكية متخصصة لمساعدة أصحاب السيارات في العراق في الحصول على المعلومات والنصائح المناسبة لصيانة سياراتهم في ظروف الطقس الحار. يعتمد التطبيق على تقنيات الذكاء الاصطناعي لتقديم إجابات مخصصة وفورية لجميع استفسارات صيانة السيارات.
</p>

### ما يقدمه التطبيق:

<p dir="rtl">
🔧 استشارات فورية حول صيانة السيارات بناءً على موديل سيارتك<br/>
🛢️ معلومات عن أنواع الزيوت المناسبة للمناخ الحار في العراق<br/>
🌡️ نصائح للعناية بالسيارة في ظروف الحرارة المرتفعة<br/>
⛽ معلومات عن توفير الوقود وتحسين أداء السيارة<br/>
🔍 توصيات مخصصة حسب نوع سيارتك وسنة الصنع<br/>
📊 لوحة تحكم متكاملة مع بيانات حقيقية للسيارات والاستفسارات
</p>

## ✨ المميزات الرئيسية

<p dir="rtl">
✅ واجهة مستخدم سهلة الاستخدام باللغة العربية<br/>
✅ وضع داكن وفاتح قابل للتبديل مع حفظ التفضيلات<br/>
✅ أسئلة سريعة مسبقة التجهيز للمساعدة الفورية<br/>
✅ تصميم متجاوب يعمل على جميع الأجهزة (حاسوب، جوال، لوحي)<br/>
✅ معلومات مخصصة لظروف العراق المناخية والطرق<br/>
✅ واجهة تفاعلية سلسة مع تحميل محسّن<br/>
✅ تحليل ذكي لبيانات السيارة وإعطاء توصيات دقيقة<br/>
✅ لوحة تحكم لإدارة وتحليل بيانات حقيقية للسيارات والاستفسارات<br/>
✅ إمكانية تصدير التقارير بصيغة CSV و PDF<br/>
✅ قاعدة بيانات Supabase لتخزين البيانات الحقيقية
</p>

## 🖼️ لقطات شاشة

<div align="center">
  <table>
    <tr>
      <td><img src="/public/screenshots/dark-mode.png" alt="واجهة الوضع الداكن" width="100%"/></td>
      <td><img src="/public/screenshots/light-mode.png" alt="واجهة الوضع الفاتح" width="100%"/></td>
    </tr>
    <tr>
      <td align="center">الوضع الداكن</td>
      <td align="center">الوضع الفاتح</td>
    </tr>
    <tr>
      <td><img src="/public/screenshots/mobile-view.png" alt="واجهة الجوال" width="100%"/></td>
      <td><img src="/public/screenshots/settings-view.png" alt="إعدادات التطبيق" width="100%"/></td>
    </tr>
    <tr>
      <td align="center">واجهة الجوال</td>
      <td align="center">إعدادات التطبيق</td>
    </tr>
  </table>
</div>

## 🛠️ التقنيات المستخدمة

- **Next.js 14**: إطار عمل React متقدم للتطبيقات ذات الأداء العالي
- **React 18**: مكتبة JavaScript لبناء واجهات المستخدم
- **Tailwind CSS**: إطار CSS عملي للتصميم السريع
- **shadcn/ui**: مكتبة مكونات واجهة مستخدم مخصصة
- **OpenAI API**: واجهة برمجة للذكاء الاصطناعي المتقدم
- **Vercel AI SDK**: أدوات لدمج تقنيات الذكاء الاصطناعي
- **TypeScript**: لغة برمجة آمنة النوع لتطوير أكثر موثوقية
- **Supabase**: قاعدة بيانات PostgreSQL كخدمة سحابية
- **jspdf**: مكتبة لإنشاء ملفات PDF

## ⚙️ التثبيت والتشغيل

### المتطلبات المسبقة

- Node.js (الإصدار 18 أو أحدث)
- حساب على Supabase (مجاني)

### خطوات التثبيت

1. استنساخ المشروع:
   ```bash
   git clone https://github.com/darkxgs/car-service-chat.git
   cd car-service-chat
   ```

2. تثبيت الاعتمادات:
   ```bash
   npm install --legacy-peer-deps
   ```

3. إعداد Supabase:
   - قم بإنشاء حساب على [Supabase](https://supabase.com)
   - أنشئ مشروعاً جديداً
   - احصل على روابط الاتصال (انظر الخطوة التالية)

4. إنشاء ملف `.env.local` وإضافة متغيرات البيئة المطلوبة:
   ```
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. تشغيل المشروع للتطوير:
   ```bash
   npm run dev
   ```

6. افتح المتصفح على العنوان [http://localhost:3000/setup](http://localhost:3000/setup) للبدء بإعداد قاعدة البيانات

7. اتبع تعليمات الإعداد على الشاشة لإنشاء جداول قاعدة البيانات وإضافة البيانات الأولية

8. بعد الانتهاء من الإعداد، يمكنك الوصول إلى لوحة التحكم في [http://localhost:3000/admin](http://localhost:3000/admin)

### إعداد قاعدة البيانات يدوياً

يمكنك أيضاً إضافة البيانات الأولية يدوياً بتنفيذ:

```bash
npm run seed
```

## 🚀 النشر

يمكن نشر التطبيق على منصات مثل Vercel أو Netlify بسهولة:

```bash
# للبناء
npm run build

# للتشغيل المحلي بعد البناء
npm run start

# للنشر على Vercel
vercel deploy
```

## 🌐 النشر المباشر

هذا التطبيق منشور ومتاح للاستخدام على:
[https://car-service-chat.vercel.app](https://car-service-chat.vercel.app)

## 📈 خطة التطوير المستقبلية

- [ ] إضافة نظام حسابات مستخدمين لحفظ سجل المحادثات
- [ ] دعم لغات إضافية (الإنجليزية، الكردية)
- [ ] إضافة ميزة التعرف على المشاكل من خلال الصور
- [ ] تكامل مع ورش الصيانة المحلية لحجز المواعيد
- [ ] تطبيق جوال أصلي لأنظمة iOS و Android

## 📄 الترخيص

هذا المشروع متاح تحت ترخيص MIT. انظر ملف [LICENSE](LICENSE) للمزيد من التفاصيل.

## 👥 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) للمزيد من المعلومات.

## 📞 التواصل

للأسئلة والاستفسارات، يرجى:
- فتح [issue جديد](https://github.com/darkxgs/car-service-chat/issues/new) على GitHub
- التواصل مباشرة مع [مالك المشروع](https://github.com/darkxgs)

---

<div align="center">
  <p>تم تطويره بواسطة <a href="https://github.com/darkxgs">@darkxgs</a> © 2025</p>
  <p>
    <a href="https://github.com/darkxgs/car-service-chat/stargazers">⭐ قم بتمييز المشروع بنجمة</a> •
    <a href="https://github.com/darkxgs/car-service-chat/fork">🔄 انسخ المشروع</a> •
    <a href="https://github.com/darkxgs/car-service-chat/issues">🐛 أبلغ عن مشكلة</a>
  </p>
</div> 