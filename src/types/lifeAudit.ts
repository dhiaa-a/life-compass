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
}

export interface LifeAuditState {
  wheelDomains: WheelDomain[];
  dylComponents: DYLComponent[];
  odysseyPlans: OdysseyPlan[];
  smartGoals: SmartGoal[];
  quickWins: QuickWin[];
  currentSection: string;
}
