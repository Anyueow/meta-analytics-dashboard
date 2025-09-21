import { MetaApiResponse, CampaignData } from '@/types'

export interface MetaApiConfig {
  accessToken: string
  appId: string
  appSecret: string
  apiVersion?: string
}

export interface CampaignInsightsParams {
  fields: string[]
  datePreset?: string
  timeRange?: {
    since: string
    until: string
  }
  level: 'account' | 'campaign' | 'adset' | 'ad'
  limit?: number
  breakdowns?: string[]
}

export class MetaApiClient {
  private config: MetaApiConfig
  private baseUrl: string

  constructor(config: MetaApiConfig) {
    this.config = config
    this.baseUrl = `https://graph.facebook.com/${config.apiVersion || 'v19.0'}`
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    // Add access token to all requests
    params.access_token = this.config.accessToken

    // Add parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join(','))
        } else if (typeof value === 'object') {
          url.searchParams.append(key, JSON.stringify(value))
        } else {
          url.searchParams.append(key, value.toString())
        }
      }
    })

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Meta API Error: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Meta API request failed:', error)
      throw error
    }
  }

  async getAdAccount(accountId: string) {
    return this.makeRequest(`/${accountId}`, {
      fields: 'id,name,account_status,currency,timezone_name,business'
    })
  }

  async getCampaigns(accountId: string, fields: string[] = ['id', 'name', 'status', 'objective']) {
    return this.makeRequest<MetaApiResponse<any>>(`/${accountId}/campaigns`, {
      fields: fields.join(','),
      limit: 100
    })
  }

  async getCampaignInsights(
    accountId: string,
    params: CampaignInsightsParams
  ): Promise<MetaApiResponse<CampaignData>> {
    const endpoint = `/${accountId}/insights`

    const requestParams: Record<string, any> = {
      fields: params.fields.join(','),
      level: params.level,
      limit: params.limit || 100
    }

    if (params.datePreset) {
      requestParams.date_preset = params.datePreset
    } else if (params.timeRange) {
      requestParams.time_range = params.timeRange
    }

    if (params.breakdowns) {
      requestParams.breakdowns = params.breakdowns.join(',')
    }

    return this.makeRequest<MetaApiResponse<CampaignData>>(endpoint, requestParams)
  }

  async getAdSetInsights(campaignId: string, fields: string[] = []) {
    return this.makeRequest(`/${campaignId}/adsets`, {
      fields: fields.join(','),
      limit: 100
    })
  }

  async getAdInsights(campaignId: string, fields: string[] = []) {
    return this.makeRequest(`/${campaignId}/ads`, {
      fields: fields.join(','),
      limit: 100
    })
  }

  async getCustomAudiences(accountId: string) {
    return this.makeRequest(`/${accountId}/customaudiences`, {
      fields: 'id,name,description,approximate_count,data_source'
    })
  }

  // Real-time data sync methods
  async syncCampaignData(accountId: string, dateRange?: { since: string; until: string }) {
    const insights = await this.getCampaignInsights(accountId, {
      fields: [
        'campaign_id',
        'campaign_name',
        'date_start',
        'spend',
        'impressions',
        'clicks',
        'actions',
        'action_values',
        'ctr',
        'cpc',
        'cpm',
        'frequency',
        'reach'
      ],
      level: 'campaign',
      timeRange: dateRange || {
        since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        until: new Date().toISOString().split('T')[0]
      },
      limit: 100
    })

    return this.transformInsightsData(insights.data)
  }

  private transformInsightsData(rawData: any[]): CampaignData[] {
    return rawData.map(item => {
      // Extract conversions and conversion value from actions array
      const conversions = this.extractActionValue(item.actions, 'purchase') || 0
      const conversionValue = this.extractActionValue(item.action_values, 'purchase') || 0

      // Calculate derived metrics
      const roas = item.spend > 0 ? conversionValue / item.spend : 0
      const cpa = conversions > 0 ? item.spend / conversions : 0
      const costPerPurchase = conversions > 0 ? item.spend / conversions : 0

      return {
        campaign_id: item.campaign_id,
        campaign_name: item.campaign_name,
        date_start: item.date_start,
        spend: parseFloat(item.spend || 0),
        impressions: parseInt(item.impressions || 0),
        clicks: parseInt(item.clicks || 0),
        conversions,
        conversion_value: conversionValue,
        ctr: parseFloat(item.ctr || 0),
        cpc: parseFloat(item.cpc || 0),
        cpm: parseFloat(item.cpm || 0),
        roas,
        cpa,
        cost_per_purchase: costPerPurchase,
        frequency: parseFloat(item.frequency || 0),
        reach: parseInt(item.reach || 0)
      }
    })
  }

  private extractActionValue(actions: any[] | undefined, actionType: string): number {
    if (!actions || !Array.isArray(actions)) return 0

    const action = actions.find(a => a.action_type === actionType)
    return action ? parseFloat(action.value || 0) : 0
  }

  // Webhook verification for real-time updates
  verifyWebhook(signature: string, body: string, secret: string): boolean {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    return signature === `sha256=${expectedSignature}`
  }

  // Rate limiting helper
  async withRateLimit<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    try {
      return await fn()
    } catch (error: any) {
      if (error.message.includes('rate limit') && retries > 0) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, 4 - retries) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.withRateLimit(fn, retries - 1)
      }
      throw error
    }
  }
}

// Singleton instance factory
let metaApiClient: MetaApiClient | null = null

export function getMetaApiClient(): MetaApiClient {
  if (!metaApiClient) {
    metaApiClient = new MetaApiClient({
      accessToken: process.env.META_ACCESS_TOKEN || '',
      appId: process.env.META_APP_ID || '',
      appSecret: process.env.META_APP_SECRET || '',
      apiVersion: 'v19.0'
    })
  }
  return metaApiClient
}

export default MetaApiClient