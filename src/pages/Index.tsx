import { useState, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { DomainAssessment } from '@/components/DomainAssessment';
import { DomainFocus } from '@/components/DomainFocus';
import { LifeOverview } from '@/components/LifeOverview';
import { ProgressCharts } from '@/components/ProgressCharts';
import { DataBackup } from '@/components/DataBackup';
import { useLifeAudit } from '@/hooks/useLifeAudit';

const ONBOARDING_KEY = 'life-audit-onboarding-complete';

const Index = () => {
  const [showAssessment, setShowAssessment] = useState(false);
  
  const {
    wheelDomains,
    dylComponents,
    smartGoals,
    actionItems,
    dailyCheckIns,
    domainProgress,
    scoreHistory,
    quickWins,
    currentSection,
    isLoaded,
    activeDomainId,
    auditStartDate,
    setCurrentSection,
    setActiveDomainId,
    updateWheelScore,
    updateDYLReflection,
    addSmartGoal,
    updateSmartGoal,
    removeSmartGoal,
    addActionItem,
    updateActionItem,
    removeActionItem,
    addDailyCheckIn,
    toggleQuickWin,
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
      scrollToSection('focus');
    } else {
      setShowAssessment(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAssessmentComplete = (scores: Record<string, number>, priorityDomains: string[]) => {
    Object.entries(scores).forEach(([domainId, score]) => {
      updateWheelScore(domainId, score);
    });
    
    completeOnboarding(priorityDomains);
    localStorage.setItem(ONBOARDING_KEY, 'true');
    
    setShowAssessment(false);
    scrollToSection('focus');
  };

  const handleRetakeAssessment = () => {
    setShowAssessment(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <DomainFocus
              domains={wheelDomains}
              activeDomainId={activeDomainId}
              goals={smartGoals}
              actionItems={actionItems}
              dailyCheckIns={dailyCheckIns}
              onSelectDomain={setActiveDomainId}
              onAddGoal={addSmartGoal}
              onUpdateGoal={updateSmartGoal}
              onRemoveGoal={removeSmartGoal}
              onAddAction={addActionItem}
              onUpdateAction={updateActionItem}
              onRemoveAction={removeActionItem}
              onAddCheckIn={addDailyCheckIn}
              onRetakeAssessment={handleRetakeAssessment}
            />

            <LifeOverview
              domains={wheelDomains}
              dylComponents={dylComponents}
              goals={smartGoals}
              quickWins={quickWins}
              onUpdateScore={updateWheelScore}
              onUpdateReflection={updateDYLReflection}
              onToggleQuickWin={toggleQuickWin}
            />

            <ProgressCharts
              domains={wheelDomains}
              domainProgress={domainProgress}
              dailyCheckIns={dailyCheckIns}
              scoreHistory={scoreHistory}
              auditStartDate={auditStartDate || undefined}
            />

            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary/20" id="settings">
              <div className="max-w-4xl mx-auto">
                <DataBackup onImportSuccess={() => window.location.reload()} />
              </div>
            </section>
          </>
        )}

        <footer className="py-12 px-4 border-t border-border bg-secondary/20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-display text-lg font-semibold text-foreground mb-2">
              Life Design is an Ongoing Process
            </p>
            <p className="text-muted-foreground text-sm">
              Review this assessment every 90 days. Track your progress and iterate on your plans.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
