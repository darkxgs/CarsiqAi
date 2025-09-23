import { NextRequest, NextResponse } from 'next/server'
import { resetFailedAttempts } from '@/utils/apiKeyRotation'

export async function POST(request: NextRequest) {
  try {
    resetFailedAttempts()
    
    return NextResponse.json({
      success: true,
      message: 'Failed attempts counter reset successfully'
    })
  } catch (error) {
    console.error('Failed to reset failures:', error)
    return NextResponse.json(
      { error: 'Failed to reset failures' },
      { status: 500 }
    )
  }
}