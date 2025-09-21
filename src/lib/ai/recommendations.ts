import { CampaignData, AIRecommendation } from '@/types'

export interface AIAnalysisConfig {
  zaiApiKey: string
  model?: string
  temperature?: number
}

export class AIRecommendationEngine {
  private config: AIAnalysisConfig

  constructor(config: AIAnalysisConfig) {
    this.config = {
      model: 'glm-4',
      temperature: 0.3,
      ...config
    }
  }

  async generateRecommendations(campaignData: CampaignData[]): Promise<AIRecommendation[]> {
    try {
      const analysis = await this.analyzeCampaignPerformance(campaignData)
      return this.convertAnalysisToRecommendations(analysis, campaignData)
    } catch (error) {
      console.error('Error generating AI recommendations:', error)
      return []
    }
  }

  private async analyzeCampaignPerformance(campaignData: CampaignData[]) {
    const prompt = this.buildAnalysisPrompt(campaignData)

    const response = await fetch('https://api.zhipuai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.zaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert Meta Ads performance analyst. Analyze the provided campaign data and generate actionable insights.

Focus on:
1. Performance anomalies (ROAS drops, CPA spikes, CTR declines)
2. Budget allocation efficiency
3. Creative fatigue indicators
4. Audience saturation signals
5. Optimization opportunities

Provide specific, actionable recommendations with expected impact estimates.
Format as structured JSON with confidence scores.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.config.temperature,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`Z AI API error: ${response.statusText}`)
    }

    const result = await response.json()
    return JSON.parse(result.choices[0].message.content)
  }

  private buildAnalysisPrompt(campaignData: CampaignData[]): string {
    const summary = this.generateCampaignSummary(campaignData)

    return `
Analyze the following Meta Ads campaign performance data and provide optimization recommendations:

CAMPAIGN SUMMARY:
${summary}

DETAILED CAMPAIGN DATA:
${JSON.stringify(campaignData, null, 2)}

Please provide recommendations in the following JSON format:
{
  "recommendations": [
    {
      "type": "budget_increase|budget_decrease|creative_refresh|audience_expansion|pause_campaign|bidding_adjustment",
      "campaign_id": "string",
      "title": "string",
      "description": "string",
      "confidence_score": number (0-1),
      "expected_impact": "string",
      "priority": "low|medium|high|critical",
      "action_required": "string"
    }
  ],
  "overall_insights": "string",
  "performance_alerts": ["string"]
}
    `
  }

  private generateCampaignSummary(campaignData: CampaignData[]): string {
    const totalSpend = campaignData.reduce((sum, c) => sum + c.spend, 0)
    const totalRevenue = campaignData.reduce((sum, c) => sum + c.conversion_value, 0)
    const totalConversions = campaignData.reduce((sum, c) => sum + c.conversions, 0)
    const avgROAS = totalRevenue / totalSpend
    const avgCPA = totalSpend / totalConversions

    const highPerformers = campaignData.filter(c => c.roas > 3.0)
    const lowPerformers = campaignData.filter(c => c.roas < 2.0)
    const fatigueRisk = campaignData.filter(c => c.frequency > 2.5)

    return `
Total Campaigns: ${campaignData.length}
Total Spend: $${totalSpend.toFixed(2)}
Total Revenue: $${totalRevenue.toFixed(2)}
Overall ROAS: ${avgROAS.toFixed(2)}
Average CPA: $${avgCPA.toFixed(2)}
Total Conversions: ${totalConversions}

Performance Segmentation:
- High Performers (ROAS > 3.0): ${highPerformers.length} campaigns
- Low Performers (ROAS < 2.0): ${lowPerformers.length} campaigns
- Creative Fatigue Risk (Freq > 2.5): ${fatigueRisk.length} campaigns

Key Metrics Ranges:
- ROAS: ${Math.min(...campaignData.map(c => c.roas)).toFixed(2)} - ${Math.max(...campaignData.map(c => c.roas)).toFixed(2)}
- CPA: $${Math.min(...campaignData.map(c => c.cpa)).toFixed(2)} - $${Math.max(...campaignData.map(c => c.cpa)).toFixed(2)}
- CTR: ${Math.min(...campaignData.map(c => c.ctr)).toFixed(2)}% - ${Math.max(...campaignData.map(c => c.ctr)).toFixed(2)}%
    `
  }

  private convertAnalysisToRecommendations(
    analysis: any,
    campaignData: CampaignData[]
  ): AIRecommendation[] {
    if (!analysis.recommendations) return []

    return analysis.recommendations.map((rec: any, index: number) => ({
      id: `ai_rec_${Date.now()}_${index}`,
      date: new Date().toISOString().split('T')[0],
      campaign_id: rec.campaign_id,
      type: rec.type,
      title: rec.title,
      description: rec.description,
      confidence_score: rec.confidence_score,
      expected_impact: rec.expected_impact,
      priority: rec.priority,
      action_required: rec.action_required,
      implemented: false,
      created_at: new Date(),
      updated_at: new Date()
    }))
  }

  // Performance anomaly detection
  detectAnomalies(campaignData: CampaignData[]): {
    roasDrops: CampaignData[]
    cpaSpikes: CampaignData[]
    ctrDeclines: CampaignData[]
    creativeFatigue: CampaignData[]
  } {
    return {
      roasDrops: campaignData.filter(c => c.roas < 2.0),
      cpaSpikes: campaignData.filter(c => c.cpa > 40),
      ctrDeclines: campaignData.filter(c => c.ctr < 1.5),
      creativeFatigue: campaignData.filter(c => c.frequency > 2.5)
    }
  }

  // Budget optimization suggestions
  optimizeBudgetAllocation(campaignData: CampaignData[]): {
    increase: CampaignData[]
    decrease: CampaignData[]
    pause: CampaignData[]
  } {
    const sorted = [...campaignData].sort((a, b) => b.roas - a.roas)

    return {
      increase: sorted.slice(0, Math.ceil(sorted.length * 0.3)).filter(c => c.roas > 3.0),
      decrease: sorted.slice(Math.ceil(sorted.length * 0.7)).filter(c => c.roas < 2.5 && c.roas > 1.5),
      pause: sorted.filter(c => c.roas < 1.5)
    }
  }
}

// Singleton factory
let aiEngine: AIRecommendationEngine | null = null

export function getAIRecommendationEngine(): AIRecommendationEngine {
  if (!aiEngine) {
    aiEngine = new AIRecommendationEngine({
      zaiApiKey: process.env.ZAI_API_KEY || '',
      model: 'glm-4',
      temperature: 0.3
    })
  }
  return aiEngine
}

export default AIRecommendationEngine