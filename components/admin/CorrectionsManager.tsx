"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  AlertTriangle,
  MessageSquare
} from "lucide-react"
import { toast } from "sonner"

interface Correction {
  id: string
  carMake: string
  carModel: string
  carYear?: string
  currentRecommendation: string
  userCorrection: string
  userEmail?: string
  status: 'pending' | 'approved' | 'rejected' | 'implemented'
  adminNotes?: string
  reviewedBy?: string
  reviewedAt?: string
  ipAddress?: string
  createdAt: string
  updatedAt: string
}

export function CorrectionsManager() {
  const [corrections, setCorrections] = useState<Correction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCorrection, setSelectedCorrection] = useState<Correction | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [adminNotes, setAdminNotes] = useState('')

  // دالة لتنسيق النص وتحويل \n إلى أسطر جديدة
  const formatText = (text: string) => {
    if (!text) return ''
    return text.replace(/\\n/g, '\n')
  }

  // دالة لتنسيق النص للعرض في سطر واحد (للجدول)
  const formatTextInline = (text: string) => {
    if (!text) return ''
    return text.replace(/\\n/g, ' ')
  }

  // تحميل التصحيحات
  const loadCorrections = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/corrections?status=${statusFilter}&limit=100`)
      const data = await response.json()

      if (data.success) {
        setCorrections(data.corrections || [])
        if (data.message) {
          toast.info(data.message)
        }
      } else {
        toast.error(data.error || 'فشل في تحميل التصحيحات')
      }
    } catch (error) {
      console.error('Error loading corrections:', error)
      toast.error('حدث خطأ أثناء تحميل التصحيحات')
    } finally {
      setLoading(false)
    }
  }

  // تحديث حالة التصحيح
  const updateCorrectionStatus = async (
    correctionId: string,
    newStatus: string,
    notes?: string
  ) => {
    try {
      const response = await fetch(`/api/corrections/${correctionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes,
          reviewedBy: 'admin', // يمكن تحسين هذا لاحقاً
          reviewedAt: new Date().toISOString()
        }),
      })

      if (response.ok) {
        toast.success('تم تحديث حالة التصحيح بنجاح')
        loadCorrections() // إعادة تحميل القائمة
        setReviewDialogOpen(false)
        setSelectedCorrection(null)
        setAdminNotes('')
      } else {
        toast.error('فشل في تحديث حالة التصحيح')
      }
    } catch (error) {
      console.error('Error updating correction:', error)
      toast.error('حدث خطأ أثناء تحديث التصحيح')
    }
  }

  // فتح نافذة المراجعة
  const openReviewDialog = (correction: Correction) => {
    setSelectedCorrection(correction)
    setAdminNotes(correction.adminNotes || '')
    setReviewDialogOpen(true)
  }

  // تحميل البيانات عند تغيير الفلتر
  useEffect(() => {
    loadCorrections()
  }, [statusFilter])

  // تحميل البيانات عند تحميل المكون
  useEffect(() => {
    loadCorrections()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'بانتظار المراجعة' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'موافق عليه' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'مرفوض' },
      implemented: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'تم التنفيذ' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة التصحيحات</h2>
          <p className="text-gray-600 dark:text-gray-400">
            مراجعة وإدارة تصحيحات المستخدمين
          </p>
        </div>
        <Button onClick={loadCorrections} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* رسالة تحذيرية إذا كان الجدول غير موجود */}
      {corrections.length === 0 && !loading && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">إعداد قاعدة البيانات مطلوب</h3>
                <p className="text-sm text-orange-700 mt-1">
                  يبدو أن جدول التصحيحات غير موجود في Supabase. يرجى إنشاؤه أولاً.
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium text-orange-800">
                    عرض تعليمات الإعداد
                  </summary>
                  <div className="mt-2 p-3 bg-orange-100 rounded text-xs">
                    <p className="mb-2">1. اذهب إلى Supabase Dashboard</p>
                    <p className="mb-2">2. افتح SQL Editor</p>
                    <p className="mb-2">3. نفذ الكود التالي:</p>
                    <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                      {`CREATE TABLE IF NOT EXISTS public.corrections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  car_make TEXT NOT NULL,
  car_model TEXT NOT NULL,
  car_year TEXT,
  current_recommendation TEXT NOT NULL,
  user_correction TEXT NOT NULL,
  user_email TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.corrections FOR ALL USING (true);`}
                    </pre>
                  </div>
                </details>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">بانتظار المراجعة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {corrections.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">موافق عليها</p>
                <p className="text-2xl font-bold text-green-600">
                  {corrections.filter(c => c.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">مرفوضة</p>
                <p className="text-2xl font-bold text-red-600">
                  {corrections.filter(c => c.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">تم التنفيذ</p>
                <p className="text-2xl font-bold text-blue-600">
                  {corrections.filter(c => c.status === 'implemented').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فلتر الحالة */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">فلتر حسب الحالة:</label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">بانتظار المراجعة</SelectItem>
            <SelectItem value="approved">موافق عليها</SelectItem>
            <SelectItem value="rejected">مرفوضة</SelectItem>
            <SelectItem value="implemented">تم التنفيذ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* جدول التصحيحات */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة التصحيحات</CardTitle>
          <CardDescription>
            {corrections.length} تصحيح في الحالة المحددة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              جاري التحميل...
            </div>
          ) : corrections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              لا توجد تصحيحات في هذه الحالة
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>السيارة</TableHead>
                    <TableHead>التصحيح</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {corrections.map((correction) => (
                    <TableRow key={correction.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {correction.carMake} {correction.carModel}
                          </p>
                          {correction.carYear && (
                            <p className="text-sm text-gray-500">{correction.carYear}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm truncate" title={formatText(correction.userCorrection)}>
                            {formatTextInline(correction.userCorrection)}
                          </p>
                          {correction.userEmail && (
                            <p className="text-xs text-gray-500 mt-1">
                              {correction.userEmail}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(correction.status)}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{formatDate(correction.createdAt)}</p>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReviewDialog(correction)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          مراجعة
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نافذة مراجعة التصحيح */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>مراجعة التصحيح</DialogTitle>
            <DialogDescription>
              مراجعة وتحديث حالة التصحيح المرسل من المستخدم
            </DialogDescription>
          </DialogHeader>

          {selectedCorrection && (
            <div className="space-y-6">
              {/* معلومات السيارة */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">نوع السيارة</label>
                  <p className="mt-1 text-sm bg-gray-50 p-2 rounded">
                    {selectedCorrection.carMake}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">الموديل</label>
                  <p className="mt-1 text-sm bg-gray-50 p-2 rounded">
                    {selectedCorrection.carModel}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">السنة</label>
                  <p className="mt-1 text-sm bg-gray-50 p-2 rounded">
                    {selectedCorrection.carYear || 'غير محدد'}
                  </p>
                </div>
              </div>

              {/* التوصية الحالية */}
              <div>
                <label className="text-sm font-medium text-gray-700">التوصية التي ظهرت للمستخدم</label>
                <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">
                    {formatText(selectedCorrection.currentRecommendation)}
                  </p>
                </div>
              </div>

              {/* تصحيح المستخدم */}
              <div>
                <label className="text-sm font-medium text-gray-700">تصحيح المستخدم</label>
                <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">
                    {formatText(selectedCorrection.userCorrection)}
                  </p>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  <p className="mt-1 text-sm bg-gray-50 p-2 rounded">
                    {selectedCorrection.userEmail || 'غير متوفر'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">تاريخ الإرسال</label>
                  <p className="mt-1 text-sm bg-gray-50 p-2 rounded">
                    {formatDate(selectedCorrection.createdAt)}
                  </p>
                </div>
              </div>

              {/* ملاحظات الإدارة */}
              <div>
                <label className="text-sm font-medium text-gray-700">ملاحظات الإدارة</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="اكتب ملاحظاتك حول هذا التصحيح..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* الحالة الحالية */}
              <div>
                <label className="text-sm font-medium text-gray-700">الحالة الحالية</label>
                <div className="mt-1">
                  {getStatusBadge(selectedCorrection.status)}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              إلغاء
            </Button>

            {selectedCorrection?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => updateCorrectionStatus(
                    selectedCorrection.id,
                    'rejected',
                    adminNotes
                  )}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  رفض
                </Button>
                <Button
                  onClick={() => updateCorrectionStatus(
                    selectedCorrection.id,
                    'approved',
                    adminNotes
                  )}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  موافقة
                </Button>
              </>
            )}

            {selectedCorrection?.status === 'approved' && (
              <Button
                onClick={() => updateCorrectionStatus(
                  selectedCorrection.id,
                  'implemented',
                  adminNotes
                )}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                تم التنفيذ
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}