"use client"

import dynamic from 'next/dynamic'

// Import the actual chat component with SSR disabled
const ChatPageClient = dynamic(
  () => import('@/components/chat/ChatPage'),
  {
    ssr: false, // Completely disable server-side rendering
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-4">🛢️</div>
          <p className="text-gray-600">جاري تحميل مساعد زيوت السيارات...</p>
        </div>
      </div>
    )
  }
)

// This is now a client component that uses dynamic import
export default function Page() {
  return <ChatPageClient />
}
