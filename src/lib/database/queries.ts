import { PrismaClient } from '@prisma/client'
import { CampaignData, AIRecommendation, PerformanceMetrics } from '@/types'

const prisma = new PrismaClient()

export class DatabaseQueries {
  // Campaign Insights
  async getCampaignInsights(dateRange?: { start: Date; end: Date }) {
    const whereClause = dateRange ? {
      date: {
        gte: dateRange.start,
        lte: dateRange.end
      }
    } : {}

    return await prisma.campaignInsight.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        recommendations: true,
        creatives: true,
        alerts: true,
        audiences: true
      }
    })
  }

  async getLatestCampaignInsights() {
    return await prisma.campaignInsight.findMany({
      where: {
        date: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { date: 'desc' }
    })
  }

  async upsertCampaignInsight(data: CampaignData & { date: Date }) {
    return await prisma.campaignInsight.upsert({
      where: {
        campaignId_date: {
          campaignId: data.campaign_id,
          date: data.date
        }
      },
      update: {
        campaignName: data.campaign_name,
        spend: data.spend,
        impressions: data.impressions,
        clicks: data.clicks,
        conversions: data.conversions,
        conversionValue: data.conversion_value,
        ctr: data.ctr,
        cpc: data.cpc,
        cpm: data.cpm,
        roas: data.roas,
        cpa: data.cpa,
        costPerPurchase: data.cost_per_purchase,
        frequency: data.frequency,
        reach: data.reach,
        relevanceScore: data.relevance_score,
        qualityRanking: data.quality_ranking
      },
      create: {
        campaignId: data.campaign_id,
        campaignName: data.campaign_name,
        date: data.date,
        spend: data.spend,
        impressions: data.impressions,
        clicks: data.clicks,
        conversions: data.conversions,
        conversionValue: data.conversion_value,
        ctr: data.ctr,
        cpc: data.cpc,
        cpm: data.cpm,
        roas: data.roas,
        cpa: data.cpa,
        costPerPurchase: data.cost_per_purchase,
        frequency: data.frequency,
        reach: data.reach,
        relevanceScore: data.relevance_score,
        qualityRanking: data.quality_ranking
      }
    })
  }

  // AI Recommendations
  async getAIRecommendations(filters?: {
    campaignId?: string
    priority?: string
    implemented?: boolean
  }) {
    const whereClause: any = {}
    
    if (filters?.campaignId) whereClause.campaignId = filters.campaignId
    if (filters?.priority) whereClause.priority = filters.priority
    if (filters?.implemented !== undefined) whereClause.implemented = filters.implemented

    return await prisma.aIRecommendation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })
  }

  async createAIRecommendation(recommendation: Omit<AIRecommendation, 'id' | 'created_at' | 'updated_at'>) {
    return await prisma.aIRecommendation.create({
      data: {
        campaignId: recommendation.campaign_id,
        date: new Date(recommendation.date),
        type: recommendation.type,
        title: recommendation.title,
        description: recommendation.description,
        confidenceScore: recommendation.confidence_score,
        expectedImpact: recommendation.expected_impact,
        priority: recommendation.priority,
        actionRequired: recommendation.action_required,
        implemented: recommendation.implemented || false
      }
    })
  }

  async updateRecommendationStatus(id: string, implemented: boolean) {
    return await prisma.aIRecommendation.update({
      where: { id },
      data: { 
        implemented,
        updatedAt: new Date()
      }
    })
  }

  // Performance Metrics
  async getPerformanceMetrics(dateRange?: { start: Date; end: Date }) {
    const whereClause = dateRange ? {
      date: {
        gte: dateRange.start,
        lte: dateRange.end
      }
    } : {}

    const insights = await prisma.campaignInsight.findMany({
      where: whereClause
    })

    const totalSpend = insights.reduce((sum, insight) => sum + insight.spend, 0)
    const totalRevenue = insights.reduce((sum, insight) => sum + insight.conversionValue, 0)
    const totalConversions = insights.reduce((sum, insight) => sum + insight.conversions, 0)
    const totalImpressions = insights.reduce((sum, insight) => sum + insight.impressions, 0)
    const totalClicks = insights.reduce((sum, insight) => sum + insight.clicks, 0)

    const metrics: PerformanceMetrics = {
      totalSpend,
      totalRevenue,
      totalConversions,
      averageROAS: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      averageCPA: totalConversions > 0 ? totalSpend / totalConversions : 0,
      averageCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      averageCPM: totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0,
      campaignCount: insights.length
    }

    return metrics
  }

  // Alerts
  async getActiveAlerts() {
    return await prisma.alertLog.findMany({
      where: { isAcknowledged: false },
      orderBy: { createdAt: 'desc' }
    })
  }

  async createAlert(alert: {
    campaignId: string
    alertType: string
    severity: string
    message: string
    thresholdValue: number
    currentValue: number
  }) {
    return await prisma.alertLog.create({
      data: {
        campaignId: alert.campaignId,
        alertType: alert.alertType,
        severity: alert.severity,
        message: alert.message,
        thresholdValue: alert.thresholdValue,
        currentValue: alert.currentValue
      }
    })
  }

  // Creative Insights
  async getCreativeInsights(campaignId?: string) {
    const whereClause = campaignId ? { campaignId } : {}
    
    return await prisma.creativeInsight.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    })
  }

  // Audience Performance
  async getAudiencePerformance(campaignId?: string) {
    const whereClause = campaignId ? { campaignId } : {}
    
    return await prisma.audiencePerformance.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    })
  }

  // Data cleanup
  async cleanupOldData(daysToKeep: number = 90) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
    
    await prisma.campaignInsight.deleteMany({
      where: { date: { lt: cutoffDate } }
    })
    
    await prisma.creativeInsight.deleteMany({
      where: { date: { lt: cutoffDate } }
    })
    
    await prisma.audiencePerformance.deleteMany({
      where: { date: { lt: cutoffDate } }
    })
  }
}

export const dbQueries = new DatabaseQueries()
export default dbQueries
