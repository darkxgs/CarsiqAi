import { NextRequest, NextResponse } from 'next/server'
import { getCurrentApiKey, handleApiError, getRotationStats } from '@/utils/apiKeyRotation'

export async function GET(request: NextRequest) {
  try {
    const currentKey = getCurrentApiKey()
    const stats = getRotationStats()
    
    return NextResponse.json({
      success: true,
      currentKey: currentKey.substring(0, 20) + '...', // Only show partial for security
      stats,
      message: 'API key rotation system is working'
    })
  } catch (error) {
    console.error('API key rotation test failed:', error)
    return NextResponse.json(
      { error: 'API key rotation test failed', details: error },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { simulateError } = await request.json()
    
    if (simulateError) {
      // Simulate an API error to test rotation
      const mockError = {
        status: 429,
        message: 'Rate limit exceeded',
        statusText: 'Too Many Requests'
      }
      
      const rotationOccurred = handleApiError(mockError)
      const newStats = getRotationStats()
      
      return NextResponse.json({
        success: true,
        rotationOccurred,
        newStats,
        message: 'Simulated error and tested rotation'
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'No error simulation requested'
    })
  } catch (error) {
    console.error('API key rotation test failed:', error)
    return NextResponse.json(
      { error: 'API key rotation test failed' },
      { status: 500 }
    )
  }
}