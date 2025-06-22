import React from 'react';
import { Button } from '@/components/ui/button';

interface ChartControlsProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  const timeRanges = [
    { label: '1D', value: '1d' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1m' },
    { label: '3M', value: '3m' },
    { label: '1Y', value: '1y' },
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
    </div>
  );
};

export default ChartControls;
