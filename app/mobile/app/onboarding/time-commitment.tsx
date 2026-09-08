import { View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';

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
    <View className="flex-1 justify-center p-6 gap-4 bg-background">
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