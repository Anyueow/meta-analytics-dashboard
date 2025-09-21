# Meta Ads Dashboard

A comprehensive Meta Ads campaign monitoring dashboard with AI-powered insights and recommendations built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Dashboard Features
- **Executive Summary Dashboard** - Key metrics overview with ROAS, spend, conversions, and CPA tracking
- **Real-time KPI Monitoring** - Live performance indicators with trend analysis
- **Campaign Performance Table** - Sortable, filterable campaign data with quick actions
- **ROAS Tracking Charts** - Interactive charts showing performance trends over time
- **AI-Powered Insights** - Automated recommendations for campaign optimization

### AI & Analytics
- **Performance Anomaly Detection** - Automatic detection of ROAS drops, CPA spikes, and CTR declines
- **Budget Optimization Recommendations** - AI-driven budget allocation suggestions
- **Creative Fatigue Detection** - Monitors ad frequency and suggests creative refreshes
- **Audience Intelligence** - Analyzes audience performance and suggests expansions
- **Predictive Insights** - Forecasts performance trends and budget pacing

### Meta Marketing API Integration
- **Real-time Data Sync** - Hourly synchronization with Meta Marketing API
- **Webhook Support** - Live updates for campaign changes
- **Rate Limiting & Error Handling** - Robust API integration with retry logic
- **Historical Data Backfill** - Import historical campaign performance data

## 📋 Prerequisites

- Node.js 18+ and npm
- Meta Business Account with Marketing API access
- PostgreSQL database
- OpenAI API key (for AI insights)

## 🛠 Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd meta-analytics-dashboard
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:
   ```env
   # Meta Marketing API Configuration
   META_APP_ID=your_meta_app_id
   META_APP_SECRET=your_meta_app_secret
   META_ACCESS_TOKEN=your_long_lived_token

   # Database Configuration
   DATABASE_URL=postgresql://user:pass@host:port/db

   # AI Configuration
   OPENAI_API_KEY=your_openai_key

   # Authentication
   NEXTAUTH_SECRET=your_auth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Webhooks
   WEBHOOK_VERIFY_TOKEN=your_webhook_token
   ```

3. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
src/
├── components/
│   ├── dashboard/          # Main dashboard components
│   │   ├── dashboard-layout.tsx
│   │   ├── kpi-cards.tsx
│   │   ├── campaign-table.tsx
│   │   └── ai-insights.tsx
│   ├── charts/            # Chart components
│   │   └── roas-chart.tsx
│   └── ui/                # Reusable UI components
│       └── card.tsx
├── lib/
│   ├── meta-api/          # Meta API integration
│   │   ├── client.ts
│   │   └── webhooks.ts
│   ├── ai/               # AI analysis engine
│   │   └── recommendations.ts
│   └── database/         # Database utilities
├── app/
│   ├── api/
│   │   ├── meta/         # Meta API endpoints
│   │   └── webhooks/     # Webhook handlers
│   └── page.tsx          # Main dashboard page
├── types/                # TypeScript definitions
└── hooks/                # Custom React hooks
```

## 🔧 Key Components

### Dashboard Layout (`components/dashboard/dashboard-layout.tsx`)
- Main application shell with header, navigation, and sidebar
- Responsive design with mobile-first approach
- Quick stats overview and alert system

### KPI Cards (`components/dashboard/kpi-cards.tsx`)
- Real-time performance metrics display
- Trend indicators with color-coded changes
- Support for multiple metric formats (currency, percentage, etc.)

### ROAS Chart (`components/charts/roas-chart.tsx`)
- Interactive line/area charts using Recharts
- Target ROAS comparison with performance indicators
- Customizable date ranges and aggregation options

### Campaign Table (`components/dashboard/campaign-table.tsx`)
- Sortable and filterable campaign performance data
- Quick action buttons (pause, resume, edit)
- Color-coded performance indicators
- Export functionality

### AI Insights (`components/dashboard/ai-insights.tsx`)
- AI-generated optimization recommendations
- Confidence scoring and priority classification
- Implementation tracking and dismissal options
- Performance impact predictions

## 🤖 AI-Powered Features

### Performance Analysis
The AI engine analyzes campaign data to identify:
- ROAS performance anomalies
- Budget allocation inefficiencies
- Creative fatigue indicators
- Audience saturation signals
- Optimization opportunities

### Recommendation Types
- **Budget Optimization** - Increase/decrease budget allocation
- **Creative Refresh** - Replace fatigued ad creatives
- **Audience Expansion** - Test new audience segments
- **Bidding Adjustments** - Optimize bidding strategies
- **Campaign Actions** - Pause underperforming campaigns

### Confidence Scoring
Each recommendation includes:
- Confidence score (0-100%)
- Expected impact estimation
- Priority level (Low/Medium/High/Critical)
- Specific implementation steps

## 📊 Meta Ads Integration

### Supported Metrics
- **Primary**: ROAS, CPA, CTR, Conversion Rate
- **Secondary**: CPM, CPC, Frequency, Reach
- **Diagnostic**: Relevance Score, Quality Ranking, Engagement Rate

### API Endpoints
- `/api/meta/campaigns` - Campaign data and actions
- `/api/webhooks/meta` - Real-time webhook handling
- Campaign insights with multiple breakdowns
- Historical data import and synchronization

### Webhook Events
Real-time updates for:
- Campaign status changes
- Budget modifications
- Ad creative updates
- Performance threshold breaches

## 🚀 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### AWS Deployment
1. Set up AWS RDS for PostgreSQL
2. Configure AWS Lambda for API functions
3. Use AWS CloudFront for CDN
4. Set up AWS SES for email notifications

## 📈 Performance Optimization

### Caching Strategy
- Server-side caching for campaign data
- Client-side caching with React Query
- CDN caching for static assets

### Database Optimization
- Indexed queries for performance metrics
- Aggregated views for dashboard data
- Scheduled data cleanup and archival

### API Optimization
- Rate limiting with exponential backoff
- Request batching for multiple campaigns
- Connection pooling for database queries

## 🔐 Security

### API Security
- OAuth 2.0 authentication with Meta
- JWT token validation
- Rate limiting and request validation
- Webhook signature verification

### Data Protection
- Environment variable encryption
- Database connection security
- HTTPS enforcement
- Input sanitization and validation

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration
```

## 📖 API Documentation

### Campaign Data Structure
```typescript
interface CampaignData {
  campaign_id: string
  campaign_name: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
  conversion_value: number
  roas: number
  cpa: number
  ctr: number
  // ... additional metrics
}
```

### AI Recommendation Structure
```typescript
interface AIRecommendation {
  id: string
  type: 'budget_increase' | 'creative_refresh' | 'audience_expansion'
  title: string
  description: string
  confidence_score: number
  expected_impact: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  action_required: string
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Review the [Documentation](https://docs.meta.com/marketing-apis/)
- Contact the development team

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---

**Built with ❤️ using Next.js, TypeScript, and the Meta Marketing API**