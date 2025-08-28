import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// In a real application, these would be stored securely in environment variables
// and the password would be hashed
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'carsiq01@'

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    const { username, password } = body
    
    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a new response with successful login
      const response = NextResponse.json(
        { success: true, message: 'تم تسجيل الدخول بنجاح', redirectTo: '/admin' },
        { status: 200 }
      )
      
      // Set both an HTTP-only secure cookie and a regular cookie for client access
      // The HTTP-only cookie can't be accessed by JavaScript but can be read by the middleware
      response.cookies.set('adminAuth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      })
      
      // Return the response with cookies
      return response
    } else {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Error in admin auth route:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء محاولة تسجيل الدخول' },
      { status: 500 }
    )
  }
} 