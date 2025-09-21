'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AIInsights from '@/components/dashboard/ai-insights'
import Breadcrumb from '@/components/ui/breadcrumb'
import { dataService } from '@/lib/services/data-service'
import { AIRecommendation } from '@/types'
import {
  Brain,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

const InsightsPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecommendations()
  }, [selectedTimeRange, selectedPriority])

  const loadRecommendations = async () => {
    try {
      setIsLoading(true)
      const recs = await dataService.getAIRecommendations({
        priority: selectedPriority === 'all' ? undefined : selectedPriority,
        implemented: false
      })
      setRecommendations(recs)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const performanceMetrics = [
    {
      title: 'AI Recommendations Generated',
      value: '247',
      change: '+23%',
      changeType: 'increase',
      icon: Brain,
      color: 'blue'
    },
    {
      title: 'Recommendations Implemented',
      value: '189',
      change: '+18%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Avg Confidence Score',
      value: '87%',
      change: '+5%',
      changeType: 'increase',
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Estimated Revenue Impact',
      value: '$12,450',
      change: '+31%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green'
    }
  ]

  const insightCategories = [
    {
      name: 'Budget Optimization',
      count: 15,
      avgImpact: '+$2,340',
      color: 'blue',
      icon: DollarSign
    },
    {
      name: 'Creative Performance',
      count: 23,
      avgImpact: '+12% CTR',
      color: 'purple',
      icon: Zap
    },
    {
      name: 'Audience Targeting',
      count: 18,
      avgImpact: '+8% Conv Rate',
      color: 'green',
      icon: Target
    },
    {
      name: 'Bidding Strategy',
      count: 11,
      avgImpact: '-15% CPA',
      color: 'orange',
      icon: TrendingUp
    }
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadRecommendations()
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Breadcrumb Navigation */}
            <div className="mb-4">
              <Breadcrumb 
                items={[{ label: 'AI Insights', current: true }]}
                backHref="/"
                backLabel="Back to Dashboard"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Insights & Recommendations</h1>
                  <p className="text-gray-600">Advanced analytics and optimization suggestions powered by AI</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Time Range Selector */}
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                {/* Action Buttons */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">{metric.change} from last period</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                      <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Insight Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {insightCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg bg-${category.color}-100`}>
                      <Icon className={`h-5 w-5 text-${category.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count} recommendations</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Avg Impact</p>
                    <p className="text-lg font-bold text-green-600">{category.avgImpact}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Analytics Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recommendation Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Recommendation Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Recommendation trends chart would display here</p>
                  <p className="text-sm text-gray-400">Shows AI recommendation volume over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                <span>Impact Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Impact distribution chart would display here</p>
                  <p className="text-sm text-gray-400">Shows breakdown of recommendation impacts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Active Alerts & Urgent Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Critical Issues</span>
                </div>
                <p className="text-2xl font-bold text-red-700">3</p>
                <p className="text-xs text-red-600">Requiring immediate attention</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Pending Actions</span>
                </div>
                <p className="text-2xl font-bold text-yellow-700">12</p>
                <p className="text-xs text-yellow-600">Awaiting implementation</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Completed Today</span>
                </div>
                <p className="text-2xl font-bold text-green-700">8</p>
                <p className="text-xs text-green-600">Successfully implemented</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main AI Insights Component */}
        <AIInsights recommendations={recommendations} />
      </div>
    </div>
  )
}

export default InsightsPage