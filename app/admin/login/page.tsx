"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check local storage first
        const isAuthenticated = localStorage.getItem('adminAuth') === 'true'
        if (isAuthenticated) {
          console.log('User is authenticated, redirecting...')
          // Use both methods for maximum compatibility
          window.location.href = '/admin'
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }
    }
    
    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('الرجاء إدخال اسم المستخدم وكلمة المرور')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        console.log('Login successful, setting auth and redirecting...')
        // Set a client-side token to remember the authentication
        localStorage.setItem('adminAuth', 'true')
        
        // Force navigation - skipping Next.js router which might be causing issues
        window.location.href = '/admin'
      } else {
        setError(data.message || 'اسم المستخدم أو كلمة المرور غير صحيحة')
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول')
      console.error('Login error:', err)
    }

    setIsLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Debug button to check if redirect works
  const testRedirect = () => {
    console.log('Testing redirect...')
    window.location.href = '/admin'
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        margin: 0,
        background: '#2d2a36',
        color: 'white'
      }}
    >
      <div 
        className="flex flex-col md:flex-row bg-[#1e1c28] rounded-2xl overflow-hidden w-[90%] max-w-4xl"
        style={{ 
          boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 5px 15px rgba(0,0,0,0.3)' 
        }}
      >
        {/* Left side - Image with text */}
        <div 
          className="flex-1 bg-cover bg-center flex flex-col justify-between p-6 relative overflow-hidden"
          style={{ 
            backgroundImage: `url('/login-bg.jpg')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderTopRightRadius: '1rem',
            borderBottomRightRadius: '1rem'
          }}
        >
          <Link 
            href="/"
            className="text-white no-underline bg-white/20 px-3 py-2 rounded-lg w-fit hover:bg-white/30 transition-colors"
          >
            ← العودة إلى الموقع
          </Link>
          
          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="text-right relative z-10">
            <h2 className="m-0 text-2xl">لوحة تحكم خدمة السيارات</h2>
            <p className="mt-2 text-base">
              تحليل بيانات استفسارات المستخدمين واهتماماتهم بموديلات السيارات
            </p>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="flex-1 p-10 flex flex-col">
          {/* Logo at top */}
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              alt="Car Service Chat" 
              width={60} 
              height={60}
              className="logo-pulse logo-glow"
            />
          </div>
          
          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className="mb-2 text-2xl font-bold">تسجيل الدخول للوحة التحكم</h2>
            <p className="text-gray-400 text-sm">مرحبًا بك مجددًا 👋 سجل دخولك وابدأ المتابعة!</p>
          </div>
          
          <form onSubmit={handleLogin}>
            {/* Username input */}
            <div className="mb-5">
              <label className="block text-sm mb-1.5 text-gray-300">اسم المستخدم</label>
              <Input
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 px-4 border-none rounded-lg bg-[#1e1e2f] text-white"
                dir="rtl"
              />
            </div>
            
            {/* Password input */}
            <div className="mb-5">
              <label className="block text-sm mb-1.5 text-gray-300">كلمة المرور</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 px-4 border-none rounded-lg bg-[#1e1e2f] text-white"
                  dir="ltr"
                  style={{ textAlign: 'right' }}
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* Remember me */}
            <div className="flex items-center mb-6">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(!!checked)} 
                  className="bg-[#1e1e2f] border-gray-500"
                />
                <label htmlFor="remember-me" className="cursor-pointer text-sm text-gray-300 mr-2">
                  تذكرني
                </label>
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-md text-sm mb-5">
                {error}
              </div>
            )}
            
            {/* Login button */}
            <button 
              type="submit" 
              className="w-full py-3.5 border-none rounded-lg bg-[#6a4df4] text-white text-base cursor-pointer hover:bg-[#7a5df8] transition-all"
              disabled={isLoading}
              style={{ outline: 'none' }}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
            
            {/* Debug button - only in development */}
            {process.env.NODE_ENV === 'development' && (
              <button 
                type="button" 
                onClick={testRedirect}
                className="mt-4 p-2 bg-gray-700 text-xs text-white rounded"
              >
                تجربة الانتقال للوحة التحكم
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
} 