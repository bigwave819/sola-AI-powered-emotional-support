import { View } from 'react-native';
import { isNotificationsSupported } from '@/src/notifications/capability';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';
import { tokenStorage } from '@/src/auth/tokenStorage';
import { scheduleDailyReminder } from '@/src/notifications/scheduler';
import { api } from '@/src/api/client';
import { useAuthStore } from '@/src/auth/authStore';
import { resetTo } from '@/src/navigation/resetTo';

export default function NotificationsStep() {
  const state = useOnboardingStore();

  async function finish(wantsNotifications: boolean) {
    console.log('[ONBOARDING] finish() called — wantsNotifications:', wantsNotifications);
    console.log('[ONBOARDING] Payload being submitted:', JSON.stringify({
      ageConfirmed: state.ageConfirmed,
      motivations: state.motivations,
      baselineMood: state.baselineMood,
      reflectionPreference: state.reflectionPreference,
      timeCommitment: state.timeCommitment,
      notificationsEnabled: wantsNotifications,
    }));

    if (wantsNotifications) {
      let granted = false;
      if (isNotificationsSupported()) {
        const Notifications = await import('expo-notifications');
        const result = await Notifications.requestPermissionsAsync();
        granted = result.granted;
      } else {
        console.log('Notifications unavailable in this environment (Expo Go on Android)');
      }
      console.log('[ONBOARDING] Notification permission granted:', granted);
      if (granted) {
        const suggestedHour = await api.get('/insights/suggested-reminder-hour');
        console.log('[ONBOARDING] Suggested reminder hour from API:', suggestedHour);
        await scheduleDailyReminder(suggestedHour, 0);
      }
    }

    state.setNotificationsEnabled(wantsNotifications);

    const accessToken = await tokenStorage.getAccessToken();

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/me/onboarding`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ageConfirmed: state.ageConfirmed,
          motivations: state.motivations,
          baselineMood: state.baselineMood,
          reflectionPreference: state.reflectionPreference,
          timeCommitment: state.timeCommitment,
          notificationsEnabled: wantsNotifications,
        }),
      });
      console.log('[ONBOARDING] /users/me/onboarding status:', res.status);
      if (!res.ok) {
        console.error('[ONBOARDING] Onboarding submit failed with status:', res.status, await res.text());
      }
    } catch (err) {
      console.error('[ONBOARDING] Onboarding submit threw:', err);
    }

    state.reset();
    useAuthStore.getState().markOnboardingDone();
    resetTo('/(tabs)');
  }

  return (
    <View className="flex-1 justify-center p-6 gap-4 bg-background">
      <Text variant="headline">Would you like reminders?</Text>
      <Text variant="body">You're always in control of when and how often.</Text>
      <Button label="Enable reminders" onPress={() => finish(true)} />
      <Button label="Not now" variant="secondary" onPress={() => finish(false)} />
    </View>
  );
}