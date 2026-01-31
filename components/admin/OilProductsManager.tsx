"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import { toast } from "sonner"

interface OilProduct {
  id: string
  name: string
  brand: string
  productLine: string
  viscosity: string
  type: string
  apiSpec?: string
  aceaSpec?: string
  otherSpecs: string[]
  capacity?: number
  price?: number
  stock: number
  isActive: boolean
  description?: string
  imageUrl?: string
  compatibleFor: string[]
}

const BRANDS = ['Castrol', 'Liqui Moly', 'Valvoline', 'Meguin']
const OIL_TYPES = ['FULL_SYNTHETIC', 'SEMI_SYNTHETIC', 'MINERAL']
const VISCOSITIES = ['0W-20', '0W-30', '5W-20', '5W-30', '5W-40', '10W-30', '10W-40', '15W-40', '20W-50']
const CAR_TYPES = [
  { value: 'american', label: 'أمريكي' },
  { value: 'european', label: 'أوروبي' },
  { value: 'asian', label: 'آسيوي' }
]

export function OilProductsManager() {
  const [products, setProducts] = useState<OilProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<OilProduct | null>(null)
  const [formData, setFormData] = useState<Partial<OilProduct>>({
    name: '',
    brand: '',
    productLine: '',
    viscosity: '',
    type: 'FULL_SYNTHETIC',
    apiSpec: '',
    aceaSpec: '',
    otherSpecs: [],
    capacity: undefined,
    price: undefined,
    stock: 0,
    isActive: true,
    description: '',
    imageUrl: '',
    compatibleFor: []
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/oil-products')
      const data = await response.json()
      
      console.log('Fetched products:', data)
      
      if (data.success && data.products) {
        // Convert snake_case to camelCase
        const formattedProducts = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          productLine: p.product_line,
          viscosity: p.viscosity,
          type: p.type,
          apiSpec: p.api_spec,
          aceaSpec: p.acea_spec,
          otherSpecs: p.other_specs || [],
          capacity: p.capacity,
          price: p.price,
          stock: p.stock,
          isActive: p.is_active,
          description: p.description,
          imageUrl: p.image_url,
          compatibleFor: p.compatible_for || []
        }))
        setProducts(formattedProducts)
      } else {
        console.error('No products in response:', data)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('فشل تحميل المنتجات')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingProduct 
        ? `/api/oil-products/${editingProduct.id}`
        : '/api/oil-products'
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(editingProduct ? 'تم تحديث المنتج' : 'تم إضافة المنتج')
        setDialogOpen(false)
        resetForm()
        fetchProducts()
      } else {
        toast.error(data.error || 'حدث خطأ')
      }
    } catch (error) {
      toast.error('فشل حفظ المنتج')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      const response = await fetch(`/api/oil-products/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('تم حذف المنتج')
        fetchProducts()
      } else {
        toast.error(data.error || 'فشل حذف المنتج')
      }
    } catch (error) {
      toast.error('فشل حذف المنتج')
    }
  }

  const handleEdit = (product: OilProduct) => {
    setEditingProduct(product)
    setFormData(product)
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      brand: '',
      productLine: '',
      viscosity: '',
      type: 'FULL_SYNTHETIC',
      apiSpec: '',
      aceaSpec: '',
      otherSpecs: [],
      capacity: undefined,
      price: undefined,
      stock: 0,
      isActive: true,
      description: '',
      imageUrl: '',
      compatibleFor: []
    })
  }

  const handleCompatibleForChange = (carType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      compatibleFor: checked
        ? [...(prev.compatibleFor || []), carType]
        : (prev.compatibleFor || []).filter(t => t !== carType)
    }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              إدارة منتجات الزيوت
            </CardTitle>
            <CardDescription>
              إضافة وتعديل منتجات الزيوت المتوفرة في المتجر
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة منتج
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل منتج الزيت
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>العلامة التجارية *</Label>
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => setFormData({ ...formData, brand: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر العلامة" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANDS.map(brand => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>خط الإنتاج *</Label>
                    <Input
                      value={formData.productLine}
                      onChange={(e) => setFormData({ ...formData, productLine: e.target.value })}
                      placeholder="مثال: EDGE, Top Tec"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>اللزوجة *</Label>
                    <Select
                      value={formData.viscosity}
                      onValueChange={(value) => setFormData({ ...formData, viscosity: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر اللزوجة" />
                      </SelectTrigger>
                      <SelectContent>
                        {VISCOSITIES.map(v => (
                          <SelectItem key={v} value={v}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>النوع *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL_SYNTHETIC">Full Synthetic</SelectItem>
                        <SelectItem value="SEMI_SYNTHETIC">Semi Synthetic</SelectItem>
                        <SelectItem value="MINERAL">Mineral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>API Spec</Label>
                    <Input
                      value={formData.apiSpec || ''}
                      onChange={(e) => setFormData({ ...formData, apiSpec: e.target.value })}
                      placeholder="مثال: API SN"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ACEA Spec</Label>
                    <Input
                      value={formData.aceaSpec || ''}
                      onChange={(e) => setFormData({ ...formData, aceaSpec: e.target.value })}
                      placeholder="مثال: ACEA C3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>السعة (لتر)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.capacity || ''}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="4.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>السعر (دينار)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="25000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>الكمية المتوفرة *</Label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>اسم المنتج الكامل *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: Castrol EDGE 0W-20 Full Synthetic"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>متوافق مع السيارات *</Label>
                  <div className="flex gap-4">
                    {CAR_TYPES.map(type => (
                      <div key={type.value} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={type.value}
                          checked={formData.compatibleFor?.includes(type.value)}
                          onCheckedChange={(checked) => handleCompatibleForChange(type.value, checked as boolean)}
                        />
                        <Label htmlFor={type.value} className="cursor-pointer">{type.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">منتج نشط</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'تحديث' : 'إضافة'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد منتجات. ابدأ بإضافة منتج جديد.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead>اللزوجة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>المواصفات</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>المخزون</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 && products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.brand} {product.productLine}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.compatibleFor.map(t => 
                          CAR_TYPES.find(ct => ct.value === t)?.label
                        ).join(', ')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.viscosity}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {product.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {[product.apiSpec, product.aceaSpec].filter(Boolean).join(', ') || '-'}
                  </TableCell>
                  <TableCell>
                    {product.price ? `${product.price} د` : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
