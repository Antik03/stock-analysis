import React, { useEffect, useRef, useState } from 'react';
import { UTCTimestamp } from 'lightweight-charts';

interface SimpleChartProps {
  symbol: string;
  timeRange: string;
  granularity?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
  symbol,
  timeRange,
  granularity = '1d'
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const toDate = new Date();
        let fromDate = new Date();
        switch (timeRange) {
          case '1d': fromDate.setDate(toDate.getDate() - 1); break;
          case '1w': fromDate.setDate(toDate.getDate() - 7); break;
          case '1m': fromDate.setMonth(toDate.getMonth() - 1); break;
          case '3m': fromDate.setMonth(toDate.getMonth() - 3); break;
          case '1y': fromDate.setFullYear(toDate.getFullYear() - 1); break;
        }

        const fromDateStr = fromDate.toISOString().split('T')[0];
        const toDateStr = toDate.toISOString().split('T')[0];
        
        let url = `/api/stock/historical/${symbol}?fromDate=${fromDateStr}&toDate=${toDateStr}`;
        if (granularity === '1h') {
          url = `/api/stock/intraday/${symbol}?fromDate=${fromDateStr}&toDate=${toDateStr}&interval=60min`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const stockData = await response.json();
        setData(stockData);
        console.log('Fetched stock data:', stockData.length, 'records');
      } catch (error) {
        console.error('Data fetch error:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeRange, granularity]);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const initChart = async () => {
      try {
        // Dynamic import to ensure proper loading
        const { createChart, ColorType } = await import('lightweight-charts');
        
        const chart = createChart(chartContainerRef.current!, {
          layout: {
            background: { type: ColorType.Solid, color: '#1e293b' },
            textColor: '#e2e8f0',
          },
          width: chartContainerRef.current!.clientWidth,
          height: 400,
          grid: {
            vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
            horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
          },
          rightPriceScale: {
            borderColor: 'rgba(197, 203, 206, 0.4)',
          },
          timeScale: {
            borderColor: 'rgba(197, 203, 206, 0.4)',
          },
        });

        const candlestickSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });

        const chartData = data.map((item: any) => ({
          time: Math.floor(new Date(item.date || item.datetime).getTime() / 1000) as UTCTimestamp,
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        chartData.sort((a: any, b: any) => a.time - b.time);
        candlestickSeries.setData(chartData);
        chart.timeScale().fitContent();
        
        console.log('Chart rendered successfully with', chartData.length, 'candles');

        return () => {
          chart.remove();
        };
      } catch (error) {
        console.error('Chart initialization error:', error);
        setError('Failed to initialize chart');
      }
    };

    const cleanup = initChart();
    
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [data]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{symbol} Stock Chart</h3>
        {loading && <div className="text-sm text-gray-400">Loading chart data...</div>}
      </div>
      
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      
      <div 
        ref={chartContainerRef} 
        className="w-full border border-gray-600 rounded bg-slate-800"
        style={{ height: '400px' }}
      />
      
      {data.length > 0 && (
        <div className="text-xs text-gray-400">
          Showing {data.length} trading days of historical data
        </div>
      )}
    </div>
  );
};

export default SimpleChart;