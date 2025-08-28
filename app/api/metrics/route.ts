import { NextResponse } from 'next/server';
import { getApiMetrics, resetApiMetrics } from '@/utils/carQueryApi';

/**
 * API Metrics endpoint
 * 
 * This endpoint provides metrics about the CarQuery API integration
 * for monitoring and debugging purposes.
 */
export async function GET(req: Request) {
  try {
    // Check for authorization
    const url = new URL(req.url);
    const apiKey = url.searchParams.get('api_key');
    
    // Simple API key check - in production, use a more secure method
    if (!apiKey || apiKey !== process.env.METRICS_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Get current metrics
    const metrics = getApiMetrics();
    
    // Calculate derived metrics
    const successRate = metrics.totalRequests > 0 
      ? (metrics.successfulRequests / metrics.totalRequests) * 100 
      : 0;
      
    const cacheHitRate = (metrics.cacheHits + metrics.cacheMisses) > 0 
      ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100 
      : 0;
      
    const avgResponseTime = metrics.successfulRequests > 0 
      ? metrics.totalResponseTime / metrics.successfulRequests 
      : 0;
      
    const normalizationSuccessRate = (metrics.normalizationSuccesses + metrics.normalizationFailures) > 0
      ? (metrics.normalizationSuccesses / (metrics.normalizationSuccesses + metrics.normalizationFailures)) * 100
      : 0;
    
    // Return metrics with derived calculations
    return NextResponse.json({
      raw: metrics,
      derived: {
        successRate: successRate.toFixed(2) + '%',
        cacheHitRate: cacheHitRate.toFixed(2) + '%',
        avgResponseTime: avgResponseTime.toFixed(2) + 'ms',
        normalizationSuccessRate: normalizationSuccessRate.toFixed(2) + '%'
      }
    });
  } catch (error) {
    console.error('Error getting API metrics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
}

/**
 * Reset metrics endpoint
 */
export async function POST(req: Request) {
  try {
    // Check for authorization
    const url = new URL(req.url);
    const apiKey = url.searchParams.get('api_key');
    
    // Simple API key check - in production, use a more secure method
    if (!apiKey || apiKey !== process.env.METRICS_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Reset metrics
    resetApiMetrics();
    
    return NextResponse.json({
      success: true,
      message: 'Metrics reset successfully'
    });
  } catch (error) {
    console.error('Error resetting API metrics:', error);
    return NextResponse.json(
      { error: 'Failed to reset metrics' },
      { status: 500 }
    );
  }
} 