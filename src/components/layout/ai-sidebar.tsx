'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Target,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react'

interface AISidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const AISidebar: React.FC<AISidebarProps> = ({ isCollapsed, onToggle }) => {
  const quickInsights = [
    {
      type: 'opportunity',
      title: 'Budget Optimization',
      description: 'Increase Holiday Campaign budget by 30%',
      impact: '+$960 revenue',
      confidence: 85,
      priority: 'high',
      icon: DollarSign,
      color: 'blue'
    },
    {
      type: 'warning',
      title: 'Creative Fatigue',
      description: 'Q4 Promotions showing declining CTR',
      impact: 'Refresh needed',
      confidence: 92,
      priority: 'critical',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      type: 'suggestion',
      title: 'Audience Expansion',
      description: 'Test 2% Lookalike for Black Friday',
      impact: '+15% conversions',
      confidence: 78,
      priority: 'medium',
      icon: Target,
      color: 'green'
    }
  ]

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      red: 'text-red-600 bg-red-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-blue-100 text-blue-800 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[priority as keyof typeof colors] || colors.medium
  }

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-l border-gray-200 flex flex-col items-center py-4 space-y-4">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Expand AI Sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* AI Icon */}
        <div className="p-2 bg-blue-100 rounded-lg">
          <Brain className="h-6 w-6 text-blue-600" />
        </div>

        {/* Quick Indicators */}
        <div className="flex flex-col space-y-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" title="Critical Alert" />
          <div className="w-3 h-3 bg-blue-500 rounded-full" title="High Priority" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Medium Priority" />
        </div>

        {/* View All Link */}
        <div className="mt-auto">
          <Link
            href="/insights"
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
            title="View All Insights"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-xs text-gray-500">Live insights & recommendations</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Today's Performance</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">+12%</div>
            <div className="text-xs text-gray-600">ROAS vs Yesterday</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">3</div>
            <div className="text-xs text-gray-600">New Opportunities</div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Quick Insights</h4>
            <Link
              href="/insights"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {quickInsights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <Card key={index} className="border border-gray-100 hover:shadow-sm transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-lg ${getIconColor(insight.color)}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="text-xs font-medium text-gray-900 truncate">
                            {insight.title}
                          </h5>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                            {insight.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600 font-medium">
                            {insight.impact}
                          </span>
                          <span className="text-gray-500">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-xs bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center space-x-2">
              <Zap className="h-3 w-3 text-blue-600" />
              <span>Run AI Analysis</span>
            </button>
            <button className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2">
              <TrendingUp className="h-3 w-3 text-gray-600" />
              <span>Optimize Budgets</span>
            </button>
            <button className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2">
              <CheckCircle className="h-3 w-3 text-gray-600" />
              <span>Apply Recommendations</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Budget increased for Holiday Campaign</span>
              <span className="text-gray-400">2m ago</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">New audience recommendation generated</span>
              <span className="text-gray-400">5m ago</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Creative fatigue detected</span>
              <span className="text-gray-400">12m ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Last update: 2m ago</span>
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

export default AISidebar