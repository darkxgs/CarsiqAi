"use client"

import React from "react"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./card"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="mx-auto my-4 max-w-md border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">حدث خطأ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              نعتذر، حدث خطأ أثناء تحميل هذا المكون. يرجى المحاولة مرة أخرى.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              إعادة المحاولة
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return this.props.children
  }
} 