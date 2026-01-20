export interface WheelDomain {
  id: string;
  name: string;
  description: string;
  score: number;
  color: string;
  isPriority?: boolean;
  targetScore?: number;
}

export interface DYLComponent {
  id: string;
  name: string;
  definition: string;
  question: string;
  reflection: string;
}

export interface OdysseyPlan {
  id: 'a' | 'b' | 'c';
  title: string;
  theme: string;
  activities: string;
  metrics: string;
}

export interface NextAction {
  type: 'calendly' | 'amazon' | 'mailto' | 'custom';
  url: string;
  label: string;
}

export interface SmartGoal {
  id: string;
  domainId: string; // Link to domain
  area: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  targetDate?: string;
  nextAction?: NextAction;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export interface ActionItem {
  id: string;
  goalId: string;
  domainId: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'skipped';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  domainId: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  reflection?: string;
  actionsCompleted: number;
  actionsTotal: number;
}

export interface QuickWin {
  id: string;
  area: string;
  action: string;
  rationale: string;
  completed: boolean;
  isCustom?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface GoodTimeEntry {
  id: string;
  date: string;
  activity: string;
  engagement: 'high' | 'medium' | 'low';
  energy: 'energized' | 'neutral' | 'drained';
  notes?: string;
}

export interface DomainProgress {
  domainId: string;
  initialScore: number;
  currentScore: number;
  targetScore: number;
  startDate: string;
  checkIns: DailyCheckIn[];
  lastAssessmentDate?: string;
}

export interface ScoreSnapshot {
  domainId: string;
  score: number;
  date: string;
}

export interface LifeAuditState {
  wheelDomains: WheelDomain[];
  dylComponents: DYLComponent[];
  odysseyPlans: OdysseyPlan[];
  smartGoals: SmartGoal[];
  actionItems: ActionItem[];
  dailyCheckIns: DailyCheckIn[];
  domainProgress: DomainProgress[];
  scoreHistory: ScoreSnapshot[];
  quickWins: QuickWin[];
  tasks: Task[];
  goodTimeJournal: GoodTimeEntry[];
  currentSection: string;
  activeDomainId?: string; // Currently focused domain
  lastSaved?: string;
  auditStartDate?: string;
  priorityDomains?: string[];
  lifeSatisfactionScore?: number;
  lifeSatisfactionDate?: string;
}
