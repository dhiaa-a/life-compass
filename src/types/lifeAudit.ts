export interface WheelDomain {
  id: string;
  name: string;
  description: string;
  score: number;
  color: string;
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

export interface SmartGoal {
  id: string;
  area: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
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

export interface LifeAuditState {
  wheelDomains: WheelDomain[];
  dylComponents: DYLComponent[];
  odysseyPlans: OdysseyPlan[];
  smartGoals: SmartGoal[];
  quickWins: QuickWin[];
  tasks: Task[];
  goodTimeJournal: GoodTimeEntry[];
  currentSection: string;
  lastSaved?: string;
}
