'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">⚠️</span>
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              عذراً، حدث خطأ
            </h2>

            {/* Error Message */}
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              حدث خطأ غير متوقع. يرجى تحديث الصفحة أو المحاولة مرة أخرى.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                <p className="text-sm text-red-800 dark:text-red-200 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
              >
                🔄 تحديث الصفحة
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-gray-300 dark:border-gray-600"
              >
                🏠 العودة للرئيسية
              </Button>
            </div>

            {/* Support Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                إذا استمرت المشكلة، يرجى{' '}
                <a
                  href="/contact"
                  className="text-red-600 dark:text-red-400 hover:underline"
                >
                  التواصل مع الدعم
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for easier use
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
