export interface CampaignData {
  campaign_id: string;
  campaign_name: string;
  date_start: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  conversion_value: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  cpa: number;
  cost_per_purchase: number;
  frequency: number;
  reach: number;
  relevance_score?: number;
  quality_ranking?: 'above_average' | 'average' | 'below_average';
}

export interface AIRecommendation {
  id: string;
  date: string;
  campaign_id: string;
  type: 'budget_increase' | 'budget_decrease' | 'pause_campaign' | 'creative_refresh' | 'audience_expansion' | 'bidding_adjustment';
  title: string;
  description: string;
  confidence_score: number;
  expected_impact: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action_required: string;
  implemented?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DashboardKPI {
  label: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'percentage' | 'number' | 'decimal';
  icon?: string;
}

export interface CampaignInsight {
  id: string;
  campaign_id: string;
  date: string;
  insights: CampaignData;
  created_at: Date;
}

export interface CreativeInsight {
  id: string;
  ad_id: string;
  campaign_id: string;
  creative_name: string;
  date: string;
  impressions: number;
  clicks: number;
  ctr: number;
  frequency: number;
  fatigue_score: number;
  performance_score: number;
  created_at: Date;
}

export interface AlertLog {
  id: string;
  campaign_id: string;
  alert_type: 'roas_drop' | 'cpa_spike' | 'budget_pacing' | 'creative_fatigue' | 'audience_saturation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold_value: number;
  current_value: number;
  is_acknowledged: boolean;
  created_at: Date;
  acknowledged_at?: Date;
}

export interface AudiencePerformance {
  id: string;
  campaign_id: string;
  audience_name: string;
  audience_type: 'lookalike' | 'interest' | 'custom' | 'detailed';
  size: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  roas: number;
  cpa: number;
  overlap_percentage?: number;
  date: string;
  created_at: Date;
}

export interface MetaApiResponse<T> {
  data: T[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
}

export interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface PerformanceMetrics {
  totalSpend: number;
  totalRevenue: number;
  totalConversions: number;
  averageROAS: number;
  averageCPA: number;
  averageCTR: number;
  averageCPM: number;
  campaignCount: number;
}

export interface FilterOptions {
  dateRange: {
    start: Date;
    end: Date;
  };
  campaigns?: string[];
  performanceThreshold?: {
    minROAS?: number;
    maxCPA?: number;
    minCTR?: number;
  };
  status?: 'active' | 'paused' | 'all';
}