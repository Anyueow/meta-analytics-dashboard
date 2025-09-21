import { NextRequest, NextResponse } from 'next/server'
import { getMetaApiClient } from './client'

export interface WebhookEntry {
  id: string
  time: number
  changes: WebhookChange[]
}

export interface WebhookChange {
  field: string
  value: {
    campaign_id?: string
    adset_id?: string
    ad_id?: string
    event_type?: string
    object_type?: string
    object_type_id?: string
  }
}

export interface WebhookPayload {
  object: string
  entry: WebhookEntry[]
}

export class MetaWebhookHandler {
  private verifyToken: string

  constructor(verifyToken: string) {
    this.verifyToken = verifyToken
  }

  // Verify webhook subscription during setup
  verifyWebhookSetup(req: NextRequest): NextResponse {
    const searchParams = req.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('Webhook verification successful')
      return new NextResponse(challenge, { status: 200 })
    } else {
      console.error('Webhook verification failed')
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // Handle incoming webhook notifications
  async handleWebhookNotification(req: NextRequest): Promise<NextResponse> {
    try {
      const signature = req.headers.get('x-hub-signature-256')
      const body = await req.text()

      if (!signature) {
        return new NextResponse('Missing signature', { status: 400 })
      }

      // Verify webhook signature
      const metaApi = getMetaApiClient()
      const isValid = metaApi.verifyWebhook(
        signature,
        body,
        process.env.META_APP_SECRET || ''
      )

      if (!isValid) {
        return new NextResponse('Invalid signature', { status: 400 })
      }

      const payload: WebhookPayload = JSON.parse(body)

      // Process webhook entries
      for (const entry of payload.entry) {
        await this.processWebhookEntry(entry)
      }

      return new NextResponse('OK', { status: 200 })
    } catch (error) {
      console.error('Webhook processing error:', error)
      return new NextResponse('Internal Server Error', { status: 500 })
    }
  }

  private async processWebhookEntry(entry: WebhookEntry) {
    console.log('Processing webhook entry:', entry.id)

    for (const change of entry.changes) {
      await this.processWebhookChange(change)
    }
  }

  private async processWebhookChange(change: WebhookChange) {
    const { field, value } = change

    switch (field) {
      case 'campaigns':
        await this.handleCampaignChange(value)
        break
      case 'ads':
        await this.handleAdChange(value)
        break
      case 'adsets':
        await this.handleAdSetChange(value)
        break
      default:
        console.log('Unhandled webhook change field:', field)
    }
  }

  private async handleCampaignChange(value: WebhookChange['value']) {
    if (!value.campaign_id) return

    console.log('Campaign change detected:', value.campaign_id)

    // Trigger campaign data sync
    try {
      // This would typically update your database
      // For now, we'll just log the event
      console.log('Campaign update:', {
        campaignId: value.campaign_id,
        eventType: value.event_type,
        objectType: value.object_type
      })

      // Example: Sync specific campaign data
      // await syncCampaignData(value.campaign_id)
    } catch (error) {
      console.error('Error handling campaign change:', error)
    }
  }

  private async handleAdChange(value: WebhookChange['value']) {
    if (!value.ad_id) return

    console.log('Ad change detected:', value.ad_id)

    // Handle ad-specific changes
    try {
      console.log('Ad update:', {
        adId: value.ad_id,
        eventType: value.event_type,
        objectType: value.object_type
      })

      // Example: Update ad performance data
      // await syncAdData(value.ad_id)
    } catch (error) {
      console.error('Error handling ad change:', error)
    }
  }

  private async handleAdSetChange(value: WebhookChange['value']) {
    if (!value.adset_id) return

    console.log('AdSet change detected:', value.adset_id)

    // Handle adset-specific changes
    try {
      console.log('AdSet update:', {
        adsetId: value.adset_id,
        eventType: value.event_type,
        objectType: value.object_type
      })

      // Example: Update adset targeting data
      // await syncAdSetData(value.adset_id)
    } catch (error) {
      console.error('Error handling adset change:', error)
    }
  }
}

// Webhook subscription management
export async function subscribeToWebhooks(accountId: string, callbackUrl: string) {
  const metaApi = getMetaApiClient()

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${accountId}/subscribed_apps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: process.env.META_ACCESS_TOKEN,
        subscribed_fields: ['campaigns', 'ads', 'adsets'],
        callback_url: callbackUrl,
        verify_token: process.env.WEBHOOK_VERIFY_TOKEN
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to subscribe to webhooks: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Webhook subscription successful:', result)
    return result
  } catch (error) {
    console.error('Error subscribing to webhooks:', error)
    throw error
  }
}

export async function unsubscribeFromWebhooks(accountId: string) {
  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${accountId}/subscribed_apps`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: process.env.META_ACCESS_TOKEN
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to unsubscribe from webhooks: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Webhook unsubscription successful:', result)
    return result
  } catch (error) {
    console.error('Error unsubscribing from webhooks:', error)
    throw error
  }
}

// Singleton webhook handler
let webhookHandler: MetaWebhookHandler | null = null

export function getWebhookHandler(): MetaWebhookHandler {
  if (!webhookHandler) {
    webhookHandler = new MetaWebhookHandler(process.env.WEBHOOK_VERIFY_TOKEN || '')
  }
  return webhookHandler
}