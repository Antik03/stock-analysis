
import React from 'react';
import { Button } from '@/components/ui/button';

interface ChartControlsProps {
  timeRange: string;
  granularity: string;
  onTimeRangeChange: (range: string) => void;
  onGranularityChange: (granularity: string) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  timeRange,
  granularity,
  onTimeRangeChange,
  onGranularityChange,
}) => {
  const timeRanges = [
    { label: '1D', value: '1d' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '1Y', value: '1y' },
  ];

  const granularities = [
    { label: '1h', value: '1h' },
    { label: '1d', value: '1d' },
    { label: '1w', value: '1w' },
    { label: '1m', value: '1m' },
  ];

  return (
    <div className="flex flex-wrap gap-8 mb-6 justify-center">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Time Range</span>
        <div className="flex gap-1">
          {timeRanges.map(({ label, value }) => (
            <Button
              key={value}
              variant={timeRange === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange(value)}
              className="h-10 px-4 rounded-lg border-2 transition-all duration-200 hover:scale-105"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Granularity</span>
        <div className="flex gap-1">
          {granularities.map(({ label, value }) => (
            <Button
              key={value}
              variant={granularity === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onGranularityChange(value)}
              className="h-10 px-4 rounded-lg border-2 transition-all duration-200 hover:scale-105"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartControls;
