"use client"

import dynamic from 'next/dynamic'
import { ChatLoadingSkeleton } from '@/components/ui/loading-skeleton'
import { ErrorBoundary } from '@/components/error-boundary'

// Import the chat component with SSR disabled
const ChatPageClient = dynamic(
  () => import('@/components/chat/ChatPage'),
  {
    ssr: false, // Completely disable server-side rendering
    loading: () => <ChatLoadingSkeleton />
  }
)

// This is the chat page route with error boundary
export default function ChatPage() {
  return (
    <ErrorBoundary>
      <ChatPageClient />
    </ErrorBoundary>
  )
} 