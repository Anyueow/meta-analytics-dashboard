'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { ChartDataPoint } from '@/types'

interface ROASChartProps {
  data?: ChartDataPoint[]
  title?: string
  showTarget?: boolean
  targetROAS?: number
}

// No default data - all data comes from API

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">{formatDate(label)}</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">ROAS:</span>
            <span className="text-sm font-semibold text-blue-600">{data.roas.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Spend:</span>
            <span className="text-sm font-semibold">{formatCurrency(data.spend)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Revenue:</span>
            <span className="text-sm font-semibold text-green-600">{formatCurrency(data.revenue)}</span>
          </div>
          {data.target && (
            <div className="flex items-center justify-between border-t pt-1 mt-1">
              <span className="text-sm text-gray-600">Target:</span>
              <span className="text-sm font-semibold text-gray-500">{data.target.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

const ROASChart: React.FC<ROASChartProps> = ({
  data = [],
  title = "ROAS Performance Trend",
  showTarget = true,
  targetROAS = 3.0
}) => {
  const currentROAS = data[data.length - 1]?.roas || 0
  const previousROAS = data[data.length - 2]?.roas || 0
  const roasChange = ((currentROAS - previousROAS) / previousROAS * 100)
  const isIncreasing = roasChange > 0

  const avgROAS = data.length > 0 ? data.reduce((sum, item) => sum + item.roas, 0) / data.length : 0
  const isAboveTarget = avgROAS > targetROAS

  if (data.length === 0) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600">ROAS performance data will appear here once campaigns are synced</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Current ROAS:</span>
                <span className="text-lg font-bold text-blue-600">{currentROAS.toFixed(2)}</span>
                <div className={`flex items-center ml-2 ${isIncreasing ? 'text-green-600' : 'text-red-600'}`}>
                  {isIncreasing ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm ml-1">{Math.abs(roasChange).toFixed(1)}%</span>
                </div>
              </div>
              {showTarget && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Target:</span>
                  <span className="text-sm font-medium text-gray-900">{targetROAS.toFixed(1)}</span>
                  <span className={`text-xs ml-2 px-2 py-1 rounded ${isAboveTarget ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isAboveTarget ? 'Above Target' : 'Below Target'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select className="text-sm border border-gray-200 rounded px-2 py-1">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="roasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={formatDate}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                domain={['dataMin - 0.2', 'dataMax + 0.2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="roas"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#roasGradient)"
              />
              {showTarget && (
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#EF4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-sm text-gray-600">Avg ROAS</div>
            <div className="text-lg font-semibold text-gray-900">{avgROAS.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Best Day</div>
            <div className="text-lg font-semibold text-green-600">
              {Math.max(...data.map(d => d.roas)).toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Worst Day</div>
            <div className="text-lg font-semibold text-red-600">
              {Math.min(...data.map(d => d.roas)).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ROASChart