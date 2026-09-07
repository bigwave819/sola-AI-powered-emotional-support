import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { theme } from '@/src/theme';

export default function TabsLayout() {
  return (
    <>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="journal" options={{ title: 'Journal' }} />
        <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>

      {/* Persistent global mood check-in — reachable from any tab */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/mood/check-in')}
      >
        <Text color={theme.color.surfaceElevated} variant="bodySemiBold">
          +
        </Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: theme.space.lg,
    bottom: 90, // sits above the tab bar
    width: 56,
    height: 56,
    borderRadius: theme.radius.full,
    backgroundColor: theme.color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: theme.elevation.medium,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});