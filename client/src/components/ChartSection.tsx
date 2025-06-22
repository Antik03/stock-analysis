
import React, { useState } from 'react';
import StockChart from './StockChart';
import SimpleChart from './SimpleChart';
import AnalysisPrompt from './AnalysisPrompt';

interface ChartSectionProps {
  ticker: string;
  onAnalyze: (data: { ticker: string; range: string; timeframe: string; prompt: string }) => void;
  isAnalyzing: boolean;
}

const ChartSection: React.FC<ChartSectionProps> = ({ ticker, onAnalyze, isAnalyzing }) => {
  const [chartError, setChartError] = useState<string | null>(null);

  const handleAnalyze = (prompt: string) => {
    onAnalyze({
      ticker,
      range: '1M',
      timeframe: 'daily',
      prompt,
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 relative overflow-hidden">
      {/* Floating elements for consistency */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-mint/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8 fade-in-section">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-mint bg-clip-text text-transparent">
              {ticker} Analysis
            </h2>
            <p className="text-muted-foreground mt-2">Real-time chart data and AI-powered insights</p>
          </div>
        </div>
        
        {chartError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{chartError}</p>
          </div>
        )}
        
        <div className="mb-8 fade-in-section" style={{ animationDelay: '0.2s' }}>
          <SimpleChart symbol={ticker} />
        </div>
        
        <div className="max-w-2xl mx-auto fade-in-section" style={{ animationDelay: '0.4s' }}>
          <AnalysisPrompt onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
