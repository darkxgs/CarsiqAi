"use client"

import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  Download, 
  FileText, 
  Calendar, 
  Search, 
  Filter, 
  Moon, 
  Sun,
  AlertCircle,
  Key,
  Settings
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { isSupabaseConfigured } from "@/lib/supabase"
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard"
import { SeedDatabaseButton } from "@/components/admin/SeedDatabaseButton"
import { CorrectionsManager } from "@/components/admin/CorrectionsManager"

// Define types for our data
interface CarModel {
  model: string;
  count: number;
  percentage: number;
  trends: string[];
}

interface CarBrand {
  brand: string;
  count: number;
  percentage: number;
  trends: string[];
}

interface QueryLogEntry {
  date: string;
  query: string;
}

interface MarketInsights {
  topTrends: string[];
  growingSegments: string[];
  consumerPreferences: string[];
}

export default function AdminDashboard() {
  const router = useRouter()

  return (
    <div className="h-full p-8 space-y-8">
      <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            متابعة بيانات وتحليلات استخدام التطبيق
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/api-keys')}
            className="flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            إدارة مفاتيح API
          </Button>
          <SeedDatabaseButton />
        </div>
      </div>
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="corrections">التصحيحات</TabsTrigger>
          <TabsTrigger value="system">النظام</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics">
          <Card className="border bg-card">
            <CardContent className="p-6">
              <AnalyticsDashboard />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="corrections">
          <CorrectionsManager />
        </TabsContent>
        
        <TabsContent value="system">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  إدارة مفاتيح API
                </CardTitle>
                <CardDescription>
                  مراقبة وإدارة دوران مفاتيح OpenRouter API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  نظام دوران تلقائي لمفاتيح API عند نفاد الرصيد أو حدوث أخطاء
                </p>
                <Button 
                  onClick={() => router.push('/admin/api-keys')}
                  className="w-full"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  إدارة المفاتيح
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  حالة النظام
                </CardTitle>
                <CardDescription>
                  مراقبة صحة النظام والخدمات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">قاعدة البيانات</span>
                    <span className="text-sm text-green-600">متصل</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">OpenRouter API</span>
                    <span className="text-sm text-green-600">نشط</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Brave Search</span>
                    <span className="text-sm text-green-600">متاح</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 