"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface CorrectionFormProps {
  carMake?: string
  carModel?: string
  carYear?: string
  currentRecommendation?: string
  onSubmit?: (data: CorrectionData) => void
}

interface CorrectionData {
  carMake: string
  carModel: string
  carYear: string
  currentRecommendation: string
  userCorrection: string
  userEmail?: string
  timestamp: number
}

export function CorrectionForm({ 
  carMake = '', 
  carModel = '', 
  carYear = '',
  currentRecommendation = '',
  onSubmit 
}: CorrectionFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    carMake: carMake,
    carModel: carModel,
    carYear: carYear,
    currentRecommendation: currentRecommendation,
    userCorrection: '',
    userEmail: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.userCorrection.trim()) {
      toast.error('يرجى كتابة التصحيح أو الملاحظة')
      return
    }

    setIsSubmitting(true)

    try {
      const correctionData: CorrectionData = {
        ...formData,
        timestamp: Date.now()
      }

      // إرسال البيانات إلى API
      const response = await fetch('/api/corrections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(correctionData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        toast.success('تم إرسال التصحيح بنجاح! شكراً لمساهمتك في تحسين الخدمة')
        
        // استدعاء callback إذا كان متوفراً
        if (onSubmit) {
          onSubmit(correctionData)
        }

        // إعادة تعيين النموذج بعد 3 ثوانٍ
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            ...formData,
            userCorrection: '',
            userEmail: ''
          })
          setIsOpen(false)
        }, 3000)
      } else {
        throw new Error('فشل في إرسال التصحيح')
      }
    } catch (error) {
      console.error('Error submitting correction:', error)
      toast.error('حدث خطأ أثناء إرسال التصحيح. يرجى المحاولة مرة أخرى')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mt-4 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/20"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          هل التوصية غير صحيحة؟ صححها الآن
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {isSubmitted ? '✅ تم الإرسال بنجاح' : '📝 تصحيح التوصية'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSubmitted 
              ? 'شكراً لك! سيتم مراجعة التصحيح وتحديث قاعدة البيانات قريباً'
              : 'ساعدنا في تحسين دقة التوصيات من خلال تصحيح المعلومات'
            }
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* معلومات السيارة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="carMake">نوع السيارة</Label>
                <Input
                  id="carMake"
                  value={formData.carMake}
                  onChange={(e) => handleInputChange('carMake', e.target.value)}
                  placeholder="مثال: تويوتا"
                  required
                />
              </div>
              <div>
                <Label htmlFor="carModel">الموديل</Label>
                <Input
                  id="carModel"
                  value={formData.carModel}
                  onChange={(e) => handleInputChange('carModel', e.target.value)}
                  placeholder="مثال: كامري"
                  required
                />
              </div>
              <div>
                <Label htmlFor="carYear">السنة</Label>
                <Input
                  id="carYear"
                  value={formData.carYear}
                  onChange={(e) => handleInputChange('carYear', e.target.value)}
                  placeholder="مثال: 2020"
                />
              </div>
            </div>

            {/* التوصية الحالية */}
            <div>
              <Label htmlFor="currentRecommendation">التوصية التي ظهرت</Label>
              <Textarea
                id="currentRecommendation"
                value={formData.currentRecommendation}
                onChange={(e) => handleInputChange('currentRecommendation', e.target.value)}
                placeholder="انسخ التوصية التي ظهرت لك هنا..."
                rows={3}
                required
              />
            </div>

            {/* التصحيح */}
            <div>
              <Label htmlFor="userCorrection">التصحيح أو الملاحظة *</Label>
              <Textarea
                id="userCorrection"
                value={formData.userCorrection}
                onChange={(e) => handleInputChange('userCorrection', e.target.value)}
                placeholder="اكتب التصحيح الصحيح أو ملاحظتك هنا... مثال: نوع الزيت الصحيح هو 5W-30 وليس 0W-20"
                rows={4}
                required
              />
            </div>

            {/* البريد الإلكتروني (اختياري) */}
            <div>
              <Label htmlFor="userEmail">البريد الإلكتروني (اختياري)</Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => handleInputChange('userEmail', e.target.value)}
                placeholder="للتواصل معك في حالة الحاجة لتوضيحات إضافية"
              />
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    إرسال التصحيح
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
              تم إرسال التصحيح بنجاح!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              سيتم مراجعة التصحيح من قبل فريقنا وتحديث قاعدة البيانات قريباً
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}