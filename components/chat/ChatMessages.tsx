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
import { CorrectionForm } from "./CorrectionForm"

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

// دوال استخراج معلومات السيارة من المحادثة
const extractCarMake = (messages: Message[]): string => {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase())
  const allText = userMessages.join(' ')

  const brands = [
    { ar: ['تويوتا', 'toyota'], en: 'Toyota' },
    { ar: ['هيونداي', 'هيوندا', 'hyundai'], en: 'Hyundai' },
    { ar: ['كيا', 'kia'], en: 'Kia' },
    { ar: ['نيسان', 'nissan'], en: 'Nissan' },
    { ar: ['هوندا', 'honda'], en: 'Honda' },
    { ar: ['مرسيدس', 'mercedes', 'بنز'], en: 'Mercedes-Benz' },
    { ar: ['بي ام دبليو', 'bmw', 'بمو'], en: 'BMW' },
    { ar: ['جيب', 'jeep'], en: 'Jeep' },
    { ar: ['شيفروليت', 'chevrolet', 'شفروليه'], en: 'Chevrolet' },
    { ar: ['فورد', 'ford'], en: 'Ford' }
  ]

  for (const brand of brands) {
    for (const name of brand.ar) {
      if (allText.includes(name)) {
        return brand.en
      }
    }
  }

  return ''
}

const extractCarModel = (messages: Message[]): string => {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase())
  const allText = userMessages.join(' ')

  const models = [
    { ar: ['كامري', 'camry'], en: 'Camry' },
    { ar: ['كورولا', 'corolla'], en: 'Corolla' },
    { ar: ['النترا', 'elantra'], en: 'Elantra' },
    { ar: ['سوناتا', 'sonata'], en: 'Sonata' },
    { ar: ['سيراتو', 'cerato'], en: 'Cerato' },
    { ar: ['كومباس', 'compass'], en: 'Compass' },
    { ar: ['شيروكي', 'cherokee'], en: 'Cherokee' },
    { ar: ['رانجلر', 'wrangler'], en: 'Wrangler' }
  ]

  for (const model of models) {
    for (const name of model.ar) {
      if (allText.includes(name)) {
        return model.en
      }
    }
  }

  return ''
}

const extractCarYear = (messages: Message[]): string => {
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content)
  const allText = userMessages.join(' ')

  const yearMatch = allText.match(/20[0-2][0-9]/)
  return yearMatch ? yearMatch[0] : ''
}

// Custom hook for scroll management
const useScrollToBottom = (keyboardVisible: boolean) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback((forceScroll = false) => {
    if (!messagesEndRef.current) return

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    if (forceScroll) {
      if (isMobile) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'auto'
        })
      }
      messagesEndRef.current.scrollIntoView({
        block: 'end',
        inline: 'nearest',
        behavior: 'auto'
      })
    } else {
      messagesEndRef.current.scrollIntoView({
        behavior: keyboardVisible ? 'auto' : 'smooth',
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

    // Normalize content: convert literal \n to actual newlines and clean up whitespace
    let normalizedContent = content
      .replace(/\\n/g, '\n')  // Convert literal \n to newlines
      .replace(/\r\n/g, '\n')  // Normalize Windows line endings
      .replace(/\r/g, '\n')   // Normalize Mac line endings
      .trim()  // Remove leading/trailing whitespace

    // Parse and render HTML tags by converting to React elements
    const parseHtml = (htmlContent: string) => {
      // More robust bold text handling - avoid conflicts with emojis
      let markedContent = htmlContent
        .replace(/<b>(.*?)<\/b>/g, '___BOLD_START___$1___BOLD_END___')
        // Handle markdown bold but be more careful with emoji sequences
        .replace(/(?<!\d️⃣|\d\uFE0F\u20E3|\w)\*\*([^*]+?)\*\*(?!\*)/g, '___BOLD_START___$1___BOLD_END___')

      // Split into paragraphs more reliably
      const paragraphs = markedContent
        .split(/\n\s*\n/)  // Split on double newlines with optional whitespace
        .filter(p => p.trim())  // Remove empty paragraphs

      return paragraphs.map((paragraph, i) => {
        const trimmedParagraph = paragraph.trim()
        const isNumberedEmoji = /^(\d️⃣|\d\uFE0F\u20E3)/.test(trimmedParagraph)
        const isHeading = trimmedParagraph.endsWith(':') && trimmedParagraph.length < MAX_HEADING_LENGTH && !isNumberedEmoji

        // Process paragraph content to restore bold tags
        const processParagraphContent = (text: string) => {
          const parts = text.split(/(___BOLD_START___|___BOLD_END___)/g)
          const result: React.ReactNode[] = []
          let isBold = false
          let currentText = ''

          for (let j = 0; j < parts.length; j++) {
            const part = parts[j]
            
            if (part === '___BOLD_START___') {
              if (currentText) {
                result.push(currentText)
                currentText = ''
              }
              isBold = true
            } else if (part === '___BOLD_END___') {
              if (currentText) {
                result.push(<b key={`bold-${result.length}`}>{currentText}</b>)
                currentText = ''
              }
              isBold = false
            } else if (part) {
              currentText += part
            }
          }

          // Handle any remaining text
          if (currentText) {
            if (isBold) {
              result.push(<b key={`bold-${result.length}`}>{currentText}</b>)
            } else {
              result.push(currentText)
            }
          }

          return result.length > 0 ? result : [text]
        }

        if (isNumberedEmoji) {
          const emoji = trimmedParagraph.match(/^(\d️⃣|\d\uFE0F\u20E3)/)?.[0] || ''
          const text = trimmedParagraph.replace(/^(\d️⃣|\d\uFE0F\u20E3)\s*/, '').trim()
          return (
            <div key={i} className="my-2 flex gap-2 items-start">
              <div className="text-lg flex-shrink-0" aria-hidden="true">{emoji}</div>
              <div className="flex-1">{processParagraphContent(text)}</div>
            </div>
          )
        } else if (isHeading) {
          return (
            <h3 key={i} className="font-bold text-md mt-3 mb-1" role="heading" aria-level={3}>
              {processParagraphContent(trimmedParagraph)}
            </h3>
          )
        } else {
          // Handle single line breaks within paragraphs
          const lines = trimmedParagraph.split('\n').filter(line => line.trim())
          if (lines.length > 1) {
            return (
              <div key={i} className="my-1.5">
                {lines.map((line, lineIndex) => {
                  const hasEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(line)
                  return (
                    <p key={lineIndex} className={`text-sm ${hasEmoji ? 'emoji-content' : ''} ${lineIndex > 0 ? 'mt-1' : ''}`}>
                      {processParagraphContent(line.trim())}
                    </p>
                  )
                })}
              </div>
            )
          } else {
            const hasEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(trimmedParagraph)
            return (
              <p key={i} className={`my-1.5 text-sm ${hasEmoji ? 'emoji-content' : ''}`}>
                {processParagraphContent(trimmedParagraph)}
              </p>
            )
          }
        }
      })
    }

    return parseHtml(normalizedContent)
  }, [content, role])

  if (role === "assistant") {
    return <div className="chat-message-content">{renderedContent}</div>
  }

  return <span className="whitespace-pre-wrap">{content}</span>
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
            className={`${buttonBaseClass} ${message.role === "user" ? userButtonClass : assistantButtonClass
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

// Enhanced loading indicator component with sophisticated animations
const LoadingIndicator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const searchSteps = [
    {
      icon: '🔍',
      text: 'جاري البحث في قاعدة البيانات',
      subtext: 'البحث في المصادر الموثوقة والمعتمدة...',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: '🛢️',
      text: 'تحليل مواصفات الزيت المطلوبة',
      subtext: 'استخراج معلومات السعة واللزوجة والنوع...',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      icon: '📦',
      text: 'البحث عن فلاتر Denckermann',
      subtext: 'العثور على رقم الفلتر المناسب من الكتالوج...',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: '✨',
      text: 'إعداد التوصية النهائية',
      subtext: 'تجهيز أفضل توصية مخصصة لسيارتك...',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  useEffect(() => {
    // Show animation after a brief delay
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % searchSteps.length);
    }, 2500);

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const targetProgress = ((currentStep + 1) / searchSteps.length) * 100;
        const diff = targetProgress - prev;
        return prev + (diff * 0.1); // Smooth interpolation
      });
    }, 50);

    return () => {
      clearTimeout(showTimer);
      clearInterval(stepInterval);
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, [currentStep]);

  if (!isVisible) return null;

  const currentStepData = searchSteps[currentStep];

  return (
    <div className="flex justify-end mt-4 w-full" role="status" aria-live="polite" aria-label="جاري المعالجة">
      <Card className={`w-auto max-w-[90%] border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden loading-card-entrance ${currentStepData.bgColor} border-l-4 border-l-blue-500`}>
        <CardContent className="p-5">
          {/* Header with step indicator */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {currentStep + 1} من {searchSteps.length}
              </div>
              <div className="text-xs text-gray-400">
                🤖 نظام البحث الذكي
              </div>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full loading-connection-indicator"></div>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">متصل</span>
            </div>
          </div>

          {/* Main loading animation */}
          <div className="flex items-center space-x-4 space-x-reverse arabic-loading-container">
            {/* Animated icon with enhanced effects */}
            <div className="text-3xl loading-search-icon flex-shrink-0">
              {currentStepData.icon}
            </div>

            {/* Loading text with enhanced styling */}
            <div className="flex-1 loading-step-transition">
              <div className="text-base font-bold text-gray-800 dark:text-gray-200 arabic-loading-text loading-shimmer-text">
                {currentStepData.text}
                <span className="loading-dots">{dots}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 arabic-loading-text">
                {currentStepData.subtext}
              </div>
            </div>
          </div>

          {/* Enhanced progress bar with gradient */}
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${currentStepData.color} rounded-full transition-all duration-700 ease-out loading-progress-bar shadow-sm`}
              style={{
                width: `${Math.min(progress, 100)}%`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
              }}
            />
          </div>

          {/* Enhanced status indicators */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                🚀 البحث المتقدم متعدد المستويات
              </span>
              <div className="flex space-x-1">
                {searchSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index <= currentStep
                      ? 'bg-blue-500 shadow-sm'
                      : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Search method badges */}
          <div className="mt-3 flex flex-wrap gap-1 justify-center">
            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
              Brave Search
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
              DuckDuckGo
            </Badge>
            <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
              Denckermann DB
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Welcome screen component
const WelcomeScreen = ({ isFaqExpanded }: { isFaqExpanded: boolean }) => {
  const handleGetStarted = useCallback(() => {
    const input = document.querySelector('textarea')
    if (input instanceof HTMLElement) {
      input.focus()
    }
  }, [])

  return (
    <div className={`text-center flex flex-col items-center px-6 max-w-screen-md mx-auto ${isFaqExpanded
      ? 'justify-start overflow-visible pt-6'
      : 'min-h-[65vh] justify-center overflow-hidden py-8'
      }`}>
      <div className={`logo-wrapper flex items-center justify-center w-full ${isFaqExpanded ? 'mb-3 sm:mb-4' : 'mb-6 sm:mb-8'
        }`}>
        <div className={`relative logo-pulse flex-shrink-0 ${isFaqExpanded
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
              style={{ position: "relative" }}
            />
          </div>
        </div>
      </div>
      <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl ${isFaqExpanded ? 'mb-1 sm:mb-2' : 'mb-2 sm:mb-3'
        } font-bold text-gray-900 dark:text-white`}>
        خبير زيوت السيارات
      </h1>
      <h2 className={`text-sm sm:text-base md:text-lg lg:text-xl ${isFaqExpanded ? 'mb-4' : 'mb-8'
        } text-[#1a73e8] dark:text-blue-300 font-semibold max-w-2xl leading-relaxed px-4`}>
        نعتمد على توصيات الشركة المصنّعة لاختيار الزيت المناسب لسيارتك
      </h2>
      <div className="w-full flex justify-center mt-6">
        <Button
          className={`inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 hover:from-red-600 hover:via-orange-600 hover:to-red-700 text-white border-0 shadow-lg ${isFaqExpanded ? 'text-base py-4 px-10 min-w-[220px]' : 'text-xl py-5 px-14 min-w-[320px]'
            } font-bold rounded-full relative overflow-hidden group`}
          onClick={handleGetStarted}
        >
          <span className="relative z-10 flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <span>اختر زيت سيارتك الآن</span>
            <span className="text-2xl">🚀</span>
          </span>
        </Button>
      </div>
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
        <div className="space-y-8 px-1 max-w-full">
          {messages.map((message) => (
            <div key={message.id} className="flex w-full">
              <div className={`flex ${message.role === "user" ? "justify-start" : "justify-end"} transform transition-transform duration-300 hover:scale-[1.01] w-full`}>
                {message.role === "user" && (
                  <div className="flex flex-shrink-0 mr-3 items-start mt-1">
                    <Avatar className="border-2 border-blue-200 dark:border-blue-800 shadow-sm h-9 w-9">
                      <AvatarImage src="/user-avatar.svg" alt="المستخدم" className="p-1" />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                        <User className="h-4 w-4" aria-hidden="true" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                <Card
                  className={`w-auto overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 my-2 ${message.role === "user"
                    ? "bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white border-none hover:from-red-600 hover:via-orange-600 hover:to-red-700 hover:scale-[1.02]"
                    : "bg-white dark:bg-gray-800 border-2 border-red-100 dark:border-red-900/30 hover:border-red-200 dark:hover:border-red-800/50 hover:shadow-red-100/20 dark:hover:shadow-red-900/20"
                    } rounded-3xl`}
                  style={{
                    maxWidth: message.role === "user" ? "85%" : "95%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word"
                  }}
                  role="article"
                  aria-label={`رسالة من ${message.role === "user" ? "المستخدم" : "المساعد"}`}
                >
                  <CardContent className={`p-5 sm:p-6 relative group ${message.role === "user" ? "pb-4" : "pb-4"}`}>
                    <MessageActions
                      message={message}
                      copiedMessageId={copiedMessageId}
                      copyToClipboard={copyToClipboard}
                      downloadMessage={downloadMessage}
                      shareMessage={shareMessage}
                    />

                    <div className={`leading-relaxed pr-12 whitespace-normal overflow-hidden overflow-wrap-break-word break-words ${message.role === "user" ? "text-base sm:text-lg font-medium" : "text-sm sm:text-base"
                      }`}>
                      <MessageContent content={message.content} role={message.role} />
                    </div>

                    {message.role === "assistant" && (
                      <div className="mt-3 space-y-3">
                        <div className="flex justify-start">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/40 dark:via-orange-900/40 dark:to-yellow-900/40 text-red-800 dark:text-red-200 text-xs sm:text-sm font-bold shadow-md border border-red-200/50 dark:border-red-700/50"
                          >
                            🤖 مساعد خبير - مخصص للعراق 🇮🇶
                          </Badge>
                        </div>

                        {/* نموذج التصحيح */}
                        <CorrectionForm
                          currentRecommendation={message.content}
                          carMake={extractCarMake(messages)}
                          carModel={extractCarModel(messages)}
                          carYear={extractCarYear(messages)}
                          onSubmit={(data) => {
                            console.log('Correction submitted:', data)
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {message.role === "assistant" && (
                  <div className="flex flex-shrink-0 ml-3 items-start mt-1">
                    <Avatar className="border-2 border-green-200 dark:border-green-800 shadow-sm h-9 w-9">
                      <AvatarImage src="/logo.png" alt="المساعد الذكي" className="p-1" />
                      <AvatarFallback className="bg-green-100 dark:bg-green-900">
                        <div className="h-full w-full flex items-center justify-center text-green-600 dark:text-green-300" aria-hidden="true">
                          🛢️
                        </div>
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ErrorBoundary>
    </div>
  )
}