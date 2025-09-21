'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CampaignTable from '@/components/dashboard/campaign-table'
import Breadcrumb from '@/components/ui/breadcrumb'
import { dataService } from '@/lib/services/data-service'
import { CampaignData } from '@/types'
import {
  Target,
  Plus,
  Filter,
  Download,
  Calendar,
  Search,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  Zap,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Archive
} from 'lucide-react'

const CampaignsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedObjective, setSelectedObjective] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState('30d')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewType, setViewType] = useState('table') // table, cards, analytics
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [campaignStats, setCampaignStats] = useState({
    total: 0,
    active: 0,
    totalSpend: 0,
    avgROAS: 0
  })

  useEffect(() => {
    loadCampaigns()
  }, [selectedDateRange])

  const loadCampaigns = async () => {
    try {
      setIsLoading(true)
      
      const days = selectedDateRange === '7d' ? 7 : selectedDateRange === '30d' ? 30 : 90
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)

      const campaignData = await dataService.getCampaigns({
        dateRange: { start: startDate, end: endDate }
      })
      
      setCampaigns(campaignData)
      
      // Calculate stats
      const totalSpend = campaignData.reduce((sum, c) => sum + c.spend, 0)
      const totalRevenue = campaignData.reduce((sum, c) => sum + c.conversion_value, 0)
      const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0
      
      setCampaignStats({
        total: campaignData.length,
        active: campaignData.filter(c => c.roas > 2.0).length,
        totalSpend,
        avgROAS
      })
    } catch (error) {
      console.error('Error loading campaigns:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const campaignStatsData = [
    {
      title: 'Total Campaigns',
      value: campaignStats.total.toString(),
      change: '+3',
      changeType: 'increase' as const,
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Active Campaigns',
      value: campaignStats.active.toString(),
      change: '+2',
      changeType: 'increase' as const,
      icon: Play,
      color: 'green'
    },
    {
      title: `Total Spend (${selectedDateRange})`,
      value: `$${campaignStats.totalSpend.toLocaleString()}`,
      change: '+12.3%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Avg ROAS',
      value: campaignStats.avgROAS.toFixed(2),
      change: '+8.7%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'green'
    }
  ]

  const campaignObjectives = [
    { value: 'all', label: 'All Objectives', count: 24 },
    { value: 'conversions', label: 'Conversions', count: 12 },
    { value: 'traffic', label: 'Traffic', count: 6 },
    { value: 'awareness', label: 'Brand Awareness', count: 4 },
    { value: 'engagement', label: 'Engagement', count: 2 }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status', count: 24 },
    { value: 'active', label: 'Active', count: 18 },
    { value: 'paused', label: 'Paused', count: 4 },
    { value: 'ended', label: 'Ended', count: 2 }
  ]

  const performanceOverview = [
    {
      metric: 'Impressions',
      value: '2.1M',
      change: '+15.2%',
      changeType: 'increase',
      icon: Eye
    },
    {
      metric: 'Clicks',
      value: '52.4K',
      change: '+8.9%',
      changeType: 'increase',
      icon: MousePointer
    },
    {
      metric: 'CTR',
      value: '2.49%',
      change: '-0.3%',
      changeType: 'decrease',
      icon: TrendingDown
    },
    {
      metric: 'Conversions',
      value: '1,847',
      change: '+22.1%',
      changeType: 'increase',
      icon: Target
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="py-6">
                    {/* Breadcrumb Navigation */}
                    <div className="mb-4">
                      <Breadcrumb 
                        items={[{ label: 'Campaigns', current: true }]}
                        backHref="/"
                        backLabel="Back to Dashboard"
                      />
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                          <Target className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
                          <p className="text-gray-600">Monitor and optimize your Meta advertising campaigns</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          <Plus className="h-4 w-4" />
                          <span>Create Campaign</span>
                        </button>

                        <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Export Data</span>
                        </button>

                        <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <RefreshCw className="h-4 w-4" />
                          <span className="hidden sm:inline">Sync</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Campaign Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {campaignStatsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200 h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between h-full">
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1 truncate">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mb-3">{stat.value}</p>
                      </div>
                      <div className="flex items-center mt-auto">
                        {stat.changeType === 'increase' ? (
                          <TrendingUp className="h-3 w-3 text-green-600 mr-1 flex-shrink-0" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600 mr-1 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} from last period
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100 flex-shrink-0 ml-4`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Performance Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Performance Overview (Last 30 Days)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {performanceOverview.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{item.metric}</h3>
                    <p className="text-xl font-bold text-gray-900">{item.value}</p>
                    <div className="flex items-center justify-center mt-1">
                      {item.changeType === 'increase' ? (
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={`text-xs ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="mb-6 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
              <div className="flex flex-col lg:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 lg:max-w-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-0"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} ({option.count})
                      </option>
                    ))}
                  </select>

                  {/* Objective Filter */}
                  <select
                    value={selectedObjective}
                    onChange={(e) => setSelectedObjective(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-0"
                  >
                    {campaignObjectives.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label} ({option.count})
                      </option>
                    ))}
                  </select>

                  {/* Date Range */}
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-0"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>

              {/* View Type Toggle */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewType('table')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      viewType === 'table'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewType('cards')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      viewType === 'cards'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewType('analytics')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      viewType === 'analytics'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <Play className="h-4 w-4" />
                <span>Resume Selected</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                <Pause className="h-4 w-4" />
                <span>Pause Selected</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Bulk Edit</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                <Archive className="h-4 w-4" />
                <span>Archive Selected</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                <Zap className="h-4 w-4" />
                <span>Apply AI Recommendations</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Content Based on View Type */}
        {viewType === 'table' && (
          <CampaignTable campaigns={campaigns} />
        )}

        {viewType === 'cards' && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Card View</h3>
                <p className="text-gray-500">Campaign card view would display here</p>
                <p className="text-sm text-gray-400 mt-1">Shows campaigns in a card-based layout</p>
              </div>
            </CardContent>
          </Card>
        )}

        {viewType === 'analytics' && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics View</h3>
                <p className="text-gray-500">Advanced analytics charts would display here</p>
                <p className="text-sm text-gray-400 mt-1">Shows detailed performance analytics and trends</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default CampaignsPage