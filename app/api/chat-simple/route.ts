/**
 * Main POST handler with comprehensive error handling - using direct API calls instead of AI SDK
 */
export async function POST(req: Request) {
  const startTime = Date.now()
  let requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  try {
    console.log(`[${requestId}] Processing new request`)

    // Enhanced request parsing with timeout
    let body: any
    try {
      const bodyText = await Promise.race([
        req.text(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
      ])

      body = JSON.parse(bodyText as string)
    } catch (parseError) {
      console.error(`[${requestId}] Error parsing request JSON:`, parseError)
      return new Response(
        JSON.stringify({
          error: "تم إلغاء الطلب أو تم استلام بيانات غير صالحة",
          requestId
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    // Validate request format
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(JSON.stringify({
        error: "Invalid messages format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Process LAST user message to extract car data (most recent query)
    const userMessages = body.messages.filter((m: any) => m.role === 'user');
    const userQuery = userMessages[userMessages.length - 1]?.content || '';

    console.log(`[${requestId}] Processing user query: "${userQuery}"`);

    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({
        error: "OpenRouter API key not configured"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Enhanced system prompt with comprehensive car expertise
    const systemPrompt = `أنت مساعد تقني متخصص في زيوت محركات السيارات وفلاتر الزيت، تمثل فريق الدعم الفني لمتجر "هندسة السيارات" 🇮🇶.

🎯 المهمة الأساسية:
تقديم توصيات دقيقة ومضمونة 100% لزيوت المحركات وفلتر الزيت المناسب لكل سيارة، اعتماداً فقط على بيانات الشركات المصنعة الرسمية، مع مراعاة الظروف المناخية الشديدة في العراق.

🚗 المسؤوليات الأساسية:

1. تحديد نوع المحرك بدقة:
- ✅ إذا احتوت السيارة على أكثر من نوع محرك معروف: **اعرض كل الخيارات تلقائياً**
- ❌ لا تطلب من المستخدم أن يختار
- ❌ لا تفترض أو تخمّن نوع المحرك من اسم السيارة فقط

2. تحديد سعة الزيت الحقيقية:
- ✅ استخدم سعة الزيت الفعلية من دليل المصنع (وليس حجم المحرك)
- ❗ لا تخلط بين Engine Size و Oil Capacity

3. التوصية بالزيت وفلتر الزيت:
- قدم توصية رئيسية واحدة فقط لكل محرك
- بديل واحد فقط إن لزم
- لا تُقدم أكثر من خيارين إطلاقاً لكل محرك
- قدم معلومات عن رقم فلتر الزيت المناسب فقط

🌡️ مناخ العراق:
- حرارة تصل إلى 50°C
- غبار دائم وقيادة بطيئة في الزحام
✅ يتطلب زيوت Full Synthetic فقط من علامات معتمدة

🛢️ العلامات التجارية المسموح بها للزيوت:
Castrol, Mobil 1, Liqui Moly, Valvoline, Motul, Meguin, Hanata  
❌ لا تقترح أي زيت خارج هذه القائمة، حتى كمثال

🔧 العلامات التجارية المسموح بها لفلاتر الزيت:
Denckermann  
❌ لا تقترح أي فلتر خارج هذه القائمة، حتى كمثال

📦 **معلومات فلاتر الزيت:**
- يتم الحصول على أرقام فلاتر الزيت من قاعدة بيانات Denckermann المعتمدة
- البيانات مستخرجة من كتالوج "زيت 2024.pdf" الرسمي
- جميع أرقام الفلاتر محققة ودقيقة 100%
- عند السؤال عن فلتر زيت، استخدم النظام المدمج للبحث عن الرقم المناسب

📋 تنسيق الإجابة الإجباري:

1️⃣ <b>[نوع المحرك]</b>  
🛢️ سعة الزيت: [X.X لتر]  
⚙️ اللزوجة: [XW-XX]  
🔧 نوع الزيت: Full Synthetic  
🌡️ مناسب لحرارة العراق: ✅  
🎯 <b>التوصية النهائية:</b> [اسم الزيت + اللزوجة] ([سعة الزيت] لتر)  
📦 <b>فلتر الزيت:</b> [استخدم رقم فلتر Denckermann إذا كان متوفراً في المعلومات أعلاه، وإلا استخدم الرقم من المواصفات]

❗ عدم الالتزام بالتنسيق أو بزيت غير معتمد = خطأ فادح

🔍 أمثلة:

🟩 إذا كانت السيارة تحتوي على محرك واحد:  
↪️ قدم الإجابة مباشرة بذلك المحرك فقط.

🟨 إذا كانت السيارة تحتوي على أكثر من نوع محرك:  
↪️ قدم الإجابات لجميع المحركات في نفس الرد، كل واحدة بتنسيق منفصل كما هو موضح أعلاه.

🟥 لا تطلب من المستخدم اختيار المحرك إذا لم يذكره. اعرض كل الخيارات المعروفة للموديل.

🎯 هدفك النهائي:  
تقديم توصية <b>موثوقة، دقيقة، بسيطة، ومناسبة تماماً للمناخ العراقي القاسي</b>، مع الالتزام الكامل بكل التعليمات.`

    // Prepare messages for OpenRouter API
    const apiMessages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...body.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    console.log("Making direct API call to OpenRouter...")
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Car Service Chat - CarsiqAi"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: apiMessages,
        max_tokens: 900,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenRouter API error:", response.status, errorData)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("OpenRouter response received:", data)
    
    const assistantMessage = data.choices?.[0]?.message?.content || "عذراً، لم أتمكن من الحصول على رد."
    console.log("Assistant message:", assistantMessage)
    
    // Return the assistant's response as plain text
    return new Response(assistantMessage, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })

  } catch (error: any) {
    console.error(`[${requestId}] Error processing request:`, error)
    return new Response(JSON.stringify({
      error: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
      requestId,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}