"use client"

import { useState, useRef, useEffect, useLayoutEffect } from "react"
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

export function ChatMessages({ messages, isLoading, keyboardVisible = false, isFaqExpanded = false }: ChatMessagesProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll function
  const scrollToBottom = (forceScroll = false) => {
    if (messagesEndRef.current) {
      // Handle desktop differently than mobile
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      
      if (forceScroll) {
        // Force immediate scroll without animation for reliability
        if (isMobile) {
          window.scrollTo(0, document.body.scrollHeight);
        }
        messagesEndRef.current.scrollIntoView({ 
          block: 'end', 
          inline: 'nearest' 
        });
      } else {
        messagesEndRef.current.scrollIntoView({ 
          behavior: keyboardVisible || !isMobile ? 'auto' : 'smooth',
          block: 'end'
        });
      }
    }
  }

  // Use layout effect for immediate DOM measurements and actions
  useLayoutEffect(() => {
    // Immediate scroll on first render
    scrollToBottom(true);
    
    // Schedule another scroll to handle any layout shifts
    const timer = setTimeout(() => scrollToBottom(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll on new messages or loading state change
  useEffect(() => {
    scrollToBottom();
    // Add a backup scroll for reliability
    setTimeout(() => scrollToBottom(true), 100);
  }, [messages, isLoading]);
  
  // Scroll when keyboard visibility changes
  useEffect(() => {
    if (keyboardVisible) {
      // Use multiple timers to ensure scroll happens after all layout changes
      setTimeout(() => scrollToBottom(true), 50);
      setTimeout(() => scrollToBottom(true), 150);
      setTimeout(() => scrollToBottom(true), 300);
    }
  }, [keyboardVisible]);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, messageId?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (messageId) {
        setCopiedMessageId(messageId)
        setTimeout(() => setCopiedMessageId(null), 2000)
      }
    } catch (err) {
      console.error("فشل في نسخ النص:", err)
    }
  }

  // Add download functionality
  const downloadMessage = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `توصية-زيت-السيارة-${new Date().toLocaleDateString('ar-IQ')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Add share functionality
  const shareMessage = async (content: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'توصية زيت السيارة',
          text: content,
        })
      } catch (error) {
        console.error('فشل في مشاركة المحتوى:', error)
      }
    } else {
      copyToClipboard(content)
      alert('تم نسخ النص إلى الحافظة')
    }
  }

  return (
    <div className={`flex-1 overflow-y-auto p-4 w-full ${keyboardVisible ? 'pb-16' : ''} h-full`}>
      {messages.length === 0 && (
        <div className={`text-center flex flex-col items-center px-4 ${
          isFaqExpanded ? 'justify-start' : 'h-full justify-center'
        }`}>
          {/* Improved responsive logo container */}
          <div className={`logo-wrapper flex items-center justify-center w-full ${
            isFaqExpanded ? 'mb-3 sm:mb-4' : 'mb-6 sm:mb-8'
          }`}>
            <div className={`relative logo-pulse flex-shrink-0 ${
              isFaqExpanded
                ? 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40' 
                : 'w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56'
            }`}>
              <div className="absolute inset-0 logo-glow rounded-full"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="هندسة السيارات"
                  width={180}
                  height={135}
                  priority
                  className="object-contain relative z-10 max-w-full max-h-full"
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.onerror = null
                    target.src = "/placeholder-logo.svg"
                  }}
                />
              </div>
            </div>
          </div>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl ${
            isFaqExpanded ? 'mb-1 sm:mb-2' : 'mb-2 sm:mb-3'
          } font-bold text-gray-900 dark:text-white`}>مساعد خبير زيوت السيارات</h1>
          <h2 className={`text-base sm:text-lg md:text-xl ${
            isFaqExpanded ? 'mb-3 sm:mb-4' : 'mb-6 sm:mb-8'
          } text-[#1a73e8] dark:text-blue-300 font-semibold max-w-lg`}>
            نعتمد على توصيات الشركة المصنّعة لاختيار الزيت المناسب لسيارتك
          </h2>
          <Button
            className={`bg-blue-600 hover:bg-blue-700 text-white ${
              isFaqExpanded ? 'text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8' : 'text-base sm:text-lg py-4 sm:py-6 px-8 sm:px-10'
            } font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-2xl hover:translate-y-[-2px]`}
            onClick={() => document.querySelector('input')?.focus()}
          >
            احصل على استشارتك الان
          </Button>
        </div>
      )}

      <ErrorBoundary>
        <div className="space-y-6 px-1 max-w-full">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className="flex w-full"
            >
              {/* This wrapper div controls the positioning and animation */}
              <div className={`flex ${message.role === "user" ? "justify-start" : "justify-end"} transform transition-transform duration-300 hover:scale-[1.01] w-full`}>
                {/* User Avatar - Only show for user messages */}
                {message.role === "user" && (
                  <div className="flex flex-shrink-0 mr-2 items-center">
                    <Avatar className="border border-gray-200 dark:border-gray-700">
                      <AvatarImage src="/user-avatar.svg" />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <User className="h-5 w-5" />
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
                >
                  <CardContent className="p-4 relative group">
                    {/* Action Buttons */}
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 rounded-lg z-10 bg-white/60 dark:bg-gray-800/60 p-1 shadow-sm">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className={`p-1.5 h-8 rounded-md ${
                              message.role === "user"
                                ? "text-white hover:bg-blue-500/70 bg-blue-600/40"
                                : "text-gray-700 hover:bg-gray-300/70 dark:text-gray-200 dark:hover:bg-gray-600/70 bg-gray-200/40 dark:bg-gray-700/40"
                            }`}
                          >
                            {copiedMessageId === message.id ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>نسخ النص</p>
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
                                className="p-1.5 h-8 rounded-md text-gray-700 hover:bg-gray-300/70 dark:text-gray-200 dark:hover:bg-gray-600/70 bg-gray-200/40 dark:bg-gray-700/40"
                              >
                                <Download className="w-4 h-4" />
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
                                className="p-1.5 h-8 rounded-md text-gray-700 hover:bg-gray-300/70 dark:text-gray-200 dark:hover:bg-gray-600/70 bg-gray-200/40 dark:bg-gray-700/40"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>مشاركة النتيجة</p>
                            </TooltipContent>
                          </Tooltip>
                        </>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="text-sm leading-relaxed pr-10 whitespace-normal overflow-hidden overflow-wrap-break-word break-words">
                      {message.role === "assistant" ? (
                        <div className="chat-message-content">
                          {message.content.split('\n\n').map((paragraph, i) => {
                            // Check if paragraph contains numbered emoji list item (like 1️⃣)
                            const isNumberedEmoji = /^(\d️⃣|\d\uFE0F\u20E3)/.test(paragraph);
                            
                            // Check if it's a heading (ends with ":")
                            const isHeading = paragraph.trim().endsWith(':') && paragraph.length < 50;
                            
                            if (isNumberedEmoji) {
                              // Render list items with better formatting
                              return (
                                <div key={i} className="my-2 flex gap-2 items-start">
                                  <div className="text-lg flex-shrink-0">{paragraph.match(/^(\d️⃣|\d\uFE0F\u20E3)/)?.[0]}</div>
                                  <div className="flex-1">{paragraph.replace(/^(\d️⃣|\d\uFE0F\u20E3)/, '').trim()}</div>
                                </div>
                              );
                            } else if (isHeading) {
                              // Render headings with better styling
                              return <p key={i} className="font-bold text-md mt-3 mb-1">{paragraph}</p>;
                            } else {
                              // Check if paragraph contains emoji
                              const hasEmoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(paragraph);
                              
                              if (hasEmoji) {
                                return <p key={i} className="my-1.5 text-sm">{paragraph}</p>;
                              }
                              
                              // Regular paragraph
                              return <p key={i} className="my-1.5 text-sm">{paragraph}</p>;
                            }
                          })}
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>

                    {/* Message Badge */}
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
                
                {/* AI Avatar - Only show for assistant messages */}
                {message.role === "assistant" && (
                  <div className="flex flex-shrink-0 ml-2 items-center">
                    <Avatar className="border border-gray-200 dark:border-gray-700">
                      <AvatarImage src="/logo.png" alt="AI Assistant" />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                        <div className="h-full w-full flex items-center justify-center text-blue-600 dark:text-blue-300">🛢️</div>
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </ErrorBoundary>

      {isLoading && (
        <div className="flex justify-end mt-4 w-full">
          <Card className="w-auto max-w-[85%] border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 mr-3">
                  جاري تحليل سيارتك...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 