import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';
import { theme } from '@/src/theme';

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function BaselineMood() {
  const baselineMood = useOnboardingStore((s) => s.baselineMood);
  const setBaselineMood = useOnboardingStore((s) => s.setBaselineMood);

  return (
    <View style={styles.container}>
      <Text variant="headline">How are you feeling today?</Text>
      <View style={styles.row}>
        {SCALE.map((n) => (
          <Button
            key={n}
            label={String(n)}
            variant={baselineMood === n ? 'primary' : 'secondary'}
            onPress={() => setBaselineMood(n)}
            style={{ width: 44, paddingHorizontal: 0 }}
          />
        ))}
      </View>
      <Button
        label="Continue"
        onPress={() => router.push('/onboarding/reflection-preference')}
        disabled={baselineMood === null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.space.lg,
    gap: theme.space.lg,
    backgroundColor: theme.color.background,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
});