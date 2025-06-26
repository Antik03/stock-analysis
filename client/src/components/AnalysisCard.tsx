import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalysisCardProps {
  title: string;
  content: string;
  icon: string;
  delay: number;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, content, icon, delay }) => {
  return (
    <div 
      className="card-3d bg-gradient-to-br from-card to-card/50 rounded-xl p-6 border border-primary/10 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 min-h-[280px] flex flex-col"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">{icon}</div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      
      <div 
        className="text-muted-foreground leading-relaxed text-sm flex-1 overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default AnalysisCard;
