"use client"

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, CheckCircle, Download, Share2, User } from "lucide-react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Message } from "ai/react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  keyboardVisible?: boolean
  isFaqExpanded?: boolean
}

// Constants for better maintainability
const SCROLL_DELAYS = {
  IMMEDIATE: 50,
  SHORT: 100,
  MEDIUM: 150,
  LONG: 300
} as const

const COPY_SUCCESS_DURATION = 2000
const MAX_HEADING_LENGTH = 50

// Custom hook for scroll management
const useScrollToBottom = (keyboardVisible: boolean) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback((forceScroll = false) => {
    if (!messagesEndRef.current) return

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      
      if (forceScroll) {
        if (isMobile) {
        window.scrollTo(0, document.body.scrollHeight)
        }
        messagesEndRef.current.scrollIntoView({ 
          block: 'end', 
          inline: 'nearest' 
      })
      } else {
        messagesEndRef.current.scrollIntoView({ 
          behavior: keyboardVisible || !isMobile ? 'auto' : 'smooth',
          block: 'end'
      })
    }
  }, [keyboardVisible])

  return { messagesEndRef, scrollToBottom }
}

// Custom hook for clipboard operations
const useClipboard = () => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string, messageId?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (messageId) {
        setCopiedMessageId(messageId)
        setTimeout(() => setCopiedMessageId(null), COPY_SUCCESS_DURATION)
      }
    } catch (err) {
      console.error("فشل في نسخ النص:", err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        if (messageId) {
          setCopiedMessageId(messageId)
          setTimeout(() => setCopiedMessageId(null), COPY_SUCCESS_DURATION)
        }
      } catch (fallbackErr) {
        console.error("فشل في النسخ باستخدام الطريقة البديلة:", fallbackErr)
      }
      document.body.removeChild(textArea)
    }
  }, [])

  return { copiedMessageId, copyToClipboard }
}

// Custom hook for file operations
const useFileOperations = (copyToClipboard: (text: string, messageId?: string) => Promise<void>) => {
  const downloadMessage = useCallback((content: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `توصية-زيت-السيارة-${new Date().toLocaleDateString('ar-IQ')}.txt`
      a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    } catch (error) {
      console.error('فشل في تحميل الملف:', error)
  }
  }, [])

  const shareMessage = useCallback(async (content: string) => {
    if (navigator.share && navigator.canShare?.({ text: content })) {
      try {
        await navigator.share({
          title: 'توصية زيت السيارة',
          text: content,
        })
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
        console.error('فشل في مشاركة المحتوى:', error)
          await copyToClipboard(content)
          alert('تم نسخ النص إلى الحافظة')
        }
      }
    } else {
      await copyToClipboard(content)
      alert('تم نسخ النص إلى الحافظة')
    }
  }, [copyToClipboard])

  return { downloadMessage, shareMessage }
}

// Message content renderer component
const MessageContent = ({ content, role }: { content: string; role: string }) => {
  const renderedContent = useMemo(() => {
    if (role !== "assistant") return content

    // First, parse and render HTML tags by converting to React elements
    const parseHtml = (htmlContent: string) => {
      // Replace both <b>text</b> and **text** with temporary markers that won't be split
      let markedContent = htmlContent.replace(/<b>(.*?)<\/b>/g, '___BOLD_START___$1___BOLD_END___');
      // Also handle markdown-style bold with ** (but avoid matching emoji sequences like 1️⃣**)
      markedContent = markedContent.replace(/(?<!\d️⃣|\d\uFE0F\u20E3)\*\*(.*?)\*\*/g, '___BOLD_START___$1___BOLD_END___');
      
      // Process paragraphs and then restore bold tags as React elements
      return markedContent.split('\n\n').map((paragraph, i) => {
        const isNumberedEmoji = /^(\d️⃣|\d\uFE0F\u20E3)/.test(paragraph)
        const isHeading = paragraph.trim().endsWith(':') && paragraph.length < MAX_HEADING_LENGTH
        
        // Process the paragraph content to restore bold tags
        const processParagraphContent = (text: string) => {
          // Split by bold markers
          const parts = text.split(/(___BOLD_START___|___BOLD_END___)/g);
          
          const result: React.ReactNode[] = [];
          let isBold = false;
          let currentText = '';
          
          parts.forEach((part) => {
            if (part === '___BOLD_START___') {
              // End current non-bold text if any
              if (currentText) {
                result.push(currentText);
                currentText = '';
              }
              isBold = true;
            } else if (part === '___BOLD_END___') {
              // End current bold text
              if (currentText) {
                result.push(<b key={`bold-${result.length}`}>{currentText}</b>);
                currentText = '';
              }
              isBold = false;
            } else {
              currentText += part;
              // If we're at the end of parts or the next part is a marker, push the current text
              if (parts.indexOf(part) === parts.length - 1) {
                if (isBold) {
                  result.push(<b key={`bold-${result.length}`}>{currentText}</b>);
                } else {
                  result.push(currentText);
                }
                currentText = '';
              }
            }
          });
          
          return result;
        };
        
        if (isNumberedEmoji) {
          const emoji = paragraph.match(/^(\d️⃣|\d\uFE0F\u20E3)/)?.[0]
          const text = paragraph.replace(/^(\d️⃣|\d\uFE0F\u20E3)/, '').trim()
          return (
            <div key={i} className="my-2 flex gap-2 items-start">
              <div className="text-lg flex-shrink-0" aria-hidden="true">{emoji}</div>
              <div className="flex-1">{processParagraphContent(text)}</div>
            </div>
          )
        } else if (isHeading) {
          return (
            <h3 key={i} className="font-bold text-md mt-3 mb-1" role="heading" aria-level={3}>
              {processParagraphContent(paragraph)}
            </h3>
          )
        } else {
          const hasEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(paragraph)
          return (
            <p key={i} className={`my-1.5 text-sm ${hasEmoji ? 'emoji-content' : ''}`}>
              {processParagraphContent(paragraph)}
            </p>
          )
        }
      })
    }
    
    return parseHtml(content);
  }, [content, role])

  if (role === "assistant") {
    return <div className="chat-message-content">{renderedContent}</div>
  }

  return <span>{content}</span>
}

// Action buttons component
const MessageActions = ({ 
  message, 
  copiedMessageId, 
  copyToClipboard, 
  downloadMessage, 
  shareMessage 
}: {
  message: Message
  copiedMessageId: string | null
  copyToClipboard: (text: string, messageId?: string) => Promise<void>
  downloadMessage: (content: string) => void
  shareMessage: (content: string) => Promise<void>
}) => {
  const buttonBaseClass = "p-1.5 h-8 rounded-md transition-colors"
  const userButtonClass = "text-white hover:bg-blue-500/70 bg-blue-600/40"
  const assistantButtonClass = "text-gray-700 hover:bg-gray-300/70 dark:text-gray-200 dark:hover:bg-gray-600/70 bg-gray-200/40 dark:bg-gray-700/40"

  return (
    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 rounded-lg z-10 bg-white/60 dark:bg-gray-800/60 p-1 shadow-sm backdrop-blur-sm">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(message.content, message.id)}
            className={`${buttonBaseClass} ${
              message.role === "user" ? userButtonClass : assistantButtonClass
            }`}
            aria-label={copiedMessageId === message.id ? "تم النسخ" : "نسخ النص"}
          >
            {copiedMessageId === message.id ? (
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copiedMessageId === message.id ? "تم النسخ!" : "نسخ النص"}</p>
        </TooltipContent>
      </Tooltip>

      {message.role === "assistant" && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => downloadMessage(message.content)}
                className={`${buttonBaseClass} ${assistantButtonClass}`}
                aria-label="تحميل النتيجة"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>تحميل النتيجة</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => shareMessage(message.content)}
                className={`${buttonBaseClass} ${assistantButtonClass}`}
                aria-label="مشاركة النتيجة"
              >
                <Share2 className="w-4 h-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>مشاركة النتيجة</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  )
}

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-end mt-4 w-full" role="status" aria-live="polite" aria-label="جاري المعالجة">
    <Card className="w-auto max-w-[85%] border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" aria-hidden="true"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} aria-hidden="true"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} aria-hidden="true"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-3">
            جاري تحليل سيارتك...
          </span>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Welcome screen component
const WelcomeScreen = ({ isFaqExpanded }: { isFaqExpanded: boolean }) => {
  const handleGetStarted = useCallback(() => {
    const input = document.querySelector('input[type="text"], textarea')
    if (input instanceof HTMLElement) {
      input.focus()
    }
  }, [])

  return (
    <div className={`text-center flex flex-col items-center px-4 max-w-screen-md mx-auto ${
      isFaqExpanded 
        ? 'justify-start overflow-visible' 
        : 'min-h-screen justify-center overflow-hidden'
    }`}>
          <div className={`logo-wrapper flex items-center justify-center w-full ${
            isFaqExpanded ? 'mb-3 sm:mb-4' : 'mb-6 sm:mb-8'
          }`}>
            <div className={`relative logo-pulse flex-shrink-0 ${
              isFaqExpanded
          ? 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32' 
          : 'w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56'
            }`}>
          <div className="absolute inset-0 logo-glow rounded-full" aria-hidden="true"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/logo.png"
              alt="شعار هندسة السيارات - مساعد خبير زيوت السيارات"
                  width={180}
                  height={135}
              className="object-contain p-2 relative z-10 w-auto h-auto"
                  priority
              style={{position: "relative"}}
                />
              </div>
            </div>
          </div>
      <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl ${
            isFaqExpanded ? 'mb-1 sm:mb-2' : 'mb-2 sm:mb-3'
      } font-bold text-gray-900 dark:text-white`}>
        مساعد خبير زيوت السيارات
      </h1>
      <h2 className={`text-sm sm:text-base md:text-lg lg:text-xl ${
            isFaqExpanded ? 'mb-3 sm:mb-4' : 'mb-6 sm:mb-8'
          } text-[#1a73e8] dark:text-blue-300 font-semibold max-w-lg`}>
            نعتمد على توصيات الشركة المصنّعة لاختيار الزيت المناسب لسيارتك
          </h2>
          <Button
        className={`inline-flex items-center justify-center gap-2 ${
          isFaqExpanded ? 'text-xs sm:text-sm md:text-base py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8' : 'text-sm sm:text-base md:text-lg py-3 sm:py-4 md:py-6 px-6 sm:px-8 md:px-10'
            } font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-2xl hover:translate-y-[-2px]`}
        onClick={handleGetStarted}
          >
            احصل على استشارتك الان
          </Button>
        </div>
  )
}

export function ChatMessages({ 
  messages, 
  isLoading, 
  keyboardVisible = false, 
  isFaqExpanded = false 
}: ChatMessagesProps) {
  const { messagesEndRef, scrollToBottom } = useScrollToBottom(keyboardVisible)
  const { copiedMessageId, copyToClipboard } = useClipboard()
  const { downloadMessage, shareMessage } = useFileOperations(copyToClipboard)

  // Scroll effects
  useLayoutEffect(() => {
    scrollToBottom(true)
    const timer = setTimeout(() => scrollToBottom(true), SCROLL_DELAYS.SHORT)
    return () => clearTimeout(timer)
  }, [scrollToBottom])

  useEffect(() => {
    scrollToBottom()
    const timer = setTimeout(() => scrollToBottom(true), SCROLL_DELAYS.SHORT)
    return () => clearTimeout(timer)
  }, [messages, isLoading, scrollToBottom])
  
  useEffect(() => {
    if (keyboardVisible) {
      const timers = [
        setTimeout(() => scrollToBottom(true), SCROLL_DELAYS.IMMEDIATE),
        setTimeout(() => scrollToBottom(true), SCROLL_DELAYS.MEDIUM),
        setTimeout(() => scrollToBottom(true), SCROLL_DELAYS.LONG)
      ]
      return () => timers.forEach(clearTimeout)
    }
  }, [keyboardVisible, scrollToBottom])

  return (
    <div 
      className={`flex-1 overflow-y-auto p-4 w-full ${keyboardVisible ? 'pb-16' : ''} h-full`}
      role="log"
      aria-live="polite"
      aria-label="محادثة مساعد زيوت السيارات"
    >
      {messages.length === 0 && (
        <WelcomeScreen isFaqExpanded={isFaqExpanded} />
      )}

      <ErrorBoundary>
        <div className="space-y-6 px-1 max-w-full">
          {messages.map((message) => (
            <div key={message.id} className="flex w-full">
              <div className={`flex ${message.role === "user" ? "justify-start" : "justify-end"} transform transition-transform duration-300 hover:scale-[1.01] w-full`}>
                {message.role === "user" && (
                  <div className="flex flex-shrink-0 mr-2 items-center">
                    <Avatar className="border border-gray-200 dark:border-gray-700">
                      <AvatarImage src="/user-avatar.svg" alt="المستخدم" />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <User className="h-5 w-5" aria-hidden="true" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                
                <Card
                  className={`w-auto overflow-hidden shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  } rounded-2xl hover:shadow-xl transition-shadow duration-300 my-1`}
                  style={{ 
                    maxWidth: message.role === "user" ? "85%" : "95%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word"
                  }}
                  role="article"
                  aria-label={`رسالة من ${message.role === "user" ? "المستخدم" : "المساعد"}`}
                >
                  <CardContent className="p-4 relative group">
                    <MessageActions
                      message={message}
                      copiedMessageId={copiedMessageId}
                      copyToClipboard={copyToClipboard}
                      downloadMessage={downloadMessage}
                      shareMessage={shareMessage}
                    />

                    <div className="text-sm leading-relaxed pr-10 whitespace-normal overflow-hidden overflow-wrap-break-word break-words">
                      <MessageContent content={message.content} role={message.role} />
                    </div>

                    {message.role === "assistant" && (
                      <div className="mt-4 flex justify-start">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs shadow-sm"
                        >
                          🤖 مساعد خبير - مخصص للعراق
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {message.role === "assistant" && (
                  <div className="flex flex-shrink-0 ml-2 items-center">
                    <Avatar className="border border-gray-200 dark:border-gray-700">
                      <AvatarImage src="/logo.png" alt="المساعد الذكي" />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                        <div className="h-full w-full flex items-center justify-center text-blue-600 dark:text-blue-300" aria-hidden="true">
                          🛢️
                        </div>
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>
      </ErrorBoundary>

      {isLoading && <LoadingIndicator />}
    </div>
  )
} 