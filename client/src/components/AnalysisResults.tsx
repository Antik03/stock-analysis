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
  overview: string | null;
  finalCommentary: string | null;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, overview, finalCommentary }) => {
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
    <div className="fade-in-section">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">AI Analysis Report</h2>
        <p className="text-muted-foreground">Comprehensive insights powered by AI agent</p>
      </div>
      
      {/* Full-width horizontal summary card */}
      <div className="mb-8 glass-effect rounded-2xl p-6 border border-primary/20 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="text-2xl mr-3">🔍</div>
              <h3 className="text-xl font-semibold text-foreground">Overview</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {overview}
            </p>
          </div>
        </div>
      </div>
      
      {/* Grid of analysis cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
      <div className="mb-8 glass-effect rounded-2xl p-6 border border-primary/20 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="text-2xl mr-3">⭐</div>
              <h3 className="text-xl font-semibold text-foreground">Final Commentary</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {finalCommentary}
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
