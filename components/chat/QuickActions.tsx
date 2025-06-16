"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, Fuel, Clock, ChevronDown, ChevronUp, Settings, Droplets, Wrench } from "lucide-react"

interface QuickActionsProps {
  onActionSelected: (action: string) => void
  onFaqExpandChange?: (isExpanded: boolean) => void
}

export function QuickActions({ onActionSelected, onFaqExpandChange }: QuickActionsProps) {
  const [showQuickActions, setShowQuickActions] = useState(true)

  const quickActions = {
    "oil-change": {
      title: "تغيير الزيت",
      icon: <RefreshCw className="w-5 h-5" />,
      question: "متى أحتاج لتغيير زيت السيارة في الجو الحار؟",
      content: "الحرارة العالية في العراق تسرع من تدهور حالة زيت المحرك. من المستحسن تغيير الزيت كل 5,000 كم في الصيف، وكل 7,500 كم في الشتاء."
    },
    "filter-info": {
      title: "الفلتر",
      icon: <Wrench className="w-5 h-5" />,
      question: "ما هو رقم فلتر الزيت المناسب؟",
      content: "يختلف رقم فلتر الزيت حسب موديل ونوع السيارة. يمكنك اختيار السيارة من القائمة لمعرفة رقم الفلتر المناسب."
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
    "temperature": {
      title: "العمر الافتراضي",
      icon: <Clock className="w-5 h-5" />,
      question: "ما هو العمر الافتراضي لأجزاء سيارتي؟",
      content: "العمر الافتراضي لأجزاء سيارتك."
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
        <div className="flex items-center justify-center mb-3">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-1/4 mx-2"></div>
          <Button
            variant="ghost"
            onClick={toggleQuickActions}
            className="flex items-center justify-center text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <span className="font-bold text-base">الأسئلة الشائعة</span>
            {showQuickActions ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
          </Button>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-1/4 mx-2"></div>
        </div>

        {showQuickActions && (
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(quickActions).map(([key, data]) => (
              <div key={key} className="relative">
                <Button
                  variant="outline"
                  onClick={() => handleQuickAction(key)}
                  className="h-20 w-full bg-gray-50 dark:bg-[#1c2537] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col justify-center items-center transition-all duration-200 text-xs p-2 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 group"
                >
                  <div className="flex justify-center items-center text-center mb-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {data.icon}
                  </div>
                  <span className="text-center text-xs font-medium break-words leading-tight group-hover:font-semibold transition-all">{data.title}</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 