"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Key, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface ApiKeyStats {
  currentIndex: number
  totalKeys: number
  lastRotationTime: number
  failedAttempts: { [key: string]: number }
}

export default function ApiKeysPage() {
  const [stats, setStats] = useState<ApiKeyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [rotating, setRotating] = useState(false)

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/api-keys/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load API key stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const rotateKey = async () => {
    setRotating(true)
    try {
      const response = await fetch('/api/admin/api-keys/rotate', {
        method: 'POST'
      })
      if (response.ok) {
        await loadStats()
      }
    } catch (error) {
      console.error('Failed to rotate API key:', error)
    } finally {
      setRotating(false)
    }
  }

  const setActiveKey = async (index: number) => {
    try {
      const response = await fetch('/api/admin/api-keys/set-active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ index })
      })
      if (response.ok) {
        await loadStats()
      }
    } catch (error) {
      console.error('Failed to set active key:', error)
    }
  }

  const resetFailures = async () => {
    try {
      const response = await fetch('/api/admin/api-keys/reset-failures', {
        method: 'POST'
      })
      if (response.ok) {
        await loadStats()
      }
    } catch (error) {
      console.error('Failed to reset failures:', error)
    }
  }

  useEffect(() => {
    loadStats()
    const interval = setInterval(loadStats, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading API key status...</span>
        </div>
      </div>
    )
  }

  const getKeyStatus = (index: number) => {
    if (!stats) return 'unknown'
    
    const keyId = `key_${index}`
    const failures = stats.failedAttempts[keyId] || 0
    
    if (index === stats.currentIndex) {
      return failures > 0 ? 'active-warning' : 'active'
    }
    
    return failures >= 3 ? 'failed' : 'inactive'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
      case 'active-warning':
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />Active (Issues)</Badge>
      case 'failed':
        return <Badge className="bg-red-500"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>
      case 'inactive':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">API Key Management</h1>
        <p className="text-gray-600">Monitor and manage OpenRouter API key rotation</p>
      </div>

      {/* Overview Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Key Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.currentIndex || 'N/A'}</div>
              <div className="text-sm text-gray-500">Current Active Key</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.totalKeys || 0}</div>
              <div className="text-sm text-gray-500">Total Available Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats?.lastRotationTime 
                  ? new Date(stats.lastRotationTime).toLocaleDateString()
                  : 'Never'
                }
              </div>
              <div className="text-sm text-gray-500">Last Rotation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Key Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Individual Key Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((index) => {
              const status = getKeyStatus(index)
              const failures = stats?.failedAttempts[`key_${index}`] || 0
              
              return (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      Key #{index}
                    </div>
                    {getStatusBadge(status)}
                    {failures > 0 && (
                      <span className="text-sm text-red-600">
                        {failures} failed attempts
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {index !== stats?.currentIndex && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveKey(index)}
                      >
                        Set Active
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={rotateKey}
              disabled={rotating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${rotating ? 'animate-spin' : ''}`} />
              {rotating ? 'Rotating...' : 'Rotate to Next Key'}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetFailures}
            >
              Reset All Failures
            </Button>
            
            <Button
              variant="outline"
              onClick={loadStats}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}