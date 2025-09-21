import { NextRequest, NextResponse } from 'next/server'
import { getMetaApiClient } from '@/lib/meta-api/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accountId = searchParams.get('account_id')
    const dateRange = searchParams.get('date_range') || '30'

    if (!accountId) {
      return NextResponse.json(
        { error: 'account_id parameter is required' },
        { status: 400 }
      )
    }

    const metaApi = getMetaApiClient()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - parseInt(dateRange))

    const insights = await metaApi.withRateLimit(async () => {
      return await metaApi.syncCampaignData(accountId, {
        since: startDate.toISOString().split('T')[0],
        until: endDate.toISOString().split('T')[0]
      })
    })

    return NextResponse.json({
      success: true,
      data: insights,
      metadata: {
        account_id: accountId,
        date_range: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        },
        total_campaigns: insights.length
      }
    })
  } catch (error) {
    console.error('Error fetching campaign data:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch campaign data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { account_id, action, campaign_id, params } = body

    if (!account_id || !action || !campaign_id) {
      return NextResponse.json(
        { error: 'account_id, action, and campaign_id are required' },
        { status: 400 }
      )
    }

    const metaApi = getMetaApiClient()

    switch (action) {
      case 'pause':
        // Implement campaign pause logic
        console.log(`Pausing campaign ${campaign_id}`)
        break
      case 'resume':
        // Implement campaign resume logic
        console.log(`Resuming campaign ${campaign_id}`)
        break
      case 'update_budget':
        // Implement budget update logic
        console.log(`Updating budget for campaign ${campaign_id}:`, params)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Campaign ${action} action completed successfully`,
      campaign_id
    })
  } catch (error) {
    console.error('Error executing campaign action:', error)

    return NextResponse.json(
      {
        error: 'Failed to execute campaign action',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}