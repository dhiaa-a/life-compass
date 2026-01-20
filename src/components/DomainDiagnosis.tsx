import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, ArrowLeft, Stethoscope, Lightbulb, 
  Target, CheckCircle2, Plus, X, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WheelDomain, ActionItem } from '@/types/lifeAudit';

interface DiagnosisQuestion {
  id: string;
  question: string;
  rootCause: string;
}

interface PrescribedAction {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rootCauses: string[]; // Which root causes this addresses
}

interface DomainDiagnosisData {
  questions: DiagnosisQuestion[];
  actions: PrescribedAction[];
}

// Research-backed diagnostic questions and interventions for each domain
const DOMAIN_DIAGNOSIS: Record<string, DomainDiagnosisData> = {
  health: {
    questions: [
      { id: 'sleep', question: "I struggle with getting quality sleep or enough rest", rootCause: 'sleep' },
      { id: 'nutrition', question: "My eating habits are inconsistent or unhealthy", rootCause: 'nutrition' },
      { id: 'exercise', question: "I don't exercise regularly or move enough during the day", rootCause: 'exercise' },
      { id: 'stress', question: "I feel chronically stressed or anxious", rootCause: 'stress' },
      { id: 'energy', question: "I often feel tired or lack energy", rootCause: 'energy' },
    ],
    actions: [
      { id: 'h1', title: "Sleep Hygiene Reset", description: "Set a fixed bedtime, no screens 1hr before, keep room cool (65-68°F)", timeframe: "Start tonight", difficulty: 'easy', rootCauses: ['sleep', 'energy'] },
      { id: 'h2', title: "10-Minute Morning Walk", description: "Walk outside for 10 minutes upon waking to reset circadian rhythm", timeframe: "Daily for 7 days", difficulty: 'easy', rootCauses: ['sleep', 'exercise', 'energy'] },
      { id: 'h3', title: "Meal Prep Sunday", description: "Prepare 5 healthy lunches on Sunday to avoid poor food choices", timeframe: "Weekly", difficulty: 'medium', rootCauses: ['nutrition', 'energy'] },
      { id: 'h4', title: "5-5-5 Breathing", description: "When stressed: inhale 5 sec, hold 5 sec, exhale 5 sec. Repeat 5 times", timeframe: "As needed", difficulty: 'easy', rootCauses: ['stress'] },
      { id: 'h5', title: "Movement Snacks", description: "Set hourly reminders for 2-minute stretch or walk breaks", timeframe: "Daily", difficulty: 'easy', rootCauses: ['exercise', 'energy'] },
      { id: 'h6', title: "Water First Protocol", description: "Drink a full glass of water before every meal and upon waking", timeframe: "Daily", difficulty: 'easy', rootCauses: ['nutrition', 'energy'] },
    ]
  },
  career: {
    questions: [
      { id: 'purpose', question: "My work feels meaningless or disconnected from my values", rootCause: 'purpose' },
      { id: 'growth', question: "I don't see opportunities for advancement or learning", rootCause: 'growth' },
      { id: 'balance', question: "Work is consuming too much of my time and energy", rootCause: 'balance' },
      { id: 'environment', question: "My workplace culture or colleagues are draining", rootCause: 'environment' },
      { id: 'skills', question: "I feel underskilled or out of my depth", rootCause: 'skills' },
    ],
    actions: [
      { id: 'c1', title: "Values Audit", description: "List your top 5 values, rate how well your job aligns (1-10) for each", timeframe: "30 min exercise", difficulty: 'easy', rootCauses: ['purpose'] },
      { id: 'c2', title: "Skill Gap Analysis", description: "Identify 3 skills needed for your dream role, find free courses for each", timeframe: "This week", difficulty: 'medium', rootCauses: ['growth', 'skills'] },
      { id: 'c3', title: "Hard Boundary Setting", description: "Define work end time, communicate it, and honor it for 2 weeks", timeframe: "Starting Monday", difficulty: 'medium', rootCauses: ['balance'] },
      { id: 'c4', title: "Coffee Chat Sprint", description: "Schedule 3 coffees with people doing work you admire", timeframe: "Next 2 weeks", difficulty: 'medium', rootCauses: ['purpose', 'growth'] },
      { id: 'c5', title: "Energy Mapping", description: "Track which work tasks energize vs drain you for 5 days", timeframe: "This week", difficulty: 'easy', rootCauses: ['environment', 'purpose'] },
      { id: 'c6', title: "Micro-Learning Habit", description: "Spend 15 min daily learning a new skill before work", timeframe: "Daily for 30 days", difficulty: 'easy', rootCauses: ['skills', 'growth'] },
    ]
  },
  finance: {
    questions: [
      { id: 'awareness', question: "I don't have a clear picture of where my money goes", rootCause: 'awareness' },
      { id: 'debt', question: "Debt is causing me stress or limiting my options", rootCause: 'debt' },
      { id: 'savings', question: "I'm not saving enough for emergencies or future goals", rootCause: 'savings' },
      { id: 'income', question: "My income doesn't match my needs or desires", rootCause: 'income' },
      { id: 'habits', question: "I have spending habits I regret (impulse buying, etc.)", rootCause: 'habits' },
    ],
    actions: [
      { id: 'f1', title: "Money Snapshot", description: "Calculate your net worth: total assets minus total debts", timeframe: "Today, 20 mins", difficulty: 'easy', rootCauses: ['awareness'] },
      { id: 'f2', title: "Expense Tracking Week", description: "Record every purchase for 7 days in a note app", timeframe: "This week", difficulty: 'easy', rootCauses: ['awareness', 'habits'] },
      { id: 'f3', title: "Debt Snowball Start", description: "List all debts smallest to largest, pay minimum on all, throw extra at smallest", timeframe: "Set up this week", difficulty: 'medium', rootCauses: ['debt'] },
      { id: 'f4', title: "Automatic Savings", description: "Set up auto-transfer of 10% of income to savings on payday", timeframe: "Today", difficulty: 'easy', rootCauses: ['savings'] },
      { id: 'f5', title: "24-Hour Rule", description: "Wait 24 hours before any non-essential purchase over $50", timeframe: "Ongoing habit", difficulty: 'easy', rootCauses: ['habits'] },
      { id: 'f6', title: "Income Brainstorm", description: "List 10 ways you could earn an extra $500/month, research top 3", timeframe: "This weekend", difficulty: 'medium', rootCauses: ['income'] },
    ]
  },
  relationships: {
    questions: [
      { id: 'time', question: "I don't spend enough quality time with friends/family", rootCause: 'time' },
      { id: 'depth', question: "My relationships feel shallow or surface-level", rootCause: 'depth' },
      { id: 'conflict', question: "There are unresolved conflicts or tension with important people", rootCause: 'conflict' },
      { id: 'isolation', question: "I feel lonely or disconnected from others", rootCause: 'isolation' },
      { id: 'boundaries', question: "Some relationships are draining or unhealthy", rootCause: 'boundaries' },
    ],
    actions: [
      { id: 'r1', title: "Weekly Connection Ritual", description: "Block 2 hours weekly for in-person time with someone you care about", timeframe: "Schedule this week", difficulty: 'easy', rootCauses: ['time', 'isolation'] },
      { id: 'r2', title: "Reach Out Sprint", description: "Send 3 texts to old friends you've lost touch with", timeframe: "Today", difficulty: 'easy', rootCauses: ['isolation'] },
      { id: 'r3', title: "The 5:1 Practice", description: "For every criticism, give 5 genuine appreciations to loved ones", timeframe: "Ongoing", difficulty: 'easy', rootCauses: ['conflict', 'depth'] },
      { id: 'r4', title: "Vulnerability Challenge", description: "Share something personal you normally wouldn't with a trusted friend", timeframe: "This week", difficulty: 'medium', rootCauses: ['depth'] },
      { id: 'r5', title: "Difficult Conversation", description: "Have one honest conversation you've been avoiding", timeframe: "Within 48 hours", difficulty: 'hard', rootCauses: ['conflict'] },
      { id: 'r6', title: "Boundary Script", description: "Write and practice saying 'no' to one draining commitment", timeframe: "This week", difficulty: 'medium', rootCauses: ['boundaries'] },
    ]
  },
  romance: {
    questions: [
      { id: 'communication', question: "We don't communicate effectively or often enough", rootCause: 'communication' },
      { id: 'intimacy', question: "Physical or emotional intimacy has decreased", rootCause: 'intimacy' },
      { id: 'priority', question: "The relationship isn't getting the attention it deserves", rootCause: 'priority' },
      { id: 'growth', question: "We've grown apart or want different things", rootCause: 'growth' },
      { id: 'single', question: "I'm single and struggling to meet compatible people", rootCause: 'single' },
    ],
    actions: [
      { id: 'ro1', title: "Weekly Date Night", description: "Block one evening weekly for undistracted partner time, phones off", timeframe: "Schedule now", difficulty: 'easy', rootCauses: ['priority', 'intimacy'] },
      { id: 'ro2', title: "Daily Check-in", description: "Ask 'What was the best and hardest part of your day?' every evening", timeframe: "Starting tonight", difficulty: 'easy', rootCauses: ['communication'] },
      { id: 'ro3', title: "Love Language Discovery", description: "Take the 5 Love Languages quiz together, discuss results", timeframe: "This week", difficulty: 'easy', rootCauses: ['intimacy', 'communication'] },
      { id: 'ro4', title: "Dream Mapping", description: "Each write your 5-year vision, then compare and find overlaps", timeframe: "Weekend activity", difficulty: 'medium', rootCauses: ['growth'] },
      { id: 'ro5', title: "Social Expansion", description: "Sign up for one group activity aligned with your interests", timeframe: "This month", difficulty: 'medium', rootCauses: ['single'] },
      { id: 'ro6', title: "Appreciation Blitz", description: "Write 3 specific things you appreciate about your partner daily", timeframe: "7 days", difficulty: 'easy', rootCauses: ['intimacy', 'communication'] },
    ]
  },
  growth: {
    questions: [
      { id: 'direction', question: "I don't have clear goals or sense of purpose", rootCause: 'direction' },
      { id: 'learning', question: "I've stopped learning or developing new skills", rootCause: 'learning' },
      { id: 'comfort', question: "I'm stuck in my comfort zone and not challenging myself", rootCause: 'comfort' },
      { id: 'mindset', question: "Negative self-talk or limiting beliefs hold me back", rootCause: 'mindset' },
      { id: 'spiritual', question: "I feel disconnected from meaning or something greater", rootCause: 'spiritual' },
    ],
    actions: [
      { id: 'g1', title: "Ideal Day Exercise", description: "Write out your perfect average day in detail, then identify gaps from reality", timeframe: "45 min exercise", difficulty: 'easy', rootCauses: ['direction'] },
      { id: 'g2', title: "Learn in Public", description: "Start sharing what you're learning on social media or a blog", timeframe: "First post this week", difficulty: 'medium', rootCauses: ['learning', 'comfort'] },
      { id: 'g3', title: "Fear Setting", description: "List your biggest fear, worst case, how you'd recover, and cost of inaction", timeframe: "30 min exercise", difficulty: 'easy', rootCauses: ['comfort', 'mindset'] },
      { id: 'g4', title: "Morning Pages", description: "Write 3 pages stream-of-consciousness every morning before doing anything else", timeframe: "Daily for 2 weeks", difficulty: 'medium', rootCauses: ['mindset', 'spiritual'] },
      { id: 'g5', title: "Skill Challenge", description: "Commit to 30 days of practicing something you've always wanted to learn", timeframe: "30-day commitment", difficulty: 'medium', rootCauses: ['learning', 'comfort'] },
      { id: 'g6', title: "Gratitude + Intention", description: "Each morning: 3 gratitudes, 1 intention for the day", timeframe: "Daily habit", difficulty: 'easy', rootCauses: ['mindset', 'spiritual'] },
    ]
  },
  fun: {
    questions: [
      { id: 'time', question: "I don't make enough time for leisure and play", rootCause: 'time' },
      { id: 'guilt', question: "I feel guilty when I'm not being productive", rootCause: 'guilt' },
      { id: 'hobbies', question: "I've lost touch with hobbies I used to enjoy", rootCause: 'hobbies' },
      { id: 'spontaneity', question: "My life feels too routine and predictable", rootCause: 'spontaneity' },
      { id: 'energy', question: "I'm too tired after work to do anything fun", rootCause: 'energy' },
    ],
    actions: [
      { id: 'fu1', title: "Play Audit", description: "List 20 activities that brought you joy as a child, circle 3 to try again", timeframe: "20 min exercise", difficulty: 'easy', rootCauses: ['hobbies'] },
      { id: 'fu2', title: "Schedule Fun First", description: "Block fun activities in your calendar BEFORE work tasks", timeframe: "Do this Sunday", difficulty: 'easy', rootCauses: ['time', 'guilt'] },
      { id: 'fu3', title: "Micro-Adventure", description: "Do one spontaneous thing this weekend you've never done before", timeframe: "This weekend", difficulty: 'easy', rootCauses: ['spontaneity'] },
      { id: 'fu4', title: "Energy Optimization", description: "Do your fun activity BEFORE or DURING your energy peak, not after", timeframe: "Experiment this week", difficulty: 'easy', rootCauses: ['energy'] },
      { id: 'fu5', title: "Hobby Restart", description: "Dig out supplies for an old hobby and do it for just 15 minutes", timeframe: "Today", difficulty: 'easy', rootCauses: ['hobbies'] },
      { id: 'fu6', title: "Permission Slip", description: "Write yourself a note: 'I give myself permission to play without producing'", timeframe: "Right now", difficulty: 'easy', rootCauses: ['guilt'] },
    ]
  },
  environment: {
    questions: [
      { id: 'clutter', question: "My space is cluttered and disorganized", rootCause: 'clutter' },
      { id: 'comfort', question: "My home doesn't feel comfortable or inviting", rootCause: 'comfort' },
      { id: 'workspace', question: "My workspace isn't set up for productivity", rootCause: 'workspace' },
      { id: 'location', question: "I'm unhappy with my neighborhood or location", rootCause: 'location' },
      { id: 'nature', question: "I don't spend enough time in nature or outside", rootCause: 'nature' },
    ],
    actions: [
      { id: 'e1', title: "10-Thing Toss", description: "Right now, find 10 items to throw away, donate, or recycle", timeframe: "15 minutes", difficulty: 'easy', rootCauses: ['clutter'] },
      { id: 'e2', title: "One Zone Reset", description: "Fully organize one small area (desk, drawer, shelf) until it sparks joy", timeframe: "1 hour", difficulty: 'easy', rootCauses: ['clutter', 'workspace'] },
      { id: 'e3', title: "Atmosphere Upgrade", description: "Add one element that makes your space feel better (plant, lighting, art)", timeframe: "This week", difficulty: 'easy', rootCauses: ['comfort'] },
      { id: 'e4', title: "Workspace Audit", description: "Optimize chair height, monitor position, and remove distractions", timeframe: "30 minutes", difficulty: 'easy', rootCauses: ['workspace'] },
      { id: 'e5', title: "Nature Prescription", description: "Spend 20 minutes in nature every day for one week", timeframe: "7 days", difficulty: 'easy', rootCauses: ['nature'] },
      { id: 'e6', title: "Neighborhood Exploration", description: "Walk a different route and discover 3 new spots near you", timeframe: "This weekend", difficulty: 'easy', rootCauses: ['location', 'nature'] },
    ]
  },
};

interface DomainDiagnosisProps {
  domain: WheelDomain;
  onComplete: (selectedActions: Omit<ActionItem, 'id' | 'createdAt' | 'status'>[]) => void;
  onSkip: () => void;
}

export function DomainDiagnosis({ domain, onComplete, onSkip }: DomainDiagnosisProps) {
  const [step, setStep] = useState<'questions' | 'actions'>('questions');
  const [selectedRootCauses, setSelectedRootCauses] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  
  const diagnosisData = DOMAIN_DIAGNOSIS[domain.id];
  
  if (!diagnosisData) {
    return null;
  }
  
  const toggleRootCause = (rootCause: string) => {
    setSelectedRootCauses(prev => 
      prev.includes(rootCause) 
        ? prev.filter(r => r !== rootCause)
        : [...prev, rootCause]
    );
  };
  
  const toggleAction = (actionId: string) => {
    setSelectedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(a => a !== actionId)
        : [...prev, actionId]
    );
  };
  
  // Filter actions based on selected root causes
  const relevantActions = useMemo(() => {
    if (selectedRootCauses.length === 0) {
      return diagnosisData.actions;
    }
    return diagnosisData.actions.filter(action =>
      action.rootCauses.some(cause => selectedRootCauses.includes(cause))
    );
  }, [diagnosisData.actions, selectedRootCauses]);
  
  const handleContinue = () => {
    if (step === 'questions') {
      setStep('actions');
    } else {
      // Convert selected actions to ActionItems
      const today = new Date();
      const actionItems = selectedActions.map(actionId => {
        const action = diagnosisData.actions.find(a => a.id === actionId)!;
        const dueDate = new Date(today);
        
        // Set due date based on timeframe
        if (action.timeframe.includes('Today') || action.timeframe.includes('tonight') || action.timeframe.includes('now')) {
          // Keep today
        } else if (action.timeframe.includes('week')) {
          dueDate.setDate(dueDate.getDate() + 7);
        } else if (action.timeframe.includes('month')) {
          dueDate.setDate(dueDate.getDate() + 30);
        } else {
          dueDate.setDate(dueDate.getDate() + 3); // Default 3 days
        }
        
        return {
          goalId: '', // Will be set by parent
          domainId: domain.id,
          title: action.title,
          description: action.description,
          dueDate: dueDate.toISOString().split('T')[0],
          priority: action.difficulty === 'hard' ? 'high' as const : action.difficulty === 'medium' ? 'medium' as const : 'low' as const,
        };
      });
      
      onComplete(actionItems);
    }
  };
  
  const difficultyColors = {
    easy: 'bg-green-500/10 text-green-600 border-green-500/30',
    medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    hard: 'bg-red-500/10 text-red-600 border-red-500/30',
  };
  
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div 
            className="inline-flex items-center justify-center p-3 rounded-full mb-4"
            style={{ backgroundColor: `${domain.color}20` }}
          >
            <Stethoscope className="w-6 h-6" style={{ color: domain.color }} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
            {step === 'questions' ? `Let's Diagnose: ${domain.name}` : 'Your Personalized Action Plan'}
          </h2>
          <p className="text-muted-foreground">
            {step === 'questions' 
              ? "Select all the statements that resonate with you"
              : `${relevantActions.length} actions recommended based on your diagnosis`}
          </p>
        </div>
        
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={cn(
            "w-3 h-3 rounded-full transition-all",
            step === 'questions' ? "bg-primary scale-125" : "bg-primary"
          )} />
          <div className="w-12 h-0.5 bg-border" />
          <div className={cn(
            "w-3 h-3 rounded-full transition-all",
            step === 'actions' ? "bg-primary scale-125" : "bg-muted"
          )} />
        </div>
        
        {step === 'questions' ? (
          // Questions Step
          <Card className="glass-card animate-slide-up">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                What's Contributing to This?
              </CardTitle>
              <CardDescription>
                Be honest — identifying the real issue is the first step to fixing it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {diagnosisData.questions.map(q => (
                <button
                  key={q.id}
                  onClick={() => toggleRootCause(q.rootCause)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all",
                    selectedRootCauses.includes(q.rootCause)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                      selectedRootCauses.includes(q.rootCause)
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {selectedRootCauses.includes(q.rootCause) && (
                        <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className={cn(
                      "text-sm",
                      selectedRootCauses.includes(q.rootCause)
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}>
                      {q.question}
                    </span>
                  </div>
                </button>
              ))}
              
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onSkip} className="flex-1">
                  Skip Diagnosis
                </Button>
                <Button onClick={handleContinue} className="flex-1">
                  See Recommendations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Actions Step
          <div className="space-y-4 animate-slide-up">
            {selectedRootCauses.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Addressing:</span>
                {selectedRootCauses.map(cause => (
                  <Badge key={cause} variant="secondary" className="capitalize">
                    {cause}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {relevantActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => toggleAction(action.id)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all",
                    selectedActions.includes(action.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0",
                      selectedActions.includes(action.id)
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {selectedActions.includes(action.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-foreground">
                          {action.title}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs capitalize", difficultyColors[action.difficulty])}
                        >
                          {action.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {action.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <span>⏱</span>
                        <span>{action.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <Card className="bg-secondary/50 border-0">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedActions.length} action{selectedActions.length !== 1 ? 's' : ''} selected
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Recommended: 2-3 to start
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('questions')} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleContinue} 
                disabled={selectedActions.length === 0}
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Add {selectedActions.length} Action{selectedActions.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
