"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ClientOnly } from "@/components/ui/client-only"
import { Moon, Settings, Sun, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChatHeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  showSettings: boolean
  setShowSettings: (value: boolean) => void
}

export function ChatHeader({
  darkMode,
  setDarkMode,
  showSettings,
  setShowSettings,
}: ChatHeaderProps) {
  return (
    <Card className="rounded-none border-0 shadow-lg dark:shadow-md bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 flex-shrink-0 z-20">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between w-full mx-auto">
          <div className="flex flex-1 items-center space-x-3 space-x-reverse">
            <div className="logo-container flex items-center justify-center mr-1 sm:mr-2">
              <div className="relative flex-shrink-0 h-10 w-16 sm:h-12 sm:w-20 md:h-14 md:w-24 flex items-center justify-center">
                <ClientOnly>
                  <Image
                    src="/logo.png"
                    alt="هندسة السيارات"
                    width={96}
                    height={72}
                    priority
                    className="object-contain max-h-full max-w-full"
                    style={{
                      width: 'auto',
                      height: 'auto'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.onerror = null
                      target.src = "/placeholder-logo.svg"
                    }}
                  />
                </ClientOnly>
              </div>
            </div>
            
            <div className="flex flex-col">
              <Badge
                variant="secondary"
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] sm:text-xs font-semibold mb-1.5 px-2.5 py-1"
              >
                <span className="inline-block ml-1.5">🇮🇶</span> مخصص للعراق
              </Badge>
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">مقاوم للحرارة العالية</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 space-x-reverse">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-1.5 sm:p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{darkMode ? "الوضع الفاتح" : "الوضع الداكن"}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showSettings ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className={cn(
                    "p-1.5 sm:p-2 rounded-full transition-all duration-200",
                    showSettings 
                      ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-600" 
                      : "border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {showSettings ? (
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showSettings ? "إغلاق الإعدادات" : "عرض الإعدادات والمعلومات"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 