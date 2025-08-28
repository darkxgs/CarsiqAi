import { createOpenAI } from "@ai-sdk/openai"

export async function GET() {
  try {
    console.log("Testing OpenRouter connection...")
    
    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({
        error: "OpenRouter API key not configured"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    console.log("Creating OpenRouter client...")
    const client = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Car Service Chat - Connection Test"
      }
    })

    // Test with a simple direct API call
    console.log("Testing direct API call...")
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Car Service Chat - Connection Test"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Respond in Arabic."
          },
          {
            role: "user", 
            content: "مرحبا"
          }
        ],
        max_tokens: 100
      })
    })

    const data = await response.json()
    console.log("OpenRouter response:", data)

    return new Response(JSON.stringify({
      success: true,
      status: response.status,
      data: data
    }), {
      headers: { "Content-Type": "application/json" }
    })

  } catch (error: any) {
    console.error("OpenRouter test error:", error)
    return new Response(JSON.stringify({
      error: "Test failed",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}