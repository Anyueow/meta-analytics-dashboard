import { NextRequest } from 'next/server'
import { getWebhookHandler } from '@/lib/meta-api/webhooks'

export async function GET(request: NextRequest) {
  const webhookHandler = getWebhookHandler()
  return webhookHandler.verifyWebhookSetup(request)
}

export async function POST(request: NextRequest) {
  const webhookHandler = getWebhookHandler()
  return webhookHandler.handleWebhookNotification(request)
}