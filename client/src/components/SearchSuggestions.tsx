
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (ticker: string) => void;
  isVisible: boolean;
}

// Mock NSE tickers database - in real app this would come from an API
const NSE_TICKERS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'SBIN', 'BHARTIARTL',
  'ITC', 'KOTAKBANK', 'LT', 'ASIANPAINT', 'AXISBANK', 'MARUTI', 'SUNPHARMA', 'TITAN',
  'ULTRACEMCO', 'NESTLEIND', 'WIPRO', 'ONGC', 'NTPC', 'POWERGRID', 'BAJFINANCE',
  'HCLTECH', 'COALINDIA', 'TATAMOTORS', 'BAJAJFINSV', 'GRASIM', 'ADANIPORTS',
  'TECHM', 'JSWSTEEL', 'TATASTEEL', 'HINDALCO', 'CIPLA', 'DRREDDY', 'BRITANNIA',
  'DIVISLAB', 'EICHERMOT', 'HEROMOTOCO', 'BAJAJ-AUTO', 'INDUSINDBK', 'SHREECEM',
  'UPL', 'GODREJCP', 'PIDILITIND', 'MARICO', 'COLPAL', 'MCDOWELL-N', 'DABUR',
  'LUPIN', 'GAIL', 'IOC', 'BPCL', 'VEDL', 'SAIL', 'NMDC', 'BANKBARODA'
];

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSelect, isVisible }) => {
  if (!isVisible || !query.trim()) return null;

  const filteredTickers = NSE_TICKERS.filter(ticker =>
    ticker.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8); // Limit to 8 suggestions

  if (filteredTickers.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1">
      <div className="glass-effect border border-primary/20 rounded-2xl shadow-lg overflow-hidden">
        <Command>
          <CommandList>
            <CommandGroup>
              {filteredTickers.map((ticker) => (
                <CommandItem
                  key={ticker}
                  onSelect={() => onSelect(ticker)}
                  className="px-4 py-3 cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">₹</span>
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{ticker}</div>
                      <div className="text-xs text-muted-foreground">NSE Stock</div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {filteredTickers.length === 0 && (
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No tickers found matching "{query}"
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default SearchSuggestions;
