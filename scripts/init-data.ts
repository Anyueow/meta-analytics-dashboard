#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import { dataService } from '../src/lib/services/data-service'

const prisma = new PrismaClient()

async function initializeData() {
  try {
    console.log('🚀 Initializing Meta Analytics Dashboard data...')

    // Check if we have any data
    const existingCampaigns = await prisma.campaignInsight.count()
    
    if (existingCampaigns > 0) {
      console.log('✅ Data already exists in database')
      return
    }

    // Get account ID from environment
    const accountId = process.env.META_ACCOUNT_ID
    
    if (!accountId) {
      console.log('⚠️  META_ACCOUNT_ID not set, skipping data sync')
      console.log('   Set META_ACCOUNT_ID in your .env.local file to sync real data')
      return
    }

    console.log('📊 Syncing campaign data from Meta API...')
    
    // Sync last 30 days of data
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 30)

    await dataService.syncCampaignData(accountId, {
      since: startDate.toISOString().split('T')[0],
      until: endDate.toISOString().split('T')[0]
    })

    console.log('🤖 Generating AI recommendations...')
    await dataService.generateAIRecommendations()

    console.log('🔍 Checking for performance anomalies...')
    await dataService.checkPerformanceAnomalies()

    console.log('✅ Data initialization completed successfully!')
    console.log('   You can now start the development server with: npm run dev')

  } catch (error) {
    console.error('❌ Error initializing data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  initializeData()
}

export default initializeData
