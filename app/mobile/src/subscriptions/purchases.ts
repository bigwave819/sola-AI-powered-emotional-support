import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

let configured = false;
let currentUserId: string | null = null;

export function isPurchasesConfigured(): boolean {
  return configured;
}

export async function initPurchases(userId: string): Promise<void> {
  const apiKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

  if (!apiKey) {
    return;
  }

  if (configured) {
    if (userId && userId !== currentUserId) {
      try {
        await Purchases.logIn(userId);
        currentUserId = userId;
      } catch (err) {
        console.warn('[PURCHASES] Failed to switch user in Purchases:', err);
      }
    }
    return;
  }

  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);
  Purchases.configure({ apiKey, appUserID: userId });
  configured = true;
  currentUserId = userId;
}
