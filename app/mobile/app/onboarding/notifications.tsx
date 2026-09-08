import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';
import { tokenStorage } from '@/src/auth/tokenStorage';
import { theme } from '@/src/theme';
import { scheduleDailyReminder } from '@/src/notifications/scheduler';
import { api } from '@/src/api/client';

export default function NotificationsStep() {
  const state = useOnboardingStore();

  async function finish(wantsNotifications: boolean) {

    if (wantsNotifications) {
      const { granted } = await Notifications.requestPermissionsAsync();
      if (granted) {
        const suggestedHour = await api.get('/insights/suggested-reminder-hour');
        await scheduleDailyReminder(suggestedHour, 0);
      }
    }

    state.setNotificationsEnabled(wantsNotifications);

    const accessToken = await tokenStorage.getAccessToken();

    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/me/onboarding`, {
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

    state.reset();
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.container}>
      <Text variant="headline">Would you like reminders?</Text>
      <Text variant="body">You're always in control of when and how often.</Text>
      <Button label="Enable reminders" onPress={() => finish(true)} />
      <Button label="Not now" variant="secondary" onPress={() => finish(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.space.lg,
    gap: theme.space.md,
    backgroundColor: theme.color.background,
  },
});