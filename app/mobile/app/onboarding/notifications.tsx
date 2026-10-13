import { useState } from 'react';
import { View } from 'react-native';
import { isNotificationsSupported } from '@/src/notifications/capability';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';
import { scheduleDailyReminder } from '@/src/notifications/scheduler';
import { api } from '@/src/api/client';
import { useAuthStore } from '@/src/auth/authStore';
import { resetTo } from '@/src/navigation/resetTo';
import { useToastStore } from '@/src/ui-feedback/toastStore';

export default function NotificationsStep() {
  const state = useOnboardingStore();
  const [saving, setSaving] = useState(false);

  async function finish(wantsNotifications: boolean) {
    if (saving) return;
    setSaving(true);
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

    try {
      await api.patch('/users/me/onboarding', {
        ageConfirmed: state.ageConfirmed,
        motivations: state.motivations,
        baselineMood: state.baselineMood,
        reflectionPreference: state.reflectionPreference,
        timeCommitment: state.timeCommitment,
        notificationsEnabled: wantsNotifications,
      });

      state.reset();
      useAuthStore.getState().markOnboardingDone();
      resetTo('/(tabs)');
    } catch (err) {
      console.error('[ONBOARDING] Onboarding submit threw:', err);
      useToastStore.getState().show("Couldn't save your answers. Please try again.");
      setSaving(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6 gap-4 bg-background">
      <Text variant="headline">Would you like reminders?</Text>
      <Text variant="body">You're always in control of when and how often.</Text>
      <Button
        label={saving ? 'Saving...' : 'Enable reminders'}
        onPress={() => finish(true)}
        disabled={saving}
      />
      <Button
        label="Not now"
        variant="secondary"
        onPress={() => finish(false)}
        disabled={saving}
      />
    </View>
  );
}