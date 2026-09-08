import { Tabs, router } from 'expo-router';
import { Pressable } from 'react-native';
import { Text } from '@/src/components/ui/Text';

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
        className="absolute right-6 bottom-[90px] w-14 h-14 rounded-full bg-accent items-center justify-center shadow-[0_4px_8px_0_rgba(0,0,0,0.15)]"
        style={{ elevation: 6 }}
        onPress={() => router.push('/mood/check-in')}
      >
        <Text variant="bodySemiBold" className="text-surface-elevated">
          +
        </Text>
      </Pressable>
    </>
  );
}