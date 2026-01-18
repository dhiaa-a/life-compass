import { useState, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { DomainAssessment } from '@/components/DomainAssessment';
import { LifeOverview } from '@/components/LifeOverview';
import { OdysseyPlanning } from '@/components/OdysseyPlanning';
import { SmartGoals } from '@/components/SmartGoals';
import { QuickWins } from '@/components/QuickWins';
import { TaskDashboard } from '@/components/TaskDashboard';
import { CalendarView } from '@/components/CalendarView';
import { DataBackup } from '@/components/DataBackup';
import { useLifeAudit } from '@/hooks/useLifeAudit';

const ONBOARDING_KEY = 'life-audit-onboarding-complete';

const Index = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  
  const {
    wheelDomains,
    dylComponents,
    odysseyPlans,
    smartGoals,
    quickWins,
    tasks,
    currentSection,
    isLoaded,
    auditStartDate,
    setCurrentSection,
    updateWheelScore,
    updateDYLReflection,
    updateOdysseyPlan,
    addSmartGoal,
    removeSmartGoal,
    updateSmartGoalAction,
    toggleQuickWin,
    addQuickWin,
    removeQuickWin,
    addTask,
    updateTask,
    removeTask,
    completeOnboarding,
  } = useLifeAudit();

  const scrollToSection = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId === 'hero' ? 'hero-section' : sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [setCurrentSection]);

  const hasCompletedOnboarding = typeof window !== 'undefined' && 
    localStorage.getItem(ONBOARDING_KEY) === 'true';

  const handleStart = () => {
    if (hasCompletedOnboarding) {
      scrollToSection('overview');
    } else {
      setShowAssessment(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAssessmentComplete = (scores: Record<string, number>, priorityDomains: string[]) => {
    // Update all domain scores from assessment
    Object.entries(scores).forEach(([domainId, score]) => {
      updateWheelScore(domainId, score);
    });
    
    // Complete onboarding with priority domains
    completeOnboarding(priorityDomains);
    localStorage.setItem(ONBOARDING_KEY, 'true');
    
    setShowAssessment(false);
    scrollToSection('overview');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Show assessment flow
  if (showAssessment) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentSection={currentSection} onNavigate={scrollToSection} />
        <DomainAssessment 
          domains={wheelDomains}
          onComplete={handleAssessmentComplete}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentSection={currentSection} onNavigate={scrollToSection} />
      
      <main>
        <div id="hero-section">
          <HeroSection 
            onStart={handleStart} 
            hasCompletedOnboarding={hasCompletedOnboarding}
            averageScore={wheelDomains.reduce((sum, d) => sum + d.score, 0) / wheelDomains.length}
          />
        </div>
        
        {hasCompletedOnboarding && (
          <>
            <LifeOverview
              domains={wheelDomains}
              dylComponents={dylComponents}
              goals={smartGoals}
              quickWins={quickWins}
              onUpdateScore={updateWheelScore}
              onUpdateReflection={updateDYLReflection}
              onToggleQuickWin={toggleQuickWin}
            />
            
            <OdysseyPlanning 
              plans={odysseyPlans} 
              onUpdatePlan={updateOdysseyPlan} 
            />
            
            <SmartGoals 
              goals={smartGoals}
              domains={wheelDomains}
              onAddGoal={addSmartGoal}
              onRemoveGoal={removeSmartGoal}
              onUpdateGoalAction={updateSmartGoalAction}
            />
            
            <QuickWins 
              quickWins={quickWins} 
              onToggle={toggleQuickWin}
              onAdd={addQuickWin}
              onRemove={removeQuickWin}
            />

            <CalendarView
              quickWins={quickWins}
              goals={smartGoals}
              auditStartDate={auditStartDate}
              onScheduleReview={() => {}}
            />

            <TaskDashboard
              tasks={tasks}
              domains={wheelDomains}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onRemoveTask={removeTask}
            />

            {/* Settings & Export Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary/20" id="settings">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <DataBackup onImportSuccess={() => window.location.reload()} />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border bg-secondary/20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-display text-lg font-semibold text-foreground mb-2">
              Life Design is an Ongoing Process
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Review this assessment every 90 days. Track your progress and iterate on your plans.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-4">
              <a 
                href="https://designingyour.life/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                Designing Your Life
              </a>
              <span>•</span>
              <a 
                href="https://lifedesignlab.stanford.edu/dyl" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                Stanford Life Design Lab
              </a>
              <span>•</span>
              <a 
                href="https://positivepsychology.com/wheel-of-life-coaching/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors"
              >
                Wheel of Life Research
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on evidence-based methodologies by Bill Burnett & Dave Evans
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
