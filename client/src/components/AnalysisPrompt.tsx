
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AnalysisPromptProps {
  onAnalyze: (prompt: string) => void;
  isAnalyzing: boolean;
}

const AnalysisPrompt: React.FC<AnalysisPromptProps> = ({ onAnalyze, isAnalyzing }) => {
  const [prompt, setPrompt] = useState('');

  const handleAnalyze = () => {
    if (prompt.trim()) {
      onAnalyze(prompt);
    }
  };

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            🚀 Ask AI Agent to dive deeper and uncover market secrets...
          </label>
          <Textarea
            placeholder="What specific analysis would you like? E.g., 'Analyze the recent price movement and predict next week's trend' or 'Compare this stock's performance with sector peers' or 'Should I buy, hold, or sell this stock?'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary resize-none"
            disabled={isAnalyzing}
          />
        </div>
        
        <div className="text-center">
          <Button
            onClick={handleAnalyze}
            disabled={!prompt.trim() || isAnalyzing}
            className="px-8 py-3 bg-gradient-to-r from-primary to-mint hover:from-primary/90 hover:to-mint/90 transform hover:scale-105 transition-all duration-200"
          >
            {isAnalyzing ? '🔍 Analyzing with AI...' : '🚀 Get AI Analysis'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPrompt;
