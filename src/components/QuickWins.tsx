import { CheckCircle2, Circle, Zap } from 'lucide-react';
import type { QuickWin } from '@/types/lifeAudit';

interface QuickWinsProps {
  quickWins: QuickWin[];
  onToggle: (id: string) => void;
}

export function QuickWins({ quickWins, onToggle }: QuickWinsProps) {
  const completedCount = quickWins.filter(w => w.completed).length;
  const progress = (completedCount / quickWins.length) * 100;

  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" id="quickwins">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">Step 5</p>
          <h2 className="section-title mb-4">Quick Wins</h2>
          <p className="section-subtitle mx-auto">
            Build immediate momentum with small, high-impact actions. 
            Complete at least three of these in the next 7 days.
          </p>
        </div>

        {/* Progress */}
        <div className="glass-card p-6 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="font-medium text-foreground">Your Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {quickWins.length} completed
            </span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          {completedCount >= 3 && (
            <p className="text-sm text-primary mt-3 font-medium">
              🎉 Great job! You've hit your minimum target!
            </p>
          )}
        </div>

        {/* Quick Win Items */}
        <div className="space-y-3">
          {quickWins.map((win, index) => (
            <button
              key={win.id}
              onClick={() => onToggle(win.id)}
              className={`quick-win-item w-full text-left animate-slide-up ${
                win.completed ? 'bg-primary/10' : ''
              }`}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className={`flex-shrink-0 transition-colors ${
                win.completed ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {win.completed ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    win.completed 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {win.area}
                  </span>
                </div>
                <p className={`font-medium ${
                  win.completed ? 'text-foreground line-through opacity-70' : 'text-foreground'
                }`}>
                  {win.action}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {win.rationale}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Next Steps */}
        <div className="mt-12 glass-card p-6 text-center animate-fade-in">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            What's Next?
          </h3>
          <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
            After completing your Quick Wins, move to 30-day prototyping and habit stacking. 
            Use the 90-day review cycle for continuous improvement.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <span>Keep building momentum</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </section>
  );
}
