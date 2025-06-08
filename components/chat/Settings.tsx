"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Wrench, Thermometer, AlertTriangle, Droplet, Info, X } from "lucide-react"

interface SettingsProps {
  showSettings: boolean
  onClose?: () => void
  darkMode?: boolean
}

export function Settings({ showSettings, onClose, darkMode = true }: SettingsProps) {
  const [mounted, setMounted] = useState(false)
  
  // Control mount/unmount with animation
  useEffect(() => {
    if (showSettings) {
      setMounted(true)
    } else {
      const timer = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [showSettings])
  
  if (!mounted) return null

  return (
    <div 
      className={`fixed inset-0 z-50 ${darkMode ? 'bg-[#1a1f2c]/95' : 'bg-gray-100/95'} backdrop-blur-sm overflow-y-auto overscroll-contain 
        transition-all duration-300 ease-in-out
        ${showSettings ? "opacity-100" : "opacity-0 pointer-events-none"}
        flex flex-col items-center pt-4 pb-16 px-3 md:p-6`}
      style={{ 
        height: 'calc(var(--vh, 1vh) * 100)',
        overscrollBehavior: 'contain' 
      }}
    >
      <div className="w-full max-w-5xl mx-auto relative">
        {/* Close button - more visible on mobile */}
        <Button
          onClick={onClose}
          className={`absolute left-1 top-1 md:left-4 md:top-4 z-10 p-1.5 h-8 w-8 rounded-full ${
            darkMode ? 'bg-gray-800/80 hover:bg-gray-700' : 'bg-gray-200/80 hover:bg-gray-300'
          } text-foreground`}
          size="icon"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header */}
        <div className="flex items-center justify-center mb-4 md:mb-6 mt-6 md:mt-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-500 dark:text-blue-400 text-center">
            التوكيلات المعتمدة والسيارات الشائعة في العراق
          </h2>
          <Info className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-500 dark:text-blue-400" />
        </div>
        <p className={`text-center mb-6 text-xs md:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          مخصص لظروف الحرارة العالية وظروف العراق الخاصة
        </p>

        {/* Responsive Grid - 1 column on mobile, 3 on tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Iraq Conditions */}
          <Card className={`${darkMode ? 'bg-transparent' : 'bg-white'} border ${darkMode ? 'border-red-800/50 hover:border-red-700/70' : 'border-red-300/70 hover:border-red-400'} rounded-xl overflow-hidden transition-all duration-200 shadow-lg`}>
            <div className={`${darkMode ? 'bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-800/50' : 'bg-gradient-to-r from-red-200/60 to-red-300/50 border-red-300/50'} p-3 border-b flex items-center`}>
              <AlertTriangle className={`w-5 h-5 ml-2 flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              <h3 className={`text-base md:text-lg font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>ظروف العراق الخاصة:</h3>
            </div>
            <CardContent className="p-3 md:p-4">
              <div className="space-y-2 md:space-y-3">
                <div className={`flex items-center rounded-lg border ${darkMode ? 'border-red-800/40 bg-red-900/20' : 'border-red-300/50 bg-red-100/30'} p-2 md:p-3`}>
                  <Thermometer className={`ml-2 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <span className={`text-sm md:text-base ${darkMode ? 'text-red-100' : 'text-red-600'}`}>حرارة تصل إلى 50°م</span>
                </div>
                
                <div className={`flex items-center rounded-lg border ${darkMode ? 'border-red-800/40 bg-red-900/20' : 'border-red-300/50 bg-red-100/30'} p-2 md:p-3`}>
                  <Droplet className={`ml-2 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <span className={`text-sm md:text-base ${darkMode ? 'text-red-100' : 'text-red-600'}`}>غبار وأتربة كثيفة</span>
                </div>

                <div className={`flex items-center rounded-lg border ${darkMode ? 'border-red-800/40 bg-red-900/20' : 'border-red-300/50 bg-red-100/30'} p-2 md:p-3`}>
                  <AlertTriangle className={`ml-2 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <span className={`text-sm md:text-base ${darkMode ? 'text-red-100' : 'text-red-600'}`}>وقود متغير الجودة</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Cars */}
          <Card className={`${darkMode ? 'bg-transparent' : 'bg-white'} border ${darkMode ? 'border-blue-800/50 hover:border-blue-700/70' : 'border-blue-300/70 hover:border-blue-400'} rounded-xl overflow-hidden transition-all duration-200 shadow-lg`}>
            <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-800/50' : 'bg-gradient-to-r from-blue-200/60 to-blue-300/50 border-blue-300/50'} p-3 border-b flex items-center`}>
              <Car className={`w-5 h-5 ml-2 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <h3 className={`text-base md:text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>السيارات الشائعة في العراق:</h3>
            </div>
            <CardContent className="p-3 md:p-4">
              <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Toyota تويوتا",
                  "Hyundai هيونداي",
                  "Kia كيا",
                  "Nissan نيسان",
                  "Honda هوندا",
                  "Chevrolet شيفروليه",
                  "Ford فورد",
                  "Mazda مازدا",
                ].map((brand) => (
                  <div 
                    key={brand}
                    className={`rounded-lg py-1.5 px-2 md:py-2 md:px-4 text-center text-xs md:text-sm transition-colors ${
                      darkMode 
                        ? 'bg-blue-900/20 border border-blue-800/40 text-blue-100 hover:bg-blue-900/30' 
                        : 'bg-blue-100/50 border border-blue-300/50 text-blue-600 hover:bg-blue-100/70'
                    }`}
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Approved Brands */}
          <Card className={`${darkMode ? 'bg-transparent' : 'bg-white'} border ${darkMode ? 'border-green-800/50 hover:border-green-700/70' : 'border-green-300/70 hover:border-green-400'} rounded-xl overflow-hidden transition-all duration-200 shadow-lg sm:col-span-2 lg:col-span-1`}>
            <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-800/50' : 'bg-gradient-to-r from-green-200/60 to-green-300/50 border-green-300/50'} p-3 border-b flex items-center`}>
              <Droplet className={`w-5 h-5 ml-2 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
              <h3 className={`text-base md:text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>التوكيلات المعتمدة:</h3>
            </div>
            <CardContent className="p-3 md:p-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                {["Mobil 1", "Castrol", "Meguin", "Liqui Moly", "Motul", "Valvoline", "Shell"].map(
                  (brand) => (
                    <div 
                      key={brand} 
                      className={`rounded-lg py-1.5 px-2 md:py-2 md:px-3 text-center text-xs md:text-sm transition-colors ${
                        darkMode 
                          ? 'bg-green-900/20 border border-green-800/40 text-green-100 hover:bg-green-900/30' 
                          : 'bg-green-100/50 border border-green-300/50 text-green-600 hover:bg-green-100/70'
                      }`}
                    >
                      {brand}
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Methodology Section */}
        <div className="mt-6">
          <div className="flex items-center justify-center mb-4">
            <Wrench className={`w-4 h-4 md:w-5 md:h-5 ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`text-base md:text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>منهجية العمل المخصصة للعراق:</h3>
          </div>
          
          <div className={`p-3 md:p-4 border rounded-xl transition-colors shadow-lg ${
            darkMode 
              ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800/70' 
              : 'border-gray-300 bg-gray-100/50 hover:bg-gray-200/70'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {[
                "تحليل بيانات السيارة مع مراعاة الحرارة العالية",
                "اختيار زيوت مقاومة للحرارة والغبار",
                "توصيات خاصة لتوفير الوقود",
                "فترات تغيير مناسبة للظروف المحلية",
                "مراعاة جودة الوقود المحلي",
                "نصائح للصيانة الوقائية",
              ].map((item, index) => (
                <div key={index} className="flex items-center group">
                  <div className={`w-2 h-2 bg-blue-500 rounded-full ml-2 group-hover:bg-blue-400 transition-colors`}></div>
                  <span className={`text-xs md:text-sm ${darkMode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-900'} transition-colors`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 