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

    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({
        error: "OpenRouter API key not configured"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    console.log("Making direct API call to OpenRouter...")
    
    // Prepare messages for OpenRouter API
    const apiMessages = [
      {
        role: "system",
        content: "أنت مساعد تقني متخصص في زيوت محركات السيارات. أجب بإيجاز ووضوح."
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