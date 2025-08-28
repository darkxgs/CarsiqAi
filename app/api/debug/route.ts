export async function GET() {
  try {
    // Test basic functionality
    const tests = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    }

    return new Response(JSON.stringify(tests, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({
      error: "Debug test failed",
      message: error.message,
      stack: error.stack
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Test the same validation as the main API
    const { z } = await import('zod')
    
    const MessageSchema = z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1, "Message content cannot be empty")
    })

    const RequestBodySchema = z.object({
      messages: z.array(MessageSchema).min(1, "At least one message is required")
    })

    const validation = RequestBodySchema.safeParse(body)
    
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: "Validation failed",
        details: validation.error.errors
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Test OpenRouter client creation
    const { createOpenAI } = await import("@ai-sdk/openai")
    
    const client = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY || "",
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Car Service Chat - CarsiqAi Debug"
      }
    })

    return new Response(JSON.stringify({
      success: true,
      message: "All tests passed",
      receivedMessages: validation.data.messages.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })

  } catch (error: any) {
    return new Response(JSON.stringify({
      error: "POST debug test failed",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, null, 2), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}