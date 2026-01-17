import { Heart, Briefcase, Gamepad2, Users } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import type { DYLComponent } from '@/types/lifeAudit';

interface DYLDashboardProps {
  components: DYLComponent[];
  onUpdateReflection: (componentId: string, reflection: string) => void;
}

const iconMap = {
  health: Heart,
  work: Briefcase,
  play: Gamepad2,
  love: Users,
};

const colorMap = {
  health: 'text-wheel-health bg-wheel-health/10',
  work: 'text-wheel-career bg-wheel-career/10',
  play: 'text-wheel-fun bg-wheel-fun/10',
  love: 'text-wheel-romance bg-wheel-romance/10',
};

export function DYLDashboard({ components, onUpdateReflection }: DYLDashboardProps) {
  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30" id="dashboard">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">Step 2</p>
          <h2 className="section-title mb-4">Energy & Engagement Dashboard</h2>
          <p className="section-subtitle mx-auto">
            A well-designed life balances four key components. 
            Reflect on where you're over-investing and where you're running a deficit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {components.map((component, index) => {
            const Icon = iconMap[component.id as keyof typeof iconMap];
            const colors = colorMap[component.id as keyof typeof colorMap];
            
            return (
              <div 
                key={component.id} 
                className="glass-card p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${colors}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                      {component.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {component.definition}
                    </p>
                  </div>
                </div>
                
                <div className="bg-secondary/50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-foreground italic">
                    "{component.question}"
                  </p>
                </div>

                <Textarea
                  placeholder="Write your reflection here..."
                  value={component.reflection}
                  onChange={(e) => onUpdateReflection(component.id, e.target.value)}
                  className="min-h-[100px] bg-background/50 border-border/50 resize-none"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-12 glass-card p-6 text-center animate-fade-in">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Key Insight
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            If any component is running at zero, your "engine" will stall. 
            Use these reflections to identify where you need to <strong className="text-foreground">rebalance your energy</strong> before setting new goals.
          </p>
        </div>
      </div>
    </section>
  );
}
