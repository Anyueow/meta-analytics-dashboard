'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Check,
  X,
  Clock,
  DollarSign,
  Target,
  Users,
  Zap,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { AIRecommendation } from '@/types'

interface AIInsightsProps {
  recommendations?: AIRecommendation[]
}

const defaultRecommendations: AIRecommendation[] = [
  {
    id: '1',
    date: '2024-11-20',
    campaign_id: '120210158071660207',
    type: 'budget_increase',
    title: 'Increase Budget - High Performing Campaign',
    description: 'Holiday Sale campaign ROAS (3.07) is 23% above target (2.5). Recommend increasing daily budget by 50% to capture more high-intent holiday traffic before the season ends.',
    confidence_score: 0.85,
    expected_impact: '+$960 revenue, +25 conversions',
    priority: 'high',
    action_required: 'Increase daily budget from $200 to $300',
    implemented: false,
    created_at: new Date('2024-11-20T08:00:00Z'),
    updated_at: new Date('2024-11-20T08:00:00Z')
  },
  {
    id: '2',
    date: '2024-11-20',
    campaign_id: '120210158071660210',
    type: 'creative_refresh',
    title: 'Creative Fatigue Detected',
    description: 'Q4 Promotions campaign showing declining CTR (2.0% → 1.6%) over 7 days with frequency at 3.2. Creative assets need refreshing to combat fatigue.',
    confidence_score: 0.92,
    expected_impact: '+0.8% CTR, -$8 CPA',
    priority: 'high',
    action_required: 'Upload 3-5 new creative assets and pause current underperforming ads',
    implemented: false,
    created_at: new Date('2024-11-20T09:15:00Z'),
    updated_at: new Date('2024-11-20T09:15:00Z')
  },
  {
    id: '3',
    date: '2024-11-20',
    campaign_id: '120210158071660208',
    type: 'audience_expansion',
    title: 'Audience Expansion Opportunity',
    description: 'Black Friday campaign performing well with 1% Lookalike. Test 2% Lookalike audience based on recent high-value purchasers (AOV $80+).',
    confidence_score: 0.78,
    expected_impact: '+40% reach, +15% conversions',
    priority: 'medium',
    action_required: 'Create new ad set with 2% Lookalike audience, allocate 30% of budget',
    implemented: false,
    created_at: new Date('2024-11-20T10:30:00Z'),
    updated_at: new Date('2024-11-20T10:30:00Z')
  },
  {
    id: '4',
    date: '2024-11-19',
    campaign_id: '120210158071660210',
    type: 'pause_campaign',
    title: 'Poor Performance Alert',
    description: 'Q4 Promotions campaign ROAS (1.58) is 37% below target. High CPA ($44.23) suggests poor audience-offer fit. Consider pausing until optimization.',
    confidence_score: 0.89,
    expected_impact: 'Save $300/day, reallocate to profitable campaigns',
    priority: 'critical',
    action_required: 'Pause campaign immediately and analyze audience segments',
    implemented: true,
    created_at: new Date('2024-11-19T14:20:00Z'),
    updated_at: new Date('2024-11-19T16:45:00Z')
  },
  {
    id: '5',
    date: '2024-11-19',
    campaign_id: '120210158071660211',
    type: 'bidding_adjustment',
    title: 'Bidding Strategy Optimization',
    description: 'Premium Products campaign eligible for Target ROAS bidding. Historical performance (4.62 ROAS) suggests stable optimization.',
    confidence_score: 0.73,
    expected_impact: '+12% efficiency, -5% CPA',
    priority: 'low',
    action_required: 'Switch from Lowest Cost to Target ROAS bidding at 4.0',
    implemented: false,
    created_at: new Date('2024-11-19T11:10:00Z'),
    updated_at: new Date('2024-11-19T11:10:00Z')
  }
]

const getRecommendationIcon = (type: string) => {
  switch (type) {
    case 'budget_increase':
    case 'budget_decrease':
      return <DollarSign className="h-4 w-4" />
    case 'creative_refresh':
      return <Zap className="h-4 w-4" />
    case 'audience_expansion':
      return <Users className="h-4 w-4" />
    case 'pause_campaign':
      return <AlertTriangle className="h-4 w-4" />
    case 'bidding_adjustment':
      return <Target className="h-4 w-4" />
    default:
      return <Lightbulb className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getConfidenceColor = (score: number) => {
  if (score >= 0.8) return 'text-green-600'
  if (score >= 0.6) return 'text-yellow-600'
  return 'text-red-600'
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

const AIInsights: React.FC<AIInsightsProps> = ({ recommendations = defaultRecommendations }) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'implemented'>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedTab === 'pending') return !rec.implemented
    if (selectedTab === 'implemented') return rec.implemented
    return true
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const handleImplement = (id: string) => {
    // This would typically call an API to implement the recommendation
    console.log('Implementing recommendation:', id)
  }

  const handleDismiss = (id: string) => {
    // This would typically call an API to dismiss the recommendation
    console.log('Dismissing recommendation:', id)
  }

  const pendingCount = recommendations.filter(r => !r.implemented).length
  const criticalCount = recommendations.filter(r => r.priority === 'critical' && !r.implemented).length

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</CardTitle>
                <p className="text-sm text-gray-600">
                  {pendingCount} pending recommendations • {criticalCount} critical actions needed
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Analyzing...' : 'Refresh Analysis'}</span>
            </button>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Potential Revenue Impact</p>
                <p className="text-xl font-bold text-green-600">+$1,260</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cost Savings</p>
                <p className="text-xl font-bold text-blue-600">$300/day</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Confidence</p>
                <p className="text-xl font-bold text-purple-600">83%</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Recommendations</CardTitle>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {(['all', 'pending', 'implemented'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'pending' && pendingCount > 0 && (
                    <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredRecommendations.map((recommendation, index) => (
              <div
                key={recommendation.id}
                className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index === filteredRecommendations.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getPriorityColor(recommendation.priority).replace('text-', 'bg-').replace('800', '100').replace('border-', '')}`}>
                        {getRecommendationIcon(recommendation.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {recommendation.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                            {recommendation.priority}
                          </span>
                          {recommendation.implemented && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Implemented
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          Campaign: {recommendation.campaign_id} • {formatTimeAgo(recommendation.created_at)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {recommendation.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Expected Impact</p>
                          <p className="text-sm font-medium text-gray-900">{recommendation.expected_impact}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Confidence</p>
                          <p className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence_score)}`}>
                            {Math.round(recommendation.confidence_score * 100)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500">Priority</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">{recommendation.priority}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-600 mb-1">Action Required:</p>
                      <p className="text-sm text-gray-900">{recommendation.action_required}</p>
                    </div>
                  </div>

                  {!recommendation.implemented && (
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleImplement(recommendation.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Check className="h-4 w-4" />
                        <span>Implement</span>
                      </button>
                      <button
                        onClick={() => handleDismiss(recommendation.id)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <X className="h-4 w-4" />
                        <span>Dismiss</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        <ChevronRight className="h-4 w-4" />
                        <span>Details</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredRecommendations.length === 0 && (
            <div className="p-8 text-center">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
              <p className="text-gray-600">
                {selectedTab === 'pending'
                  ? "All recommendations have been implemented or dismissed."
                  : "The AI is analyzing your campaigns. Check back in a few minutes."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AIInsights