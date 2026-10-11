import { isNotificationsSupported } from './capability';

// Lazily loaded reference — only populated when notifications are supported.
let Notifications: typeof import('expo-notifications') | null = null;

function getNotifications(): typeof import('expo-notifications') | null {
  if (Notifications) return Notifications;
  if (!isNotificationsSupported()) return null;
  // Safe to require synchronously — we only reach here on platforms that support the module.
  Notifications = require('expo-notifications') as typeof import('expo-notifications');
  return Notifications;
}

// Set up the notification handler only when supported (this would crash
// on Android Expo Go SDK 53+ if called unconditionally).
if (isNotificationsSupported()) {
  const N = getNotifications();
  N?.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

const DAILY_REMINDER_ID = 'sola-daily-reminder';

// Invitational tone per spec — never guilt-based.
const REMINDER_MESSAGES = [
  'Your thoughts are welcome anytime.',
  'A quiet moment, whenever you have one.',
  'Sola is here if you want to check in.',
];

export async function scheduleDailyReminder(hour: number, minute: number) {
  const N = getNotifications();
  if (!N) {
    console.log('Notifications unavailable in Expo Go on Android — will work in a dev build');
    return;
  }

  await N.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});

  await N.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Sola',
      body: REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)],
    },
    trigger: {
      type: N.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyReminder() {
  const N = getNotifications();
  if (!N) {
    console.log('Notifications unavailable in Expo Go on Android — will work in a dev build');
    return;
  }

  await N.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});
}