'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Breadcrumb from '@/components/ui/breadcrumb'
import { Calculator, TrendingUp, DollarSign, Target, ShoppingCart } from 'lucide-react'

const CalculationsPage = () => {
  const calculations = [
    {
      id: 'roas',
      title: 'Return on Ad Spend (ROAS)',
      icon: TrendingUp,
      formula: 'ROAS = Revenue ÷ Ad Spend',
      description: 'Measures the revenue generated for every dollar spent on advertising.',
      example: 'If you spend $100 and generate $300 in revenue, your ROAS is 3.0',
      color: 'blue'
    },
    {
      id: 'cpa',
      title: 'Cost Per Acquisition (CPA)',
      icon: Target,
      formula: 'CPA = Ad Spend ÷ Number of Conversions',
      description: 'The average cost to acquire one customer or conversion.',
      example: 'If you spend $500 and get 10 conversions, your CPA is $50',
      color: 'green'
    },
    {
      id: 'ctr',
      title: 'Click-Through Rate (CTR)',
      icon: TrendingUp,
      formula: 'CTR = (Clicks ÷ Impressions) × 100',
      description: 'The percentage of people who clicked on your ad after seeing it.',
      example: 'If 100 people see your ad and 5 click, your CTR is 5%',
      color: 'purple'
    },
    {
      id: 'cpc',
      title: 'Cost Per Click (CPC)',
      icon: DollarSign,
      formula: 'CPC = Ad Spend ÷ Number of Clicks',
      description: 'The average amount you pay for each click on your ad.',
      example: 'If you spend $200 and get 50 clicks, your CPC is $4',
      color: 'orange'
    },
    {
      id: 'cpm',
      title: 'Cost Per Mille (CPM)',
      icon: DollarSign,
      formula: 'CPM = (Ad Spend ÷ Impressions) × 1000',
      description: 'The cost to reach 1,000 people with your ad.',
      example: 'If you spend $50 for 10,000 impressions, your CPM is $5',
      color: 'red'
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      icon: ShoppingCart,
      formula: 'Conversion Rate = (Conversions ÷ Clicks) × 100',
      description: 'The percentage of clicks that result in a conversion.',
      example: 'If 100 people click and 5 convert, your conversion rate is 5%',
      color: 'indigo'
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
                items={[{ label: 'Calculations', current: true }]}
                backHref="/"
                backLabel="Back to Dashboard"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">KPI Calculations</h1>
                <p className="text-gray-600">Understanding how key performance indicators are calculated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Understanding Your Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              These calculations help you understand how your Meta advertising performance is measured. 
              Each metric provides insights into different aspects of your campaign effectiveness, 
              from cost efficiency to audience engagement.
            </p>
          </CardContent>
        </Card>

        {/* Calculations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculations.map((calc) => {
            const Icon = calc.icon
            return (
              <Card key={calc.id} className="hover:shadow-md transition-shadow duration-200 h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-${calc.color}-100 rounded-lg`}>
                      <Icon className={`h-6 w-6 text-${calc.color}-600`} />
                    </div>
                    <CardTitle className="text-lg">{calc.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600 mb-1">Formula</p>
                    <p className="text-lg font-mono text-gray-900">{calc.formula}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {calc.description}
                    </p>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-800 mb-1">Example</p>
                      <p className="text-sm text-blue-700">{calc.example}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Aim for ROAS above 3.0 for profitable campaigns</li>
                  <li>• Keep CTR above 1% for good engagement</li>
                  <li>• Monitor CPA trends to optimize budget allocation</li>
                  <li>• Use CPM to compare reach efficiency across campaigns</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tips for Improvement</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Test different ad creatives to improve CTR</li>
                  <li>• Refine targeting to lower CPA</li>
                  <li>• Optimize landing pages to increase conversion rate</li>
                  <li>• Use AI recommendations for automated optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CalculationsPage