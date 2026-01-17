import { useState, useEffect } from 'react';
import { format, subDays, isSameDay, startOfDay } from 'date-fns';

interface MoodEntry {
  date: string;
  mood: 'sad' | 'neutral' | 'happy';
}

interface MoodTrackerProps {
  goalId: string;
}

const MOOD_STORAGE_KEY = 'life-audit-mood-tracking';

const moodEmojis = {
  sad: '😞',
  neutral: '😐',
  happy: '🙂',
};

const moodColors = {
  sad: 'hsl(0, 60%, 50%)',
  neutral: 'hsl(45, 60%, 50%)',
  happy: 'hsl(150, 60%, 45%)',
};

export function MoodTracker({ goalId }: MoodTrackerProps) {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<MoodEntry['mood'] | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(MOOD_STORAGE_KEY);
    if (stored) {
      const allMoods = JSON.parse(stored);
      const goalMoods = allMoods[goalId] || [];
      setMoodHistory(goalMoods);

      // Check if today already has a mood
      const today = startOfDay(new Date()).toISOString();
      const existingToday = goalMoods.find((m: MoodEntry) => 
        isSameDay(new Date(m.date), new Date())
      );
      if (existingToday) {
        setTodayMood(existingToday.mood);
      }
    }
  }, [goalId]);

  const saveMood = (mood: MoodEntry['mood']) => {
    const today = startOfDay(new Date()).toISOString();
    const newEntry: MoodEntry = { date: today, mood };

    const stored = localStorage.getItem(MOOD_STORAGE_KEY);
    const allMoods = stored ? JSON.parse(stored) : {};
    const goalMoods = allMoods[goalId] || [];

    // Update or add today's mood
    const existingIndex = goalMoods.findIndex((m: MoodEntry) => 
      isSameDay(new Date(m.date), new Date())
    );
    if (existingIndex >= 0) {
      goalMoods[existingIndex] = newEntry;
    } else {
      goalMoods.push(newEntry);
    }

    // Keep only last 7 days
    const last7Days = goalMoods.filter((m: MoodEntry) => {
      const entryDate = new Date(m.date);
      const sevenDaysAgo = subDays(new Date(), 7);
      return entryDate >= sevenDaysAgo;
    });

    allMoods[goalId] = last7Days;
    localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(allMoods));
    
    setMoodHistory(last7Days);
    setTodayMood(mood);
  };

  // Generate sparkline data for last 7 days
  const sparklineData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const entry = moodHistory.find(m => isSameDay(new Date(m.date), date));
    return {
      date,
      mood: entry?.mood || null,
    };
  });

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">How do you feel about this goal?</span>
        <div className="flex gap-1">
          {(Object.keys(moodEmojis) as Array<keyof typeof moodEmojis>).map((mood) => (
            <button
              key={mood}
              onClick={() => saveMood(mood)}
              className={`text-lg px-2 py-1 rounded transition-all ${
                todayMood === mood 
                  ? 'bg-primary/20 scale-110' 
                  : 'hover:bg-secondary opacity-60 hover:opacity-100'
              }`}
              title={`I feel ${mood}`}
            >
              {moodEmojis[mood]}
            </button>
          ))}
        </div>
      </div>

      {/* Sparkline */}
      <div className="flex items-end gap-1 h-6">
        {sparklineData.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full rounded-sm transition-all"
              style={{
                height: day.mood ? (day.mood === 'happy' ? '100%' : day.mood === 'neutral' ? '60%' : '30%') : '10%',
                backgroundColor: day.mood ? moodColors[day.mood] : 'hsl(var(--muted))',
                opacity: day.mood ? 1 : 0.3,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">7 days ago</span>
        <span className="text-[10px] text-muted-foreground">Today</span>
      </div>
    </div>
  );
}
