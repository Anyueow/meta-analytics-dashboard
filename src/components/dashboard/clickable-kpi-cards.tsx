'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, DollarSign, Target, Users, MousePointer, ShoppingCart, ChevronRight } from 'lucide-react'
import { DashboardKPI } from '@/types'

interface ClickableKPICardsProps {
  kpis?: DashboardKPI[]
}

// No default KPIs - all data comes from API

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
    case 'shopping-cart':
      return <ShoppingCart {...iconProps} />
    case 'mouse-pointer':
      return <MousePointer {...iconProps} />
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
      return <TrendingUp className="h-4 w-4" />
    case 'decrease':
      return <TrendingDown className="h-4 w-4" />
    default:
      return <Minus className="h-4 w-4" />
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

const getKPISlug = (label: string): string => {
  return label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const ClickableKPICards: React.FC<ClickableKPICardsProps> = ({ kpis = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {kpis.map((kpi, index) => (
        <Link
          key={index}
          href={`/calculations#${getKPISlug(kpi.label)}`}
          className="group"
        >
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group-hover:scale-[1.02] border-2 border-transparent group-hover:border-blue-200 h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {kpi.icon && (
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors duration-200 flex-shrink-0">
                      {getIcon(kpi.icon, "h-5 w-5 text-gray-600 group-hover:text-blue-600")}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 truncate">
                    {kpi.label}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200 flex-shrink-0" />
              </div>

              <div className="space-y-3 flex-1">
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {formatValue(kpi.value, kpi.format)}
                </div>

                <div className={`flex items-center space-x-2 text-sm ${getChangeColor(kpi.changeType)}`}>
                  {getChangeIcon(kpi.changeType)}
                  <span className="font-medium">
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-gray-400 text-xs">vs last month</span>
                </div>
              </div>

              {/* Clickable indicator */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                  <span>Click to see calculation</span>
                  <ChevronRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default ClickableKPICards