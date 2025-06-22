import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, ColorType, LineStyle } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChartData {
  time: number; // timestamp for TradingView
  open: number;
  high: number;
  low: number;
  close: number;
  value: number; // for line chart
}

interface StockChartProps {
  symbol: string;
  onError?: (error: string) => void;
}

const StockChart: React.FC<StockChartProps> = ({ symbol, onError }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [dataType, setDataType] = useState<'historical' | 'intraday'>('historical');

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#758694',
          width: 1,
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: '#758694',
          width: 1,
          style: LineStyle.Dashed,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.4)',
        textColor: '#d1d5db',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.4)',
        textColor: '#d1d5db',
        timeVisible: true,
        secondsVisible: false,
      },
      watermark: {
        color: 'rgba(171, 71, 188, 0.3)',
        visible: true,
        text: symbol,
        fontSize: 24,
        horzAlign: 'center',
        vertAlign: 'center',
      },
    });

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol]);

  // Calculate date range based on selection
  const getDateRange = () => {
    const now = new Date();
    const toDate = now.toISOString().split('T')[0];
    let fromDate: string;

    switch (timeRange) {
      case '1D':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        fromDate = yesterday.toISOString().split('T')[0];
        break;
      case '1W':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        fromDate = weekAgo.toISOString().split('T')[0];
        break;
      case '1M':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        fromDate = monthAgo.toISOString().split('T')[0];
        break;
      case '3M':
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        fromDate = threeMonthsAgo.toISOString().split('T')[0];
        break;
      case '1Y':
        const yearAgo = new Date(now);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        fromDate = yearAgo.toISOString().split('T')[0];
        break;
      default:
        fromDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
    }

    return { fromDate, toDate };
  };

  // Fetch and update chart data
  const fetchChartData = async () => {
    if (!symbol || !chartRef.current) return;

    setLoading(true);
    try {
      const { fromDate, toDate } = getDateRange();
      
      let url: string;
      if (dataType === 'intraday') {
        const interval = timeRange === '1D' ? '15min' : '60min';
        url = `/api/stock/intraday/${symbol}?fromDate=${fromDate}&toDate=${toDate}&interval=${interval}`;
      } else {
        url = `/api/stock/historical/${symbol}?fromDate=${fromDate}&toDate=${toDate}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const data = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('No data available for the selected period');
      }

      // Transform data for chart - TradingView expects timestamps
      const chartData: ChartData[] = data.map((item: any) => {
        // Convert date string to timestamp for TradingView
        const timestamp = Math.floor(new Date(item.date + 'T00:00:00').getTime() / 1000);
        return {
          time: timestamp as any,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          value: item.close, // for line chart
        };
      });

      // Sort by time
      chartData.sort((a, b) => (a.time as number) - (b.time as number));
      
      console.log('Chart data prepared:', chartData.slice(0, 3)); // Debug log

      // Clear existing series
      if (candlestickSeriesRef.current) {
        chartRef.current.removeSeries(candlestickSeriesRef.current);
        candlestickSeriesRef.current = null;
      }
      if (lineSeriesRef.current) {
        chartRef.current.removeSeries(lineSeriesRef.current);
        lineSeriesRef.current = null;
      }

      // Update chart based on type
      if (chartType === 'candlestick') {
        candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
        candlestickSeriesRef.current.setData(chartData);
      } else {
        lineSeriesRef.current = chartRef.current.addLineSeries({
          color: '#2563eb',
          lineWidth: 2,
        });
        const lineData = chartData.map(item => ({ time: item.time, value: item.value }));
        lineSeriesRef.current.setData(lineData);
      }

      console.log('Successfully updated chart with', chartData.length, 'data points');

      // Fit content to chart
      chartRef.current.timeScale().fitContent();

    } catch (error) {
      console.error('Chart data fetch error:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    if (chartRef.current && symbol) {
      fetchChartData();
    }
  }, [symbol, chartType, timeRange, dataType]);

  // Ensure chart resizes properly
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Select value={chartType} onValueChange={(value) => setChartType(value as 'candlestick' | 'line')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="candlestick">Candlestick</SelectItem>
              <SelectItem value="line">Line</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dataType} onValueChange={(value) => setDataType(value as 'historical' | 'intraday')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="historical">Historical</SelectItem>
              <SelectItem value="intraday">Intraday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-1">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="px-3 py-1 text-xs"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <div 
          ref={chartContainerRef} 
          className="w-full h-96 bg-card rounded-lg border"
          style={{ minHeight: '400px' }}
        />
        
        {loading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChart;