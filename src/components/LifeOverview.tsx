import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  Target, TrendingUp, CheckCircle2, Star, 
  Calendar, Heart, Briefcase, Gamepad2, Users,
  ChevronDown, ChevronUp, Edit3
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { WheelDomain, DYLComponent, SmartGoal, QuickWin } from '@/types/lifeAudit';

interface LifeOverviewProps {
  domains: WheelDomain[];
  dylComponents: DYLComponent[];
  goals: SmartGoal[];
  quickWins: QuickWin[];
  onUpdateScore: (domainId: string, score: number) => void;
  onUpdateReflection: (componentId: string, reflection: string) => void;
  onToggleQuickWin: (id: string) => void;
}

const dylIconMap = {
  health: Heart,
  work: Briefcase,
  play: Gamepad2,
  love: Users,
};

const dylColorMap = {
  health: 'text-red-500 bg-red-500/10',
  work: 'text-blue-500 bg-blue-500/10',
  play: 'text-yellow-500 bg-yellow-500/10',
  love: 'text-pink-500 bg-pink-500/10',
};

export function LifeOverview({ 
  domains, 
  dylComponents,
  goals, 
  quickWins, 
  onUpdateScore,
  onUpdateReflection,
  onToggleQuickWin 
}: LifeOverviewProps) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);

  const chartData = domains.map(domain => ({
    subject: domain.name.split(' ')[0],
    fullName: domain.name,
    score: domain.score,
    fullMark: 10,
  }));

  const averageScore = domains.reduce((sum, d) => sum + d.score, 0) / domains.length;
  const completedWins = quickWins.filter(w => w.completed).length;
  const priorityDomains = domains.filter(d => d.isPriority);
  const lowDomains = domains.filter(d => d.score <= 4).sort((a, b) => a.score - b.score);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" id="overview">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="section-title mb-2">Your Life Dashboard</h2>
          <p className="text-muted-foreground">
            Everything at a glance — adjust scores, track progress, and stay focused.
          </p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Balance Score</p>
                  <p className="font-display text-2xl font-bold text-primary">{averageScore.toFixed(1)}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Quick Wins</p>
                  <p className="font-display text-2xl font-bold text-primary">{completedWins}/{quickWins.length}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Goals</p>
                  <p className="font-display text-2xl font-bold text-primary">{goals.length}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Focus Areas</p>
                  <p className="font-display text-2xl font-bold text-primary">{priorityDomains.length}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <Tabs defaultValue="wheel" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="wheel">Life Wheel</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Wheel Tab */}
          <TabsContent value="wheel" className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Radar Chart */}
              <Card className="glass-card lg:col-span-2">
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={chartData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 10]} 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
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
                </CardContent>
              </Card>

              {/* Domain List */}
              <Card className="glass-card lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Life Domains</span>
                    <span className="text-sm text-muted-foreground font-normal">Click to adjust</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
                    {domains.map(domain => (
                      <div 
                        key={domain.id}
                        className={cn(
                          "p-3 rounded-lg border transition-all cursor-pointer",
                          editingDomain === domain.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setEditingDomain(editingDomain === domain.id ? null : domain.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full shrink-0" 
                              style={{ backgroundColor: domain.color }}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-foreground">
                                  {domain.name}
                                </span>
                                {domain.isPriority && (
                                  <Badge variant="secondary" className="text-xs py-0">
                                    <Star className="w-3 h-3 mr-1" /> Priority
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-display text-xl font-bold",
                              domain.score >= 7 ? "text-primary" : 
                              domain.score >= 5 ? "text-accent" : 
                              "text-destructive"
                            )}>
                              {domain.score}
                            </span>
                            {editingDomain === domain.id ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Edit3 className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        {editingDomain === domain.id && (
                          <div className="mt-3 pt-3 border-t border-border" onClick={e => e.stopPropagation()}>
                            <p className="text-xs text-muted-foreground mb-3">{domain.description}</p>
                            <Slider
                              value={[domain.score]}
                              onValueChange={(value) => onUpdateScore(domain.id, value[0])}
                              min={1}
                              max={10}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>1</span>
                              <span>10</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attention Areas */}
            {lowDomains.length > 0 && (
              <Card className="glass-card border-destructive/30 bg-destructive/5">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg shrink-0">
                      <TrendingUp className="w-4 h-4 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Areas Needing Attention</p>
                      <p className="text-sm text-muted-foreground">
                        {lowDomains.map(d => d.name.split(' ')[0]).join(', ')} scored below 5. 
                        Consider setting goals to improve these areas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Energy Tab */}
          <TabsContent value="energy">
            <div className="grid md:grid-cols-2 gap-4">
              {dylComponents.map(component => {
                const Icon = dylIconMap[component.id as keyof typeof dylIconMap];
                const colors = dylColorMap[component.id as keyof typeof dylColorMap];
                
                return (
                  <Card key={component.id} className="glass-card">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${colors}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{component.name}</h4>
                          <p className="text-xs text-muted-foreground">{component.definition}</p>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/50 rounded-lg p-3 mb-3">
                        <p className="text-sm italic text-foreground">"{component.question}"</p>
                      </div>

                      <Textarea
                        placeholder="Your reflection..."
                        value={component.reflection}
                        onChange={(e) => onUpdateReflection(component.id, e.target.value)}
                        className="min-h-[80px] bg-background/50 text-sm resize-none"
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Wins */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Quick Wins</span>
                    <Badge variant="outline">{completedWins}/{quickWins.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {quickWins.slice(0, 6).map(win => (
                      <button
                        key={win.id}
                        onClick={() => onToggleQuickWin(win.id)}
                        className={cn(
                          "w-full p-3 rounded-lg border text-left transition-all",
                          win.completed 
                            ? "border-primary/30 bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                            win.completed ? "border-primary bg-primary" : "border-muted-foreground"
                          )}>
                            {win.completed && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <div>
                            <p className={cn(
                              "text-sm font-medium",
                              win.completed && "line-through text-muted-foreground"
                            )}>
                              {win.action}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{win.area}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Goals Summary */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>SMART Goals</span>
                    <Badge variant="outline">{goals.length} active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {goals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No goals set yet</p>
                      <p className="text-xs">Scroll down to create your first goal</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {goals.slice(0, 5).map(goal => (
                        <div
                          key={goal.id}
                          className="p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {goal.specific}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {goal.area}
                                </Badge>
                                {goal.timeBound && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {goal.timeBound}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
