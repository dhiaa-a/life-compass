import { useState, useEffect } from 'react';
import { Calendar, Plus, Bell, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import type { SmartGoal, QuickWin } from '@/types/lifeAudit';
import { generateICS, downloadICSFile } from '@/lib/icsGenerator';
import { requestNotificationPermission, scheduleDay7Reminder } from '@/lib/notifications';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'quick-win' | 'goal-action' | 'review';
  completed?: boolean;
}

interface CalendarViewProps {
  quickWins: QuickWin[];
  goals: SmartGoal[];
  auditStartDate: string | null;
  onScheduleReview: () => void;
}

export function CalendarView({ quickWins, goals, auditStartDate, onScheduleReview }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Generate 7-day auto-events from incomplete quick wins
  useEffect(() => {
    if (!auditStartDate) return;

    const today = startOfToday();
    const incompleteWins = quickWins.filter(w => !w.completed);
    const generatedEvents: CalendarEvent[] = [];

    // Auto-schedule one quick win per day for 7 days
    incompleteWins.slice(0, 7).forEach((win, index) => {
      generatedEvents.push({
        id: `auto-${win.id}`,
        date: addDays(today, index),
        title: win.action.split(':')[0],
        type: 'quick-win',
        completed: win.completed,
      });
    });

    // Add goal review events
    goals.forEach((goal, index) => {
      if (goal.timeBound) {
        generatedEvents.push({
          id: `goal-${goal.id}`,
          date: addDays(today, 7 + index * 7),
          title: `Review: ${goal.specific.slice(0, 30)}...`,
          type: 'goal-action',
        });
      }
    });

    setEvents(generatedEvents);
  }, [quickWins, goals, auditStartDate]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
      scheduleDay7Reminder();
    }
  };

  const handle90DayReview = () => {
    const reviewDate = addDays(startOfToday(), 90);
    const icsContent = generateICS({
      title: '90-Day Life Audit Review',
      description: 'Time to review your Wheel of Life scores, reflect on progress, and set new goals for the next quarter.',
      startDate: reviewDate,
      duration: 60,
    });
    downloadICSFile(icsContent, 'life-audit-90-day-review.ics');
    onScheduleReview();
  };

  const eventsForSelectedDate = selectedDate 
    ? events.filter(e => isSameDay(e.date, selectedDate))
    : [];

  const eventDates = events.map(e => e.date);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background" id="calendar">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-primary font-medium mb-2 tracking-wide uppercase text-sm">Your Schedule</p>
          <h2 className="section-title mb-4">Action Calendar</h2>
          <p className="section-subtitle mx-auto">
            Auto-scheduled tiny actions to keep you moving forward every day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar Picker */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Calendar className="w-5 h-5 text-primary" />
                7-Day Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md pointer-events-auto"
                modifiers={{
                  hasEvent: eventDates,
                }}
                modifiersStyles={{
                  hasEvent: {
                    backgroundColor: 'hsl(var(--primary) / 0.2)',
                    borderRadius: '50%',
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Events & Actions */}
          <div className="space-y-4">
            {/* Selected Day Events */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {eventsForSelectedDate.length > 0 ? (
                  <ul className="space-y-3">
                    {eventsForSelectedDate.map(event => (
                      <li 
                        key={event.id}
                        className={`p-3 rounded-lg flex items-center gap-3 ${
                          event.type === 'quick-win' ? 'bg-primary/10' :
                          event.type === 'goal-action' ? 'bg-accent/10' : 'bg-secondary'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          event.type === 'quick-win' ? 'bg-primary' :
                          event.type === 'goal-action' ? 'bg-accent' : 'bg-muted-foreground'
                        }`} />
                        <span className="text-sm text-foreground">{event.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">No actions scheduled for this day.</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleEnableNotifications}
                  disabled={notificationsEnabled}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {notificationsEnabled ? 'Day 7 Reminder Set ✓' : 'Enable Day 7 Reminder'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handle90DayReview}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download 90-Day Review (.ics)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
