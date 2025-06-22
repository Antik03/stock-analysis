import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchSuggestions from './SearchSuggestions';
import { isValidNSETicker } from '@/lib/utils';

interface HeroSectionProps {
  onSearch: (ticker: string) => void;
  isSearching: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, isSearching }) => {
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    const ticker = searchInput.trim().toUpperCase();
    
    if (!ticker) {
      setError('Please enter a stock ticker');
      return;
    }

    if (!isValidNSETicker(ticker)) {
      setError(`"${ticker}" is not a valid NSE stock ticker. Please select from the suggestions.`);
      return;
    }

    setError(null);
    setShowSuggestions(false);
    onSearch(ticker);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setError(null);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (ticker: string) => {
    setSearchInput(ticker);
    setShowSuggestions(false);
    setError(null);
    onSearch(ticker);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Additional floating elements for consistency */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-lightblue/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500" />
      <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-lightblue/10 rounded-full blur-2xl animate-pulse delay-[2000ms]" />

      <div className="w-full max-w-2xl mx-auto text-center relative z-10">
        <div className="mb-8 fade-in-section">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-lightblue to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
            Stock Analysis
          </h1>
        </div>
        
        <div className="space-y-6 fade-in-section" style={{ animationDelay: '0.3s' }}>
          <div ref={containerRef} className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter NSE ticker, e.g. RELIANCE"
              value={searchInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => searchInput.trim().length > 0 && setShowSuggestions(true)}
              className="h-16 text-lg px-6 pr-16 glass-effect border-2 border-primary/30 focus:border-primary glow-effect rounded-2xl"
              disabled={isSearching}
            />
            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            
            <SearchSuggestions
              query={searchInput}
              onSelect={handleSuggestionSelect}
              isVisible={showSuggestions && !isSearching}
            />
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={!searchInput.trim() || isSearching}
            className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-primary to-mint hover:from-primary/90 hover:to-mint/90 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-primary/50 glass-effect border border-primary/30 rounded-2xl text-white"
          >
            {isSearching ? '🔍 Analyzing...' : '🚀 Search'}
          </Button>
        </div>
        {error && (
          <div className="absolute top-full left-0 right-0 mt-2 text-sm text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
