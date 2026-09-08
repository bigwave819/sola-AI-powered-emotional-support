import { View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';

export default function AgeGate() {
  const setAgeConfirmed = useOnboardingStore((s) => s.setAgeConfirmed);

  function confirm() {
    setAgeConfirmed(true);
    router.push('/onboarding/motivation');
  }

  return (
    <View className="flex-1 justify-center p-6 gap-4 bg-background">
      <Text variant="headline">Sola is designed for adults.</Text>
      <Text variant="body">You must be 18 or older to continue.</Text>
      <Button label="I'm 18 or older" onPress={confirm} />
      <Button
        label="I'm under 18"
        variant="secondary"
        onPress={() => router.replace('/onboarding/not-eligible')}
      />
    </View>
  );
}