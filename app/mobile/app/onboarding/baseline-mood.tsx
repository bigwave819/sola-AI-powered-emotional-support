import { View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';

const SCALE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function BaselineMood() {
  const baselineMood = useOnboardingStore((s) => s.baselineMood);
  const setBaselineMood = useOnboardingStore((s) => s.setBaselineMood);

  return (
    <View className="flex-1 justify-center p-6 gap-6 bg-background">
      <Text variant="headline">How are you feeling today?</Text>
      <View className="flex-row flex-wrap gap-2">
        {SCALE.map((n) => (
          <Button
            key={n}
            label={String(n)}
            variant={baselineMood === n ? 'primary' : 'secondary'}
            onPress={() => setBaselineMood(n)}
            className="w-11 px-0"
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