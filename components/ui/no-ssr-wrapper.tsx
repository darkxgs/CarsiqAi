'use client'

import React, { useEffect, useState } from 'react'

export default function NoSSR({ 
  children,
  fallback = null
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  
  // Only render children after component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // If not mounted yet, render fallback or null
  if (!mounted) {
    return fallback ? <>{fallback}</> : null
  }

  // Important: Using key forces a complete re-render which helps avoid hydration mismatches
  return <div key="no-ssr-wrapper">{children}</div>
} 