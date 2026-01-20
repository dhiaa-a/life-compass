import { useState, useCallback, useEffect } from 'react';
import type { WheelDomain, DYLComponent, OdysseyPlan, SmartGoal, QuickWin, Task, GoodTimeEntry, NextAction, ActionItem, DailyCheckIn, DomainProgress, ScoreSnapshot } from '@/types/lifeAudit';

const STORAGE_KEY = 'life-audit-data';

const initialWheelDomains: WheelDomain[] = [
  { id: 'career', name: 'Career & Work', description: 'Your professional life, job satisfaction, career path, and future prospects.', score: 5, color: 'hsl(200, 70%, 50%)' },
  { id: 'finance', name: 'Money & Finance', description: 'Your financial health, income, savings, debt, and sense of financial security.', score: 5, color: 'hsl(150, 60%, 45%)' },
  { id: 'health', name: 'Health & Fitness', description: 'Your physical well-being, nutrition, exercise, sleep, and energy levels.', score: 5, color: 'hsl(120, 50%, 45%)' },
  { id: 'relationships', name: 'Friends & Family', description: 'The quality of your relationships with friends, family, and social network.', score: 5, color: 'hsl(340, 65%, 55%)' },
  { id: 'romance', name: 'Romance & Partner', description: 'The state of your primary romantic relationship or your approach to finding one.', score: 5, color: 'hsl(320, 70%, 55%)' },
  { id: 'growth', name: 'Personal Growth', description: 'Your education, skill development, spiritual life, and self-improvement efforts.', score: 5, color: 'hsl(270, 50%, 55%)' },
  { id: 'fun', name: 'Fun & Recreation', description: 'The time you dedicate to hobbies, relaxation, travel, and enjoyable activities.', score: 5, color: 'hsl(45, 90%, 55%)' },
  { id: 'environment', name: 'Physical Environment', description: 'Your home, workspace, and the physical surroundings that impact your daily life.', score: 5, color: 'hsl(25, 60%, 50%)' },
];

const initialDYLComponents: DYLComponent[] = [
  { id: 'health', name: 'Health', definition: 'Your physical and mental well-being, including sleep, diet, and stress management.', question: 'Am I consistently investing in my physical and mental health?', reflection: '' },
  { id: 'work', name: 'Work', definition: 'Any activity that provides income, meaning, or a sense of contribution.', question: 'Does my work align with my values and provide a sense of purpose?', reflection: '' },
  { id: 'play', name: 'Play', definition: 'Activities done purely for the joy of it, with no goal or outcome.', question: 'When was the last time I did something just for fun, and what was it?', reflection: '' },
  { id: 'love', name: 'Love', definition: 'The quality of your relationships with others, including family, friends, and partners.', question: 'Are my most important relationships thriving and receiving the attention they deserve?', reflection: '' },
];

const initialOdysseyPlans: OdysseyPlan[] = [
  { id: 'a', title: 'Plan A: The Current Path', theme: '', activities: '', metrics: '' },
  { id: 'b', title: 'Plan B: The Alternative Path', theme: '', activities: '', metrics: '' },
  { id: 'c', title: 'Plan C: The Wild Card', theme: '', activities: '', metrics: '' },
];

const initialQuickWins: QuickWin[] = [
  { id: 'clarity', area: 'Clarity', action: 'The Brain Dump: Write down every task, worry, idea, and commitment.', rationale: 'Frees up mental RAM and creates a single source of truth.', completed: false },
  { id: 'environment', area: 'Environment', action: 'The 15-Minute Declutter: Declutter one small, high-traffic area.', rationale: 'A clean environment reduces cognitive load.', completed: false },
  { id: 'health', area: 'Health', action: 'The Water Challenge: Drink a full glass of water upon waking.', rationale: 'Kickstarts hydration and energy for the day.', completed: false },
  { id: 'finance', area: 'Finance', action: 'The 5-Minute Budget Check: Review statements for top spending categories.', rationale: 'Creates awareness of current financial reality.', completed: false },
  { id: 'productivity', area: 'Productivity', action: 'The "One Thing" Rule: Identify your MIT before bed.', rationale: 'Start the day with focus and clear priority.', completed: false },
];

interface StoredData {
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
  lastSaved: string;
  activeDomainId?: string;
  auditStartDate?: string;
  priorityDomains?: string[];
  lifeSatisfactionScore?: number;
  lifeSatisfactionDate?: string;
}

function loadFromStorage(): Partial<StoredData> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return null;
}

function saveToStorage(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function useLifeAudit() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wheelDomains, setWheelDomains] = useState<WheelDomain[]>(initialWheelDomains);
  const [dylComponents, setDYLComponents] = useState<DYLComponent[]>(initialDYLComponents);
  const [odysseyPlans, setOdysseyPlans] = useState<OdysseyPlan[]>(initialOdysseyPlans);
  const [smartGoals, setSmartGoals] = useState<SmartGoal[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [dailyCheckIns, setDailyCheckIns] = useState<DailyCheckIn[]>([]);
  const [domainProgress, setDomainProgress] = useState<DomainProgress[]>([]);
  const [scoreHistory, setScoreHistory] = useState<ScoreSnapshot[]>([]);
  const [quickWins, setQuickWins] = useState<QuickWin[]>(initialQuickWins);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goodTimeJournal, setGoodTimeJournal] = useState<GoodTimeEntry[]>([]);
  const [currentSection, setCurrentSection] = useState('hero');
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const [auditStartDate, setAuditStartDate] = useState<string | null>(null);
  const [priorityDomains, setPriorityDomains] = useState<string[]>([]);
  const [lifeSatisfactionScore, setLifeSatisfactionScore] = useState<number | null>(null);
  const [lifeSatisfactionDate, setLifeSatisfactionDate] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      if (stored.wheelDomains) setWheelDomains(stored.wheelDomains);
      if (stored.dylComponents) setDYLComponents(stored.dylComponents);
      if (stored.odysseyPlans) setOdysseyPlans(stored.odysseyPlans);
      if (stored.smartGoals) setSmartGoals(stored.smartGoals);
      if (stored.actionItems) setActionItems(stored.actionItems);
      if (stored.dailyCheckIns) setDailyCheckIns(stored.dailyCheckIns);
      if (stored.domainProgress) setDomainProgress(stored.domainProgress);
      if (stored.scoreHistory) setScoreHistory(stored.scoreHistory);
      if (stored.quickWins) setQuickWins(stored.quickWins);
      if (stored.tasks) setTasks(stored.tasks);
      if (stored.goodTimeJournal) setGoodTimeJournal(stored.goodTimeJournal);
      if (stored.activeDomainId) setActiveDomainId(stored.activeDomainId);
      if (stored.auditStartDate) setAuditStartDate(stored.auditStartDate);
      if (stored.priorityDomains) setPriorityDomains(stored.priorityDomains);
      if (stored.lifeSatisfactionScore) setLifeSatisfactionScore(stored.lifeSatisfactionScore);
      if (stored.lifeSatisfactionDate) setLifeSatisfactionDate(stored.lifeSatisfactionDate);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    saveToStorage({
      wheelDomains,
      dylComponents,
      odysseyPlans,
      smartGoals,
      actionItems,
      dailyCheckIns,
      domainProgress,
      scoreHistory,
      quickWins,
      tasks,
      goodTimeJournal,
      lastSaved: new Date().toISOString(),
      activeDomainId: activeDomainId || undefined,
      auditStartDate: auditStartDate || undefined,
      priorityDomains,
      lifeSatisfactionScore: lifeSatisfactionScore || undefined,
      lifeSatisfactionDate: lifeSatisfactionDate || undefined,
    });
  }, [isLoaded, wheelDomains, dylComponents, odysseyPlans, smartGoals, actionItems, dailyCheckIns, domainProgress, scoreHistory, quickWins, tasks, goodTimeJournal, activeDomainId, auditStartDate, priorityDomains, lifeSatisfactionScore, lifeSatisfactionDate]);

  const updateWheelScore = useCallback((domainId: string, score: number) => {
    setWheelDomains(prev => 
      prev.map(domain => 
        domain.id === domainId ? { ...domain, score } : domain
      )
    );
  }, []);

  const updateDYLReflection = useCallback((componentId: string, reflection: string) => {
    setDYLComponents(prev =>
      prev.map(component =>
        component.id === componentId ? { ...component, reflection } : component
      )
    );
  }, []);

  const updateOdysseyPlan = useCallback((planId: 'a' | 'b' | 'c', field: keyof OdysseyPlan, value: string) => {
    setOdysseyPlans(prev =>
      prev.map(plan =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
  }, []);

  // SMART Goals
  const addSmartGoal = useCallback((goal: Omit<SmartGoal, 'id' | 'status' | 'createdAt'>) => {
    const newGoal: SmartGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setSmartGoals(prev => [...prev, newGoal]);
    return newGoal.id;
  }, []);

  const updateSmartGoal = useCallback((goalId: string, updates: Partial<SmartGoal>) => {
    setSmartGoals(prev =>
      prev.map(goal =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    );
  }, []);

  const removeSmartGoal = useCallback((goalId: string) => {
    setSmartGoals(prev => prev.filter(goal => goal.id !== goalId));
    // Also remove related actions
    setActionItems(prev => prev.filter(action => action.goalId !== goalId));
  }, []);

  const updateSmartGoalAction = useCallback((goalId: string, action: NextAction) => {
    setSmartGoals(prev =>
      prev.map(goal =>
        goal.id === goalId ? { ...goal, nextAction: action } : goal
      )
    );
  }, []);

  // Action Items
  const addActionItem = useCallback((action: Omit<ActionItem, 'id' | 'createdAt' | 'status'>) => {
    const newAction: ActionItem = {
      ...action,
      id: `action-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setActionItems(prev => [...prev, newAction]);
  }, []);

  const updateActionItem = useCallback((actionId: string, updates: Partial<ActionItem>) => {
    setActionItems(prev =>
      prev.map(action => {
        if (action.id === actionId) {
          const updated = { ...action, ...updates };
          if (updates.status === 'completed' && !action.completedAt) {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return action;
      })
    );
  }, []);

  const removeActionItem = useCallback((actionId: string) => {
    setActionItems(prev => prev.filter(action => action.id !== actionId));
  }, []);

  // Daily Check-ins
  const addDailyCheckIn = useCallback((checkIn: Omit<DailyCheckIn, 'id'>) => {
    const newCheckIn: DailyCheckIn = {
      ...checkIn,
      id: `checkin-${Date.now()}`,
    };
    setDailyCheckIns(prev => [...prev, newCheckIn]);
  }, []);

  const getTodayCheckIn = useCallback((domainId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dailyCheckIns.find(c => c.domainId === domainId && c.date === today);
  }, [dailyCheckIns]);

  // Domain Progress
  const initializeDomainProgress = useCallback((domainId: string, initialScore: number, targetScore: number) => {
    setDomainProgress(prev => {
      const existing = prev.find(p => p.domainId === domainId);
      if (existing) return prev;
      
      return [...prev, {
        domainId,
        initialScore,
        currentScore: initialScore,
        targetScore,
        startDate: new Date().toISOString(),
        checkIns: [],
      }];
    });
  }, []);

  const updateDomainProgress = useCallback((domainId: string, updates: Partial<DomainProgress>) => {
    setDomainProgress(prev =>
      prev.map(progress =>
        progress.domainId === domainId ? { ...progress, ...updates } : progress
      )
    );
  }, []);

  // Quick Wins
  const toggleQuickWin = useCallback((quickWinId: string) => {
    setQuickWins(prev =>
      prev.map(win =>
        win.id === quickWinId ? { ...win, completed: !win.completed } : win
      )
    );
  }, []);

  const addQuickWin = useCallback((quickWin: Omit<QuickWin, 'id' | 'completed' | 'isCustom'>) => {
    const newWin: QuickWin = {
      ...quickWin,
      id: `custom-${Date.now()}`,
      completed: false,
      isCustom: true,
    };
    setQuickWins(prev => [...prev, newWin]);
  }, []);

  const removeQuickWin = useCallback((quickWinId: string) => {
    setQuickWins(prev => prev.filter(win => win.id !== quickWinId));
  }, []);

  // Task management
  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'todo',
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const updated = { ...task, ...updates };
          if (updates.status === 'done' && !task.completedAt) {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return task;
      })
    );
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  // Good Time Journal
  const addGoodTimeEntry = useCallback((entry: Omit<GoodTimeEntry, 'id'>) => {
    const newEntry: GoodTimeEntry = {
      ...entry,
      id: `gtj-${Date.now()}`,
    };
    setGoodTimeJournal(prev => [...prev, newEntry]);
  }, []);

  const removeGoodTimeEntry = useCallback((entryId: string) => {
    setGoodTimeJournal(prev => prev.filter(entry => entry.id !== entryId));
  }, []);

  // Onboarding completion
  const completeOnboarding = useCallback((selectedDomains: string[]) => {
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    
    setPriorityDomains(selectedDomains);
    setAuditStartDate(now);
    
    // Mark priority domains and set first as active
    setWheelDomains(prev => {
      // Record initial scores in history
      const snapshots: ScoreSnapshot[] = prev.map(domain => ({
        domainId: domain.id,
        score: domain.score,
        date: today,
      }));
      setScoreHistory(existing => [...existing, ...snapshots]);
      
      return prev.map(domain => ({
        ...domain,
        isPriority: selectedDomains.includes(domain.id),
      }));
    });
    
    if (selectedDomains.length > 0) {
      setActiveDomainId(selectedDomains[0]);
    }
  }, []);

  // Record a score snapshot for tracking
  const recordScoreSnapshot = useCallback((domainId: string, score: number) => {
    const today = new Date().toISOString().split('T')[0];
    setScoreHistory(prev => {
      // Remove any existing snapshot for this domain on this date
      const filtered = prev.filter(s => !(s.domainId === domainId && s.date === today));
      return [...filtered, { domainId, score, date: today }];
    });
  }, []);

  // Retake assessment for a domain
  const retakeAssessment = useCallback((domainId: string, newScore: number) => {
    updateWheelScore(domainId, newScore);
    recordScoreSnapshot(domainId, newScore);
    updateDomainProgress(domainId, {
      currentScore: newScore,
      lastAssessmentDate: new Date().toISOString(),
    });
  }, [updateWheelScore, updateDomainProgress, recordScoreSnapshot]);

  // Reset all data
  const resetAllData = useCallback(() => {
    setWheelDomains(initialWheelDomains);
    setDYLComponents(initialDYLComponents);
    setOdysseyPlans(initialOdysseyPlans);
    setSmartGoals([]);
    setActionItems([]);
    setDailyCheckIns([]);
    setDomainProgress([]);
    setScoreHistory([]);
    setQuickWins(initialQuickWins);
    setTasks([]);
    setGoodTimeJournal([]);
    setActiveDomainId(null);
    setAuditStartDate(null);
    setPriorityDomains([]);
    setLifeSatisfactionScore(null);
    setLifeSatisfactionDate(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Save life satisfaction score
  const saveLifeSatisfactionScore = useCallback((score: number) => {
    setLifeSatisfactionScore(score);
    setLifeSatisfactionDate(new Date().toISOString());
  }, []);

  // Get goals for a specific domain
  const getGoalsForDomain = useCallback((domainId: string) => {
    return smartGoals.filter(g => g.domainId === domainId);
  }, [smartGoals]);

  // Get actions for a specific domain
  const getActionsForDomain = useCallback((domainId: string) => {
    return actionItems.filter(a => a.domainId === domainId);
  }, [actionItems]);

  // Get actions due today
  const getTodayActions = useCallback((domainId?: string) => {
    const today = new Date().toISOString().split('T')[0];
    return actionItems.filter(a => 
      a.dueDate === today && 
      a.status === 'pending' &&
      (domainId ? a.domainId === domainId : true)
    );
  }, [actionItems]);

  return {
    wheelDomains,
    dylComponents,
    odysseyPlans,
    smartGoals,
    actionItems,
    dailyCheckIns,
    domainProgress,
    scoreHistory,
    quickWins,
    tasks,
    goodTimeJournal,
    currentSection,
    isLoaded,
    activeDomainId,
    auditStartDate,
    priorityDomains,
    lifeSatisfactionScore,
    lifeSatisfactionDate,
    setCurrentSection,
    setActiveDomainId,
    updateWheelScore,
    updateDYLReflection,
    updateOdysseyPlan,
    addSmartGoal,
    updateSmartGoal,
    removeSmartGoal,
    updateSmartGoalAction,
    addActionItem,
    updateActionItem,
    removeActionItem,
    addDailyCheckIn,
    getTodayCheckIn,
    initializeDomainProgress,
    updateDomainProgress,
    toggleQuickWin,
    addQuickWin,
    removeQuickWin,
    addTask,
    updateTask,
    removeTask,
    addGoodTimeEntry,
    removeGoodTimeEntry,
    completeOnboarding,
    retakeAssessment,
    recordScoreSnapshot,
    saveLifeSatisfactionScore,
    resetAllData,
    getGoalsForDomain,
    getActionsForDomain,
    getTodayActions,
  };
}
