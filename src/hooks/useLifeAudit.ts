import { useState, useCallback } from 'react';
import type { WheelDomain, DYLComponent, OdysseyPlan, SmartGoal, QuickWin } from '@/types/lifeAudit';

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

export function useLifeAudit() {
  const [wheelDomains, setWheelDomains] = useState<WheelDomain[]>(initialWheelDomains);
  const [dylComponents, setDYLComponents] = useState<DYLComponent[]>(initialDYLComponents);
  const [odysseyPlans, setOdysseyPlans] = useState<OdysseyPlan[]>(initialOdysseyPlans);
  const [smartGoals, setSmartGoals] = useState<SmartGoal[]>([]);
  const [quickWins, setQuickWins] = useState<QuickWin[]>(initialQuickWins);
  const [currentSection, setCurrentSection] = useState('hero');

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

  const addSmartGoal = useCallback((goal: SmartGoal) => {
    setSmartGoals(prev => [...prev, goal]);
  }, []);

  const removeSmartGoal = useCallback((goalId: string) => {
    setSmartGoals(prev => prev.filter(goal => goal.id !== goalId));
  }, []);

  const toggleQuickWin = useCallback((quickWinId: string) => {
    setQuickWins(prev =>
      prev.map(win =>
        win.id === quickWinId ? { ...win, completed: !win.completed } : win
      )
    );
  }, []);

  return {
    wheelDomains,
    dylComponents,
    odysseyPlans,
    smartGoals,
    quickWins,
    currentSection,
    setCurrentSection,
    updateWheelScore,
    updateDYLReflection,
    updateOdysseyPlan,
    addSmartGoal,
    removeSmartGoal,
    toggleQuickWin,
  };
}
