'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  ShoppingCart,
  Info,
  ArrowLeft,
  BarChart3,
  PieChart,
  Calendar,
  Users
} from 'lucide-react'
import Link from 'next/link'

const CalculationsPage = () => {
  const searchParams = useSearchParams()
  const [activeKPI, setActiveKPI] = useState<string>('')

  useEffect(() => {
    // Check if there's a hash in the URL to scroll to a specific KPI
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        setActiveKPI(hash)
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }
  }, [])

  const kpiCalculations = [
    {
      id: 'roas',
      name: 'ROAS (Return on Ad Spend)',
      formula: 'Revenue ÷ Ad Spend',
      description: 'Measures how much revenue you generate for every dollar spent on advertising',
      currentValue: '3.42',
      icon: TrendingUp,
      color: 'blue',
      calculation: {
        revenue: 154890,
        adSpend: 45231,
        result: 3.42
      },
      breakdown: [
        { period: 'Last 7 days', revenue: 36240, spend: 10580, roas: 3.43 },
        { period: 'Last 14 days', revenue: 72450, spend: 21150, roas: 3.42 },
        { period: 'Last 30 days', revenue: 154890, spend: 45231, roas: 3.42 }
      ],
      insights: [
        'Your ROAS is 37% above the industry average of 2.5',
        'Performance improved 12.5% compared to last month',
        'Holiday campaign contributing 28% of total ROAS'
      ]
    },
    {
      id: 'total-spend',
      name: 'Total Spend',
      formula: 'Sum of all campaign costs',
      description: 'Total amount spent across all active campaigns in the selected time period',
      currentValue: '$45,231',
      icon: DollarSign,
      color: 'green',
      calculation: {
        campaignSpend: {
          'Holiday Sale': 12504,
          'Black Friday': 21503,
          'Winter Collection': 8907,
          'Q4 Promotions': 16809,
          'Premium Products': 32508
        },
        totalSpend: 45231
      },
      breakdown: [
        { campaign: 'Holiday Sale', spend: 12504, percentage: 27.6 },
        { campaign: 'Black Friday', spend: 21503, percentage: 47.5 },
        { campaign: 'Winter Collection', spend: 8907, percentage: 19.7 },
        { campaign: 'Q4 Promotions', spend: 16809, percentage: 37.2 },
        { campaign: 'Premium Products', spend: 32508, percentage: 71.9 }
      ],
      insights: [
        'Spend increased 8.2% compared to last month',
        'Black Friday campaign represents 47.5% of total spend',
        'Daily average spend: $1,507'
      ]
    },
    {
      id: 'conversions',
      name: 'Total Conversions',
      formula: 'Sum of all conversion events',
      description: 'Total number of desired actions completed by users from your ads',
      currentValue: '1,423',
      icon: Target,
      color: 'purple',
      calculation: {
        conversionTypes: {
          'Purchase': 1249,
          'Add to Cart': 174
        },
        totalConversions: 1423
      },
      breakdown: [
        { source: 'Purchase conversions', count: 1249, percentage: 87.8 },
        { source: 'Add to Cart conversions', count: 174, percentage: 12.2 }
      ],
      insights: [
        'Conversions increased 15.3% compared to last month',
        'Purchase conversion rate: 2.84%',
        'Mobile devices account for 68% of conversions'
      ]
    },
    {
      id: 'cost-per-purchase',
      name: 'Cost per Purchase',
      formula: 'Total Ad Spend ÷ Purchase Conversions',
      description: 'Average cost to acquire one purchase through your advertising',
      currentValue: '$28.95',
      icon: ShoppingCart,
      color: 'orange',
      calculation: {
        totalSpend: 45231,
        purchaseConversions: 1249,
        costPerPurchase: 28.95
      },
      breakdown: [
        { campaign: 'Winter Collection', cpp: 19.95, purchases: 42 },
        { campaign: 'Black Friday', cpp: 24.15, purchases: 85 },
        { campaign: 'Holiday Sale', cpp: 25.30, purchases: 48 },
        { campaign: 'Premium Products', cpp: 22.85, purchases: 125 },
        { campaign: 'Q4 Promotions', cpp: 42.10, purchases: 38 }
      ],
      insights: [
        'Cost per purchase decreased 7.8% (improvement)',
        'Winter Collection has the lowest CPP at $19.95',
        'Q4 Promotions needs optimization - highest CPP'
      ]
    }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Dashboard</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">KPI Calculations</h1>
                <p className="text-gray-600">Deep dive into how your key performance indicators are calculated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Jump to KPI</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {kpiCalculations.map((kpi) => {
                const Icon = kpi.icon
                return (
                  <button
                    key={kpi.id}
                    onClick={() => {
                      setActiveKPI(kpi.id)
                      document.getElementById(kpi.id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeKPI === kpi.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-${kpi.color}-100`}>
                      <Icon className={`h-4 w-4 text-${kpi.color}-600`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{kpi.name}</p>
                      <p className="text-sm text-gray-500">{kpi.currentValue}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* KPI Calculations */}
        <div className="space-y-8">
          {kpiCalculations.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div key={kpi.id} id={kpi.id} className="scroll-mt-8">
                <Card className={`${activeKPI === kpi.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg bg-${kpi.color}-100`}>
                        <Icon className={`h-6 w-6 text-${kpi.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">{kpi.name}</CardTitle>
                        <p className="text-gray-600 mt-1">{kpi.description}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Formula & Current Value */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Formula</h4>
                        <p className="text-lg font-mono bg-white p-3 rounded border">{kpi.formula}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Current Value</h4>
                        <p className="text-3xl font-bold text-blue-600">{kpi.currentValue}</p>
                      </div>
                    </div>

                    {/* Calculation Details */}
                    {kpi.id === 'roas' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Calculation Breakdown</h4>
                          <div className="bg-white border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                              <span>Total Revenue:</span>
                              <span className="font-semibold">{formatCurrency(kpi.calculation.revenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Ad Spend:</span>
                              <span className="font-semibold">{formatCurrency(kpi.calculation.adSpend)}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between text-lg">
                              <span className="font-semibold">ROAS:</span>
                              <span className="font-bold text-blue-600">{kpi.calculation.result}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Period Breakdown</h4>
                          <div className="space-y-2">
                            {kpi.breakdown.map((period, index) => (
                              <div key={index} className="bg-white border rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{period.period}</span>
                                  <span className="font-bold text-blue-600">{period.roas}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {formatCurrency(period.revenue)} ÷ {formatCurrency(period.spend)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {kpi.id === 'total-spend' && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Spend by Campaign</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {kpi.breakdown.map((campaign, index) => (
                            <div key={index} className="bg-white border rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{campaign.campaign}</span>
                                <span className="font-bold">{formatCurrency(campaign.spend)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${Math.min(campaign.percentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {kpi.id === 'conversions' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Conversion Types</h4>
                          <div className="space-y-3">
                            {kpi.breakdown.map((conversion, index) => (
                              <div key={index} className="bg-white border rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{conversion.source}</span>
                                  <div className="text-right">
                                    <div className="font-bold">{formatNumber(conversion.count)}</div>
                                    <div className="text-sm text-gray-600">{conversion.percentage}%</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Visual Breakdown</h4>
                          <div className="bg-white border rounded-lg p-4 h-40 flex items-center justify-center">
                            <div className="text-center">
                              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">Conversion breakdown chart</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {kpi.id === 'cost-per-purchase' && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Cost per Purchase by Campaign</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {kpi.breakdown.map((campaign, index) => (
                            <div key={index} className="bg-white border rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{campaign.campaign}</span>
                                <span className="font-bold">${campaign.cpp}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {campaign.purchases} purchases
                              </div>
                              <div className={`text-xs mt-1 ${campaign.cpp < 25 ? 'text-green-600' : campaign.cpp > 35 ? 'text-red-600' : 'text-yellow-600'}`}>
                                {campaign.cpp < 25 ? 'Excellent' : campaign.cpp > 35 ? 'Needs optimization' : 'Good'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Insights */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Insights</h4>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <ul className="space-y-2">
                          {kpi.insights.map((insight, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-800">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CalculationsPage