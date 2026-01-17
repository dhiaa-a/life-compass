import { useState } from 'react';
import { Target, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SmartGoal, WheelDomain } from '@/types/lifeAudit';

interface SmartGoalsProps {
  goals: SmartGoal[];
  domains: WheelDomain[];
  onAddGoal: (goal: SmartGoal) => void;
  onRemoveGoal: (goalId: string) => void;
}

const smartCriteria = [
  { key: 'specific', label: 'Specific', description: 'Clearly defined — What exactly will you accomplish?' },
  { key: 'measurable', label: 'Measurable', description: 'How will you track progress and know when it\'s complete?' },
  { key: 'achievable', label: 'Achievable', description: 'Is this realistic given your resources and constraints?' },
  { key: 'relevant', label: 'Relevant', description: 'How does this align with your values and Odyssey Plans?' },
  { key: 'timeBound', label: 'Time-bound', description: 'What is your deadline? (Aim for 90 days)' },
];

export function SmartGoals({ goals, domains, onAddGoal, onRemoveGoal }: SmartGoalsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<SmartGoal>>({
    area: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.specific && newGoal.area) {
      onAddGoal({
        id: Date.now().toString(),
        area: newGoal.area || '',
        specific: newGoal.specific || '',
        measurable: newGoal.measurable || '',
        achievable: newGoal.achievable || '',
        relevant: newGoal.relevant || '',
        timeBound: newGoal.timeBound || '',
      });
      setNewGoal({ area: '', specific: '', measurable: '', achievable: '', relevant: '', timeBound: '' });
      setIsFormOpen(false);
    }
  };

  const lowScoreDomains = domains.filter(d => d.score <= 5).sort((a, b) => a.score - b.score);

  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30" id="goals">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">Step 4</p>
          <h2 className="section-title mb-4">SMART Goals</h2>
          <p className="section-subtitle mx-auto">
            Turn your vision into concrete, actionable goals. 
            Focus on your lowest-scoring Wheel of Life areas first.
          </p>
        </div>

        {lowScoreDomains.length > 0 && (
          <div className="glass-card p-4 mb-8 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-2">📊 Suggested focus areas based on your Wheel of Life:</p>
            <div className="flex flex-wrap gap-2">
              {lowScoreDomains.slice(0, 3).map(domain => (
                <span 
                  key={domain.id}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: domain.color }} />
                  {domain.name} ({domain.score}/10)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Existing Goals */}
        {goals.length > 0 && (
          <div className="space-y-4 mb-8">
            {goals.map((goal) => (
              <div key={goal.id} className="glass-card p-6 animate-scale-in">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">{goal.area}</span>
                      <h4 className="font-display font-semibold text-foreground">{goal.specific}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveGoal(goal.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove goal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <span className="font-medium text-foreground">Measurable:</span>
                    <p className="text-muted-foreground">{goal.measurable || '—'}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <span className="font-medium text-foreground">Deadline:</span>
                    <p className="text-muted-foreground">{goal.timeBound || '—'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Goal Form */}
        {isFormOpen ? (
          <form onSubmit={handleSubmit} className="glass-card p-6 animate-scale-in">
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Create a SMART Goal</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="area">Focus Area</Label>
                <Select value={newGoal.area} onValueChange={(value) => setNewGoal({ ...newGoal, area: value })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a life domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map(domain => (
                      <SelectItem key={domain.id} value={domain.name}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {smartCriteria.map(criteria => (
                <div key={criteria.key}>
                  <Label htmlFor={criteria.key} className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{criteria.label[0]}</span>
                    <span>{criteria.label.slice(1)}</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mb-1.5">{criteria.description}</p>
                  {criteria.key === 'specific' ? (
                    <Textarea
                      id={criteria.key}
                      value={newGoal[criteria.key as keyof SmartGoal] as string || ''}
                      onChange={(e) => setNewGoal({ ...newGoal, [criteria.key]: e.target.value })}
                      className="min-h-[80px] resize-none"
                      required={criteria.key === 'specific'}
                    />
                  ) : (
                    <Input
                      id={criteria.key}
                      value={newGoal[criteria.key as keyof SmartGoal] as string || ''}
                      onChange={(e) => setNewGoal({ ...newGoal, [criteria.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <Button type="submit" className="flex-1">
                Save Goal
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
            className="w-full py-6 border-dashed border-2"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add a SMART Goal
          </Button>
        )}
      </div>
    </section>
  );
}
