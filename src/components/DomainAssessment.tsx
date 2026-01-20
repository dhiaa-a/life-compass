import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Target, Sparkles, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DomainDiagnosis } from '@/components/DomainDiagnosis';
import type { WheelDomain, ActionItem } from '@/types/lifeAudit';

interface DomainAssessmentProps {
  domains: WheelDomain[];
  onComplete: (scores: Record<string, number>, priorityDomains: string[], prescribedActions: Omit<ActionItem, 'id' | 'createdAt' | 'status'>[]) => void;
}

// Research-backed questions for each life domain
// Based on validated life coaching assessments and psychology research
const DOMAIN_QUESTIONS: Record<string, { questions: string[]; tips: string }> = {
  career: {
    questions: [
      "I feel energized and engaged by my current work or profession.",
      "I have clear opportunities for growth and advancement in my career.",
      "My work contributes meaningfully to something larger than myself."
    ],
    tips: "Consider job satisfaction, work-life balance, and career trajectory."
  },
  finance: {
    questions: [
      "I have enough financial resources to meet my current needs comfortably.",
      "I feel secure about my financial future and retirement.",
      "I am making progress toward my financial goals."
    ],
    tips: "Think about savings, debt, income stability, and financial peace of mind."
  },
  health: {
    questions: [
      "I have consistent energy levels throughout the day.",
      "I maintain healthy habits around sleep, nutrition, and exercise.",
      "I feel physically capable of doing the activities I enjoy."
    ],
    tips: "Consider physical fitness, mental health, sleep quality, and chronic conditions."
  },
  relationships: {
    questions: [
      "I have meaningful connections with friends and family I can rely on.",
      "I feel supported and understood by the people in my life.",
      "I invest quality time in nurturing my important relationships."
    ],
    tips: "Think about depth of friendships, family bonds, and your support network."
  },
  romance: {
    questions: [
      "I feel fulfilled in my romantic life, whether single or partnered.",
      "I am able to give and receive love openly.",
      "My romantic relationship (or pursuit of one) adds to my wellbeing."
    ],
    tips: "Consider intimacy, communication, shared values, and emotional connection."
  },
  growth: {
    questions: [
      "I am actively learning new skills or expanding my knowledge.",
      "I have a clear sense of purpose and direction in my life.",
      "I regularly challenge myself to grow beyond my comfort zone."
    ],
    tips: "Think about education, hobbies, spirituality, and personal development."
  },
  fun: {
    questions: [
      "I regularly engage in activities that bring me joy and relaxation.",
      "I make time for hobbies and interests outside of work obligations.",
      "I feel a healthy sense of play and adventure in my life."
    ],
    tips: "Consider leisure time, creative pursuits, travel, and spontaneity."
  },
  environment: {
    questions: [
      "My home environment supports my wellbeing and productivity.",
      "I feel safe and comfortable in my physical surroundings.",
      "My living and working spaces are organized and pleasant."
    ],
    tips: "Think about your home, workspace, neighborhood, and physical possessions."
  }
};

const RESPONSE_OPTIONS = [
  { value: 1, label: "Strongly Disagree", emoji: "😞" },
  { value: 2, label: "Disagree", emoji: "😕" },
  { value: 3, label: "Neutral", emoji: "😐" },
  { value: 4, label: "Agree", emoji: "🙂" },
  { value: 5, label: "Strongly Agree", emoji: "😊" }
];

export function DomainAssessment({ domains, onComplete }: DomainAssessmentProps) {
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [showPrioritySelection, setShowPrioritySelection] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [domainScores, setDomainScores] = useState<Record<string, number>>({});
  const [diagnosisStep, setDiagnosisStep] = useState<'none' | 'first' | 'second'>('none');
  const [prescribedActions, setPrescribedActions] = useState<Omit<ActionItem, 'id' | 'createdAt' | 'status'>[]>([]);

  const currentDomain = domains[currentDomainIndex];
  const domainQuestions = DOMAIN_QUESTIONS[currentDomain.id]?.questions || [];
  const currentQuestion = domainQuestions[currentQuestionIndex];
  
  const totalQuestions = domains.length * 3;
  const answeredQuestions = Object.values(answers).reduce((sum, arr) => sum + arr.length, 0);
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleAnswer = (value: number) => {
    const domainId = currentDomain.id;
    const currentAnswers = answers[domainId] || [];
    const newAnswers = [...currentAnswers];
    newAnswers[currentQuestionIndex] = value;
    
    setAnswers(prev => ({
      ...prev,
      [domainId]: newAnswers
    }));

    // Auto-advance after selection
    setTimeout(() => {
      if (currentQuestionIndex < domainQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else if (currentDomainIndex < domains.length - 1) {
        setCurrentDomainIndex(currentDomainIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Calculate final scores and show priority selection
        calculateScores();
      }
    }, 300);
  };

  const calculateScores = () => {
    const scores: Record<string, number> = {};
    
    domains.forEach(domain => {
      const domainAnswers = answers[domain.id] || [];
      if (domainAnswers.length === 3) {
        // Convert 1-5 scale to 1-10 scale
        const avgScore = domainAnswers.reduce((a, b) => a + b, 0) / 3;
        scores[domain.id] = Math.round((avgScore / 5) * 10);
      } else {
        scores[domain.id] = 5; // Default
      }
    });
    
    setDomainScores(scores);
    setShowPrioritySelection(true);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentDomainIndex > 0) {
      setCurrentDomainIndex(currentDomainIndex - 1);
      setCurrentQuestionIndex(2); // Last question of previous domain
    }
  };

  const togglePriority = (domainId: string) => {
    setSelectedPriorities(prev => {
      if (prev.includes(domainId)) {
        return prev.filter(id => id !== domainId);
      }
      if (prev.length >= 2) {
        return [prev[1], domainId];
      }
      return [...prev, domainId];
    });
  };

  const handleStartDiagnosis = () => {
    if (selectedPriorities.length === 2) {
      setDiagnosisStep('first');
    }
  };

  const handleDiagnosisComplete = (actions: Omit<ActionItem, 'id' | 'createdAt' | 'status'>[]) => {
    setPrescribedActions(prev => [...prev, ...actions]);
    if (diagnosisStep === 'first') {
      setDiagnosisStep('second');
    } else {
      // Both diagnoses complete
      onComplete(domainScores, selectedPriorities, prescribedActions.concat(actions));
    }
  };

  const handleSkipDiagnosis = () => {
    if (diagnosisStep === 'first') {
      setDiagnosisStep('second');
    } else {
      onComplete(domainScores, selectedPriorities, prescribedActions);
    }
  };

  const handleComplete = () => {
    onComplete(domainScores, selectedPriorities, prescribedActions);
  };

  const currentAnswer = answers[currentDomain.id]?.[currentQuestionIndex];

  // Diagnosis Flow for Priority Domains (check this FIRST before priority selection)
  if (diagnosisStep !== 'none') {
    const currentPriorityIndex = diagnosisStep === 'first' ? 0 : 1;
    const currentPriorityDomain = domains.find(d => d.id === selectedPriorities[currentPriorityIndex]);
    
    if (!currentPriorityDomain) {
      handleComplete();
      return null;
    }
    
    return (
      <DomainDiagnosis
        domain={currentPriorityDomain}
        onComplete={handleDiagnosisComplete}
        onSkip={handleSkipDiagnosis}
      />
    );
  }

  // Priority Selection Screen
  if (showPrioritySelection) {
    // Sort domains by score (lowest first - these need most attention)
    const sortedDomains = [...domains].sort((a, b) => 
      (domainScores[a.id] || 5) - (domainScores[b.id] || 5)
    );

    return (
      <section className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Your Life Audit Results
            </h2>
            <p className="text-muted-foreground">
              Based on your answers, here's how you rated each area. 
              Select <strong className="text-foreground">2 domains</strong> to prioritize.
            </p>
          </div>

          {/* Score Overview */}
          <Card className="glass-card mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-3">
                {sortedDomains.map(domain => {
                  const score = domainScores[domain.id] || 5;
                  const isSelected = selectedPriorities.includes(domain.id);
                  const isLow = score <= 4;
                  
                  return (
                    <button
                      key={domain.id}
                      onClick={() => togglePriority(domain.id)}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50",
                        isLow && !isSelected && "bg-destructive/5"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: domain.color }}
                          />
                          <span className="font-medium text-sm text-foreground">
                            {domain.name.split(' ')[0]}
                          </span>
                        </div>
                        <span className={cn(
                          "font-display text-xl font-bold",
                          score >= 7 ? "text-primary" : score >= 5 ? "text-accent" : "text-destructive"
                        )}>
                          {score}
                        </span>
                      </div>
                      <Progress value={score * 10} className="h-2" />
                      {isSelected && (
                        <span className="text-xs text-primary font-medium mt-2 block">
                          #{selectedPriorities.indexOf(domain.id) + 1} Priority
                        </span>
                      )}
                      {isLow && !isSelected && (
                        <span className="text-xs text-muted-foreground mt-2 block">
                          Needs attention
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card className="glass-card mb-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Life Balance</p>
                  <p className="text-xs text-muted-foreground">Average across all domains</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-3xl font-bold text-primary">
                    {(Object.values(domainScores).reduce((a, b) => a + b, 0) / 8).toFixed(1)}
                  </span>
                  <span className="text-lg text-muted-foreground">/10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedPriorities.length}/2 priorities selected
            </p>
            <Button 
              onClick={handleStartDiagnosis}
              disabled={selectedPriorities.length !== 2}
              size="lg"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Diagnose & Prescribe
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Question Flow
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div 
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
            style={{ backgroundColor: `${currentDomain.color}20` }}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentDomain.color }}
            />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
            {currentDomain.name}
          </h2>
          <p className="text-muted-foreground text-sm">
            {DOMAIN_QUESTIONS[currentDomain.id]?.tips}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Domain {currentDomainIndex + 1} of {domains.length}</span>
            <span>Question {currentQuestionIndex + 1} of 3</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="glass-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-display leading-relaxed">
              "{currentQuestion}"
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Response Options */}
            <div className="grid gap-2">
              {RESPONSE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all duration-200",
                    "hover:border-primary/50 hover:bg-secondary/50",
                    currentAnswer === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <span className={cn(
                      "font-medium",
                      currentAnswer === option.value
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}>
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentDomainIndex === 0 && currentQuestionIndex === 0}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (currentQuestionIndex < 2) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  } else if (currentDomainIndex < domains.length - 1) {
                    setCurrentDomainIndex(currentDomainIndex + 1);
                    setCurrentQuestionIndex(0);
                  } else {
                    calculateScores();
                  }
                }}
                disabled={currentAnswer === undefined}
                className="flex-1"
              >
                {currentDomainIndex === domains.length - 1 && currentQuestionIndex === 2 
                  ? 'See Results' 
                  : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Domain Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {domains.map((domain, i) => (
            <div
              key={domain.id}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                i === currentDomainIndex
                  ? "scale-125"
                  : i < currentDomainIndex
                  ? "opacity-100"
                  : "opacity-30"
              )}
              style={{ backgroundColor: domain.color }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
