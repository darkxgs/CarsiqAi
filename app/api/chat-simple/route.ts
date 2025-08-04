export async function POST(req: Request) {
  try {
    console.log("Simple chat API called")
    
    const body = await req.json()
    console.log("Request body parsed:", body)
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(JSON.stringify({
        error: "Invalid messages format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    const userQuery = body.messages[body.messages.length - 1]?.content || ''
    console.log("User query:", userQuery)

    // Check if user is asking about oil filters
    const isFilterQuery = /فلتر|فيلتر|filter/i.test(userQuery)
    console.log("Is filter query:", isFilterQuery)

    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({
        error: "OpenRouter API key not configured"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    console.log("Making direct API call to OpenRouter...")
    
    // Enhanced system prompt with car expertise and database integration
    const systemPrompt = `أنت CarsiqAi، مساعد ذكي متخصص في السيارات وزيوت المحركات. لديك خبرة واسعة في:

🚗 **تخصصاتك:**
- زيوت المحركات وأنواعها ومواصفاتها
- فلاتر الزيت (خاصة قاعدة بيانات Denckermann المعتمدة)
- صيانة السيارات والمحركات
- توصيات مخصصة حسب نوع السيارة والمناخ
- مشاكل المحركات وحلولها

🛢️ **قاعدة بيانات فلاتر Denckermann المعتمدة:**
- Toyota: A210032, A210379, A210052, A210119, A210004, A210374, A210060
- Ford: A210159, A210014, A210094, A210723, A210414
- Hyundai/Kia: A210931, A211067, A211070, A211089, A210420, A210618, A210616
- BMW: A210738, A210101, A210519, A210736
- Mercedes-Benz: A211037, A210963, A210076, A210977
- Chevrolet: A211062, A210050, A210191
- Nissan: A210021, A210492

🌡️ **توصيات حسب المناخ:**
- الجو الحار (العراق، الخليج): 20W-50, 15W-40
- الجو المعتدل: 10W-40, 5W-30
- الجو البارد: 0W-20, 5W-20

📋 **أسلوب الرد:**
- استخدم الرموز التعبيرية المناسبة
- قدم معلومات دقيقة ومفصلة
- اذكر أرقام فلاتر Denckermann عند السؤال عن الفلاتر
- قدم نصائح عملية للصيانة
- اربط التوصيات بنوع السيارة والمناخ

عند السؤال عن فلاتر الزيت، استخدم هذا التنسيق:
🔧 **فلتر الزيت الموصى به**
🚗 السيارة: [نوع السيارة]
🛢️ رقم فلتر الزيت: **[رقم Denckermann]**
🏭 الماركة: Denckermann
✅ مصدر المعلومة: قاعدة بيانات Denckermann المعتمدة`

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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Car Service Chat - Simple API"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: apiMessages,
        max_tokens: 500,
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
    console.error("Simple chat API error:", error)
    return new Response(JSON.stringify({
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}