import { useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { WheelOfLife } from '@/components/WheelOfLife';
import { DYLDashboard } from '@/components/DYLDashboard';
import { OdysseyPlanning } from '@/components/OdysseyPlanning';
import { SmartGoals } from '@/components/SmartGoals';
import { QuickWins } from '@/components/QuickWins';
import { useLifeAudit } from '@/hooks/useLifeAudit';

const Index = () => {
  const {
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
  } = useLifeAudit();

  

  const scrollToSection = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId === 'hero' ? 'hero-section' : sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [setCurrentSection]);

  const handleStart = () => scrollToSection('wheel');

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentSection={currentSection} onNavigate={scrollToSection} />
      
      <main>
        <div id="hero-section">
          <HeroSection onStart={handleStart} />
        </div>
        
        <WheelOfLife 
          domains={wheelDomains} 
          onUpdateScore={updateWheelScore} 
        />
        
        <DYLDashboard 
          components={dylComponents} 
          onUpdateReflection={updateDYLReflection} 
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
        />
        
        <QuickWins 
          quickWins={quickWins} 
          onToggle={toggleQuickWin} 
        />

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border bg-secondary/20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-display text-lg font-semibold text-foreground mb-2">
              Life Design is an Ongoing Process
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Review this assessment every 90 days. Track your Good Time Journal and iterate on your Odyssey Plans.
            </p>
            <p className="text-xs text-muted-foreground">
              Based on the <a href="https://designingyour.life/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Designing Your Life</a> methodology by Bill Burnett & Dave Evans
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
