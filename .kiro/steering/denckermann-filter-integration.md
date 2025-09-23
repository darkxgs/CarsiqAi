# Denckermann Oil Filter Integration Guide

## Overview
This document provides comprehensive guidance for integrating the verified Denckermann oil filter database into CarsiqAi responses. The Denckermann filter data is 100% accurate and extracted from the official "زيت 2024.pdf" catalog.

## Key Integration Points

### 1. Filter Query Detection
The system automatically detects filter-related queries using these keywords:
- Arabic: `فلتر زيت`, `فلتر الزيت`, `فيلتر زيت`, `فيلتر الزيت`, `فلتر`, `فيلتر`, `رقم فلتر`, `رقم الفلتر`
- English: `oil filter`, `filter`, `filter number`

### 2. Verified Filter Database
The Denckermann database contains verified filter numbers for major car brands:
- **Toyota**: A210032, A210379, A210052, A210119, A210004, A210374, A210060
- **Ford**: A210159, A210014, A210094, A210723, A210414
- **Hyundai**: A210931, A211067, A211070, A211089, A210420, A210618, A210616
- **Kia**: Uses same filters as Hyundai (shared platform)
- **BMW**: A210738, A210101, A210519, A210736
- **Mercedes-Benz**: A211037, A210963, A210076, A210977
- **Chevrolet**: A211062, A210050, A210191
- **Nissan**: A210021, A210492
- **Universal**: A210021 (compatible with multiple brands)

### 3. Response Enhancement
When a user asks about oil filters, the system should:

1. **Prioritize Denckermann Data**: Always use verified Denckermann filter numbers when available
2. **Provide Complete Information**: Include filter number, compatible vehicles, and confidence level
3. **Add Context**: Explain that the data is from official Denckermann catalog
4. **Include Alternatives**: Show compatible vehicles that use the same filter

### 4. Example Responses

#### For Specific Car Model (e.g., "تويوتا كامري 2020 فلتر زيت")
```
🔧 **فلتر الزيت الموصى به**

🚗 السيارة: تويوتا كامري 2020
🛢️ رقم فلتر الزيت: **A210032**
🏭 الماركة: Denckermann
✅ مصدر المعلومة: قاعدة بيانات Denckermann المعتمدة
🎯 مستوى الثقة: عالي

🔄 **السيارات المتوافقة مع نفس الفلتر:**
• C-HR
• Camry
• Corolla
• Prius
• RAV 4
• Rush
• Yaris
• Yaris (USA)

💡 **نصائح مهمة:**
• تأكد من رقم الفلتر قبل الشراء
• يُنصح بتغيير فلتر الزيت مع كل تغيير زيت
• استخدم فقط الفلاتر الأصلية أو المعتمدة
• احتفظ بالفلتر القديم للمقارنة عند الشراء

⚠️ **تنبيه:** هذه المعلومات مستخرجة من كتالوج Denckermann الرسمي وهي دقيقة 100%
```

#### For General Filter Query
```
🔍 **البحث عن فلاتر الزيت**

وجدت عدة نتائج مطابقة:

1. **A210032** - Toyota Camry
   العلامة التجارية: Denckermann
   مستوى الثقة: عالي

2. **A210379** - Toyota Corolla
   العلامة التجارية: Denckermann
   مستوى الثقة: عالي

💡 **نصيحة:** يرجى تحديد نوع السيارة وموديلها بوضوح للحصول على توصية دقيقة.
مثال: "تويوتا كامري 2020 فلتر زيت"
```

### 5. Integration with Oil Recommendations
When providing oil recommendations, always include the verified Denckermann filter number:

```
🛢️ **توصية الزيت الكاملة**

**المحرك:** 2.5L 4-Cylinder
🛢️ سعة الزيت: 4.8 لتر
⚙️ اللزوجة: 0W-20
🔧 نوع الزيت: Full Synthetic
🎯 **التوصية النهائية:** Castrol EDGE 0W-20 Full Synthetic (4.8 لتر)

**فلتر الزيت المعتمد:**
📦 رقم الفلتر: **A210032** (Denckermann)
✅ مصدر التحقق: كتالوج Denckermann الرسمي 2024
🔄 متوافق مع: Camry, Corolla, Prius, RAV 4

💡 **نصائح الصيانة:**
• غيّر فلتر الزيت مع كل تغيير زيت
• استخدم الكمية الصحيحة من الزيت (4.8 لتر)
• تأكد من رقم الفلتر قبل الشراء
```

### 6. Error Handling
When no Denckermann filter is found:

```
🔍 **البحث عن فلتر الزيت**

🚗 السيارة: [Make] [Model] [Year]

❌ عذراً، لم نجد فلتر زيت محدد لهذا الموديل في قاعدة بيانات Denckermann.

💡 **نصائح للعثور على الفلتر المناسب:**
• راجع دليل المالك الخاص بسيارتك
• اتصل بالوكيل المعتمد
• احضر الفلتر القديم عند الشراء
• تأكد من رقم المحرك وسنة الصنع
```

### 7. Arabic Model Name Mapping
The system handles Arabic car names automatically:
- `تويوتا كامري` → `toyota camry`
- `هيونداي النترا` → `hyundai elantra`
- `كيا سبورتاج` → `kia sportage`
- `نيسان التيما` → `nissan altima`

### 8. Quality Assurance
- **Always verify** filter numbers against the Denckermann database
- **Never guess** or provide unverified filter numbers
- **Always mention** that data is from official Denckermann catalog
- **Provide confidence levels** for all recommendations
- **Include compatible vehicles** when available

### 9. Performance Considerations
- Filter queries are processed separately from oil recommendations for faster response
- Denckermann database is loaded in memory for quick access
- Arabic text processing is optimized for common car names
- Search results are limited to top 5 matches to avoid overwhelming users

### 10. Future Enhancements
- Integration with air filter database
- Price information for filters
- Availability status in local markets
- Cross-reference with OEM part numbers
- Integration with maintenance schedules

## Implementation Notes
The Denckermann filter integration is implemented in:
- `data/denckermann-filters.ts` - Filter database
- `services/filterRecommendationService.ts` - Filter logic
- `app/api/chat/route.ts` - API integration

This ensures that users always receive accurate, verified filter recommendations based on official manufacturer data.