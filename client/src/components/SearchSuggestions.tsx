import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { searchNSEStocks } from '@/lib/utils';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (ticker: string) => void;
  isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSelect, isVisible }) => {
  if (!isVisible || !query.trim()) return null;

  const filteredStocks = searchNSEStocks(query);

  if (filteredStocks.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 z-50 mt-1">
        <div className="glass-effect border border-primary/20 rounded-2xl shadow-lg overflow-hidden">
          <Command className="w-full">
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm text-red-500">
                No valid NSE ticker found matching "{query}"
              </CommandEmpty>
            </CommandList>
          </Command>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1">
      <div className="glass-effect border border-primary/20 rounded-2xl shadow-lg overflow-hidden">
        <Command className="w-full">
          <CommandList>
            <CommandGroup>
              {filteredStocks.map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  onSelect={() => onSelect(stock.symbol)}
                  className="px-4 py-3 cursor-pointer hover:bg-primary/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">₹</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="font-semibold text-primary text-left">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground text-left truncate">{stock.name}</div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default SearchSuggestions;
