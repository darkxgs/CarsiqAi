"use client"

import { useState, useEffect } from "react"
import { Send, Car, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  iraqiCarSuggestions: string[]
  onStopGeneration?: () => void
  keyboardVisible?: boolean
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  iraqiCarSuggestions,
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

  const filteredSuggestions = iraqiCarSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(input.toLowerCase()),
  )

  const handleSuggestionClick = (suggestion: string) => {
    handleInputChange({ target: { value: suggestion + " ماشية " } } as any)
    setShowSuggestions(false)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("Submitting form with input:", input)
    handleSubmit(e)
    setShowSuggestions(false)
  }

  return (
    <Card className={`rounded-none border-0 shadow-lg bg-gradient-to-t from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 flex-shrink-0`}>
      <CardContent className={`p-2 pb-2 sm:p-4 md:p-6 ${keyboardVisible ? 'pb-6' : ''}`}>
        <form onSubmit={handleFormSubmit} className="w-full mx-auto">
          <div className="relative">
            <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
              <div className="flex-1 relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  value={input}
                  onChange={(e) => {
                    handleInputChange(e)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => {
                    setInputFocused(true)
                    setShowSuggestions(input.length > 0)
                  }}
                  onBlur={() => {
                    setInputFocused(false)
                    setTimeout(() => setShowSuggestions(false), 200)
                  }}
                  placeholder="مثال: تويوتا كورولا 2020..."
                  className={`w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 rounded-full px-4 sm:px-6 py-2 sm:py-5 pr-10 sm:pr-14 pl-12 sm:pl-16 focus:outline-none focus:ring-2 focus:ring-blue-500 border transition-all duration-200 text-xs sm:text-base shadow-inner ${
                    inputFocused
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  disabled={isLoading}
                />

                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {isLoading ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          onClick={onStopGeneration}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 p-1.5 sm:p-2 rounded-full transition-colors text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform h-7 w-7 sm:h-9 sm:w-9"
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
                        disabled={isLoading || !input.trim()}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-500 disabled:cursor-not-allowed disabled:border disabled:border-gray-300 dark:disabled:border-gray-600 p-1.5 sm:p-2 rounded-full transition-colors text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform h-7 w-7 sm:h-9 sm:w-9"
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
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 mt-1 sm:mt-2 z-10 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                    <CardContent className="p-2">
                      {filteredSuggestions.slice(0, 3).map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-right p-2 sm:p-3 text-xs sm:text-base hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <Car className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                          {suggestion}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            {!keyboardVisible && (
              <p className="text-[11px] sm:text-sm text-gray-800 dark:text-gray-200 mt-1 sm:mt-3 text-center font-medium bg-gray-50 dark:bg-gray-800/50 py-1 sm:py-1.5 px-4 rounded-full mx-auto inline-block">
              اكتب استفسارك عن زيت السيارة أو اختر من الأسئلة الشائعة أعلاه
            </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 