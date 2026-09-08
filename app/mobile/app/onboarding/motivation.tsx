import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';

const OPTIONS = [
  'stress', 'overthinking', 'loneliness', 'self-understanding',
  'journaling', 'better habits', 'relaxation', 'focus',
];

const CHIP_CLASS = 'py-2 px-4 rounded-full border border-border';
const CHIP_SELECTED_CLASS = 'bg-accent border-accent';

export default function Motivation() {
  const motivations = useOnboardingStore((s) => s.motivations);
  const toggle = useOnboardingStore((s) => s.toggleMotivation);

  return (
    <View className="flex-1 justify-center p-6 gap-6 bg-background">
      <Text variant="headline">What brings you here?</Text>
      <View className="flex-row flex-wrap gap-2">
        {OPTIONS.map((opt) => {
          const selected = motivations.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => toggle(opt)}
              className={selected ? `${CHIP_CLASS} ${CHIP_SELECTED_CLASS}` : CHIP_CLASS}
            >
              <Text className={selected ? 'text-surface-elevated' : 'text-text-primary'}>
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