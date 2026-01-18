import { ArrowRight, Sparkles, RefreshCw, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStart: () => void;
  hasCompletedOnboarding?: boolean;
  averageScore?: number;
}

export function HeroSection({ onStart, hasCompletedOnboarding, averageScore }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-4xl mx-auto">
        {hasCompletedOnboarding && averageScore !== undefined ? (
          <>
            {/* Returning user view */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6 animate-fade-in">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Your Life Balance Score: {averageScore.toFixed(1)}/10</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 animate-slide-up">
              Welcome Back
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in">
              Continue working on your life design. Review your progress, adjust your goals, and keep building a life you love.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button 
                onClick={onStart}
                size="lg" 
                className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
              >
                View Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 rounded-full"
                onClick={() => {
                  localStorage.removeItem('life-audit-onboarding-complete');
                  window.location.reload();
                }}
              >
                <RefreshCw className="mr-2 w-5 h-5" />
                Retake Assessment
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* First time user view */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Evidence-based life design framework</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 animate-slide-up">
              Design a Life
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                You Actually Love
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in">
              Take a 5-minute assessment to discover where you're thriving and where you need focus. 
              Get personalized insights across 8 life domains.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button 
                onClick={onStart}
                size="lg" 
                className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
              >
                Start My Life Audit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground animate-fade-in">
              24 quick questions • 100% private • Saved locally
            </p>
          </>
        )}
      </div>
    </section>
  );
}
