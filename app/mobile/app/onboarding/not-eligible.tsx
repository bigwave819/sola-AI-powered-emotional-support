import { View, StyleSheet } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { theme } from '@/src/theme';

export default function NotEligible() {
  return (
    <View style={styles.container}>
      <Text variant="headline">Sola is currently for adults 18+</Text>
      <Text variant="body">
        We're not able to continue account setup at this time.
      </Text>
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