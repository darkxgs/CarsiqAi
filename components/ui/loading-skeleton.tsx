import React from 'react'

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      {/* Logo Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>

      {/* Title Skeleton */}
      <div className="space-y-3 mb-8 w-full max-w-md">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse w-3/4 mx-auto"></div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4 w-full max-w-2xl">
        <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          جاري التحميل...
        </p>
      </div>
    </div>
  )
}

export function ChatLoadingSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Skeleton */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 animate-pulse"></div>

      {/* Messages Skeleton */}
      <div className="flex-1 overflow-hidden p-4 space-y-4">
        {/* Assistant Message */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
          </div>
        </div>

        {/* User Message */}
        <div className="flex items-start gap-3 justify-end">
          <div className="flex-1 space-y-2 flex flex-col items-end">
            <div className="h-4 bg-blue-300 dark:bg-blue-700 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-blue-300 dark:bg-blue-700 rounded animate-pulse w-2/3"></div>
          </div>
          <div className="w-8 h-8 bg-blue-300 dark:bg-blue-700 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  )
}
