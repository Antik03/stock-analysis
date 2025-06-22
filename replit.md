# Stock Analysis Platform

## Overview
A comprehensive stock analysis platform that provides real-time stock data visualization using TradingView's Lightweight Charts library integrated with Samco API for Indian stock market data. The application features a modern React frontend with a Node.js/Express backend.

## Architecture
- **Frontend**: React 18 with TypeScript, Tailwind CSS, Radix UI components
- **Backend**: Node.js with Express, TypeScript
- **Charts**: TradingView Lightweight Charts for candlestick and line charts
- **Data Source**: Samco API for real-time Indian stock market data
- **Build Tool**: Vite for fast development and building

## Key Features
- Stock search with real-time data
- Interactive candlestick and line charts
- Multiple timeframes (1D, 1W, 1M, 3M, 1Y)
- Historical and intraday data support
- Responsive design with modern UI

## API Endpoints
- `/api/stock/quote/:symbol` - Get current stock quote from Samco API
- `/api/stock/historical/:symbol` - Get historical stock data (requires fromDate, toDate params)
- `/api/stock/intraday/:symbol` - Get intraday stock data (requires fromDate, toDate, interval params)
- `/api/analysis` - Send stock analysis request to N8N webhook (requires prompt in body)

## Usage Instructions
1. **Stock Charts**: Search for any NSE stock symbol (e.g., TCS, RELIANCE, HCLTECH) to view real-time candlestick charts
2. **AI Analysis**: Click "Analyze" button after viewing a chart to get AI-powered insights
3. **N8N Webhook**: To activate AI analysis, go to your N8N workflow and click "Execute workflow" to register the webhook in test mode

## Environment Variables
- `SAMCO_USER_ID` - Samco trading account username
- `SAMCO_PASSWORD` - Samco trading account password
- `SAMCO_YOB` - Year of birth for Samco authentication

## Recent Changes
- **2025-06-22**: Migrated from Lovable to Replit environment
- **2025-06-22**: Integrated Samco API service for stock data
- **2025-06-22**: Added TradingView Lightweight Charts with candlestick visualization
- **2025-06-22**: Created backend API routes for stock data and AI analysis
- **2025-06-22**: Configured Samco credentials for data access
- **2025-06-22**: Integrated AI analysis webhook for comprehensive insights
- **2025-06-22**: Fixed chart rendering issues with dynamic imports
- **2025-06-22**: Updated analysis cards to use dynamic naming based on API response keys
- **2025-06-22**: Removed recommendation card as requested, implemented filtering for empty sections
- **2025-06-22**: Added DynamicLevels card with colorful formatting for entry/exit points
- **2025-06-22**: Renamed Final Commentary to "Chart Data & AI-Powered Insights"
- **2025-06-22**: Enhanced analysis cards with HTML rendering for better visual presentation
- **2025-06-22**: Fixed price/volume display to show real Samco data instead of dummy values
- **2025-06-22**: Implemented comprehensive NSE stock database with 200+ listed stocks
- **2025-06-22**: Added intelligent stock search with symbol and company name matching

## Project Status
✓ Migration completed successfully
✓ Stock data API integrated with Samco
✓ TradingView Lightweight Charts implemented
✓ Historical data working properly
✓ Authentication configured
✓ Backend API routes functional

## Known Issues
- Quote API has parameter format issues (using historical data fallback)
- Chart renders with live Samco historical data

## Usage
1. Search for any NSE stock symbol (e.g., TCS, RELIANCE, INFY)
2. View interactive candlestick/line charts
3. Switch between timeframes (1D, 1W, 1M, 3M, 1Y)
4. Toggle between historical and intraday data