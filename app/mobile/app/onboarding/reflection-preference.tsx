import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';
import { theme } from '@/src/theme';

const OPTIONS = [
  { value: 'writing', label: 'Writing' },
  { value: 'talking', label: 'Talking / conversation' },
  { value: 'quick', label: 'Quick check-ins' },
  { value: 'guided', label: 'Guided reflection' },
];

export default function ReflectionPreference() {
  const value = useOnboardingStore((s) => s.reflectionPreference);
  const setValue = useOnboardingStore((s) => s.setReflectionPreference);

  return (
    <View style={styles.container}>
      <Text variant="headline">How do you like to reflect?</Text>
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
        onPress={() => router.push('/onboarding/time-commitment')}
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