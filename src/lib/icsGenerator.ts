import { format, addMinutes } from 'date-fns';

interface ICSEvent {
  title: string;
  description: string;
  startDate: Date;
  duration: number; // in minutes
  location?: string;
}

export function generateICS(event: ICSEvent): string {
  const formatICSDate = (date: Date) => format(date, "yyyyMMdd'T'HHmmss");
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@lifeaudit.app`;
  const endDate = addMinutes(event.startDate, event.duration);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Life Audit//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    event.location ? `LOCATION:${event.location}` : null,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${event.title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n');
}

export function downloadICSFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateWeeklyActionsICS(actions: Array<{ date: Date; title: string; description: string }>): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Life Audit//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const formatICSDate = (date: Date) => format(date, "yyyyMMdd'T'HHmmss");

  actions.forEach((action, index) => {
    const uid = `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}@lifeaudit.app`;
    const endDate = addMinutes(action.date, 15);

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(action.date)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:🎯 ${action.title}`,
      `DESCRIPTION:${action.description.replace(/\n/g, '\\n')}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Time for your daily action: ${action.title}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
