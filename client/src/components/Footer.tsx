
import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-16 border-t border-border/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-6">
            <a
              href="https://www.mindsmapai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <span>www.mindsmapai.com</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/mindsmapai/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            Powered by Mindsmap AI Services
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
