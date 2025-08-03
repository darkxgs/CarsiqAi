"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, FileText, Moon, Search, Sun, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { isSupabaseConfigured } from "@/lib/supabase";

// Define types for our data
interface TrendingModel {
  model: string;
  count: number;
  percentage: number;
  trends?: string[];
  brand?: string;
}

interface TrendingBrand {
  brand: string;
  count: number;
  percentage: number;
  trends?: string[];
}

interface QueryLogItem {
  query: string;
  date: string;
  brand?: string;
}

interface MarketInsights {
  topTrends: string[];
  growingSegments: string[];
  consumerPreferences: string[];
}

export function AnalyticsDashboard() {
  const { theme, setTheme } = useTheme();
  const [timeRange, setTimeRange] = useState<string>("30days");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMockData, setIsMockData] = useState<boolean>(false);
  
  // Data states
  const [trendingModels, setTrendingModels] = useState<TrendingModel[]>([]);
  const [trendingBrands, setTrendingBrands] = useState<TrendingBrand[]>([]);
  const [queryLog, setQueryLog] = useState<QueryLogItem[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsights>({
    topTrends: [],
    growingSegments: [],
    consumerPreferences: [],
  });

  // Filter query log based on search input
  const filteredQueryLog = (queryLog || []).filter(
    (item) => item?.query?.toLowerCase()?.includes(searchQuery?.toLowerCase() || '')
  );

  // Function to handle brand selection
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    fetchAnalyticsData(timeRange, brand);
  };

  // Function to export data as PDF
  const handlePDFExport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("تقرير تحليلات سيارتي", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`الفترة: ${getTimeRangeText(timeRange)}`, 105, 25, { align: "center" });
    
    // Add trending models
    doc.setFontSize(14);
    doc.text("النماذج الأكثر شيوعاً", 200, 40, { align: "right" });
    
    autoTable(doc, {
      startY: 45,
      head: [["النموذج", "عدد الاستفسارات", "النسبة"]],
      body: trendingModels.map(model => [
        model.model, 
        model.count.toString(), 
        `${model.percentage.toFixed(1)}%`
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    // Add trending brands
    const brandsStartY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("الماركات الأكثر شيوعاً", 200, brandsStartY, { align: "right" });
    
    autoTable(doc, {
      startY: brandsStartY + 5,
      head: [["الماركة", "عدد الاستفسارات", "النسبة"]],
      body: trendingBrands.map(brand => [
        brand.brand, 
        brand.count.toString(), 
        `${brand.percentage.toFixed(1)}%`
      ]),
      theme: "grid",
      headStyles: { fillColor: [46, 204, 113] },
    });
    
    // Save the PDF
    doc.save("car-analytics-report.pdf");
  };

  // Function to export data as CSV
  const handleCSVExport = () => {
    // Create CSV content for models
    let csvContent = "Model,Count,Percentage\n";
    trendingModels.forEach(model => {
      csvContent += `${model.model},${model.count},${model.percentage.toFixed(1)}\n`;
    });
    
    csvContent += "\nBrand,Count,Percentage\n";
    trendingBrands.forEach(brand => {
      csvContent += `${brand.brand},${brand.count},${brand.percentage.toFixed(1)}\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "car-analytics-report.csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to display time range text
  const getTimeRangeText = (range: string) => {
    switch (range) {
      case "7days": return "آخر 7 أيام";
      case "30days": return "آخر 30 يوم";
      case "90days": return "آخر 90 يوم";
      case "alltime": return "كل الوقت";
      default: return "آخر 30 يوم";
    }
  };

  // Fetch analytics data
  const fetchAnalyticsData = async (timeRange: string, brand = "all") => {
    setIsLoading(true);
    
    try {
      // Constructed URL with query params
      const url = `/api/admin/analytics?timeRange=${timeRange}${brand !== "all" ? `&brand=${brand}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();
      
      // Check if this is mock data
      setIsMockData(data.isMockData || false);
      
      // Update state with fetched data
      setTrendingModels(data.carModels || []);
      setTrendingBrands(data.brands || []);
      setQueryLog(data.recentQueries || []);
      
      // Update market insights
      setMarketInsights({
        topTrends: data.insights?.topTrends || [],
        growingSegments: data.insights?.growingSegments || [],
        consumerPreferences: data.insights?.consumerPreferences || []
      });
      
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData(timeRange, selectedBrand);
  }, []);

  // Check if Supabase is configured
  const isSupabaseSetup = isSupabaseConfigured();

  return (
    <div className="container mx-auto">
      {(!isSupabaseSetup || isMockData) && (
        <Alert className="mb-6 border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
          <AlertCircle className="h-4 w-4 ml-2" />
          <AlertTitle>تنبيه: بيانات تجريبية</AlertTitle>
          <AlertDescription>
            {!isSupabaseSetup ? (
              <>
                لم يتم تكوين قاعدة بيانات Supabase بشكل صحيح. تعرض لوحة التحكم حالياً بيانات تجريبية. 
                <a href="/setup" className="underline mr-2">انتقل إلى صفحة الإعداد</a>
                لتكوين قاعدة البيانات الحقيقية.
              </>
            ) : (
              <>
                تعرض لوحة التحكم حالياً بيانات تجريبية. استخدم زر تهيئة قاعدة البيانات لإضافة بيانات واقعية للتحليلات.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onValueChange={(value) => {
              setTimeRange(value);
              fetchAnalyticsData(value, selectedBrand);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">آخر 7 أيام</SelectItem>
              <SelectItem value="30days">آخر 30 يوم</SelectItem>
              <SelectItem value="90days">آخر 90 يوم</SelectItem>
              <SelectItem value="alltime">كل الوقت</SelectItem>
            </SelectContent>
          </Select>
            
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCSVExport}>
              <Download className="h-4 w-4 ml-2" />
              تصدير CSV
            </Button>
            <Button variant="outline" onClick={handlePDFExport}>
              <FileText className="h-4 w-4 ml-2" />
              تصدير PDF
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
        
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Market Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>📈 الاتجاهات الرئيسية</CardTitle>
                <CardDescription>أحدث اتجاهات السوق</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {marketInsights.topTrends.map((trend, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>{trend}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 القطاعات النامية</CardTitle>
                <CardDescription>قطاعات السيارات الأسرع نمواً</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {marketInsights.growingSegments.map((segment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>{segment}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>👥 تفضيلات المستهلكين</CardTitle>
                <CardDescription>أهم ما يبحث عنه المستخدمون</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {marketInsights.consumerPreferences.map((pref, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span>{pref}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Existing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Trending Car Models */}
            <Card className="min-h-[450px] flex flex-col">
              <CardHeader>
                <CardTitle>🔍 النماذج الأكثر شيوعاً</CardTitle>
                <CardDescription>موديلات السيارات التي يتم البحث عنها بشكل متكرر</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  {trendingModels.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium cursor-pointer hover:text-blue-600 transition-colors">
                          {item.model}
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            {item.count} استفسار
                          </span>
                          <div 
                            className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                          >
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.trends?.map((trend, tIndex) => (
                          <span key={tIndex} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
                            {trend}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
                
            {/* Top Trending Brands */}
            <Card className="min-h-[450px] flex flex-col">
              <CardHeader>
                <CardTitle>🚗 الماركات الأكثر شيوعاً</CardTitle>
                <CardDescription>ماركات السيارات التي يتم البحث عنها بشكل متكرر</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  {trendingBrands.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span 
                          className="font-medium cursor-pointer hover:text-green-600 transition-colors"
                          onClick={() => handleBrandChange(item.brand)}
                        >
                          {item.brand}
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            {item.count} استفسار
                          </span>
                          <div 
                            className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                          >
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.trends?.map((trend, tIndex) => (
                          <span key={tIndex} className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-full">
                            {trend}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <Button variant="ghost" size="sm" className="w-full text-green-600" onClick={() => setSelectedBrand('all')}>
                  عرض جميع الماركات
                </Button>
              </CardFooter>
            </Card>
                
            {/* Query Log */}
            <Card className="min-h-[450px] flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>🔎 سجل الاستفسارات</CardTitle>
                    <CardDescription>آخر استفسارات المستخدمين</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث في الاستفسارات..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardContent className="flex-grow overflow-auto">
                <div className="space-y-2">
                  {filteredQueryLog.length > 0 ? (
                    filteredQueryLog.map((item, index) => (
                      <div key={index} className="border-b pb-2 border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.date}</p>
                        <p className="text-sm font-medium">{item.query}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد استفسارات مطابقة
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <Button variant="ghost" size="sm" className="w-full text-blue-600">
                  عرض جميع الاستفسارات
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
} 