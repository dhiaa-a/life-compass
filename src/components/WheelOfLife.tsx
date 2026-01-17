import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Slider } from '@/components/ui/slider';
import type { WheelDomain } from '@/types/lifeAudit';

interface WheelOfLifeProps {
  domains: WheelDomain[];
  onUpdateScore: (domainId: string, score: number) => void;
}

export function WheelOfLife({ domains, onUpdateScore }: WheelOfLifeProps) {
  const chartData = domains.map(domain => ({
    subject: domain.name.split(' ')[0],
    fullName: domain.name,
    score: domain.score,
    fullMark: 10,
  }));

  const averageScore = domains.reduce((sum, d) => sum + d.score, 0) / domains.length;

  return (
    <section className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" id="wheel">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">Step 1</p>
          <h2 className="section-title mb-4">The Wheel of Life</h2>
          <p className="section-subtitle mx-auto">
            Score each domain from 1 to 10. The goal is not perfection, but balance — 
            a sustainable life that aligns with your values.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Radar Chart */}
          <div className="glass-card p-6 order-2 lg:order-1">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    tickCount={6}
                  />
                  <Radar
                    name="Life Balance"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">Overall Balance Score</p>
              <p className="font-display text-3xl font-bold text-primary">{averageScore.toFixed(1)}</p>
            </div>
          </div>

          {/* Domain Sliders */}
          <div className="space-y-4 order-1 lg:order-2">
            {domains.map((domain, index) => (
              <div 
                key={domain.id} 
                className="glass-card p-4 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: domain.color }}
                    />
                    <h3 className="font-medium text-foreground">{domain.name}</h3>
                  </div>
                  <span className="font-display text-2xl font-bold text-primary">
                    {domain.score}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{domain.description}</p>
                <Slider
                  value={[domain.score]}
                  onValueChange={(value) => onUpdateScore(domain.id, value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Dissatisfied</span>
                  <span>Fully Satisfied</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
