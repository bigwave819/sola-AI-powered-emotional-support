import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';
import { theme } from '@/src/theme';

export default function AgeGate() {
  const setAgeConfirmed = useOnboardingStore((s) => s.setAgeConfirmed);

  function confirm() {
    setAgeConfirmed(true);
    router.push('/onboarding/motivation');
  }

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.space.lg,
    gap: theme.space.md,
    backgroundColor: theme.color.background,
  },
});