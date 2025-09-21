'use client'

import React, { useEffect, useState } from 'react'
import SimplifiedLayout from '@/components/layout/simplified-layout'
import ClickableKPICards from '@/components/dashboard/clickable-kpi-cards'
import ROASChart from '@/components/charts/roas-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
  TrendingUp,
  Target,
  Brain,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Users,
  Calendar,
  RefreshCw
} from 'lucide-react'
import { dataService } from '@/lib/services/data-service'
import { DashboardKPI, ChartDataPoint } from '@/types'

export default function Home() {
  const [kpis, setKpis] = useState<DashboardKPI[]>([])
  const [roasData, setRoasData] = useState<ChartDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [alerts, setAlerts] = useState<any[]>([])
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Loading dashboard data from Meta API...')
      
      // Check if we have environment variables
      if (!process.env.META_ACCESS_TOKEN || !process.env.META_ACCOUNT_ID) {
        console.warn('⚠️ Meta API credentials not configured')
        setKpis([])
        setRoasData([])
        setAlerts([])
        setAiRecommendations([])
        return
      }

      // Load KPIs
      console.log('📊 Fetching KPI data...')
      const kpiData = await dataService.getDashboardKPIs()
      console.log('✅ KPI data loaded:', kpiData)
      
      setKpis([
        {
          label: 'ROAS',
          value: kpiData.roas.value,
          change: kpiData.roas.change,
          changeType: kpiData.roas.changeType,
          format: 'decimal',
          icon: 'trending-up'
        },
        {
          label: 'Total Spend',
          value: kpiData.totalSpend.value,
          change: kpiData.totalSpend.change,
          changeType: kpiData.totalSpend.changeType,
          format: 'currency',
          icon: 'dollar-sign'
        },
        {
          label: 'Conversions',
          value: kpiData.conversions.value,
          change: kpiData.conversions.change,
          changeType: kpiData.conversions.changeType,
          format: 'number',
          icon: 'target'
        },
        {
          label: 'Cost per Purchase',
          value: kpiData.costPerPurchase.value,
          change: kpiData.costPerPurchase.change,
          changeType: kpiData.costPerPurchase.changeType,
          format: 'currency',
          icon: 'shopping-cart'
        }
      ])

      // Load ROAS chart data
      console.log('📈 Fetching ROAS chart data...')
      const chartData = await dataService.getROASChartData(30)
      console.log('✅ ROAS chart data loaded:', chartData.length, 'data points')
      setRoasData(chartData)

      // Load alerts
      console.log('🚨 Fetching performance alerts...')
      const alertData = await dataService.getPerformanceAlerts()
      console.log('✅ Alerts loaded:', alertData.length, 'alerts')
      setAlerts(alertData)

      // Load AI recommendations
      console.log('🤖 Fetching AI recommendations...')
      const recommendations = await dataService.getAIRecommendations({ implemented: false })
      console.log('✅ AI recommendations loaded:', recommendations.length, 'recommendations')
      setAiRecommendations(recommendations)

      setLastUpdated(new Date())
      console.log('✅ Dashboard data loading completed successfully')
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error)
      // Set empty states on error
      setKpis([])
      setRoasData([])
      setAlerts([])
      setAiRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    await loadDashboardData()
  }
  return (
    <SimplifiedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Welcome Header - Mobile Friendly */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor your Meta Ads performance at a glance</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics - Most Important First */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Key Performance Metrics</h2>
            <Link
              href="/calculations"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View calculations</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-24"></div>
              ))}
            </div>
          ) : kpis.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 mb-4">Connect your Meta Ads account to see performance metrics</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Refresh Data
              </button>
            </div>
          ) : (
            <ClickableKPICards kpis={kpis} />
          )}
        </div>

        {/* Quick Status Cards - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Performance Alert */}
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Performance Alert</h3>
                  <p className="text-sm text-gray-600">{alerts.length} campaigns need attention</p>
                </div>
                <Link
                  href="/campaigns"
                  className="text-orange-600 hover:text-orange-800"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">AI Insights</h3>
                  <p className="text-sm text-gray-600">{aiRecommendations.length} optimization opportunities</p>
                </div>
                <Link
                  href="/insights"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Active Campaigns</h3>
                  <p className="text-sm text-gray-600">18 running, 6 paused</p>
                </div>
                <Link
                  href="/campaigns"
                  className="text-green-600 hover:text-green-800"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROAS Trend - Simplified */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">ROAS Performance</h2>
            <Link
              href="/insights"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View detailed analytics</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
          ) : roasData.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ROAS Data</h3>
              <p className="text-gray-600">ROAS performance data will appear here once campaigns are synced</p>
            </div>
          ) : (
            <ROASChart data={roasData} />
          )}
        </div>

        {/* Recent Activity Summary - Mobile Friendly */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Holiday Campaign budget increased</span>
                </div>
                <span className="text-xs text-gray-500">5 min ago</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">AI detected optimization opportunity</span>
                </div>
                <span className="text-xs text-gray-500">12 min ago</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Creative fatigue alert triggered</span>
                </div>
                <span className="text-xs text-gray-500">1 hour ago</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Link
                href="/campaigns"
                className="flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <span>View all campaigns</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SimplifiedLayout>
  )
}