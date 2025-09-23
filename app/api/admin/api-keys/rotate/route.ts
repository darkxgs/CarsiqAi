import { NextRequest, NextResponse } from 'next/server'
import { rotateToNextKey } from '@/utils/apiKeyRotation'

export async function POST(request: NextRequest) {
  try {
    const newKey = rotateToNextKey()
    
    return NextResponse.json({
      success: true,
      message: 'API key rotated successfully',
      newKey: newKey.substring(0, 20) + '...' // Only show partial key for security
    })
  } catch (error) {
    console.error('Failed to rotate API key:', error)
    return NextResponse.json(
      { error: 'Failed to rotate API key' },
      { status: 500 }
    )
  }
}