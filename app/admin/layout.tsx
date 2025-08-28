"use client"

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // This is a simple client-side auth check using localStorage
      // In a production app, use HTTP-only cookies or a secure token system
      const auth = localStorage.getItem('adminAuth')
      
      if (auth === 'true') {
        setIsAuthenticated(true)
      } else if (pathname !== '/admin/login') {
        // Redirect to login if not authenticated and not on login page
        router.push('/admin/login')
      }
      
      setIsLoading(false)
    }
    
    checkAuth()
  }, [pathname, router])
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">جاري التحميل...</p>
        </div>
      </div>
    )
  }
  
  // If on login page, or authenticated, show content
  if (pathname === '/admin/login' || isAuthenticated) {
    return children
  }
  
  // This should not be reached due to the redirect in the useEffect
  return null
} 