import { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus, Calendar, Target } from 'lucide-react';
import { format, subDays, parseISO, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import type { WheelDomain, DomainProgress, DailyCheckIn } from '@/types/lifeAudit';

interface ScoreSnapshot {
  domainId: string;
  score: number;
  date: string;
}

interface ProgressChartsProps {
  domains: WheelDomain[];
  domainProgress: DomainProgress[];
  dailyCheckIns: DailyCheckIn[];
  scoreHistory: ScoreSnapshot[];
  auditStartDate?: string;
}

export function ProgressCharts({ 
  domains, 
  domainProgress, 
  dailyCheckIns,
  scoreHistory,
  auditStartDate 
}: ProgressChartsProps) {
  
  // Generate chart data for the last 90 days
  const chartData = useMemo(() => {
    const today = new Date();
    const startDate = auditStartDate ? parseISO(auditStartDate) : subDays(today, 90);
    const dayCount = Math.min(differenceInDays(today, startDate), 90);
    
    const data = [];
    
    for (let i = dayCount; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const displayDate = format(date, 'MMM d');
      
      const dataPoint: Record<string, any> = { 
        date: dateStr,
        displayDate,
      };
      
      // Get scores for each domain at this date
      domains.forEach(domain => {
        // Find the most recent score snapshot up to this date
        const relevantSnapshots = scoreHistory
          .filter(s => s.domainId === domain.id && s.date <= dateStr)
          .sort((a, b) => b.date.localeCompare(a.date));
        
        if (relevantSnapshots.length > 0) {
          dataPoint[domain.id] = relevantSnapshots[0].score;
        } else {
          // Use initial score if no snapshot exists
          dataPoint[domain.id] = domain.score;
        }
      });
      
      // Calculate average
      const scores = domains.map(d => dataPoint[d.id] || d.score);
      dataPoint.average = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
      
      data.push(dataPoint);
    }
    
    return data;
  }, [domains, scoreHistory, auditStartDate]);

  // Calculate trends for each domain
  const trends = useMemo(() => {
    if (chartData.length < 7) return {};
    
    const result: Record<string, { direction: 'up' | 'down' | 'stable'; change: number }> = {};
    
    domains.forEach(domain => {
      const recentData = chartData.slice(-7);
      const firstScore = recentData[0]?.[domain.id] || domain.score;
      const lastScore = recentData[recentData.length - 1]?.[domain.id] || domain.score;
      const change = lastScore - firstScore;
      
      result[domain.id] = {
        direction: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable',
        change: Math.abs(change),
      };
    });
    
    return result;
  }, [chartData, domains]);

  // Get mood data for the week
  const moodData = useMemo(() => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const displayDate = format(date, 'EEE');
      
      const checkInsForDay = dailyCheckIns.filter(c => c.date === dateStr);
      const moodValues = checkInsForDay.map(c => {
        switch (c.mood) {
          case 'great': return 5;
          case 'good': return 4;
          case 'okay': return 3;
          case 'bad': return 2;
          case 'terrible': return 1;
          default: return 3;
        }
      });
      
      const avgMood = moodValues.length > 0 
        ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length 
        : null;
      
      const completedActions = checkInsForDay.reduce((sum, c) => sum + c.actionsCompleted, 0);
      const totalActions = checkInsForDay.reduce((sum, c) => sum + c.actionsTotal, 0);
      
      weekData.push({
        date: dateStr,
        displayDate,
        mood: avgMood,
        completionRate: totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : null,
      });
    }
    
    return weekData;
  }, [dailyCheckIns]);

  // Summary stats
  const stats = useMemo(() => {
    const currentAverage = chartData.length > 0 
      ? chartData[chartData.length - 1].average 
      : domains.reduce((sum, d) => sum + d.score, 0) / domains.length;
    
    const initialAverage = chartData.length > 0 
      ? chartData[0].average 
      : currentAverage;
    
    const improvement = currentAverage - initialAverage;
    
    const totalCheckIns = dailyCheckIns.length;
    const daysTracked = new Set(dailyCheckIns.map(c => c.date)).size;
    
    return { currentAverage, initialAverage, improvement, totalCheckIns, daysTracked };
  }, [chartData, domains, dailyCheckIns]);

  const domainColors = useMemo(() => {
    const colors: Record<string, string> = {};
    domains.forEach(domain => {
      colors[domain.id] = domain.color;
    });
    return colors;
  }, [domains]);

  const TrendIcon = ({ direction }: { direction: 'up' | 'down' | 'stable' }) => {
    if (direction === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (direction === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8" id="progress">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="section-title mb-2">Progress Over Time</h2>
          <p className="text-muted-foreground">
            Track your growth across all life domains
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Average</p>
                  <p className="font-display text-2xl font-bold text-primary">{stats.currentAverage.toFixed(1)}</p>
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Overall Change</p>
                  <p className={cn(
                    "font-display text-2xl font-bold",
                    stats.improvement > 0 ? "text-green-500" : stats.improvement < 0 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {stats.improvement > 0 ? '+' : ''}{stats.improvement.toFixed(1)}
                  </p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  {stats.improvement > 0 ? <TrendingUp className="w-5 h-5 text-green-500" /> : 
                   stats.improvement < 0 ? <TrendingDown className="w-5 h-5 text-red-500" /> :
                   <Minus className="w-5 h-5 text-muted-foreground" />}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Days Tracked</p>
                  <p className="font-display text-2xl font-bold text-primary">{stats.daysTracked}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Check-ins</p>
                  <p className="font-display text-2xl font-bold text-primary">{stats.totalCheckIns}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="domains">By Domain</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Life Balance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="displayDate" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="average"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorAverage)"
                        strokeWidth={2}
                        name="Average Score"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Domain Trends Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {domains.map(domain => (
                <Card key={domain.id} className="glass-card">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: domain.color }}
                      />
                      <TrendIcon direction={trends[domain.id]?.direction || 'stable'} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{domain.name.split(' ')[0]}</p>
                    <p className="font-display text-xl font-bold text-foreground">{domain.score}</p>
                    {trends[domain.id] && trends[domain.id].change > 0 && (
                      <p className={cn(
                        "text-xs",
                        trends[domain.id].direction === 'up' ? "text-green-500" : 
                        trends[domain.id].direction === 'down' ? "text-red-500" : 
                        "text-muted-foreground"
                      )}>
                        {trends[domain.id].direction === 'up' ? '+' : trends[domain.id].direction === 'down' ? '-' : ''}
                        {trends[domain.id].change.toFixed(1)} this week
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">All Domains Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="displayDate" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend />
                      {domains.map(domain => (
                        <Line
                          key={domain.id}
                          type="monotone"
                          dataKey={domain.id}
                          stroke={domain.color}
                          strokeWidth={2}
                          dot={false}
                          name={domain.name.split(' ')[0]}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Tab */}
          <TabsContent value="weekly" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mood Chart */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Mood</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={moodData}>
                        <defs>
                          <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="displayDate" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        />
                        <YAxis 
                          domain={[1, 5]} 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                          tickFormatter={(value) => {
                            const labels = ['', '😢', '😕', '😐', '🙂', '😊'];
                            return labels[value] || '';
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => {
                            const labels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Great'];
                            return [labels[Math.round(value)] || 'No data', 'Mood'];
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="mood"
                          stroke="hsl(var(--accent))"
                          fillOpacity={1}
                          fill="url(#colorMood)"
                          strokeWidth={2}
                          connectNulls
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Action Completion */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Action Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={moodData}>
                        <defs>
                          <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="displayDate" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value}%`, 'Completion']}
                        />
                        <Area
                          type="monotone"
                          dataKey="completionRate"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill="url(#colorCompletion)"
                          strokeWidth={2}
                          connectNulls
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily breakdown */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">This Week at a Glance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {moodData.map((day, index) => (
                    <div 
                      key={day.date}
                      className={cn(
                        "text-center p-3 rounded-lg border",
                        index === 6 ? "border-primary bg-primary/5" : "border-border"
                      )}
                    >
                      <p className="text-xs text-muted-foreground mb-1">{day.displayDate}</p>
                      <p className="text-2xl mb-1">
                        {day.mood ? ['', '😢', '😕', '😐', '🙂', '😊'][Math.round(day.mood)] : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {day.completionRate !== null ? `${day.completionRate}%` : '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
