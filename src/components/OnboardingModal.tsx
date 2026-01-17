import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { WheelDomain } from '@/types/lifeAudit';

const ONBOARDING_KEY = 'life-audit-onboarding-complete';

interface OnboardingModalProps {
  domains: WheelDomain[];
  onComplete: (selectedDomains: string[]) => void;
  isLoaded: boolean;
}

export function OnboardingModal({ domains, onComplete, isLoaded }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoaded) return;
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setIsOpen(true);
    }
  }, [isLoaded]);

  const toggleDomain = (domainId: string) => {
    setSelectedDomains(prev => {
      if (prev.includes(domainId)) {
        return prev.filter(id => id !== domainId);
      }
      if (prev.length >= 2) {
        return [prev[1], domainId];
      }
      return [...prev, domainId];
    });
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    onComplete(selectedDomains);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="font-display text-xl">Welcome to Your Life Audit</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            In 30 seconds, pick the <strong>2 domains</strong> that matter most to you right now. 
            We'll prioritize these in your assessment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 my-6">
          {domains.map(domain => (
            <button
              key={domain.id}
              onClick={() => toggleDomain(domain.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedDomains.includes(domain.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: domain.color }}
                />
                <span className="font-medium text-sm text-foreground">{domain.name}</span>
              </div>
              {selectedDomains.includes(domain.id) && (
                <span className="text-xs text-primary font-medium">
                  #{selectedDomains.indexOf(domain.id) + 1} Priority
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedDomains.length}/2 selected
          </p>
          <Button 
            onClick={handleComplete}
            disabled={selectedDomains.length !== 2}
          >
            Start My Audit <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
