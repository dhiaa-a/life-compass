import { ArrowDown, BookOpen, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface HeroSectionProps {
  onStart: () => void;
  lifeSatisfactionScore?: number | null;
  lifeSatisfactionDate?: string | null;
}

const getScoreLabel = (score: number): { label: string; color: string } => {
  if (score >= 30) return { label: 'Highly Satisfied', color: 'text-primary' };
  if (score >= 25) return { label: 'Quite Satisfied', color: 'text-primary' };
  if (score >= 20) return { label: 'Average', color: 'text-accent' };
  if (score >= 15) return { label: 'Below Average', color: 'text-orange-500' };
  return { label: 'Needs Attention', color: 'text-destructive' };
};

export function HeroSection({ onStart, lifeSatisfactionScore, lifeSatisfactionDate }: HeroSectionProps) {
  const hasScore = lifeSatisfactionScore !== null && lifeSatisfactionScore !== undefined;
  const scoreInfo = hasScore ? getScoreLabel(lifeSatisfactionScore) : null;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-3xl mx-auto text-center animate-fade-in">
        <p className="text-primary font-medium mb-4 tracking-wide uppercase text-sm">
          Phase I: Assessment & Vision
        </p>
        
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Design Your Life
          <span className="block text-primary">With Intention</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          The journey to transformation begins with clarity. Use this interactive life audit to assess where you are, 
          envision where you want to be, and create an actionable roadmap to get there.
        </p>

        {/* Life Satisfaction Score Display */}
        {hasScore && scoreInfo && (
          <div className="mb-8 glass-card p-6 max-w-md mx-auto animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Life Satisfaction Score</span>
              </div>
              {lifeSatisfactionDate && (
                <span className="text-xs text-muted-foreground">
                  {format(new Date(lifeSatisfactionDate), 'MMM d, yyyy')}
                </span>
              )}
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className={cn("text-4xl font-bold", scoreInfo.color)}>
                {lifeSatisfactionScore}
              </span>
              <span className="text-lg text-muted-foreground mb-1">/35</span>
            </div>
            <p className={cn("text-sm font-medium", scoreInfo.color)}>
              {scoreInfo.label}
            </p>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Based on the Satisfaction With Life Scale (SWLS) - a clinically validated assessment
              </p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            onClick={onStart}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl"
          >
            {hasScore ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Retake Assessment
              </>
            ) : (
              'Begin Your Assessment'
            )}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-border hover:bg-secondary px-8 py-6 text-lg rounded-xl"
            asChild
          >
            <a 
              href="https://designingyour.life/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Learn the Method
            </a>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: '5', label: 'SWLS Questions' },
            { number: '8', label: 'Life Domains' },
            { number: '3', label: 'Future Paths' },
            { number: '90', label: 'Day Cycles' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <p className="font-display text-3xl font-bold text-primary">{stat.number}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={onStart}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
        aria-label="Scroll to begin"
      >
        <ArrowDown className="w-6 h-6" />
      </button>
    </section>
  );
}