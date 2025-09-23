import { NextRequest, NextResponse } from 'next/server'
import { getRotationStats } from '@/utils/apiKeyRotation'

export async function GET(request: NextRequest) {
  try {
    const stats = getRotationStats()
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to get API key stats:', error)
    return NextResponse.json(
      { error: 'Failed to get API key stats' },
      { status: 500 }
    )
  }
}