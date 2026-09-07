import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';
import { theme } from '@/src/theme';

const OPTIONS = [
  { value: '2min', label: '2 minutes' },
  { value: '5min', label: '5 minutes' },
  { value: '10min', label: '10 minutes' },
  { value: 'whenever', label: 'Whenever I need it' },
];

export default function TimeCommitment() {
  const value = useOnboardingStore((s) => s.timeCommitment);
  const setValue = useOnboardingStore((s) => s.setTimeCommitment);

  return (
    <View style={styles.container}>
      <Text variant="headline">How much time do you want to give this?</Text>
      {OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          label={opt.label}
          variant={value === opt.value ? 'primary' : 'secondary'}
          onPress={() => setValue(opt.value)}
        />
      ))}
      <Button
        label="Continue"
        onPress={() => router.push('/onboarding/notifications')}
        disabled={!value}
      />
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