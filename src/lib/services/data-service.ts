import { getMetaApiClient } from '@/lib/meta-api/client'
import { dbQueries } from '@/lib/database/queries'
import { getAIRecommendationEngine } from '@/lib/ai/recommendations'
import { CampaignData, AIRecommendation, PerformanceMetrics } from '@/types'

export class DataService {
  private metaApi = getMetaApiClient()
  private aiEngine = getAIRecommendationEngine()

  // Sync campaign data from Meta API
  async syncCampaignData(accountId: string, dateRange?: { since: string; until: string }) {
    try {
      console.log('Starting campaign data sync...')
      
      // Fetch data from Meta API
      const campaignData = await this.metaApi.syncCampaignData(accountId, dateRange)
      
      // Store in database
      const results = []
      for (const campaign of campaignData) {
        const date = new Date(campaign.date_start)
        const result = await dbQueries.upsertCampaignInsight({
          ...campaign,
          date
        })
        results.push(result)
      }

      console.log(`Synced ${results.length} campaign insights`)
      return results
    } catch (error) {
      console.error('Error syncing campaign data:', error)
      throw error
    }
  }

  // Get dashboard KPIs
  async getDashboardKPIs(dateRange?: { start: Date; end: Date }) {
    try {
      console.log('📊 Fetching dashboard KPIs...')
      const metrics = await dbQueries.getPerformanceMetrics(dateRange)
      console.log('📈 Raw metrics:', metrics)
      
      // If no data, return zeros
      if (metrics.campaignCount === 0) {
        console.log('⚠️ No campaign data found, returning zero values')
        return {
          roas: { value: 0, change: 0, changeType: 'neutral' as const },
          totalSpend: { value: 0, change: 0, changeType: 'neutral' as const },
          conversions: { value: 0, change: 0, changeType: 'neutral' as const },
          costPerPurchase: { value: 0, change: 0, changeType: 'neutral' as const }
        }
      }
      
      // Calculate changes (simplified - in production, you'd compare with previous period)
      const previousMetrics = await dbQueries.getPerformanceMetrics({
        start: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        end: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)   // 30 days ago
      })

      const roasChange = previousMetrics.averageROAS > 0 
        ? ((metrics.averageROAS - previousMetrics.averageROAS) / previousMetrics.averageROAS) * 100
        : 0

      const spendChange = previousMetrics.totalSpend > 0
        ? ((metrics.totalSpend - previousMetrics.totalSpend) / previousMetrics.totalSpend) * 100
        : 0

      const conversionsChange = previousMetrics.totalConversions > 0
        ? ((metrics.totalConversions - previousMetrics.totalConversions) / previousMetrics.totalConversions) * 100
        : 0

      const cpaChange = previousMetrics.averageCPA > 0
        ? ((metrics.averageCPA - previousMetrics.averageCPA) / previousMetrics.averageCPA) * 100
        : 0

      const kpiData = {
        roas: {
          value: metrics.averageROAS,
          change: roasChange,
          changeType: roasChange > 0 ? 'increase' : roasChange < 0 ? 'decrease' : 'neutral'
        },
        totalSpend: {
          value: metrics.totalSpend,
          change: spendChange,
          changeType: spendChange > 0 ? 'increase' : spendChange < 0 ? 'decrease' : 'neutral'
        },
        conversions: {
          value: metrics.totalConversions,
          change: conversionsChange,
          changeType: conversionsChange > 0 ? 'increase' : conversionsChange < 0 ? 'decrease' : 'neutral'
        },
        costPerPurchase: {
          value: metrics.averageCPA,
          change: cpaChange,
          changeType: cpaChange > 0 ? 'increase' : cpaChange < 0 ? 'decrease' : 'neutral'
        }
      }

      console.log('✅ KPI data calculated:', kpiData)
      return kpiData
    } catch (error) {
      console.error('❌ Error getting dashboard KPIs:', error)
      throw error
    }
  }

  // Get campaign data for table
  async getCampaigns(filters?: {
    search?: string
    status?: string
    objective?: string
    dateRange?: { start: Date; end: Date }
  }) {
    try {
      let insights = await dbQueries.getCampaignInsights(filters?.dateRange)
      
      // Apply filters
      if (filters?.search) {
        insights = insights.filter(insight => 
          insight.campaignName.toLowerCase().includes(filters.search!.toLowerCase())
        )
      }

      // Convert to CampaignData format
      return insights.map(insight => ({
        campaign_id: insight.campaignId,
        campaign_name: insight.campaignName,
        date_start: insight.date.toISOString().split('T')[0],
        spend: insight.spend,
        impressions: insight.impressions,
        clicks: insight.clicks,
        conversions: insight.conversions,
        conversion_value: insight.conversionValue,
        ctr: insight.ctr,
        cpc: insight.cpc,
        cpm: insight.cpm,
        roas: insight.roas,
        cpa: insight.cpa,
        cost_per_purchase: insight.costPerPurchase,
        frequency: insight.frequency,
        reach: insight.reach,
        relevance_score: insight.relevanceScore,
        quality_ranking: insight.qualityRanking as 'above_average' | 'average' | 'below_average'
      }))
    } catch (error) {
      console.error('Error getting campaigns:', error)
      throw error
    }
  }

  // Get ROAS chart data
  async getROASChartData(days: number = 30) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)

      const insights = await dbQueries.getCampaignInsights({
        start: startDate,
        end: endDate
      })

      // Group by date and calculate daily totals
      const dailyData = new Map<string, {
        date: string
        roas: number
        spend: number
        revenue: number
        target: number
      }>()

      insights.forEach(insight => {
        const dateKey = insight.date.toISOString().split('T')[0]
        const existing = dailyData.get(dateKey) || {
          date: dateKey,
          roas: 0,
          spend: 0,
          revenue: 0,
          target: 3.0
        }

        existing.spend += insight.spend
        existing.revenue += insight.conversionValue
        existing.roas = existing.spend > 0 ? existing.revenue / existing.spend : 0

        dailyData.set(dateKey, existing)
      })

      return Array.from(dailyData.values()).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    } catch (error) {
      console.error('Error getting ROAS chart data:', error)
      throw error
    }
  }

  // Generate AI recommendations
  async generateAIRecommendations() {
    try {
      // Get recent campaign data
      const insights = await dbQueries.getLatestCampaignInsights()
      
      if (insights.length === 0) {
        console.log('No campaign data available for AI analysis')
        return []
      }

      // Convert to CampaignData format
      const campaignData: CampaignData[] = insights.map(insight => ({
        campaign_id: insight.campaignId,
        campaign_name: insight.campaignName,
        date_start: insight.date.toISOString().split('T')[0],
        spend: insight.spend,
        impressions: insight.impressions,
        clicks: insight.clicks,
        conversions: insight.conversions,
        conversion_value: insight.conversionValue,
        ctr: insight.ctr,
        cpc: insight.cpc,
        cpm: insight.cpm,
        roas: insight.roas,
        cpa: insight.cpa,
        cost_per_purchase: insight.costPerPurchase,
        frequency: insight.frequency,
        reach: insight.reach,
        relevance_score: insight.relevanceScore,
        quality_ranking: insight.qualityRanking as 'above_average' | 'average' | 'below_average'
      }))

      // Generate recommendations
      const recommendations = await this.aiEngine.generateRecommendations(campaignData)
      
      // Store recommendations in database
      const storedRecommendations = []
      for (const rec of recommendations) {
        const stored = await dbQueries.createAIRecommendation(rec)
        storedRecommendations.push(stored)
      }

      console.log(`Generated ${storedRecommendations.length} AI recommendations`)
      return storedRecommendations
    } catch (error) {
      console.error('Error generating AI recommendations:', error)
      throw error
    }
  }

  // Get AI recommendations
  async getAIRecommendations(filters?: {
    priority?: string
    implemented?: boolean
  }) {
    try {
      const recommendations = await dbQueries.getAIRecommendations(filters)
      
      // Convert to AIRecommendation format
      return recommendations.map(rec => ({
        id: rec.id,
        date: rec.date.toISOString().split('T')[0],
        campaign_id: rec.campaignId,
        type: rec.type as any,
        title: rec.title,
        description: rec.description,
        confidence_score: rec.confidenceScore,
        expected_impact: rec.expectedImpact,
        priority: rec.priority as any,
        action_required: rec.actionRequired,
        implemented: rec.implemented,
        created_at: rec.createdAt,
        updated_at: rec.updatedAt
      }))
    } catch (error) {
      console.error('Error getting AI recommendations:', error)
      throw error
    }
  }

  // Update recommendation status
  async updateRecommendationStatus(id: string, implemented: boolean) {
    try {
      return await dbQueries.updateRecommendationStatus(id, implemented)
    } catch (error) {
      console.error('Error updating recommendation status:', error)
      throw error
    }
  }

  // Get performance alerts
  async getPerformanceAlerts() {
    try {
      return await dbQueries.getActiveAlerts()
    } catch (error) {
      console.error('Error getting performance alerts:', error)
      throw error
    }
  }

  // Check for performance anomalies and create alerts
  async checkPerformanceAnomalies() {
    try {
      const insights = await dbQueries.getLatestCampaignInsights()
      const alerts = []

      for (const insight of insights) {
        // Check for ROAS drops
        if (insight.roas < 2.0) {
          alerts.push({
            campaignId: insight.campaignId,
            alertType: 'roas_drop',
            severity: 'high',
            message: `ROAS dropped to ${insight.roas.toFixed(2)} for campaign ${insight.campaignName}`,
            thresholdValue: 2.0,
            currentValue: insight.roas
          })
        }

        // Check for high CPA
        if (insight.cpa > 40) {
          alerts.push({
            campaignId: insight.campaignId,
            alertType: 'cpa_spike',
            severity: 'medium',
            message: `CPA increased to $${insight.cpa.toFixed(2)} for campaign ${insight.campaignName}`,
            thresholdValue: 40,
            currentValue: insight.cpa
          })
        }

        // Check for creative fatigue
        if (insight.frequency > 2.5) {
          alerts.push({
            campaignId: insight.campaignId,
            alertType: 'creative_fatigue',
            severity: 'medium',
            message: `High frequency (${insight.frequency.toFixed(1)}) detected for campaign ${insight.campaignName}`,
            thresholdValue: 2.5,
            currentValue: insight.frequency
          })
        }
      }

      // Store alerts
      for (const alert of alerts) {
        await dbQueries.createAlert(alert)
      }

      console.log(`Created ${alerts.length} performance alerts`)
      return alerts
    } catch (error) {
      console.error('Error checking performance anomalies:', error)
      throw error
    }
  }
}

export const dataService = new DataService()
export default dataService
