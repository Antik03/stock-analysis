import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TestStockData: React.FC = () => {
  const [symbol, setSymbol] = useState('TCS');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/stock/quote/${symbol}`);
      const data = await response.json();
      setResult({ type: 'quote', data });
    } catch (error) {
      setResult({ type: 'error', data: error });
    }
    setLoading(false);
  };

  const testHistorical = async () => {
    setLoading(true);
    try {
      const toDate = new Date().toISOString().split('T')[0];
      const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const response = await fetch(`/api/stock/historical/${symbol}?fromDate=${fromDate}&toDate=${toDate}`);
      const data = await response.json();
      setResult({ type: 'historical', data });
    } catch (error) {
      setResult({ type: 'error', data: error });
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Stock Data Test</h3>
      
      <div className="flex gap-2 items-center">
        <Input 
          value={symbol} 
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter symbol"
          className="w-32"
        />
        <Button onClick={testQuote} disabled={loading}>
          Test Quote
        </Button>
        <Button onClick={testHistorical} disabled={loading}>
          Test Historical
        </Button>
      </div>

      {loading && <div>Loading...</div>}
      
      {result && (
        <div className="bg-gray-100 p-3 rounded text-xs">
          <strong>{result.type}:</strong>
          <pre className="mt-2 overflow-auto max-h-40">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestStockData;