import { View, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';
import { theme } from '@/src/theme';

const OPTIONS = [
  'stress', 'overthinking', 'loneliness', 'self-understanding',
  'journaling', 'better habits', 'relaxation', 'focus',
];

export default function Motivation() {
  const motivations = useOnboardingStore((s) => s.motivations);
  const toggle = useOnboardingStore((s) => s.toggleMotivation);

  return (
    <View style={styles.container}>
      <Text variant="headline">What brings you here?</Text>
      <View style={styles.chipRow}>
        {OPTIONS.map((opt) => {
          const selected = motivations.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => toggle(opt)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text color={selected ? theme.color.surfaceElevated : theme.color.textPrimary}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Button label="Continue" onPress={() => router.push('/onboarding/baseline-mood')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.space.lg,
    gap: theme.space.lg,
    justifyContent: 'center',
    backgroundColor: theme.color.background,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  chip: {
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.md,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  chipSelected: {
    backgroundColor: theme.color.accent,
    borderColor: theme.color.accent,
  },
});