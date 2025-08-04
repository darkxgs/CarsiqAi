import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

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

    console.log("Creating OpenRouter client...")
    const client = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Car Service Chat - Simple Test"
      }
    })

    console.log("Calling streamText...")
    const result = await streamText({
      model: client("google/gemini-2.0-flash-001"),
      system: "أنت مساعد تقني متخصص في زيوت محركات السيارات. أجب بإيجاز ووضوح.",
      messages: body.messages,
      maxTokens: 500,
      temperature: 0.3
    })

    console.log("Returning stream response...")
    
    // Create a streaming response using the text stream
    return new Response(result.textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
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