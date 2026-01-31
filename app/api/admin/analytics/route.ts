import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { CarModel, CarBrand, UserQuery, MarketInsight } from '@/lib/supabase'

// Define types for our response data
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

interface AnalyticsResponse {
  carModels: TrendingModel[];
  brands: TrendingBrand[];
  recentQueries: QueryLogItem[];
  insights: MarketInsights;
  isMockData: boolean;
  error?: string;
}

// Helper function to calculate date based on time range
function calculateStartDate(timeRange: string): Date {
  const now = new Date();
  const start = new Date(now);
  
  switch(timeRange) {
    case '7days':
      start.setDate(now.getDate() - 7);
      break;
    case '30days':
      start.setDate(now.getDate() - 30);
      break;
    case '90days':
      start.setDate(now.getDate() - 90);
      break;
    case 'alltime':
      start.setDate(now.getDate() - 365 * 10); // 10 years back for "all time"
      break;
    default:
      start.setDate(now.getDate() - 30); // Default to 30 days
  }
  
  return start;
}

// Helper function to format query date for display
function formatQueryDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `منذ ${diffMinutes} دقيقة`;
    }
    return `منذ ${diffHours} ساعة`;
  } else if (diffDays === 1) {
    return 'الأمس';
  } else if (diffDays < 7) {
    return `منذ ${diffDays} أيام`;
  } else {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

// Generate fake data for testing when Supabase is not configured
function generateMockData(timeRange: string, selectedBrand: string | null = null): AnalyticsResponse {
  // Mock car models with query counts
  const mockCarModels: TrendingModel[] = [
    { model: 'تويوتا كامري 2024', count: 285, percentage: 28.5, trends: ['استهلاك الوقود', 'السعر', 'قطع الغيار'], brand: 'تويوتا' },
    { model: 'تويوتا كورولا 2024', count: 265, percentage: 26.5, trends: ['الاقتصاد', 'الموثوقية'], brand: 'تويوتا' },
    { model: 'هيونداي توسان 2024', count: 245, percentage: 24.5, trends: ['التصميم', 'التقنيات'], brand: 'هيونداي' },
    { model: 'كيا K8 2024', count: 220, percentage: 22, trends: ['الفخامة', 'التكنولوجيا'], brand: 'كيا' },
    { model: 'نيسان التيما 2024', count: 198, percentage: 19.8, trends: ['السعر', 'الراحة'], brand: 'نيسان' }
  ];
  
  // Filter models by brand if specified
  const filteredModels = selectedBrand 
    ? mockCarModels.filter(model => model.brand?.toLowerCase() === selectedBrand.toLowerCase())
    : mockCarModels;
    
  // Mock brand analytics
  const mockBrands: TrendingBrand[] = [
    { brand: 'تويوتا', count: 550, percentage: 36.7, trends: ['استهلاك الوقود', 'الموثوقية', 'قطع الغيار'] },
    { brand: 'هيونداي', count: 430, percentage: 28.7, trends: ['التصميم', 'التقنيات', 'الضمان'] },
    { brand: 'كيا', count: 400, percentage: 26.7, trends: ['الفخامة', 'التكنولوجيا', 'السعر'] },
    { brand: 'نيسان', count: 380, percentage: 25.3, trends: ['السعر', 'الراحة', 'استهلاك الوقود'] }
  ];
  
  // Generate fake dates based on time range
  const now = new Date();
  const startDate = calculateStartDate(timeRange);
  
  // Mock recent user queries
  const mockQueries: QueryLogItem[] = [
    { query: 'ما هو سعر تويوتا كامري 2024؟', date: 'منذ 5 دقائق' },
    { query: 'مقارنة بين هيونداي توسان وكيا سبورتاج', date: 'منذ 1 ساعة' },
    { query: 'استهلاك الوقود في كيا K8 الجديدة', date: 'منذ 3 ساعات' },
    { query: 'عيوب نيسان التيما 2024', date: 'منذ 5 ساعات' },
    { query: 'مواصفات تويوتا كورولا 2024', date: 'الأمس' },
    { query: 'تجربة قيادة هيونداي توسان الجديدة', date: 'منذ 2 يوم' },
    { query: 'أسعار قطع غيار تويوتا كامري', date: 'منذ 3 أيام' },
    { query: 'مقارنة بين كيا K8 ونيسان التيما', date: 'منذ 5 أيام' }
  ];
  
  // Filter queries by brand if specified
  const filteredQueries = selectedBrand
    ? mockQueries.filter(q => q.query.toLowerCase().includes(selectedBrand.toLowerCase()))
    : mockQueries;
    
  // Mock market insights
  const mockInsights: MarketInsights = {
    topTrends: [
      'زيادة الإقبال على السيارات الكهربائية',
      'ارتفاع أهمية أنظمة السلامة المتقدمة',
      'الاهتمام بالاقتصاد في استهلاك الوقود',
      'تفضيل السيارات ذات التقنيات الحديثة'
    ],
    growingSegments: [
      'SUV متوسطة الحجم',
      'السيارات الكهربائية',
      'السيارات الهجينة',
      'سيارات الكروس أوفر المدمجة'
    ],
    consumerPreferences: [
      'الاقتصاد في استهلاك الوقود',
      'التقنيات والاتصال',
      'السلامة المتقدمة',
      'سهولة الصيانة'
    ]
  };
  
  return {
    carModels: filteredModels,
    brands: mockBrands,
    recentQueries: filteredQueries,
    insights: mockInsights,
    isMockData: true
  };
}

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30days';
    const selectedBrand = searchParams.get('brand');
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, returning mock data');
      return NextResponse.json(
        generateMockData(timeRange, selectedBrand),
        { status: 200 }
      );
    }
    
    // Initialize response data
    let responseData: AnalyticsResponse = {
      carModels: [],
      brands: [],
      recentQueries: [],
      insights: {
        topTrends: [],
        growingSegments: [],
        consumerPreferences: []
      },
      isMockData: false
    };
    
    // Calculate start date based on timeRange
    const startDate = calculateStartDate(timeRange);
    const startDateISO = startDate.toISOString();
    
    try {
      // Fetch car models data with real query counts
      let carModelsQuery = supabase
        .from('car_models')
        .select('*')
        .order('queries', { ascending: false })
        .limit(10);
      
      // Apply brand filter if specified  
      if (selectedBrand && selectedBrand !== 'all') {
        carModelsQuery = carModelsQuery.eq('brand', selectedBrand);
      }
      
      const { data: carModelsData, error: carModelsError } = await carModelsQuery;
      
      if (carModelsError) throw carModelsError;
      
      // Format car models data
      if (carModelsData && carModelsData.length > 0) {
        // Calculate total queries to get percentage
        const totalQueries = carModelsData.reduce((sum, model) => sum + (model.queries || 0), 0);
        
        responseData.carModels = carModelsData.map((model) => ({
          model: model.name,
          count: model.queries || 0,
          percentage: totalQueries > 0 ? (model.queries || 0) / totalQueries * 100 : 0,
          trends: model.trends || [],
          brand: model.brand
        }));
      }
      
      // Fetch brand analytics
      const { data: brandsData, error: brandsError } = await supabase
        .from('car_brands')
        .select('*')
        .order('queries', { ascending: false })
        .limit(5);
      
      if (brandsError) throw brandsError;
      
      // Format brands data
      if (brandsData && brandsData.length > 0) {
        const totalBrandQueries = brandsData.reduce((sum, brand) => sum + (brand.queries || 0), 0);
        
        responseData.brands = brandsData.map((brand) => ({
          brand: brand.name,
          count: brand.queries || 0,
          percentage: totalBrandQueries > 0 ? (brand.queries || 0) / totalBrandQueries * 100 : 0,
          trends: brand.trends || []
        }));
      }
      
      // Fetch recent user queries
      let userQueriesQuery = supabase
        .from('user_queries')
        .select('*')
        .gte('timestamp', startDateISO)
        .order('timestamp', { ascending: false })
        .limit(20);
      
      // Apply brand filter if specified
      if (selectedBrand && selectedBrand !== 'all') {
        userQueriesQuery = userQueriesQuery.eq('car_brand', selectedBrand);
      }
      
      const { data: queriesData, error: queriesError } = await userQueriesQuery;
      
      if (queriesError) throw queriesError;
      
      // Format queries data
      if (queriesData && queriesData.length > 0) {
        responseData.recentQueries = queriesData.map((query) => ({
          query: query.query,
          date: formatQueryDate(query.timestamp),
          brand: query.car_brand
        }));
      }
      
      // Fetch market insights
      const { data: insightsData, error: insightsError } = await supabase
        .from('market_insights')
        .select('*')
        .gte('timestamp', startDateISO)
        .order('importance', { ascending: false });
      
      if (insightsError) throw insightsError;
      
      // Group insights by type
      if (insightsData && insightsData.length > 0) {
        const trends = insightsData
          .filter((insight) => insight.type === 'TREND')
          .map((insight) => insight.value);
          
        const segments = insightsData
          .filter((insight) => insight.type === 'SEGMENT')
          .map((insight) => insight.value);
          
        const preferences = insightsData
          .filter((insight) => insight.type === 'PREFERENCE')
          .map((insight) => insight.value);
        
        responseData.insights = {
          topTrends: trends,
          growingSegments: segments,
          consumerPreferences: preferences
        };
      }
      
      // Check if we have real data or need to fall back to mock data
      const hasRealData = 
        responseData.carModels.length > 0 || 
        responseData.brands.length > 0 || 
        responseData.recentQueries.length > 0;
      
      // If we don't have real data, use mock data but mark it as such
      if (!hasRealData) {
        console.log('No real data found in Supabase, returning mock data');
        return NextResponse.json(
          {
            ...generateMockData(timeRange, selectedBrand),
            isMockData: true
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(responseData, { status: 200 });
      
    } catch (supabaseError) {
      console.error('Supabase query error:', supabaseError);
      // Fall back to mock data if there's an error with Supabase, but mark it as mock data
      return NextResponse.json(
        {
          ...generateMockData(timeRange, selectedBrand),
          isMockData: true, 
          error: 'Database query error, showing mock data'
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error in analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error },
      { status: 500 }
    );
  }
} 