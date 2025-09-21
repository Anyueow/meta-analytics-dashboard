import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/services/data-service'

export async function POST(request: NextRequest) {
  try {
    const { accountId, dateRange } = await request.json()

    if (!accountId) {
      return NextResponse.json(
        { error: 'account_id is required' },
        { status: 400 }
      )
    }

    // Sync campaign data
    const campaignData = await dataService.syncCampaignData(accountId, dateRange)
    
    // Generate AI recommendations
    const recommendations = await dataService.generateAIRecommendations()
    
    // Check for performance anomalies
    const alerts = await dataService.checkPerformanceAnomalies()

    return NextResponse.json({
      success: true,
      data: {
        campaigns_synced: campaignData.length,
        recommendations_generated: recommendations.length,
        alerts_created: alerts.length
      },
      message: 'Data sync completed successfully'
    })
  } catch (error) {
    console.error('Error syncing data:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to sync data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const accountId = searchParams.get('account_id')

    if (!accountId) {
      return NextResponse.json(
        { error: 'account_id parameter is required' },
        { status: 400 }
      )
    }

    // Get current data status
    const kpis = await dataService.getDashboardKPIs()
    const campaigns = await dataService.getCampaigns()
    const recommendations = await dataService.getAIRecommendations()
    const alerts = await dataService.getPerformanceAlerts()

    return NextResponse.json({
      success: true,
      data: {
        kpis,
        campaigns_count: campaigns.length,
        recommendations_count: recommendations.length,
        alerts_count: alerts.length
      }
    })
  } catch (error) {
    console.error('Error getting data status:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to get data status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
