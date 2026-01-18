import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LifeSatisfactionAssessmentProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

const SWLS_QUESTIONS = [
  {
    id: 1,
    text: "In most ways my life is close to my ideal.",
    subtext: "Consider how your current reality matches your vision of an ideal life."
  },
  {
    id: 2,
    text: "The conditions of my life are excellent.",
    subtext: "Think about your living situation, health, relationships, and resources."
  },
  {
    id: 3,
    text: "I am satisfied with my life.",
    subtext: "An overall assessment of your contentment with life as it is now."
  },
  {
    id: 4,
    text: "So far I have gotten the important things I want in life.",
    subtext: "Reflect on your achievements and progress toward meaningful goals."
  },
  {
    id: 5,
    text: "If I could live my life over, I would change almost nothing.",
    subtext: "Consider your life path and the choices you've made."
  }
];

const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly Disagree", color: "bg-destructive/80" },
  { value: 2, label: "Disagree", color: "bg-destructive/50" },
  { value: 3, label: "Slightly Disagree", color: "bg-orange-500/60" },
  { value: 4, label: "Neutral", color: "bg-muted" },
  { value: 5, label: "Slightly Agree", color: "bg-primary/40" },
  { value: 6, label: "Agree", color: "bg-primary/70" },
  { value: 7, label: "Strongly Agree", color: "bg-primary" }
];

interface ScoreInterpretation {
  range: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  recommendation: string;
}

const getScoreInterpretation = (score: number): ScoreInterpretation => {
  if (score >= 30) {
    return {
      range: "30-35",
      title: "Highly Satisfied",
      description: "You love your life and feel things are going very well. While not perfect, you embrace challenges and find enjoyment in most areas.",
      icon: <Sparkles className="w-8 h-8" />,
      color: "text-primary",
      recommendation: "Continue nurturing what's working. The Wheel of Life can help you identify areas for even greater fulfillment."
    };
  } else if (score >= 25) {
    return {
      range: "25-29",
      title: "Quite Satisfied",
      description: "You like your life and feel things are going well overall. Areas of less satisfaction may actually motivate positive growth.",
      icon: <Heart className="w-8 h-8" />,
      color: "text-primary",
      recommendation: "Use this audit to pinpoint specific areas where small improvements could elevate your satisfaction further."
    };
  } else if (score >= 20) {
    return {
      range: "20-24",
      title: "Average Satisfaction",
      description: "Your satisfaction is typical for developed nations. You're generally content but see clear opportunities for improvement.",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "text-accent",
      recommendation: "This is an ideal starting point for a life audit. You have solid foundations to build upon."
    };
  } else if (score >= 15) {
    return {
      range: "15-19",
      title: "Below Average",
      description: "You may be facing significant challenges in several areas, or substantial problems in one domain. If recent, this may improve with time.",
      icon: <AlertCircle className="w-8 h-8" />,
      color: "text-orange-500",
      recommendation: "This audit will help identify which areas need attention most. Consider reaching out to supportive friends or professionals."
    };
  } else {
    return {
      range: "5-14",
      title: "Dissatisfied",
      description: "You're experiencing significant unhappiness. This may stem from recent events or persistent challenges that need addressing.",
      icon: <AlertCircle className="w-8 h-8" />,
      color: "text-destructive",
      recommendation: "This audit can help clarify what needs to change. We strongly encourage seeking support from trusted people or a counselor."
    };
  }
};

export function LifeSatisfactionAssessment({ onComplete, onBack }: LifeSatisfactionAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(5).fill(null));
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < SWLS_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const totalScore = answers.reduce((sum, val) => sum + (val || 0), 0);
  const progress = ((currentQuestion + 1) / SWLS_QUESTIONS.length) * 100;
  const interpretation = getScoreInterpretation(totalScore);
  const allAnswered = answers.every(a => a !== null);

  if (showResults) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 py-16">
        <Card className="max-w-2xl w-full glass-card animate-scale-in">
          <CardHeader className="text-center pb-2">
            <div className={cn("mx-auto mb-4", interpretation.color)}>
              {interpretation.icon}
            </div>
            <CardTitle className="text-2xl md:text-3xl font-display">
              Your Life Satisfaction Score
            </CardTitle>
            <div className="mt-4">
              <span className={cn("text-6xl font-bold", interpretation.color)}>{totalScore}</span>
              <span className="text-2xl text-muted-foreground">/35</span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className={cn("text-xl font-semibold mb-2", interpretation.color)}>
                {interpretation.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {interpretation.description}
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                What This Means For You
              </h4>
              <p className="text-sm text-muted-foreground">
                {interpretation.recommendation}
              </p>
            </div>

            {/* Score breakdown */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Your Responses</h4>
              <div className="grid gap-2">
                {SWLS_QUESTIONS.map((q, i) => (
                  <div key={q.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate flex-1 mr-4">
                      Q{i + 1}: {q.text.slice(0, 40)}...
                    </span>
                    <span className={cn(
                      "font-medium px-2 py-0.5 rounded",
                      answers[i] && answers[i]! >= 5 ? "bg-primary/20 text-primary" : 
                      answers[i] && answers[i]! >= 4 ? "bg-muted text-muted-foreground" :
                      "bg-orange-500/20 text-orange-600"
                    )}>
                      {answers[i]}/7
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">
                <strong>About this assessment:</strong> The Satisfaction With Life Scale (SWLS) was developed by 
                psychologist Ed Diener and is one of the most widely used and validated measures of life satisfaction 
                in psychological research. It has been used in thousands of studies worldwide.
              </p>
              <p className="text-xs text-muted-foreground">
                Reference: Diener, E., Emmons, R. A., Larson, R. J., & Griffin, S. (1985). 
                The Satisfaction with Life Scale. Journal of Personality Assessment, 49, 71-75.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers(Array(5).fill(null));
                }}
                className="flex-1"
              >
                Retake Assessment
              </Button>
              <Button 
                onClick={() => onComplete(totalScore)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Continue to Life Audit
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const question = SWLS_QUESTIONS[currentQuestion];

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">
            Validated Life Satisfaction Scale
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
            How Satisfied Are You?
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            This clinically validated 5-question assessment helps measure your overall life satisfaction.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {SWLS_QUESTIONS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="glass-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-display leading-relaxed">
              "{question.text}"
            </CardTitle>
            <CardDescription className="text-base">
              {question.subtext}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Likert Scale Options */}
            <div className="grid gap-2">
              {LIKERT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 text-left transition-all duration-200",
                    "hover:border-primary/50 hover:bg-secondary/50",
                    answers[currentQuestion] === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      answers[currentQuestion] === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}>
                      {option.value}
                    </div>
                    <span className={cn(
                      "font-medium",
                      answers[currentQuestion] === option.value
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
                onClick={currentQuestion === 0 ? onBack : handlePrevious}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {currentQuestion === 0 ? 'Back' : 'Previous'}
              </Button>
              <Button
                onClick={handleNext}
                disabled={answers[currentQuestion] === null}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {currentQuestion === SWLS_QUESTIONS.length - 1 ? 'See Results' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visual indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {SWLS_QUESTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                i === currentQuestion
                  ? "bg-primary scale-125"
                  : answers[i] !== null
                  ? "bg-primary/50"
                  : "bg-border"
              )}
              aria-label={`Go to question ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
