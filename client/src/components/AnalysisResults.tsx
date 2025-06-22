
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalysisCard from './AnalysisCard';

interface AnalysisResult {
  title: string;
  content: string;
  icon: string;
}

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const handleDownloadReport = () => {
    // Create a simple text report
    const reportContent = results.map(result => 
      `${result.title}\n${'-'.repeat(result.title.length)}\n${result.content}\n\n`
    ).join('');
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI_Analysis_Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in-section animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">AI Analysis Report</h2>
        <p className="text-muted-foreground">Comprehensive insights powered by AI agent</p>
      </div>
      
      {/* Full-width horizontal summary card */}
      <div className="mb-8 glass-effect rounded-2xl p-6 border border-primary/20 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="text-2xl mr-3">📊</div>
              <h3 className="text-xl font-semibold text-foreground">Intro</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Based on comprehensive AI analysis, the stock shows strong bullish momentum with positive technical indicators. 
              Key support levels are well-established, and market sentiment remains favorable with institutional interest. 
              The analysis suggests a favorable risk-reward ratio for potential investors.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {results.map((result, index) => (
          <AnalysisCard
            key={index}
            title={result.title}
            content={result.content}
            icon={result.icon}
            delay={index * 100}
          />
        ))}
      </div>
      
      {/* Chart data summary card above download button */}
      <div className="mb-8 glass-effect rounded-2xl p-6 border border-mint/20 bg-gradient-to-r from-mint/10 to-primary/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="text-2xl mr-3">📈</div>
              <h3 className="text-xl font-semibold text-foreground">Chart Data & AI-Powered Insights</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              This comprehensive analysis combines real-time market data with advanced AI algorithms to provide 
              you with actionable investment insights. Download the complete report for detailed recommendations 
              and strategic guidance tailored to your investment goals.
            </p>
          </div>
        </div>
      </div>
      
      {/* Download button */}
      <div className="text-center">
        <Button
          onClick={handleDownloadReport}
          className="px-8 py-3 bg-gradient-to-r from-primary to-mint hover:from-primary/90 hover:to-mint/90 transform hover:scale-105 transition-all duration-200 text-white rounded-2xl shadow-lg hover:shadow-xl"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;
