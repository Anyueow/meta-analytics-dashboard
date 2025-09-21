'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Settings, CheckCircle } from 'lucide-react'

interface EnvCheckProps {
  children: React.ReactNode
}

const EnvCheck: React.FC<EnvCheckProps> = ({ children }) => {
  const [envStatus, setEnvStatus] = React.useState<{
    hasMetaToken: boolean
    hasAccountId: boolean
    hasDatabase: boolean
    hasZaiKey: boolean
  }>({
    hasMetaToken: false,
    hasAccountId: false,
    hasDatabase: false,
    hasZaiKey: false
  })

  React.useEffect(() => {
    // Check environment variables (client-side check)
    setEnvStatus({
      hasMetaToken: !!process.env.NEXT_PUBLIC_META_ACCESS_TOKEN,
      hasAccountId: !!process.env.NEXT_PUBLIC_META_ACCOUNT_ID,
      hasDatabase: !!process.env.NEXT_PUBLIC_DATABASE_URL,
      hasZaiKey: !!process.env.NEXT_PUBLIC_ZAI_API_KEY
    })
  }, [])

  const allConfigured = Object.values(envStatus).every(Boolean)

  if (allConfigured) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <span>Configuration Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Please configure the following environment variables to use the Meta Analytics Dashboard:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              {envStatus.hasMetaToken ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">Meta Access Token</p>
                <p className="text-sm text-gray-500">META_ACCESS_TOKEN</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {envStatus.hasAccountId ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">Meta Account ID</p>
                <p className="text-sm text-gray-500">META_ACCOUNT_ID</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {envStatus.hasDatabase ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">Database URL</p>
                <p className="text-sm text-gray-500">DATABASE_URL</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {envStatus.hasZaiKey ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">Z AI API Key</p>
                <p className="text-sm text-gray-500">ZAI_API_KEY</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Create a <code>.env.local</code> file in your project root</li>
              <li>Add the required environment variables</li>
              <li>Restart the development server</li>
              <li>Run <code>npm run db:push</code> to set up the database</li>
            </ol>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Example .env.local:</h4>
            <pre className="text-xs text-gray-700 overflow-x-auto">
{`META_ACCESS_TOKEN=your_meta_access_token
META_ACCOUNT_ID=your_meta_account_id
DATABASE_URL=postgresql://user:pass@host:port/db
ZAI_API_KEY=your_zai_api_key`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EnvCheck
