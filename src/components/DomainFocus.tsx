import { useState } from 'react';
import { format, addDays, isToday, isPast, isFuture } from 'date-fns';
import { 
  Target, Plus, ChevronRight, CheckCircle2, Circle, Calendar,
  ArrowRight, Sparkles, Clock, TrendingUp, X, AlertCircle,
  RotateCcw, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { WheelDomain, SmartGoal, ActionItem, DailyCheckIn } from '@/types/lifeAudit';

interface DomainFocusProps {
  domains: WheelDomain[];
  activeDomainId: string | null;
  goals: SmartGoal[];
  actionItems: ActionItem[];
  dailyCheckIns: DailyCheckIn[];
  onSelectDomain: (domainId: string) => void;
  onAddGoal: (goal: Omit<SmartGoal, 'id' | 'status' | 'createdAt'>) => void;
  onUpdateGoal: (goalId: string, updates: Partial<SmartGoal>) => void;
  onRemoveGoal: (goalId: string) => void;
  onAddAction: (action: Omit<ActionItem, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateAction: (actionId: string, updates: Partial<ActionItem>) => void;
  onRemoveAction: (actionId: string) => void;
  onAddCheckIn: (checkIn: Omit<DailyCheckIn, 'id'>) => void;
  onRetakeAssessment: () => void;
}

const MOOD_OPTIONS = [
  { value: 'great', emoji: '😊', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'bad', emoji: '😕', label: 'Bad' },
  { value: 'terrible', emoji: '😞', label: 'Terrible' },
] as const;

export function DomainFocus({
  domains,
  activeDomainId,
  goals,
  actionItems,
  dailyCheckIns,
  onSelectDomain,
  onAddGoal,
  onUpdateGoal,
  onRemoveGoal,
  onAddAction,
  onUpdateAction,
  onRemoveAction,
  onAddCheckIn,
  onRetakeAssessment,
}: DomainFocusProps) {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showActionForm, setShowActionForm] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('today');
  
  const activeDomain = domains.find(d => d.id === activeDomainId);
  const priorityDomains = domains.filter(d => d.isPriority);
  const domainGoals = goals.filter(g => g.domainId === activeDomainId && g.status === 'active');
  const domainActions = actionItems.filter(a => a.domainId === activeDomainId);
  
  const today = new Date().toISOString().split('T')[0];
  const todayActions = domainActions.filter(a => a.dueDate === today);
  const pendingActions = todayActions.filter(a => a.status === 'pending');
  const completedToday = todayActions.filter(a => a.status === 'completed').length;
  
  const todayCheckIn = dailyCheckIns.find(c => c.domainId === activeDomainId && c.date === today);
  const last7DaysCheckIns = dailyCheckIns
    .filter(c => c.domainId === activeDomainId)
    .slice(-7);

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    targetDate: '',
  });

  // New action form state
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium' as ActionItem['priority'],
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDomainId || !newGoal.specific) return;

    onAddGoal({
      domainId: activeDomainId,
      area: activeDomain?.name || '',
      specific: newGoal.specific,
      measurable: newGoal.measurable,
      achievable: newGoal.achievable,
      relevant: newGoal.relevant,
      timeBound: newGoal.timeBound,
      targetDate: newGoal.targetDate,
    });

    setNewGoal({ specific: '', measurable: '', achievable: '', relevant: '', timeBound: '', targetDate: '' });
    setShowGoalForm(false);
  };

  const handleAddAction = (goalId: string) => (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDomainId || !newAction.title) return;

    onAddAction({
      goalId,
      domainId: activeDomainId,
      title: newAction.title,
      description: newAction.description,
      dueDate: newAction.dueDate,
      priority: newAction.priority,
    });

    setNewAction({ title: '', description: '', dueDate: format(new Date(), 'yyyy-MM-dd'), priority: 'medium' });
    setShowActionForm(null);
  };

  const handleCheckIn = (mood: DailyCheckIn['mood']) => {
    if (!activeDomainId) return;
    
    onAddCheckIn({
      date: today,
      domainId: activeDomainId,
      mood,
      actionsCompleted: completedToday,
      actionsTotal: todayActions.length,
    });
  };

  // Domain Selection View
  if (!activeDomainId) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8" id="focus">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="section-title mb-2">Choose Your Focus</h2>
            <p className="text-muted-foreground">
              Select a priority domain to set goals, create actions, and track progress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {priorityDomains.map(domain => (
              <button
                key={domain.id}
                onClick={() => onSelectDomain(domain.id)}
                className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: domain.color }}
                    />
                    <div>
                      <h3 className="font-display font-semibold text-foreground">
                        {domain.name}
                      </h3>
                      <Badge variant="secondary" className="mt-1">
                        <Star className="w-3 h-3 mr-1" />
                        Priority
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "font-display text-3xl font-bold",
                      domain.score >= 7 ? "text-primary" : 
                      domain.score >= 5 ? "text-accent" : 
                      "text-destructive"
                    )}>
                      {domain.score}
                    </span>
                    <span className="text-muted-foreground">/10</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{domain.description}</p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  <span>Start working on this</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            ))}
          </div>

          {priorityDomains.length === 0 && (
            <Card className="glass-card text-center py-12">
              <CardContent>
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Complete the assessment to identify your priority domains.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    );
  }

  // Active Domain Focus View
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" id="focus">
      <div className="max-w-5xl mx-auto">
        {/* Domain Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${activeDomain?.color}20` }}
            >
              <div 
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: activeDomain?.color }}
              />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                {activeDomain?.name}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-muted-foreground">
                  Current: <span className="font-semibold text-foreground">{activeDomain?.score}/10</span>
                </span>
                {activeDomain?.targetScore && (
                  <span className="text-sm text-muted-foreground">
                    Target: <span className="font-semibold text-primary">{activeDomain.targetScore}/10</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onSelectDomain('')}>
              Switch Domain
            </Button>
            <Button variant="outline" size="sm" onClick={onRetakeAssessment}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reassess
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Goals</p>
                  <p className="font-display text-2xl font-bold text-foreground">{domainGoals.length}</p>
                </div>
                <Target className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Today's Actions</p>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {completedToday}/{todayActions.length}
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">7-Day Streak</p>
                  <div className="flex gap-1 mt-1">
                    {last7DaysCheckIns.map((c, i) => (
                      <span key={i} className="text-lg">
                        {MOOD_OPTIONS.find(m => m.value === c.mood)?.emoji || '⚪'}
                      </span>
                    ))}
                    {Array(7 - last7DaysCheckIns.length).fill(null).map((_, i) => (
                      <span key={`empty-${i}`} className="text-lg opacity-30">⚪</span>
                    ))}
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Today's Mood</p>
                  {todayCheckIn ? (
                    <span className="text-3xl">
                      {MOOD_OPTIONS.find(m => m.value === todayCheckIn.mood)?.emoji}
                    </span>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not checked in</p>
                  )}
                </div>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="actions">All Actions</TabsTrigger>
          </TabsList>

          {/* Today Tab */}
          <TabsContent value="today" className="space-y-6">
            {/* Daily Check-in */}
            {!todayCheckIn && (
              <Card className="glass-card border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">How are you feeling about {activeDomain?.name.split(' ')[0].toLowerCase()}?</CardTitle>
                  <CardDescription>Daily check-in helps track your progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 justify-center">
                    {MOOD_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleCheckIn(option.value)}
                        className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <span className="text-3xl">{option.emoji}</span>
                        <span className="text-xs text-muted-foreground">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Today's Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Today's Actions</span>
                  <Badge variant="outline">{format(new Date(), 'EEEE, MMM d')}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingActions.length === 0 && completedToday === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No actions scheduled for today</p>
                    <p className="text-sm mt-1">Add actions from your goals below</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayActions.map(action => (
                      <div
                        key={action.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border transition-all",
                          action.status === 'completed' 
                            ? "border-primary/30 bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <button
                          onClick={() => onUpdateAction(action.id, {
                            status: action.status === 'completed' ? 'pending' : 'completed'
                          })}
                          className={cn(
                            "flex-shrink-0 mt-0.5",
                            action.status === 'completed' ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {action.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={cn(
                            "font-medium",
                            action.status === 'completed' && "line-through text-muted-foreground"
                          )}>
                            {action.title}
                          </p>
                          {action.description && (
                            <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Goals Summary for Today */}
            {domainGoals.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Your Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {domainGoals.map(goal => {
                    const goalActions = actionItems.filter(a => a.goalId === goal.id);
                    const completed = goalActions.filter(a => a.status === 'completed').length;
                    const progress = goalActions.length > 0 ? (completed / goalActions.length) * 100 : 0;
                    
                    return (
                      <div key={goal.id} className="p-3 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-foreground">{goal.specific}</p>
                          <span className="text-xs text-muted-foreground">{completed}/{goalActions.length} actions</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        {goal.targetDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            {domainGoals.length > 0 && (
              <div className="space-y-4">
                {domainGoals.map(goal => {
                  const goalActions = actionItems.filter(a => a.goalId === goal.id);
                  const completed = goalActions.filter(a => a.status === 'completed').length;
                  
                  return (
                    <Card key={goal.id} className="glass-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{goal.specific}</CardTitle>
                            {goal.measurable && (
                              <CardDescription className="mt-1">
                                Measure: {goal.measurable}
                              </CardDescription>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveGoal(goal.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span>{completed}/{goalActions.length} actions completed</span>
                          </div>
                          {goal.targetDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{format(new Date(goal.targetDate), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions List */}
                        {goalActions.length > 0 && (
                          <div className="space-y-2">
                            {goalActions.map(action => (
                              <div
                                key={action.id}
                                className={cn(
                                  "flex items-center gap-3 p-2 rounded-lg",
                                  action.status === 'completed' ? "bg-primary/5" : "bg-secondary/50"
                                )}
                              >
                                <button
                                  onClick={() => onUpdateAction(action.id, {
                                    status: action.status === 'completed' ? 'pending' : 'completed'
                                  })}
                                >
                                  {action.status === 'completed' ? (
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </button>
                                <span className={cn(
                                  "flex-1 text-sm",
                                  action.status === 'completed' && "line-through text-muted-foreground"
                                )}>
                                  {action.title}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(action.dueDate), 'MMM d')}
                                </span>
                                <button
                                  onClick={() => onRemoveAction(action.id)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Action Form */}
                        {showActionForm === goal.id ? (
                          <form onSubmit={handleAddAction(goal.id)} className="space-y-3 pt-3 border-t border-border">
                            <Input
                              placeholder="What's the next physical action?"
                              value={newAction.title}
                              onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                              required
                            />
                            <div className="flex gap-3">
                              <Input
                                type="date"
                                value={newAction.dueDate}
                                onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                                className="flex-1"
                              />
                              <select
                                value={newAction.priority}
                                onChange={(e) => setNewAction({ ...newAction, priority: e.target.value as ActionItem['priority'] })}
                                className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                            <div className="flex gap-2">
                              <Button type="submit" size="sm">Add Action</Button>
                              <Button type="button" variant="outline" size="sm" onClick={() => setShowActionForm(null)}>
                                Cancel
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowActionForm(goal.id)}
                            className="w-full border-dashed"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Action
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Add Goal Form */}
            {showGoalForm ? (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Create a SMART Goal</CardTitle>
                  <CardDescription>
                    Set a specific, measurable goal for {activeDomain?.name.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddGoal} className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-1">
                        <span className="text-primary font-bold">S</span>pecific
                      </Label>
                      <Textarea
                        placeholder="What exactly do you want to accomplish?"
                        value={newGoal.specific}
                        onChange={(e) => setNewGoal({ ...newGoal, specific: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1">
                        <span className="text-primary font-bold">M</span>easurable
                      </Label>
                      <Input
                        placeholder="How will you measure progress?"
                        value={newGoal.measurable}
                        onChange={(e) => setNewGoal({ ...newGoal, measurable: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1">
                        <span className="text-primary font-bold">A</span>chievable
                      </Label>
                      <Input
                        placeholder="What resources or skills do you need?"
                        value={newGoal.achievable}
                        onChange={(e) => setNewGoal({ ...newGoal, achievable: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="flex items-center gap-1">
                        <span className="text-primary font-bold">R</span>elevant
                      </Label>
                      <Input
                        placeholder="Why does this matter to you?"
                        value={newGoal.relevant}
                        onChange={(e) => setNewGoal({ ...newGoal, relevant: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="flex items-center gap-1">
                          <span className="text-primary font-bold">T</span>ime-bound
                        </Label>
                        <Input
                          placeholder="e.g., 90 days"
                          value={newGoal.timeBound}
                          onChange={(e) => setNewGoal({ ...newGoal, timeBound: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Target Date</Label>
                        <Input
                          type="date"
                          value={newGoal.targetDate}
                          onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Goal
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowGoalForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Button
                onClick={() => setShowGoalForm(true)}
                variant="outline"
                className="w-full py-6 border-dashed border-2"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add a SMART Goal
              </Button>
            )}
          </TabsContent>

          {/* All Actions Tab */}
          <TabsContent value="actions" className="space-y-4">
            {/* Grouped by date */}
            {(() => {
              const grouped = domainActions.reduce((acc, action) => {
                const date = action.dueDate;
                if (!acc[date]) acc[date] = [];
                acc[date].push(action);
                return acc;
              }, {} as Record<string, ActionItem[]>);

              const sortedDates = Object.keys(grouped).sort();

              return sortedDates.length === 0 ? (
                <Card className="glass-card text-center py-12">
                  <CardContent>
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No actions scheduled yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add goals and create actions to see them here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                sortedDates.map(date => {
                  const dateActions = grouped[date];
                  const dateObj = new Date(date);
                  const isDateToday = isToday(dateObj);
                  const isDatePast = isPast(dateObj) && !isDateToday;

                  return (
                    <Card key={date} className={cn(
                      "glass-card",
                      isDateToday && "border-primary/30"
                    )}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(dateObj, 'EEEE, MMMM d')}
                          {isDateToday && <Badge variant="default" className="ml-2">Today</Badge>}
                          {isDatePast && <Badge variant="secondary" className="ml-2">Past</Badge>}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {dateActions.map(action => (
                          <div
                            key={action.id}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-lg",
                              action.status === 'completed' ? "bg-primary/5" : "bg-secondary/50"
                            )}
                          >
                            <button
                              onClick={() => onUpdateAction(action.id, {
                                status: action.status === 'completed' ? 'pending' : 'completed'
                              })}
                            >
                              {action.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                            <span className={cn(
                              "flex-1 text-sm",
                              action.status === 'completed' && "line-through text-muted-foreground"
                            )}>
                              {action.title}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {action.priority}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })
              );
            })()}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
