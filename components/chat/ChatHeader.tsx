"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ClientOnly } from "@/components/ui/client-only"
import { Moon, Settings, Sun, X, MessageSquare, Menu } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ChatHeaderProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  showSettings: boolean
  setShowSettings: (value: boolean) => void
  toggleSidebar?: () => void
}

export function ChatHeader({
  darkMode,
  setDarkMode,
  showSettings,
  setShowSettings,
  toggleSidebar
}: ChatHeaderProps) {
  return (
    <Card className="rounded-none border-0 shadow-lg bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 flex-shrink-0 z-20 border-b-2 border-red-100 dark:border-red-900/30">
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="flex items-center justify-between w-full mx-auto">
          <div className="flex flex-1 items-center space-x-3 space-x-reverse">
            {toggleSidebar && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="mr-1 p-1.5 rounded-full hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-110"
                    aria-label="فتح قائمة المحادثات"
                  >
                    <Menu className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>قائمة المحادثات</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            <div className="logo-container flex items-center justify-center">
              <div className="relative flex-shrink-0 h-8 w-12 sm:h-12 sm:w-20 md:h-16 md:w-24 flex items-center justify-center">
                <ClientOnly>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-200/50 to-orange-200/50 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-all duration-300" />
                  <Image
                    src="/logo.png"
                    alt="هندسة السيارات"
                    width={120}
                    height={90}
                    priority
                      className="object-contain max-h-full max-w-full relative z-10 transition-all duration-300 group-hover:scale-110 drop-shadow-lg scale-75 sm:scale-100"
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
                  </div>
                </ClientOnly>
              </div>
            </div>
            
            <div className="flex flex-col">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/70 dark:via-orange-900/70 dark:to-yellow-900/70 text-red-800 dark:text-red-200 text-[8px] sm:text-[10px] md:text-xs font-bold mb-1 sm:mb-1.5 px-2 sm:px-3 py-1 sm:py-1.5 shadow-md border border-red-200/50 dark:border-red-700/50"
              >
                <span className="inline-block ml-1 sm:ml-1.5">🇮🇶</span> مخصص للعراق
              </Badge>
              <p className="text-[9px] sm:text-[11px] md:text-sm text-gray-700 dark:text-gray-300 flex items-center font-medium">
                <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1 inline-block text-red-500" />
                <span className="hidden sm:inline">المساعد الذكي لاختيار زيت سيارتك</span>
                <span className="sm:hidden">مساعد خبير زيوت السيارات</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 space-x-reverse">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 sm:p-2.5 border-2 border-red-200 dark:border-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 rounded-full shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  {darkMode ? 
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-spin-slow" /> : 
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 animate-pulse" />
                  }
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
                    "p-2 sm:p-2.5 rounded-full transition-all duration-300 shadow-md hover:scale-110 hover:-translate-y-1",
                    showSettings 
                      ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-2 border-red-600 shadow-lg" 
                      : "border-2 border-red-200 dark:border-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20"
                  )}
                >
                  {showSettings ? (
                    <X className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 animate-pulse" />
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