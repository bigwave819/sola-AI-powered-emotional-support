import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { theme } from '@/src/theme';

export default function Trust() {
  return (
    <View style={styles.container}>
      <Text variant="headline">Your reflections stay yours.</Text>
      <Text variant="body">
        Sola is built around private reflection. You control your data — export or delete it anytime.
      </Text>
      <Button label="Continue" onPress={() => router.push('/auth')} />
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