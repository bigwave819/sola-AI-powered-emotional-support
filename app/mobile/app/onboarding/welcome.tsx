import { View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';

export default function Welcome() {
  return (
    <View className="flex-1 justify-center p-6 gap-6 bg-background">
      <Text variant="headline">A quieter place for your thoughts.</Text>
      <Button label="Begin" onPress={() => router.push('/onboarding/trust')} />
    </View>
  );
}