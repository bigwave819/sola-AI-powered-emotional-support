import { View } from 'react-native';
import { Text } from '@/src/components/ui/Text';

export default function NotEligible() {
  return (
    <View className="flex-1 justify-center p-6 gap-4 bg-background">
      <Text variant="headline">Sola is currently for adults 18+</Text>
      <Text variant="body">
        We're not able to continue account setup at this time.
      </Text>
    </View>
  );
}