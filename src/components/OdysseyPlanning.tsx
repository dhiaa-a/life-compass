import { MapPin, Compass, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { OdysseyPlan } from '@/types/lifeAudit';

interface OdysseyPlanningProps {
  plans: OdysseyPlan[];
  onUpdatePlan: (planId: 'a' | 'b' | 'c', field: keyof OdysseyPlan, value: string) => void;
}

const planConfig = {
  a: {
    icon: MapPin,
    color: 'odyssey-a',
    bgColor: 'bg-odyssey-a/10',
    borderColor: 'border-odyssey-a/30',
    textColor: 'text-odyssey-a',
    description: 'The life you would live if you continued on your current trajectory, perhaps with a few minor improvements.',
    example: 'Get promoted to Senior Manager, pay off student loans, save for a down payment.',
  },
  b: {
    icon: Compass,
    color: 'odyssey-b',
    bgColor: 'bg-odyssey-b/10',
    borderColor: 'border-odyssey-b/30',
    textColor: 'text-odyssey-b',
    description: 'The life you would live if you took a completely different direction (career change, new country, start a business).',
    example: 'Quit corporate job, start a small online business, travel for 1 year.',
  },
  c: {
    icon: Sparkles,
    color: 'odyssey-c',
    bgColor: 'bg-odyssey-c/10',
    borderColor: 'border-odyssey-c/30',
    textColor: 'text-odyssey-c',
    description: 'The life you would live if money or image were no object. This is your "dream" life.',
    example: 'Become a full-time artist, volunteer for a non-profit, pursue a PhD in philosophy.',
  },
};

export function OdysseyPlanning({ plans, onUpdatePlan }: OdysseyPlanningProps) {
  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" id="odyssey">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">Step 3</p>
          <h2 className="section-title mb-4">Odyssey Planning</h2>
          <p className="section-subtitle mx-auto">
            Design three distinct, compelling versions of your life over the next five years. 
            This is a creative exercise, not a commitment — allow your imagination to explore.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const config = planConfig[plan.id];
            const Icon = config.icon;
            
            return (
              <div 
                key={plan.id}
                className={`odyssey-card border-2 ${config.borderColor} animate-slide-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${config.textColor} text-sm font-medium mb-4`}>
                  <Icon className="w-4 h-4" />
                  <span>Plan {plan.id.toUpperCase()}</span>
                </div>
                
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {plan.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {config.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`${plan.id}-theme`} className="text-sm font-medium">
                      Theme / Focus
                    </Label>
                    <Input
                      id={`${plan.id}-theme`}
                      placeholder={`e.g., ${config.example.split(',')[0]}`}
                      value={plan.theme}
                      onChange={(e) => onUpdatePlan(plan.id, 'theme', e.target.value)}
                      className="mt-1.5 bg-background/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`${plan.id}-activities`} className="text-sm font-medium">
                      Key Activities (5 Years)
                    </Label>
                    <Textarea
                      id={`${plan.id}-activities`}
                      placeholder="What will you do to make this life happen?"
                      value={plan.activities}
                      onChange={(e) => onUpdatePlan(plan.id, 'activities', e.target.value)}
                      className="mt-1.5 min-h-[80px] bg-background/50 resize-none"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`${plan.id}-metrics`} className="text-sm font-medium">
                      Metrics of Success
                    </Label>
                    <Textarea
                      id={`${plan.id}-metrics`}
                      placeholder="How will you know you've succeeded?"
                      value={plan.metrics}
                      onChange={(e) => onUpdatePlan(plan.id, 'metrics', e.target.value)}
                      className="mt-1.5 min-h-[80px] bg-background/50 resize-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
