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
  keyboardVisible?: boolean
}

export function ChatInput({
  input = '',
  handleInputChange,
  handleSubmit,
  isLoading = false,
  iraqiCarSuggestions = [],
  onStopGeneration,
  keyboardVisible = false
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
    <Card className={`rounded-none border-0 shadow-lg bg-white dark:bg-gray-900 flex-shrink-0`}>
      <CardContent className={`p-3 pb-3 sm:p-4 ${keyboardVisible ? 'pb-6' : ''}`}>
        <form onSubmit={handleFormSubmit} className="w-full max-w-3xl mx-auto">
          <div className="relative">
            <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
              <div className="flex-1 relative">
                <div className={`absolute right-4 top-4 transform -translate-y-1/2 text-blue-500 dark:text-blue-400 transition-all duration-300 ${inputFocused ? 'opacity-100' : 'opacity-70'}`}>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  placeholder="مثال: تويوتا كورولا 2020..."
                  className={cn(
                    "w-full bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300",
                    "rounded-xl px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-14 pl-12 sm:pl-16 focus:outline-none focus:ring-2 focus:ring-blue-500 border",
                    "transition-all duration-300 text-sm sm:text-base resize-none",
                    inputFocused
                      ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-white dark:bg-gray-800"
                      : "border-gray-200 dark:border-gray-700 shadow-sm"
                  )}
                  disabled={isLoading}
                  minRows={1}
                  maxRows={8}
                  style={{ overflow: 'hidden' }}
                />

                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                  {isLoading ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          onClick={() => onStopGeneration?.()}
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 p-0 rounded-xl transition-all duration-300 text-white shadow-md hover:shadow-lg transform hover:scale-105 h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center"
                        >
                          <Square className="w-3 h-3 sm:w-4 sm:h-4" />
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
                        className={`p-0 rounded-xl transition-all duration-300 text-white shadow-md hover:shadow-lg transform hover:scale-105 h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center ${
                          (input?.trim?.() || '') 
                            ? "bg-blue-600 hover:bg-blue-700" 
                            : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                        }`}
                      >
                        <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>إرسال الاستفسار</p>
                    </TooltipContent>
                  </Tooltip>
                  )}
                </div>

                {/* Auto-suggestions */}
                {showSuggestions && filteredSuggestions && filteredSuggestions.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 mt-2 z-10 border border-blue-100 dark:border-blue-800/50 rounded-xl shadow-xl overflow-hidden">
                    <CardContent className="p-1">
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
            {!keyboardVisible && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-3 text-center font-medium">
              اكتب استفسارك عن زيت السيارة أو اختر من الأسئلة الشائعة أعلاه
            </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 