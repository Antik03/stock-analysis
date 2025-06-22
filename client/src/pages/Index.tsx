import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LandingHero from '@/components/LandingHero';
import HeroSection from '@/components/HeroSection';
import ChartSection from '@/components/ChartSection';
import AnalysisResults from '@/components/AnalysisResults';
import SearchSuggestions from '@/components/SearchSuggestions';
import Footer from '@/components/Footer';
import TestStockData from '@/components/TestStockData';

interface AnalysisData {
  ticker: string;
  range: string;
  timeframe: string;
  prompt: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'search' | 'chart'>('landing');
  const [currentTicker, setCurrentTicker] = useState<string>('');
  const [currentStockData, setCurrentStockData] = useState<{price: number, volume: number} | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showHeaderSuggestions, setShowHeaderSuggestions] = useState(false);
  
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const analysisResultsRef = useRef<HTMLDivElement>(null);
  const analysisHeaderRef = useRef<HTMLDivElement>(null);
  const headerSearchRef = useRef<HTMLDivElement>(null);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        setCurrentStep(state.step);
        setShowChart(state.showChart || false);
        setCurrentTicker(state.ticker || '');
        setSearchInput(state.searchInput || '');
        setAnalysisResults(state.analysisResults || []);
      } else {
        // No state, go back to landing
        setCurrentStep('landing');
        setShowChart(false);
        setCurrentTicker('');
        setSearchInput('');
        setAnalysisResults([]);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Push state when step changes
  useEffect(() => {
    const state = {
      step: currentStep,
      showChart,
      ticker: currentTicker,
      searchInput,
      analysisResults
    };
    
    if (currentStep !== 'landing') {
      window.history.pushState(state, '', window.location.pathname);
    }
  }, [currentStep, showChart, currentTicker, searchInput, analysisResults]);

  const handleStartAnalyzing = () => {
    setCurrentStep('search');
  };

  const handleSearch = async (ticker: string) => {
    setIsSearching(true);
    setCurrentTicker(ticker);
    setSearchInput(ticker);
    setCurrentStockData(null);
    
    // Fetch stock data
    try {
      const response = await fetch(`/api/stock/historical/${ticker.toUpperCase()}?fromDate=${new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]}&toDate=${new Date().toISOString().split('T')[0]}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const latestData = data[data.length - 1];
          setCurrentStockData({
            price: latestData.close || latestData.ltp || 0,
            volume: latestData.volume || 0
          });
        }
      }
    } catch (error) {
      console.log('Could not fetch stock data');
    }
    
    setTimeout(() => {
      setShowChart(true);
      setCurrentStep('chart');
      setIsSearching(false);
    }, 1500);
  };

  const handleNewSearch = async () => {
    if (searchInput.trim()) {
      setShowHeaderSuggestions(false);
      setCurrentStockData(null);
      
      // Fetch stock data for new search
      try {
        const response = await fetch(`/api/stock/historical/${searchInput.toUpperCase()}?fromDate=${new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]}&toDate=${new Date().toISOString().split('T')[0]}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const latestData = data[data.length - 1];
            setCurrentStockData({
              price: latestData.close || latestData.ltp || 0,
              volume: latestData.volume || 0
            });
          }
        }
      } catch (error) {
        console.log('Could not fetch stock data');
      }
      
      handleSearch(searchInput.toUpperCase());
    }
  };

  const handleHeaderSuggestionSelect = (selectedTicker: string) => {
    setSearchInput(selectedTicker);
    setShowHeaderSuggestions(false);
    handleSearch(selectedTicker);
  };

  const handleHeaderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setShowHeaderSuggestions(value.trim().length > 0);
  };

  // Close header suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerSearchRef.current && !headerSearchRef.current.contains(event.target as Node)) {
        setShowHeaderSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnalyze = async (data: AnalysisData) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResults([]);
    
    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Analyze ${data.ticker} stock comprehensively covering: 1) Trend Analysis, 2) Key Drivers, 3) Support & Resistance levels, 4) Volume Analysis, 5) Market Sentiment, 6) Risk Assessment, 7) Actionable Recommendations. Provide detailed insights for each area.`
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const analysisResult = await response.json();
      console.log('Analysis result received:', analysisResult);
      
      // Check if we have valid analysis data
      if (!analysisResult || !analysisResult.output) {
        throw new Error('No analysis data received from AI service');
      }
      
      // Parse the nested JSON output from N8N webhook
      let analysisData;
      try {
        analysisData = JSON.parse(analysisResult.output);
      } catch (e) {
        analysisData = { overview: analysisResult.output };
      }
      
      // Create exactly 6 cards from API response - no dummy data
      const results = [];
      
      // Define the exact 6 cards we want in order
      const cardMappings = [
        {
          key: 'overview',
          title: 'Overview',
          icon: '📋'
        },
        {
          key: 'MarketSnapshot',
          title: 'Market Snapshot',
          icon: '📊'
        },
        {
          key: 'NewsAnalysis',
          title: 'News Analysis',
          icon: '📰'
        },
        {
          key: 'TechnicalChartInterpretation',
          title: 'Technical Chart Analysis',
          icon: '📈'
        },
        {
          key: 'PriceActionAnalysis',
          title: 'Price Action Analysis',
          icon: '📉'
        },
        {
          key: 'StrategyAndRiskAssessment',
          title: 'Strategy & Risk Assessment',
          icon: '⚠️'
        }
      ];
      
      // Add cards only if data exists in API response
      cardMappings.forEach(mapping => {
        if (analysisData[mapping.key] && analysisData[mapping.key].trim()) {
          results.push({
            title: mapping.title,
            content: analysisData[mapping.key],
            icon: mapping.icon
          });
        }
      });
      
      // Handle DynamicLevels as a special card
      if (analysisData.DynamicLevels && typeof analysisData.DynamicLevels === 'object') {
        const dynamicLevels = analysisData.DynamicLevels;
        const stopLoss = dynamicLevels.StopLoss || '';
        const profitTarget = dynamicLevels.ProfitTarget || '';
        const entryZone = dynamicLevels.EntryZone || '';
        const exitZone = dynamicLevels.ExitZone || '';
        
        if (stopLoss || profitTarget || entryZone || exitZone) {
          const dynamicLevelsContent = `
            <div class="space-y-3">
              ${stopLoss ? `<div class="flex items-center gap-2"><span class="w-3 h-3 bg-red-500 rounded-full"></span><strong>Stop Loss:</strong> <span class="text-red-400">${stopLoss}</span></div>` : ''}
              ${profitTarget ? `<div class="flex items-center gap-2"><span class="w-3 h-3 bg-green-500 rounded-full"></span><strong>Profit Target:</strong> <span class="text-green-400">${profitTarget}</span></div>` : ''}
              ${entryZone ? `<div class="flex items-center gap-2"><span class="w-3 h-3 bg-blue-500 rounded-full"></span><strong>Entry Zone:</strong> <span class="text-blue-400">${entryZone}</span></div>` : ''}
              ${exitZone ? `<div class="flex items-center gap-2"><span class="w-3 h-3 bg-yellow-500 rounded-full"></span><strong>Exit Zone:</strong> <span class="text-yellow-400">${exitZone}</span></div>` : ''}
            </div>
          `;
          results.push({
            title: 'Dynamic Trading Levels',
            content: dynamicLevelsContent,
            icon: '🎯'
          });
        }
      }
      
      // Add Final Commentary as the last card if it exists
      const finalCommentary = analysisData['Final Commentary'] || analysisData.FinalCommentary || '';
      if (finalCommentary && finalCommentary.trim()) {
        results.push({
          title: 'Final Commentary',
          content: finalCommentary,
          icon: '💡'
        });
      }

      setAnalysisResults(results);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to get AI analysis');
      setAnalysisResults([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background - Always present */}
      <div className="animated-background" />
      
      {/* Floating Particles - Always present */}
      <div className="floating-particles">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Landing Hero */}
      {currentStep === 'landing' && (
        <div className={`landing-hero fade-in-section`}>
          <LandingHero onStartAnalyzing={handleStartAnalyzing} />
        </div>
      )}
      
      {/* Search Section */}
      {currentStep === 'search' && (
        <div ref={heroSectionRef} className="search-section slide-up-animation">
          <HeroSection onSearch={handleSearch} isSearching={isSearching} />
        </div>
      )}
      
      {/* Fixed Search Bar at Top - show when chart is active and no analysis results */}
      {currentStep === 'chart' && showChart && analysisResults.length === 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20 shadow-lg">
          <div className="max-w-6xl mx-auto p-4">
            {/* Horizontal Overview Card */}
            <div className="mb-4 glass-effect rounded-2xl border border-primary/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary">{currentTicker}</h3>
                    <p className="text-sm text-muted-foreground">NSE Stock Analysis</p>
                  </div>
                  <div className="flex gap-6 text-sm">
                    {currentStockData?.price ? (
                      <div>
                        <span className="text-muted-foreground">Price: </span>
                        <span className="font-semibold text-green-500">₹{currentStockData.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-muted-foreground">Price: </span>
                        <span className="font-semibold text-gray-400">Loading...</span>
                      </div>
                    )}
                    {currentStockData?.volume ? (
                      <div>
                        <span className="text-muted-foreground">Volume: </span>
                        <span className="font-semibold">{(currentStockData.volume / 1000000).toFixed(1)}M</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-muted-foreground">Volume: </span>
                        <span className="font-semibold text-gray-400">Loading...</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div ref={headerSearchRef} className="relative">
                    <Input
                      type="text"
                      placeholder={currentTicker}
                      value={searchInput}
                      onChange={handleHeaderInputChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleNewSearch()}
                      onFocus={() => searchInput.trim().length > 0 && setShowHeaderSuggestions(true)}
                      className="h-10 pr-10 glass-effect border-primary/30 focus:border-primary rounded-2xl"
                      disabled={isSearching}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    
                    <SearchSuggestions
                      query={searchInput}
                      onSelect={handleHeaderSuggestionSelect}
                      isVisible={showHeaderSuggestions && !isSearching}
                    />
                  </div>
                  <Button
                    onClick={handleNewSearch}
                    disabled={!searchInput.trim() || isSearching}
                    className="h-10 px-4 bg-gradient-to-r from-primary to-mint hover:from-primary/90 hover:to-mint/90 rounded-2xl text-white"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chart Section */}
      {currentStep === 'chart' && showChart && (
        <div className="chart-section slide-up-animation pt-32">
          <ChartSection
            ticker={currentTicker}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </div>
      )}
      
      {/* Analysis Error */}
      {analysisError && (
        <div className="analysis-section slide-up-animation px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-lg text-center">
              <div className="text-red-400 text-lg font-semibold mb-2">Analysis Failed</div>
              <div className="text-red-300 text-sm">{analysisError}</div>
              <div className="text-red-200 text-xs mt-3">
                Please check if your AI webhook service is running and accessible.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div ref={analysisResultsRef} className="analysis-section slide-up-animation px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div ref={analysisHeaderRef}>
              <AnalysisResults results={analysisResults} />
            </div>
          </div>
        </div>
      )}

      {/* Footer - Always visible at the bottom */}
      <Footer />
    </div>
  );
};

export default Index;
