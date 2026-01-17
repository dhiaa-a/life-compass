import { useState } from 'react';
import { CheckCircle2, Circle, Zap, Plus, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { QuickWin } from '@/types/lifeAudit';

interface QuickWinsProps {
  quickWins: QuickWin[];
  onToggle: (id: string) => void;
  onAdd: (quickWin: Omit<QuickWin, 'id' | 'completed' | 'isCustom'>) => void;
  onRemove: (id: string) => void;
}

const areaOptions = ['Clarity', 'Environment', 'Health', 'Finance', 'Productivity', 'Relationships', 'Personal Growth', 'Fun'];

export function QuickWins({ quickWins, onToggle, onAdd, onRemove }: QuickWinsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newWin, setNewWin] = useState({ area: 'Clarity', action: '', rationale: '' });

  const completedCount = quickWins.filter(w => w.completed).length;
  const progress = (completedCount / quickWins.length) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWin.action.trim()) {
      onAdd({
        area: newWin.area,
        action: newWin.action,
        rationale: newWin.rationale || 'Build momentum with quick action.',
      });
      setNewWin({ area: 'Clarity', action: '', rationale: '' });
      setIsFormOpen(false);
    }
  };

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
            <div
              key={win.id}
              className={`quick-win-item w-full text-left animate-slide-up ${
                win.completed ? 'bg-primary/10' : ''
              }`}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <button
                onClick={() => onToggle(win.id)}
                className={`flex-shrink-0 transition-colors ${
                  win.completed ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {win.completed ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    win.completed 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    {win.area}
                  </span>
                  {win.isCustom && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                      Custom
                    </span>
                  )}
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
              {win.isCustom && (
                <button
                  onClick={() => onRemove(win.id)}
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove quick win"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Custom Quick Win */}
        {isFormOpen ? (
          <form onSubmit={handleSubmit} className="glass-card p-6 mt-6 animate-scale-in">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Add Custom Quick Win</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="win-area">Focus Area</Label>
                <select
                  id="win-area"
                  value={newWin.area}
                  onChange={(e) => setNewWin({ ...newWin, area: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {areaOptions.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="win-action">Quick Win Action *</Label>
                <Input
                  id="win-action"
                  value={newWin.action}
                  onChange={(e) => setNewWin({ ...newWin, action: e.target.value })}
                  placeholder="What will you do? (e.g., Meditate for 5 minutes)"
                  className="mt-1.5"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="win-rationale">Why This Matters (optional)</Label>
                <Input
                  id="win-rationale"
                  value={newWin.rationale}
                  onChange={(e) => setNewWin({ ...newWin, rationale: e.target.value })}
                  placeholder="What benefit will this bring?"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1">
                Add Quick Win
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={() => setIsFormOpen(true)}
            variant="outline"
            className="w-full py-4 mt-6 border-dashed border-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your Own Quick Win
          </Button>
        )}

        {/* Next Steps */}
        <div className="mt-12 glass-card p-6 text-center animate-fade-in">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            What's Next?
          </h3>
          <p className="text-muted-foreground mb-4 max-w-xl mx-auto">
            After completing your Quick Wins, move to the Task Dashboard for 30-day prototyping. 
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
