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

interface AnalysisResult {
  title: string;
  content: string;
  icon: string;
}

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
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [analysisOverview, setAnalysisOverview] = useState<string | null>(null);
  const [finalCommentary, setFinalCommentary] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showHeaderSuggestions, setShowHeaderSuggestions] = useState(false);
  const [timeRange, setTimeRange] = useState('1m');
  const [nseStocks, setNseStocks] = useState<Array<{symbol: string, name: string}>>([]);
  
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const analysisResultsRef = useRef<HTMLDivElement>(null);
  const analysisHeaderRef = useRef<HTMLDivElement>(null);
  const headerSearchRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

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
    
    // Cleanup polling on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
    };
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

  // Load NSE stocks data
  useEffect(() => {
    const loadNSEStocks = async () => {
      try {
        const response = await fetch('/nse_equity_stocks.csv');
        const text = await response.text();
        const stocks = text.split('\n').slice(1).map(line => {
          const [symbol, name] = line.split(',');
          return { symbol: symbol?.trim(), name: name?.trim() };
        }).filter(stock => stock.symbol && stock.name);
        setNseStocks(stocks);
      } catch (error) {
        console.error('Failed to load NSE stocks:', error);
      }
    };
    loadNSEStocks();
  }, []);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

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
    setAnalysisOverview(null);
    setFinalCommentary(null);

    // Stop any previous polling
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }

    try {
      // 1. Start the analysis job
      const startResponse = await fetch('https://abhi1234.app.n8n.cloud/webhook/92686492-c65e-4693-a757-67765f04d0fc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `${data.ticker}, ${data.prompt}` }),
      });

      if (!startResponse.ok) {
        throw new Error('Failed to start analysis job');
      }

      const { jobId } = await startResponse.json();

      // 2. Poll for results
      const poll = async () => {
        // If polling has been stopped, do nothing
        if (!pollingRef.current) return;

        try {
          const statusResponse = await fetch(`https://abhi1234.app.n8n.cloud/webhook/5e25cc8c-8400-4e41-9d61-c4a487a67aea/status/${jobId}`);
          if (!statusResponse.ok) {
            console.warn(`Polling request failed with status: ${statusResponse.status}`);
            // Schedule the next poll even if this one failed
            pollingRef.current = setTimeout(poll, 10000);
            return;
          }

          const resultData = await statusResponse.json();
          console.log('Poll response:', resultData);

          if (resultData.status === 'done') {
            // Stop polling immediately
            if (pollingRef.current) {
              clearTimeout(pollingRef.current);
              pollingRef.current = null;
            }

            try {
              console.log('Attempting to parse result:', resultData.result);
              const analysisData = JSON.parse(resultData.result);

              // Helper to format the content for each card
              const formatCardContent = (key: string, data: any): string => {
                if (!data) return 'No data available.';
                let content = [];
                switch (key) {
                  case 'MarketSnapshot':
                    if (data.current_price) content.push(`<strong>Current Price:</strong> ${data.current_price}`);
                    if (data.day_high_low) content.push(`<strong>Day High/Low:</strong> ${data.day_high_low}`);
                    if (data['52w_range']) content.push(`<strong>52w Range:</strong> ${data['52w_range']}`);
                    if (data.previous_close) content.push(`<strong>Previous Close:</strong> ${data.previous_close}`);
                    if (data.volume) content.push(`<strong>Volume:</strong> ${data.volume.toLocaleString()}`);
                    if (data['5_day_closes']) content.push(`<strong>5 Day Closes:</strong> ${data['5_day_closes'].join(', ')}`);
                    if (data.summary) content.push(`<br/><strong>Summary:</strong><br/>${data.summary.replace(/\n/g, '<br/>')}`);
                    if (data.TimingRecommendation) content.push(`<br/><strong>Timing Recommendation:</strong><br/>${data.TimingRecommendation.replace(/\n/g, '<br/>')}`);
                    if (data.ResultInterpretation) content.push(`<br/><strong>Result Interpretation:</strong><br/>${data.ResultInterpretation.replace(/\n/g, '<br/>')}`);
                    return content.join('<br/>');
                  
                  case 'FundamentalsAndEvents':
                    if (data.pe_ratio) content.push(`<strong>P/E Ratio:</strong> ${data.pe_ratio}`);
                    if (data.roce) content.push(`<strong>ROCE:</strong> ${data.roce}%`);
                    if (data.upcoming_events && data.upcoming_events.length > 0) {
                      const events = data.upcoming_events.map((e: any) => `<li>${e.event} (${e.date})</li>`).join('');
                      content.push(`<br/><strong>Upcoming Events:</strong><ul>${events}</ul>`);
                    }
                    if (data.summary) content.push(`<br/><strong>Summary:</strong><br/>${data.summary.replace(/\n/g, '<br/>')}`);
                    if (data.TimingRecommendation) content.push(`<br/><strong>Timing Recommendation:</strong><br/>${data.TimingRecommendation.replace(/\n/g, '<br/>')}`);
                    if (data.ResultInterpretation) content.push(`<br/><strong>Result Interpretation:</strong><br/>${data.ResultInterpretation.replace(/\n/g, '<br/>')}`);
                    return content.join('<br/>');
        
                  case 'TechnicalChartInterpretation':
                    if (data.candlestick_pattern) content.push(`<strong>Candlestick Pattern:</strong> ${data.candlestick_pattern}`);
                    if (data.macd_status) content.push(`<strong>MACD Status:</strong> ${data.macd_status}`);
                    if (data.rsi_value) content.push(`<strong>RSI Value:</strong> ${data.rsi_value}`);
                    if (data.support_resistance) content.push(`<strong>Support/Resistance:</strong> ${data.support_resistance.join(', ')}`);
                    if (data.summary) content.push(`<br/><strong>Summary:</strong><br/>${data.summary.replace(/\n/g, '<br/>')}`);
                    if (data.TimingRecommendation) content.push(`<br/><strong>Timing Recommendation:</strong><br/>${data.TimingRecommendation.replace(/\n/g, '<br/>')}`);
                    if (data.ResultInterpretation) content.push(`<br/><strong>Result Interpretation:</strong><br/>${data.ResultInterpretation.replace(/\n/g, '<br/>')}`);
                    return content.join('<br/>');
                    
                  case 'PriceActionAnalysis':
                    if (data.pattern) content.push(`<strong>Pattern:</strong> ${data.pattern}`);
                    if (data.key_signals) content.push(`<strong>Key Signals:</strong><ul>${data.key_signals.map((s: string) => `<li>${s}</li>`).join('')}</ul>`);
                    if (data.summary) content.push(`<br/><strong>Summary:</strong><br/>${data.summary.replace(/\n/g, '<br/>')}`);
                    if (data.TimingRecommendation) content.push(`<br/><strong>Timing Recommendation:</strong><br/>${data.TimingRecommendation.replace(/\n/g, '<br/>')}`);
                    if (data.ResultInterpretation) content.push(`<br/><strong>Result Interpretation:</strong><br/>${data.ResultInterpretation.replace(/\n/g, '<br/>')}`);
                    return content.join('<br/>');

                  case 'StrategyAndRisk':
                    if (data.stop_loss) content.push(`<strong>Stop Loss:</strong> ${data.stop_loss.price} (${data.stop_loss.pct})`);
                    if (data.profit_target) content.push(`<strong>Profit Target:</strong> ${data.profit_target.price} (${data.profit_target.pct})`);
                    if (data.risk_reward) content.push(`<strong>Risk/Reward:</strong> ${data.risk_reward}`);
                    if (data.entry_zone) content.push(`<strong>Entry Zone:</strong> ${data.entry_zone}`);
                    if (data.exit_zone) content.push(`<strong>Exit Zone:</strong> ${data.exit_zone}`);
                    if (data.summary) content.push(`<br/><strong>Summary:</strong><br/>${data.summary.replace(/\n/g, '<br/>')}`);
                    if (data.TimingRecommendation) content.push(`<br/><strong>Timing Recommendation:</strong><br/>${data.TimingRecommendation.replace(/\n/g, '<br/>')}`);
                    if (data.ResultInterpretation) content.push(`<br/><strong>Result Interpretation:</strong><br/>${data.ResultInterpretation.replace(/\n/g, '<br/>')}`);
                    return content.join('<br/>');
                  
                  case 'NewsAnalysis':
                    if (data.summary) content.push(`<strong>Summary:</strong><br/>${data.summary.replace(/\n/g, '<br/>')}`);
                    if (data.items && data.items.length > 0) {
                        const newsItems = data.items.map((item: any) => `<li><strong>${item.headline}</strong>: ${item.impact} (<em>${item.sentiment}</em>)</li>`).join('');
                        content.push(`<br/><strong>News Items:</strong><ul>${newsItems}</ul>`);
                    }
                    if (data.TimingRecommendation) content.push(`<br/><strong>Timing Recommendation:</strong><br/>${data.TimingRecommendation.replace(/\n/g, '<br/>')}`);
                    if (data.ResultInterpretation) content.push(`<br/><strong>Result Interpretation:</strong><br/>${data.ResultInterpretation.replace(/\n/g, '<br/>')}`);
                    return content.join('<br/>');

                  default:
                    return JSON.stringify(data, null, 2);
                }
              };
              
              const icons: { [key: string]: string } = {
                MarketSnapshot: '📈',
                FundamentalsAndEvents: '🏦',
                NewsAnalysis: '📰',
                TechnicalChartInterpretation: '📊',
                PriceActionAnalysis: '📉',
                StrategyAndRisk: '🛡️',
                ResultInterpretation: analysisData.ResultInterpretation,
              };

              const cardOrder = [
                'MarketSnapshot',
                'FundamentalsAndEvents',
                'TechnicalChartInterpretation',
                'PriceActionAnalysis',
                'StrategyAndRisk',
                'NewsAnalysis',
              ];

              // Create a special object for NewsAnalysis card
              const processedAnalysisData = { ...analysisData };
              if (analysisData.NewsAnalysis && analysisData.NewsAnalysisSummary) {
                  processedAnalysisData.NewsAnalysis = {
                      summary: analysisData.NewsAnalysisSummary,
                      items: analysisData.NewsAnalysis,
                      TimingRecommendation: analysisData.TimingRecommendation,
                      ResultInterpretation: analysisData.ResultInterpretation,
                  };
              }

              const results: AnalysisResult[] = cardOrder
                .filter(key => processedAnalysisData[key])
                .map(key => ({
                  title: key.replace(/([A-Z])/g, ' $1').trim(),
                  content: formatCardContent(key, processedAnalysisData[key]),
                  icon: icons[key] || '❓',
                }));

                console.log('Analysis parsed. Updating state.');
                setAnalysisOverview(analysisData.overview ? analysisData.overview.replace(/\n/g, '<br/>') : 'No overview available.');

                const uqr = analysisData.UserQuestionResponse;
                if (uqr) {
                  let commentary = [];
                  if (uqr.question) commentary.push(`<strong>Question:</strong> ${uqr.question}`);
                  if (uqr.answer) commentary.push(`<br/><strong>Answer:</strong><br/>${uqr.answer.replace(/\n/g, '<br/>')}`);
                  if (uqr.summary) commentary.push(`<br/><strong>Summary:</strong><br/>${uqr.summary.replace(/\n/g, '<br/>')}`);
                  if (uqr.TimingRecommendation) commentary.push(`<br/><strong>Timing Recommendation:</strong><br/>${uqr.TimingRecommendation.replace(/\n/g, '<br/>')}`);
                  if (uqr.ResultInterpretation) commentary.push(`<br/><strong>Result Interpretation:</strong><br/>${uqr.ResultInterpretation.replace(/\n/g, '<br/>')}`);
                  setFinalCommentary(commentary.join('<br/>'));
                } else {
                  setFinalCommentary('No commentary available.');
      }

      setAnalysisResults(results);
                setIsAnalyzing(false);

                setTimeout(() => {
                  analysisResultsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);

            } catch (parsingError) {
              console.error('Failed to parse analysis result:', parsingError, 'Raw result:', resultData.result);
              setAnalysisError('Failed to read analysis result. The data from the server was malformed.');
              setIsAnalyzing(false);
            }

          } else if (resultData.status === 'failed' || resultData.status === 'error') {
            if (pollingRef.current) {
              clearTimeout(pollingRef.current);
              pollingRef.current = null;
            }
            throw new Error(resultData.error || 'Analysis job failed');
          } else {
            // If still processing, poll again after 10 seconds
            pollingRef.current = setTimeout(poll, 10000);
          }

    } catch (error) {
          console.error('Polling failed:', error);
          // Keep polling even if there's a parsing error or other issue
          if (pollingRef.current) {
            pollingRef.current = setTimeout(poll, 10000);
          }
        }
      };

      // 3. Start polling after initial delay
      pollingRef.current = setTimeout(poll, 60000); // Start polling after 60 seconds

    } catch (error: any) {
      console.error('Analysis failed:', error);
      setAnalysisError(error.message);
      setIsAnalyzing(false);
      // Clear interval on initial failure
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
    }
  };

  const handleBackToTop = () => {
    heroSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                      isVisible={showHeaderSuggestions}
                      nseStocks={nseStocks}
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
        <div className="fade-in-section">
          <ChartSection
            ticker={currentTicker}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            timeRange={timeRange}
            onTimeRangeChange={handleTimeRangeChange}
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
                        <AnalysisResults
            results={analysisResults}
            overview={analysisOverview}
            finalCommentary={finalCommentary}
            isAnalyzing={isAnalyzing}
          />
            </div>
            <div className="text-center mt-8">
              <Button onClick={handleBackToTop}>Back to Top</Button>
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
