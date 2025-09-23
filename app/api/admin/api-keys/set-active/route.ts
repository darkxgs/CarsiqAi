import { NextRequest, NextResponse } from 'next/server'
import { apiKeyRotation } from '@/utils/apiKeyRotation'

export async function POST(request: NextRequest) {
  try {
    const { index } = await request.json()
    
    if (!index || index < 1 || index > 3) {
      return NextResponse.json(
        { error: 'Invalid key index. Must be 1, 2, or 3.' },
        { status: 400 }
      )
    }
    
    apiKeyRotation.setCurrentIndex(index)
    
    return NextResponse.json({
      success: true,
      message: `API key ${index} set as active`,
      currentIndex: index
    })
  } catch (error) {
    console.error('Failed to set active API key:', error)
    return NextResponse.json(
      { error: 'Failed to set active API key' },
      { status: 500 }
    )
  }
}