# Stock Whisper Insights

A modern web application for AI-powered stock analysis and insights. Get comprehensive analysis of NSE stocks with real-time data visualization and AI-generated insights.

## Features

- 📊 Real-time stock data visualization
- 🤖 AI-powered stock analysis
- 📈 Technical analysis and market insights
- 🎯 Strategy and risk assessment
- 💹 Price action analysis
- 📰 News sentiment analysis
- 🔍 Smart stock search with suggestions

## Prerequisites

Before running the application, make sure you have:

- Node.js (v16 or higher)
- npm (Node Package Manager)
- SAMCO trading account credentials

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# SAMCO API Credentials
SAMCO_USER_ID=your_user_id
SAMCO_PASSWORD=your_password
SAMCO_YOB=your_year_of_birth

# N8N Webhook URL
N8N_WEBHOOK_URL=https://abhi1234.app.n8n.cloud/webhook/4a73c746-83ec-4c1f-bdcd-d681a9769d3c
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-whisper-insights-forge
```

2. Install dependencies for both client and server:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

This will start both the backend server and frontend development server:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

Note: If port 5000 is already in use, you can modify the port in `server/index.ts`.

## Troubleshooting

### Common Issues

1. **Port 5000 Already in Use**
   ```
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   Solution:
   - Kill the process using port 5000: `lsof -i :5000` then `kill -9 PID`
   - Or modify the port in `server/index.ts`

2. **SAMCO Authentication Error**
   ```
   Authentication required - please set SAMCO_USER_ID, SAMCO_PASSWORD, SAMCO_YOB env variables
   ```
   Solution:
   - Ensure your `.env` file exists and contains valid SAMCO credentials
   - Check if the credentials are correct
   - Verify that the environment variables are being loaded properly

## Project Structure

```
stock-whisper-insights-forge/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   └── pages/        # Page components
├── server/                # Backend Express server
│   ├── routes.ts         # API routes
│   ├── samcoService.ts   # SAMCO API integration
│   └── index.ts          # Server entry point
└── shared/               # Shared types and utilities
```

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI
  - Vite

- Backend:
  - Node.js
  - Express
  - TypeScript
  - SAMCO API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 