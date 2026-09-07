import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { theme } from '@/src/theme';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text variant="headline">A quieter place for your thoughts.</Text>
      <Button label="Begin" onPress={() => router.push('/onboarding/trust')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.space.lg,
    gap: theme.space.lg,
    backgroundColor: theme.color.background,
  },
});