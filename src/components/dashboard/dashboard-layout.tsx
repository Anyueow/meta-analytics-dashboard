'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, DollarSign, Users, Target, AlertTriangle } from 'lucide-react'

interface DashboardLayoutProps {
  children?: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meta Ads Dashboard</h1>
                <p className="text-sm text-gray-500">AI-Powered Campaign Analytics & Optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sync Data
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">3.42</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">↗</span>
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">$45,231</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">↗</span>
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversions</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">1,423</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">↗</span>
                +15.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg CPA</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">$31.78</div>
              <p className="text-xs text-red-600 flex items-center mt-1">
                <span className="mr-1">↘</span>
                -5.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Banner */}
        <div className="mb-8">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="flex items-center p-4">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">
                  AI Alert: 3 campaigns showing declining ROAS trends
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Recommended actions available in the AI Insights panel
                </p>
              </div>
              <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
                View Details →
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {children}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Insights Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900">Budget Optimization</h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Increase budget for "Holiday Campaign" by 30% to capture high-intent traffic
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">High</span>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-green-900">Creative Refresh</h4>
                      <p className="text-xs text-green-700 mt-1">
                        Ad creative showing fatigue. CTR dropped 15% - time for new assets
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Med</span>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-yellow-900">Audience Expansion</h4>
                      <p className="text-xs text-yellow-700 mt-1">
                        Test 2% Lookalike audience based on recent high-value conversions
                      </p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Low</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="text-sm font-medium text-gray-900">Export Campaign Data</div>
                  <div className="text-xs text-gray-500">Download last 30 days performance</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="text-sm font-medium text-gray-900">Schedule Report</div>
                  <div className="text-xs text-gray-500">Set up automated weekly reports</div>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="text-sm font-medium text-gray-900">Campaign Settings</div>
                  <div className="text-xs text-gray-500">Manage campaigns and budgets</div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout