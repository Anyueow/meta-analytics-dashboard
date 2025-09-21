'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, Users, MousePointer, Eye, Zap, ShoppingCart } from 'lucide-react'
import { DashboardKPI } from '@/types'

interface KPICardsProps {
  kpis?: DashboardKPI[]
}

const defaultKPIs: DashboardKPI[] = [
  {
    label: 'Total ROAS',
    value: 3.42,
    change: 12.5,
    changeType: 'increase',
    format: 'decimal',
    icon: 'trending-up'
  },
  {
    label: 'Total Spend',
    value: 45231,
    change: 8.2,
    changeType: 'increase',
    format: 'currency',
    icon: 'dollar-sign'
  },
  {
    label: 'Conversions',
    value: 1423,
    change: 15.3,
    changeType: 'increase',
    format: 'number',
    icon: 'target'
  },
  {
    label: 'Cost per Purchase',
    value: 28.95,
    change: -7.8,
    changeType: 'decrease',
    format: 'currency',
    icon: 'shopping-cart'
  },
  {
    label: 'Avg CPA',
    value: 31.78,
    change: -5.2,
    changeType: 'decrease',
    format: 'currency',
    icon: 'users'
  },
  {
    label: 'Avg CTR',
    value: 2.84,
    change: -2.1,
    changeType: 'decrease',
    format: 'percentage',
    icon: 'mouse-pointer'
  },
  {
    label: 'Total Reach',
    value: 284650,
    change: 18.7,
    changeType: 'increase',
    format: 'number',
    icon: 'eye'
  },
  {
    label: 'Avg CPM',
    value: 12.45,
    change: 3.4,
    changeType: 'increase',
    format: 'currency',
    icon: 'zap'
  },
  {
    label: 'Conversion Rate',
    value: 3.2,
    change: 0.0,
    changeType: 'neutral',
    format: 'percentage',
    icon: 'target'
  }
]

const getIcon = (iconName: string, className: string) => {
  const iconProps = { className }

  switch (iconName) {
    case 'trending-up':
      return <TrendingUp {...iconProps} />
    case 'dollar-sign':
      return <DollarSign {...iconProps} />
    case 'target':
      return <Target {...iconProps} />
    case 'users':
      return <Users {...iconProps} />
    case 'mouse-pointer':
      return <MousePointer {...iconProps} />
    case 'eye':
      return <Eye {...iconProps} />
    case 'zap':
      return <Zap {...iconProps} />
    case 'shopping-cart':
      return <ShoppingCart {...iconProps} />
    default:
      return <TrendingUp {...iconProps} />
  }
}

const formatValue = (value: number | string, format: string): string => {
  if (typeof value === 'string') return value

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value >= 1000 ? 0 : 2
      }).format(value)
    case 'percentage':
      return `${value.toFixed(1)}%`
    case 'number':
      return new Intl.NumberFormat('en-US').format(value)
    case 'decimal':
      return value.toFixed(2)
    default:
      return value.toString()
  }
}

const getChangeIcon = (changeType: string) => {
  switch (changeType) {
    case 'increase':
      return <TrendingUp className="h-3 w-3" />
    case 'decrease':
      return <TrendingDown className="h-3 w-3" />
    default:
      return <Minus className="h-3 w-3" />
  }
}

const getChangeColor = (changeType: string) => {
  switch (changeType) {
    case 'increase':
      return 'text-green-600'
    case 'decrease':
      return 'text-red-600'
    default:
      return 'text-gray-500'
  }
}

const KPICards: React.FC<KPICardsProps> = ({ kpis = defaultKPIs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {kpi.label}
            </CardTitle>
            {kpi.icon && getIcon(kpi.icon, "h-4 w-4 text-gray-400")}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatValue(kpi.value, kpi.format)}
            </div>
            <div className={`text-xs flex items-center mt-1 ${getChangeColor(kpi.changeType)}`}>
              {getChangeIcon(kpi.changeType)}
              <span className="ml-1">
                {kpi.change > 0 ? '+' : ''}{kpi.change}% from last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default KPICards