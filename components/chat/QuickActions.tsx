"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, Fuel, ChevronDown, ChevronUp, Settings, Droplets, Wrench, Wind } from "lucide-react"

interface QuickActionsProps {
  onActionSelected: (action: string) => void
  onFaqExpandChange?: (isExpanded: boolean) => void
}

export function QuickActions({ onActionSelected, onFaqExpandChange }: QuickActionsProps) {
  const [showQuickActions, setShowQuickActions] = useState(false)

  const quickActions = {
    "oil-change": {
      title: "تغيير الزيت",
      icon: <RefreshCw className="w-5 h-5" />,
      question: "متى أحتاج لتغيير زيت السيارة في الجو الحار؟",
      content: "الحرارة العالية في العراق تسرع من تدهور حالة زيت المحرك. من المستحسن تغيير الزيت كل 5,000 كم في الصيف، وكل 7,500 كم في الشتاء."
    },
    "filter-info": {
      title: "فلتر الزيت",
      icon: <Wrench className="w-5 h-5" />,
      question: "ما هو رقم فلتر الزيت المناسب؟",
      content: "يختلف رقم فلتر الزيت حسب موديل ونوع السيارة. يمكنك اختيار السيارة من القائمة لمعرفة رقم الفلتر المناسب."
    },
    "air-filter-info": {
      title: "فلتر الهواء",
      icon: <Wind className="w-5 h-5" />,
      question: "ما هو رقم فلتر الهواء المناسب لسيارتي؟",
      content: "يختلف رقم فلتر الهواء حسب موديل ونوع السيارة. في العراق، ينصح بتغيير فلتر الهواء كل 15,000 كم بسبب الغبار والظروف البيئية."
    },
    "oil-types": {
      title: "أنواع الزيوت",
      icon: <Droplets className="w-5 h-5" />,
      question: "ما أفضل نوع زيت للجو الحار في العراق؟",
      content: "للأجواء الحارة في العراق، يُنصح بزيوت اصطناعية كاملة (Full Synthetic) بلزوجة 5W-30 أو 5W-40 أو 10W-40 حسب توصية الشركة المصنعة."
    },
    "fuel-efficiency": {
      title: "توفير الوقود",
      icon: <Fuel className="w-5 h-5" />,
      question: "كيف أحسن استهلاك الوقود في الجو الحار؟",
      content: "للتوفير في استهلاك الوقود: حافظ على ضغط الإطارات المناسب، استخدم زيت محرك عالي الجودة، وتجنب الوقوف مع تشغيل المحرك لفترات طويلة."
    },
    "maintenance": {
      title: "نصائح الصيانة",
      icon: <Settings className="w-5 h-5" />,
      question: "نصائح صيانة السيارة في الجو الحار",
      content: "تأكد من فحص نظام التبريد بانتظام، استخدم سائل تبريد عالي الجودة، وافحص البطارية حيث أن الحرارة العالية تؤثر عليها بشكل كبير."
    },

  };

  const handleQuickAction = (action: string) => {
    const message = quickActions[action as keyof typeof quickActions]?.question;
    if (message) {
      onActionSelected(message);
    }
  }
  
  const toggleQuickActions = () => {
    const newState = !showQuickActions;
    setShowQuickActions(newState);
    if (onFaqExpandChange) {
      onFaqExpandChange(newState);
    }
  }

  return (
    <div className="mx-auto mb-2 flex-shrink-0">
      <div className="p-2">
        <div className="flex items-center justify-center mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-600 to-transparent w-1/4 mx-3"></div>
          <Button
            variant="ghost"
            onClick={toggleQuickActions}
            className="flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 rounded-xl px-6 py-3 group"
          >
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700">
              الأسئلة الشائعة
            </span>
            <div className="mr-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
              {showQuickActions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </Button>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-600 to-transparent w-1/4 mx-3"></div>
        </div>

        {showQuickActions && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xs sm:max-w-md mx-auto">
            {Object.entries(quickActions).map(([key, data]) => (
              <div key={key} className="relative group">
                <Button
                  variant="outline"
                  onClick={() => handleQuickAction(key)}
                  className="h-16 sm:h-20 w-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 flex flex-col justify-center items-center transition-all duration-300 text-xs p-1.5 sm:p-2 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 group-hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex justify-center items-center text-center mb-0.5 sm:mb-1 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-all duration-300 group-hover:scale-110">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {data.icon}
                    </div>
                  </div>
                  <span className="relative text-center text-[10px] sm:text-xs font-semibold break-words leading-tight group-hover:font-bold transition-all duration-300">{data.title}</span>
                </Button>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 