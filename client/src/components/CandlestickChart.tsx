
import React, { useEffect, useState } from 'react';

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  ticker: string;
  timeRange: string;
  granularity: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  ticker,
  timeRange,
  granularity,
}) => {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data generation
  const generateMockData = () => {
    const mockData: CandlestickData[] = [];
    const basePrice = 2500 + Math.random() * 1000;
    
    for (let i = 0; i < 50; i++) {
      const prevClose = i === 0 ? basePrice : mockData[i - 1].close;
      const open = prevClose + (Math.random() - 0.5) * 20;
      const close = open + (Math.random() - 0.5) * 50;
      const high = Math.max(open, close) + Math.random() * 30;
      const low = Math.min(open, close) - Math.random() * 30;
      
      mockData.push({
        time: new Date(Date.now() - (50 - i) * 86400000).toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000),
      });
    }
    return mockData;
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 1000);
  }, [ticker, timeRange, granularity]);

  const renderCandle = (candle: CandlestickData, index: number, maxHigh: number, minLow: number) => {
    const isGreen = candle.close > candle.open;
    const range = maxHigh - minLow;
    const bodyTop = Math.max(candle.open, candle.close);
    const bodyBottom = Math.min(candle.open, candle.close);
    
    const wickTop = ((maxHigh - candle.high) / range) * 300;
    const wickBottom = ((candle.low - minLow) / range) * 300;
    const bodyTopPos = ((maxHigh - bodyTop) / range) * 300;
    const bodyBottomPos = ((bodyBottom - minLow) / range) * 300;
    
    return (
      <g key={index} transform={`translate(${index * 8 + 20}, 0)`}>
        {/* Wick */}
        <line
          x1="0"
          y1={wickTop}
          x2="0"
          y2={320 - wickBottom}
          stroke={isGreen ? '#22c55e' : '#ef4444'}
          strokeWidth="1"
        />
        
        {/* Body */}
        <rect
          x="-2"
          y={bodyTopPos}
          width="4"
          height={Math.max(1, bodyBottomPos - bodyTopPos)}
          fill={isGreen ? '#22c55e' : '#ef4444'}
          opacity="0.8"
        />
      </g>
    );
  };

  if (loading) {
    return (
      <div className="h-80 bg-card rounded-lg flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
      </div>
    );
  }

  const maxHigh = Math.max(...data.map(d => d.high));
  const minLow = Math.min(...data.map(d => d.low));

  return (
    <div className="bg-card rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{ticker} - Candlestick Chart</h3>
      </div>
      
      <div className="h-80 overflow-x-auto">
        <svg width={Math.max(400, data.length * 8 + 40)} height="320" className="w-full">
          {data.map((candle, index) => 
            renderCandle(candle, index, maxHigh, minLow)
          )}
        </svg>
      </div>
    </div>
  );
};

export default CandlestickChart;
