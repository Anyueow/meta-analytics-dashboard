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

const defaultData: ChartDataPoint[] = [
  { date: '2024-11-01', roas: 2.8, spend: 1200, revenue: 3360, target: 3.0 },
  { date: '2024-11-02', roas: 3.1, spend: 1350, revenue: 4185, target: 3.0 },
  { date: '2024-11-03', roas: 2.9, spend: 1100, revenue: 3190, target: 3.0 },
  { date: '2024-11-04', roas: 3.4, spend: 1450, revenue: 4930, target: 3.0 },
  { date: '2024-11-05', roas: 3.2, spend: 1300, revenue: 4160, target: 3.0 },
  { date: '2024-11-06', roas: 3.6, spend: 1600, revenue: 5760, target: 3.0 },
  { date: '2024-11-07', roas: 3.3, spend: 1400, revenue: 4620, target: 3.0 },
  { date: '2024-11-08', roas: 2.7, spend: 1250, revenue: 3375, target: 3.0 },
  { date: '2024-11-09', roas: 3.8, spend: 1550, revenue: 5890, target: 3.0 },
  { date: '2024-11-10', roas: 3.5, spend: 1480, revenue: 5180, target: 3.0 },
  { date: '2024-11-11', roas: 3.7, spend: 1620, revenue: 5994, target: 3.0 },
  { date: '2024-11-12', roas: 3.9, spend: 1700, revenue: 6630, target: 3.0 },
  { date: '2024-11-13', roas: 3.4, spend: 1450, revenue: 4930, target: 3.0 },
  { date: '2024-11-14', roas: 4.1, spend: 1800, revenue: 7380, target: 3.0 },
  { date: '2024-11-15', roas: 3.8, spend: 1650, revenue: 6270, target: 3.0 },
  { date: '2024-11-16', roas: 3.6, spend: 1500, revenue: 5400, target: 3.0 },
  { date: '2024-11-17', roas: 4.0, spend: 1750, revenue: 7000, target: 3.0 },
  { date: '2024-11-18', roas: 3.7, spend: 1600, revenue: 5920, target: 3.0 },
  { date: '2024-11-19', roas: 3.9, spend: 1720, revenue: 6708, target: 3.0 },
  { date: '2024-11-20', roas: 4.2, spend: 1850, revenue: 7770, target: 3.0 }
]

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
  data = defaultData,
  title = "ROAS Performance Trend",
  showTarget = true,
  targetROAS = 3.0
}) => {
  const currentROAS = data[data.length - 1]?.roas || 0
  const previousROAS = data[data.length - 2]?.roas || 0
  const roasChange = ((currentROAS - previousROAS) / previousROAS * 100)
  const isIncreasing = roasChange > 0

  const avgROAS = data.reduce((sum, item) => sum + item.roas, 0) / data.length
  const isAboveTarget = avgROAS > targetROAS

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