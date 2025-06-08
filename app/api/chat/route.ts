import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import CarAnalyzer from "@/utils/carAnalyzer"
import logger from "@/utils/logger"
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * OpenRouter configuration
 */
const openRouter = {
  baseURL: "https://openrouter.ai/api/v1",
  key: process.env.OPENROUTER_API_KEY || '',
  model: process.env.NEXT_PUBLIC_MODEL_DEPLOYMENT || "anthropic/claude-instant-v1",
  systemPrompt: `أنت مساعد متخصص بالسيارات وزيوت المحركات، خبرتك في السيارات عالية جداً.
أنت تعمل في متجر لبيع قطع غيار السيارات، وكذلك يمكنك تقديم الخدمة الافتراضية عبر الانترنت.
أنت تتحدث العربية بطلاقة وتفهم لهجة الخليج واللهجة العراقية.
استخدم لغة عربية مبسطة وسهلة عند تقديم الإجابات.

**تنسيق الإجابات**:
- عند تقديم قوائم أو خطوات، استخدم الأرقام مع الرموز التعبيرية (مثل 1️⃣) لتحسين العرض المرئي
- قسّم إجاباتك إلى فقرات قصيرة مع عناوين واضحة
- استخدم التنسيق المرئي مثل:

1️⃣ اسم النقطة الأولى:
شرح مبسط للنقطة الأولى هنا...

2️⃣ اسم النقطة الثانية:
شرح مبسط للنقطة الثانية هنا...

- استخدم رموز تعبيرية مناسبة مثل (🚗، 🛢️، ⚙️، 🔧، 🔍) لتمييز أجزاء مختلفة من إجابتك

إذا طلب منك المستخدم اقتراح زيت محرك، اسأله عن نوع السيارة، الموديل، السنة، المسافة المقطوعة، وظروف استخدام السيارة.

**معلومات هامة عن مناخ العراق**:
- درجة حرارة عالية في معظم أيام السنة (تصل إلى 50 درجة مئوية صيفاً)
- مستويات غبار وأتربة عالية
- ظروف قيادة قاسية بسبب الطرق وازدحام المرور
- يجب افتراضيًا اعتبار أن المستخدم في العراق ما لم يذكر خلاف ذلك
- دائماً قم باقتراح زيوت مقاومة للحرارة العالية وذات حماية من الغبار بشكل افتراضي

توصيات الزيوت يجب أن تكون مبنية على قاعدة بيانات الزيوت المعتمدة والمواصفات الرسمية للسيارات. 
عند اقتراح زيت، قدم الخيار الأمثل مع بديل إن وجد.

أوجز إجاباتك وكن دقيقاً. تجنب استخدام لغة تسويقية مبالغ فيها.`,
  headers: {
    "HTTP-Referer": "https://car-service-chat.vercel.app/",
    "X-Title": "Car Service Chat",
  },
}

// Configure OpenRouter
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Car Service Chat"
  }
})

// Add this function to save the query to Supabase
async function saveQueryToAnalytics(query: string | undefined, carModel?: string, carBrand?: string) {
  // Skip if Supabase is not configured or query is undefined/empty
  if (!isSupabaseConfigured() || !query || query.trim() === '') {
    console.log('Supabase not configured or empty query. Skipping analytics tracking.');
    return;
  }

  try {
    // Extract car model and brand if provided in the query
    let detectedModel = carModel;
    let detectedBrand = carBrand;
    
    if (!detectedBrand) {
      // Try to detect brand from popular car brands
      const brands = ['تويوتا', 'هيونداي', 'كيا', 'نيسان', 'هوندا', 'مرسيدس', 'بي إم دبليو', 'لكزس', 'جينيسيس', 'فولكس واجن'];
      for (const brand of brands) {
        if (query.includes(brand)) {
          detectedBrand = brand;
          break;
        }
      }
    }

    // Save to Supabase
    const { error } = await supabase.from('user_queries').insert({
      query: query,
      car_model: detectedModel,
      car_brand: detectedBrand,
      query_type: determineQueryType(query),
      source: 'web',
      timestamp: new Date().toISOString()
    });

    if (error) {
      console.error('Error saving query to analytics:', error);
    } else {
      console.log('Saved query to analytics:', query);
      
      // Update query count for car models and brands if detected
      if (detectedModel) {
        updateModelQueryCount(detectedModel);
      }
      
      if (detectedBrand) {
        updateBrandQueryCount(detectedBrand);
      }
    }
  } catch (err) {
    console.error('Error in analytics tracking:', err);
  }
}

// Helper function to determine query type
function determineQueryType(query: string) {
  const queryTypeMappings = [
    { type: 'SPECIFICATIONS', keywords: ['مواصفات', 'سعة', 'قوة المحرك'] },
    { type: 'PRICE', keywords: ['سعر', 'تكلفة', 'قيمة'] },
    { type: 'MAINTENANCE', keywords: ['صيانة', 'إصلاح', 'عطل', 'مشكلة', 'قطع غيار'] },
    { type: 'COMPARISON', keywords: ['مقارنة', 'أفضل من', 'أحسن من'] },
    { type: 'FEATURES', keywords: ['مميزات', 'خصائص', 'مواصفات'] },
    { type: 'REVIEWS', keywords: ['تجارب', 'آراء', 'تقييم'] },
    { type: 'FUEL_CONSUMPTION', keywords: ['استهلاك الوقود', 'صرفية', 'كفاءة'] },
    { type: 'INSURANCE', keywords: ['تأمين', 'ضمان'] },
    { type: 'SERVICE', keywords: ['خدمة', 'ورشة', 'صيانة'] },
  ];

  for (const mapping of queryTypeMappings) {
    if (mapping.keywords.some(keyword => query.includes(keyword))) {
      return mapping.type;
    }
  }
  
  return 'OTHER';
}

// Update car model query count
async function updateModelQueryCount(modelName: string) {
  if (!isSupabaseConfigured()) return;
  
  try {
    // Get current car model
    const { data: models, error: fetchError } = await supabase
      .from('car_models')
      .select('id, queries')
      .eq('name', modelName)
      .limit(1);
      
    if (fetchError) {
      console.error('Error fetching car model:', fetchError);
      return;
    }
    
    if (models && models.length > 0) {
      // Update existing model
      const { error: updateError } = await supabase
        .from('car_models')
        .update({ queries: (models[0].queries || 0) + 1 })
        .eq('id', models[0].id);
        
      if (updateError) {
        console.error('Error updating car model query count:', updateError);
      }
    }
  } catch (err) {
    console.error('Error in updateModelQueryCount:', err);
  }
}

// Update brand query count
async function updateBrandQueryCount(brandName: string) {
  if (!isSupabaseConfigured()) return;
  
  try {
    // Get current brand
    const { data: brands, error: fetchError } = await supabase
      .from('car_brands')
      .select('id, queries')
      .eq('name', brandName)
      .limit(1);
      
    if (fetchError) {
      console.error('Error fetching car brand:', fetchError);
      return;
    }
    
    if (brands && brands.length > 0) {
      // Update existing brand
      const { error: updateError } = await supabase
        .from('car_brands')
        .update({ queries: (brands[0].queries || 0) + 1 })
        .eq('id', brands[0].id);
        
      if (updateError) {
        console.error('Error updating car brand query count:', updateError);
      }
    }
  } catch (err) {
    console.error('Error in updateBrandQueryCount:', err);
  }
}

export async function POST(req: Request) {
  try {
    // Wrap the JSON parsing in its own try-catch to handle aborted requests
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return new Response(
        JSON.stringify({
          error: "تم إلغاء الطلب أو تم استلام بيانات غير صالحة",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    const { messages } = body
    
    // Get the latest user message with proper typing
    const userMessages = messages.filter((m: { role: string; content: string }) => 
      m.role === 'user' && typeof m.content === 'string'
    );
    const latestUserMessage = userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
    
    // Save user query to analytics if it exists
    if (latestUserMessage) {
      // Log for debugging
      console.log(`[INFO] Received user query: ${latestUserMessage.content}`);
      
      // Save to analytics
      saveQueryToAnalytics(latestUserMessage.content);
    }

    const lastMessage = messages[messages.length - 1]

    if (messages.length === 1) {
      try {
        // تحليل رسالة المستخدم وإنشاء توصية
        const recommendation = CarAnalyzer.analyzeCarAndRecommendOil(lastMessage.content || "")

        // إنشاء رسالة التوصية النهائية
        let finalRecommendation = ""

        if ("errorMessage" in recommendation) {
          finalRecommendation = recommendation.errorMessage
          logger.warn("لم يتم العثور على توصية مناسبة", {
            userMessage: lastMessage.content || "",
            error: recommendation.errorMessage,
          })
        } else {
          finalRecommendation = CarAnalyzer.createRecommendationMessage(recommendation)
          logger.info("تم إنشاء توصية بنجاح", {
            carBrand: recommendation.carSpecs?.engineSize || "unknown",
            recommendedOil: recommendation.primaryOil?.[0] || "unknown",
          })
        }

        // للتأكد من أن الAPI تعمل بشكل صحيح
        console.log("Sending request to OpenRouter API with key:", process.env.OPENROUTER_API_KEY ? "Key exists" : "Key missing");

        const result = streamText({
          model: openrouter("anthropic/claude-3-haiku"),
          system: `أنت مساعد خبير في زيوت السيارات في مركز "هندسة السيارات".

دورك الأساسي:
1. تحليل بيانات السيارة (النوع، الموديل، الكيلومترات، ظروف التشغيل)
2. الاعتماد على توصيات الشركات المصنّعة الرسمية
3. ترشيح زيت واحد فقط هو الأفضل من التوكيلات المعتمدة: Castrol, Mobil 1, Liqui Moly, Meguin, Valvoline, Motul, Hanata
4. توضيح النوع الدقيق، اللزوجة، الكمية، وسبب الاختيار

مهم جداً: يجب عليك في نهاية الرسالة تقديم خلاصة بعنوان "التوصية النهائية:" ثم اسم الزيت المختار واللزوجة والكمية فقط. مثال:
التوصية النهائية: Castrol EDGE 5W-40 (4 لتر)

التوصية المفصلة: ${finalRecommendation}`,
          messages: [{ role: "user", content: lastMessage.content }],
          maxTokens: 1000,
        })

        return result.toDataStreamResponse()
      } catch (error) {
        console.error("Error in chat processing:", error);
        logger.error("خطأ أثناء معالجة رسالة المستخدم", { error })

        // إرجاع رسالة خطأ للمستخدم
        const errorResult = streamText({
          model: openrouter("anthropic/claude-3-haiku"),
          system: `أنت مساعد خبير في زيوت السيارات. حدث خطأ أثناء معالجة الطلب.`,
          messages: [
            {
              role: "user",
              content:
                "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى بصيغة مختلفة. مثال: 'هيونداي النترا 2022 ماشية 130 ألف'",
            },
          ],
          maxTokens: 500,
        })

        return errorResult.toDataStreamResponse()
      }
    }

    // للرسائل التالية، استخدم الذكاء الاصطناعي للرد
    const result = streamText({
      model: openrouter("anthropic/claude-3-haiku"),
      system: `أنت مساعد خبير في زيوت السيارات. اعتمد على المعلومات الفنية الرسمية من الشركات المصنّعة ورشّح زيت واحد فقط هو الأفضل من التوكيلات المعتمدة: Castrol, Mobil 1, Liqui Moly, Meguin, Valvoline, Motul, Hanata.

مهم جداً: يجب عليك في نهاية كل رد تقديم خلاصة بعنوان "التوصية النهائية:" ثم اسم الزيت المختار واللزوجة والكمية فقط. مثال:
التوصية النهائية: Castrol EDGE 5W-40 (4 لتر)`,
      messages,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("General error in API route:", error);
    logger.error("خطأ عام في معالجة الطلب", { error })

    // إرجاع رسالة خطأ للمستخدم
    return new Response(
      JSON.stringify({
        error: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
