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
  AlertCircle
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
  return (
    <div className="h-full p-8 space-y-8">
      <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
          <p className="text-muted-foreground">
            متابعة بيانات وتحليلات استخدام التطبيق
          </p>
        </div>
        <SeedDatabaseButton />
                          </div>
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="corrections">التصحيحات</TabsTrigger>
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
      </Tabs>
    </div>
  )
} 