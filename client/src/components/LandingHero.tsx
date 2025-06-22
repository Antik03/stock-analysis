
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, TrendingUp, Brain, BarChart3, Zap, Target, Bot } from 'lucide-react';
import { useTheme } from 'next-themes';

interface LandingHeroProps {
  onStartAnalyzing: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ onStartAnalyzing }) => {
  const { theme, setTheme } = useTheme();
  const [currentPunchlineIndex, setCurrentPunchlineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const punchlines = [
    "Transform Market Data Into Winning Strategies",
    "AI-Powered Stock Intelligence at Your Fingertips", 
    "Simply Ask, We Analyze - Stock Reports Made Easy",
    "Your Personal Wall Street Analyst, Powered by AI",
    "From Chaos to Clarity: AI Stock Analysis Revolution",
    "Ask Anything, Get Everything - Complete Stock Insights"
  ];

  const features = [
    { icon: Bot, text: "AI-Powered Analysis" },
    { icon: Target, text: "Analyse as you want" },
    { icon: BarChart3, text: "Smart Insights" },
    { icon: Brain, text: "Market Trends" },
    { icon: TrendingUp, text: "Instant Reports" },
    { icon: Zap, text: "Complete Analysis" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPunchlineIndex((prev) => (prev + 1) % punchlines.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [punchlines.length]);

  return (
    <>
      {/* Animated Background */}
      <div className="animated-background" />
      
      {/* Floating Particles */}
      <div className="floating-particles">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className={`landing-hero ${!isVisible ? 'fade-out' : ''}`}>
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
          {/* Additional floating elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-lightblue/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500" />
          <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-lightblue/10 rounded-full blur-2xl animate-pulse delay-[2000ms]" />
          
          {/* Theme Toggle */}
          <div className="absolute top-6 right-6">
            <Button
              variant="outline" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-full border-2 glass-effect hover:scale-110 transition-all duration-300"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          <div className="w-full max-w-4xl mx-auto text-center relative z-10">
            {/* Brand Badge */}
            <div className="mb-6 fade-in-section">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full border border-primary/20 backdrop-blur-sm">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary to-lightblue bg-clip-text text-transparent">
                  Powered by Mindsmap AI Services
                </span>
              </div>
            </div>

            {/* Main Punchline */}
            <div className="mb-8 h-32 flex items-center justify-center">
              <h1 
                key={currentPunchlineIndex}
                className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-lightblue to-blue-600 bg-clip-text text-transparent animate-fade-in drop-shadow-2xl leading-tight"
              >
                {punchlines[currentPunchlineIndex]}
              </h1>
            </div>
            
            {/* Subtitle */}
            <div className="mb-12 fade-in-section">
              <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                <span className="font-semibold text-primary">Just ask a question</span> and our AI instantly generates comprehensive stock reports with market analysis, price predictions, risk assessments, and actionable insights.
                <br />
                <span className="text-lightblue font-semibold">No complex tools. No waiting. Just intelligent answers.</span>
              </p>
              
              {/* Feature Icons */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={feature.text}
                    className="flex items-center gap-2 px-4 py-2 glass-effect rounded-full border border-primary/20 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <feature.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Value Propositions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                <div className="glass-effect rounded-lg p-4 border border-lightblue/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-semibold text-primary mb-1">Instant Analysis</h3>
                  <p className="text-sm text-muted-foreground">Get detailed stock reports in seconds, not hours</p>
                </div>
                <div className="glass-effect rounded-lg p-4 border border-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-2xl mb-2">🧠</div>
                  <h3 className="font-semibold text-lightblue mb-1">AI Precision</h3>
                  <p className="text-sm text-muted-foreground">Advanced algorithms analyze market patterns</p>
                </div>
                <div className="glass-effect rounded-lg p-4 border border-lightblue/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-2xl mb-2">💡</div>
                  <h3 className="font-semibold text-primary mb-1">Smart Insights</h3>
                  <p className="text-sm text-muted-foreground">Actionable recommendations for your portfolio</p>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onStartAnalyzing, 500);
                }}
                className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-primary to-mint hover:from-primary/90 hover:to-mint/90 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-primary/50 glass-effect border border-primary/30 rounded-full text-white"
              >
                Start Your AI Analysis
                <TrendingUp className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingHero;
