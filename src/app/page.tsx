'use client'

import React from 'react'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import KPICards from '@/components/dashboard/kpi-cards'
import ROASChart from '@/components/charts/roas-chart'
import CampaignTable from '@/components/dashboard/campaign-table'
import AIInsights from '@/components/dashboard/ai-insights'

export default function Home() {
  return (
    <DashboardLayout>
      {/* KPI Overview */}
      <div className="mb-8">
        <KPICards />
      </div>

      {/* ROAS Performance Chart */}
      <div className="mb-8">
        <ROASChart />
      </div>

      {/* Campaign Performance Table */}
      <div className="mb-8">
        <CampaignTable />
      </div>

      {/* AI Insights Panel */}
      <div>
        <AIInsights />
      </div>
    </DashboardLayout>
  )
}