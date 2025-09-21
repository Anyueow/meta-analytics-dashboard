'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronUp, ChevronDown, Play, Pause, Edit, MoreHorizontal, Download, Filter } from 'lucide-react'
import { CampaignData } from '@/types'

interface CampaignTableProps {
  campaigns?: CampaignData[]
}

type SortKey = keyof CampaignData
type SortDirection = 'asc' | 'desc'

const defaultCampaigns: CampaignData[] = [
  {
    campaign_id: '120210158071660207',
    campaign_name: 'Holiday Sale - Lookalike 1%',
    date_start: '2024-11-01',
    spend: 1250.45,
    impressions: 45000,
    clicks: 1200,
    conversions: 48,
    conversion_value: 3840.00,
    ctr: 2.67,
    cpc: 1.04,
    cpm: 27.79,
    roas: 3.07,
    cpa: 26.05,
    cost_per_purchase: 25.30,
    frequency: 2.1,
    reach: 21428,
    relevance_score: 7,
    quality_ranking: 'above_average'
  },
  {
    campaign_id: '120210158071660208',
    campaign_name: 'Black Friday - Interest Targeting',
    date_start: '2024-11-01',
    spend: 2150.30,
    impressions: 78000,
    clicks: 1950,
    conversions: 85,
    conversion_value: 6800.00,
    ctr: 2.50,
    cpc: 1.10,
    cpm: 27.57,
    roas: 3.16,
    cpa: 25.30,
    cost_per_purchase: 24.15,
    frequency: 2.8,
    reach: 27857,
    relevance_score: 8,
    quality_ranking: 'above_average'
  },
  {
    campaign_id: '120210158071660209',
    campaign_name: 'Winter Collection - Retargeting',
    date_start: '2024-11-01',
    spend: 890.75,
    impressions: 25000,
    clicks: 750,
    conversions: 42,
    conversion_value: 4200.00,
    ctr: 3.00,
    cpc: 1.19,
    cpm: 35.63,
    roas: 4.71,
    cpa: 21.21,
    cost_per_purchase: 19.95,
    frequency: 1.8,
    reach: 13888,
    relevance_score: 9,
    quality_ranking: 'above_average'
  },
  {
    campaign_id: '120210158071660210',
    campaign_name: 'Q4 Promotions - Broad Targeting',
    date_start: '2024-11-01',
    spend: 1680.90,
    impressions: 65000,
    clicks: 1300,
    conversions: 38,
    conversion_value: 2660.00,
    ctr: 2.00,
    cpc: 1.29,
    cpm: 25.86,
    roas: 1.58,
    cpa: 44.23,
    cost_per_purchase: 42.10,
    frequency: 3.2,
    reach: 20312,
    relevance_score: 5,
    quality_ranking: 'average'
  },
  {
    campaign_id: '120210158071660211',
    campaign_name: 'Premium Products - Custom Audience',
    date_start: '2024-11-01',
    spend: 3250.80,
    impressions: 95000,
    clicks: 2850,
    conversions: 125,
    conversion_value: 15000.00,
    ctr: 3.00,
    cpc: 1.14,
    cpm: 34.22,
    roas: 4.62,
    cpa: 26.01,
    cost_per_purchase: 22.85,
    frequency: 2.3,
    reach: 41304,
    relevance_score: 8,
    quality_ranking: 'above_average'
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

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`
}

const formatDecimal = (value: number) => {
  return value.toFixed(2)
}

const getROASColor = (roas: number) => {
  if (roas >= 3.0) return 'text-green-600'
  if (roas >= 2.0) return 'text-yellow-600'
  return 'text-red-600'
}

const getCPAColor = (cpa: number) => {
  if (cpa <= 25) return 'text-green-600'
  if (cpa <= 35) return 'text-yellow-600'
  return 'text-red-600'
}

const getCTRColor = (ctr: number) => {
  if (ctr >= 2.5) return 'text-green-600'
  if (ctr >= 1.5) return 'text-yellow-600'
  return 'text-red-600'
}

const getQualityBadgeColor = (ranking: string) => {
  switch (ranking) {
    case 'above_average':
      return 'bg-green-100 text-green-800'
    case 'average':
      return 'bg-yellow-100 text-yellow-800'
    case 'below_average':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns = defaultCampaigns }) => {
  const [sortKey, setSortKey] = useState<SortKey>('spend')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filter, setFilter] = useState('')

  const sortedAndFilteredCampaigns = useMemo(() => {
    let filtered = campaigns.filter(campaign =>
      campaign.campaign_name.toLowerCase().includes(filter.toLowerCase())
    )

    return filtered.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      return 0
    })
  }, [campaigns, sortKey, sortDirection, filter])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc'
      ? <ChevronUp className="h-4 w-4 text-blue-600" />
      : <ChevronDown className="h-4 w-4 text-blue-600" />
  }

  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.spend, 0)
  const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.conversion_value, 0)
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)
  const avgROAS = totalRevenue / totalSpend

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">Campaign Performance</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {campaigns.length} campaigns • {formatCurrency(totalSpend)} total spend • {totalConversions} conversions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('campaign_name')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Campaign</span>
                    {getSortIcon('campaign_name')}
                  </button>
                </th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('spend')}
                    className="flex items-center justify-end space-x-1 hover:text-gray-700"
                  >
                    <span>Spend</span>
                    {getSortIcon('spend')}
                  </button>
                </th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('roas')}
                    className="flex items-center justify-end space-x-1 hover:text-gray-700"
                  >
                    <span>ROAS</span>
                    {getSortIcon('roas')}
                  </button>
                </th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('cpa')}
                    className="flex items-center justify-end space-x-1 hover:text-gray-700"
                  >
                    <span>CPA</span>
                    {getSortIcon('cpa')}
                  </button>
                </th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('ctr')}
                    className="flex items-center justify-end space-x-1 hover:text-gray-700"
                  >
                    <span>CTR</span>
                    {getSortIcon('ctr')}
                  </button>
                </th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('conversions')}
                    className="flex items-center justify-end space-x-1 hover:text-gray-700"
                  >
                    <span>Conversions</span>
                    {getSortIcon('conversions')}
                  </button>
                </th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality
                </th>
                <th className="text-center p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredCampaigns.map((campaign) => (
                <tr key={campaign.campaign_id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.campaign_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {campaign.campaign_id}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(campaign.spend)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(campaign.impressions)} imp
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`text-sm font-medium ${getROASColor(campaign.roas)}`}>
                      {formatDecimal(campaign.roas)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(campaign.conversion_value)} rev
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`text-sm font-medium ${getCPAColor(campaign.cpa)}`}>
                      {formatCurrency(campaign.cpa)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`text-sm font-medium ${getCTRColor(campaign.ctr)}`}>
                      {formatPercentage(campaign.ctr)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(campaign.clicks)} clicks
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatNumber(campaign.conversions)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatNumber(campaign.reach)} reach
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityBadgeColor(campaign.quality_ranking || 'average')}`}>
                      {campaign.quality_ranking?.replace('_', ' ') || 'N/A'}
                    </span>
                    {campaign.relevance_score && (
                      <div className="text-xs text-gray-500 mt-1">
                        Score: {campaign.relevance_score}/10
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-green-600" title="Resume">
                        <Play className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600" title="Pause">
                        <Pause className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600" title="More">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              Showing {sortedAndFilteredCampaigns.length} of {campaigns.length} campaigns
            </div>
            <div className="flex items-center space-x-6 text-gray-900">
              <span>Total Spend: <strong>{formatCurrency(totalSpend)}</strong></span>
              <span>Total Revenue: <strong>{formatCurrency(totalRevenue)}</strong></span>
              <span>Overall ROAS: <strong className={getROASColor(avgROAS)}>{formatDecimal(avgROAS)}</strong></span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CampaignTable