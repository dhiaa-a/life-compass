const NOTIFICATION_STORAGE_KEY = 'life-audit-notifications';

interface NotificationState {
  day7ReminderScheduled: boolean;
  scheduledAt?: string;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function scheduleDay7Reminder(): void {
  const state: NotificationState = {
    day7ReminderScheduled: true,
    scheduledAt: new Date().toISOString(),
  };
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(state));

  // For browser notifications, we need to use the Page Visibility API
  // since we can't schedule future notifications directly
  checkAndShowDay7Reminder();
}

export function checkAndShowDay7Reminder(): void {
  try {
    const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!stored) return;

    const state: NotificationState = JSON.parse(stored);
    if (!state.day7ReminderScheduled || !state.scheduledAt) return;

    const scheduledDate = new Date(state.scheduledAt);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince >= 7 && Notification.permission === 'granted') {
      new Notification('🔔 Week 1 Complete!', {
        body: 'Time to review your progress and pick your next step in your life audit journey.',
        icon: '/favicon.ico',
        tag: 'day7-reminder',
      });
      
      // Clear the reminder so it doesn't show again
      localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error checking notifications:', e);
  }
}

// Check on page load
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkAndShowDay7Reminder();
    }
  });
}
