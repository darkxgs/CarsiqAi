"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import { Send, Car, Square, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import TextareaAutosize from "react-textarea-autosize"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  iraqiCarSuggestions: string[]
  onStopGeneration?: () => void
}

export function ChatInput({
  input = '',
  handleInputChange,
  handleSubmit,
  isLoading = false,
  iraqiCarSuggestions = [],
  onStopGeneration
}: ChatInputProps) {
  const [inputFocused, setInputFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredSuggestions = (iraqiCarSuggestions || []).filter((suggestion) => {
    if (!suggestion || typeof suggestion !== 'string') return false;
    const suggestionLower = suggestion.toLowerCase();
    const inputLower = (input || '').toLowerCase();
    return suggestionLower.includes(inputLower);
  })

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange?.({ target: { value: (suggestion || '') + " ماشية " } } as any)
    setShowSuggestions(false)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit?.(e)
    setShowSuggestions(false)
  }
  
  // Handle key press for Shift+Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if ((input?.trim?.() || '') && !isLoading) {
        handleFormSubmit(e)
      }
    }
  }

  return (
    <Card className="rounded-none border-0 shadow-xl bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 flex-shrink-0">
      <CardContent className="p-2 pb-2 sm:p-4 sm:pb-4 md:p-6">
        <form onSubmit={handleFormSubmit} className="w-full max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-center space-x-3 sm:space-x-4 space-x-reverse">
              <div className="flex-1 relative">
                <div className={`absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${inputFocused ? 'text-red-500 dark:text-red-400 opacity-100 scale-110' : 'text-red-400 dark:text-red-500 opacity-70'}`}>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-pulse" />
                </div>
                <TextareaAutosize
                  value={input}
                  onChange={(e) => {
                    handleInputChange?.(e)
                    setShowSuggestions((e?.target?.value?.length || 0) > 0)
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    setInputFocused(true)
                    setShowSuggestions((input?.length || 0) > 0)
                  }}
                  onBlur={() => {
                    setInputFocused(false)
                    setTimeout(() => setShowSuggestions(false), 200)
                  }}
                  placeholder="🚗 مثال: تويوتا كورولا 2020 ماشية 150 ألف كم..."
                  className={cn(
                    "w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                    "rounded-2xl px-3 sm:px-5 md:px-7 py-2.5 sm:py-4 md:py-5 pr-10 sm:pr-14 md:pr-16 pl-10 sm:pl-14 md:pl-18 focus:outline-none border-2",
                    "transition-all duration-300 text-sm sm:text-base md:text-lg resize-none font-medium shadow-lg",
                    "hover:shadow-xl focus:shadow-2xl",
                    inputFocused
                      ? "border-red-500 focus:ring-4 focus:ring-red-500/20 bg-white dark:bg-gray-800 shadow-red-500/10"
                      : "border-red-200 dark:border-red-700/50 shadow-red-100/50 dark:shadow-red-900/10"
                  )}
                  disabled={isLoading}
                  minRows={1}
                  maxRows={6}
                  style={{ overflow: 'hidden' }}
                />

                <div className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                  {isLoading ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          onClick={() => onStopGeneration?.()}
                          size="sm"
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-0 rounded-2xl transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-1 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center border-2 border-red-400"
                        >
                          <Square className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>إيقاف الإجابة</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        disabled={isLoading || !(input?.trim?.() || '')}
                        size="sm"
                        className={`p-0 rounded-2xl transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-110 hover:-translate-y-1 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center border-2 ${
                          (input?.trim?.() || '') 
                            ? "bg-gradient-to-r from-red-500 via-orange-500 to-red-600 hover:from-red-600 hover:via-orange-600 hover:to-red-700 border-red-400 animate-pulse" 
                            : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed border-gray-400"
                        }`}
                      >
                        <Send className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>إرسال الاستفسار 🚀</p>
                    </TooltipContent>
                  </Tooltip>
                  )}
                </div>

                {/* Auto-suggestions */}
                {showSuggestions && filteredSuggestions && filteredSuggestions.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 mt-3 z-10 border-2 border-red-100 dark:border-red-800/50 rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 animate-fade-in">
                    <CardContent className="p-2">
                      <div className="max-h-60 overflow-y-auto">
                        {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                            className="w-full justify-start text-right p-3 sm:p-3.5 text-sm sm:text-base hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg my-0.5"
                          onClick={() => handleSuggestionClick(suggestion || '')}
                        >
                            <Car className="w-3 h-3 sm:w-4 sm:h-4 ml-2 sm:ml-3 text-blue-500 dark:text-blue-400" />
                          {suggestion}
                        </Button>
                      ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-3 text-center font-medium">
              اكتب استفسارك عن زيت السيارة أو اختر من الأسئلة الشائعة أعلاه
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 