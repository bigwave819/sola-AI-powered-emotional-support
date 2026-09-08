import { View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';

export default function Trust() {
  return (
    <View className="flex-1 justify-center p-6 gap-4 bg-background">
      <Text variant="headline">Your reflections stay yours.</Text>
      <Text variant="body">
        Sola is built around private reflection. You control your data — export or delete it anytime.
      </Text>
      <Button label="Continue" onPress={() => router.push('/auth')} />
    </View>
  );
}