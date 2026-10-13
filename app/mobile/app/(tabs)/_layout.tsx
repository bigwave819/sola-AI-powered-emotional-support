import { Pressable } from 'react-native';
import { Tabs, router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { FloatingTabBar } from '@/src/components/ui/FloatingTabBar';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // The reference Profile screen has no floating button
  const showFab = !['/', '/profile', '/journal', '/insights'].includes(pathname);
  const fabBottom = 62 + 6 + Math.max(insets.bottom, 10) + 16;

  return (
    <>
      <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="journal" options={{ title: 'Journal' }} />
        <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>

      {showFab && (
        <Pressable
          onPress={() => router.push('/mood/check-in')}
          accessibilityRole="button"
          accessibilityLabel="Mood check-in"
          className="absolute right-6 h-14 w-14 items-center justify-center rounded-full bg-forest shadow-[0_4px_8px_0_rgba(0,0,0,0.15)]"
          style={{ bottom: fabBottom, elevation: 6 }}
        >
          <Plus color="#FFFFFF" size={28} />
        </Pressable>
      )}
    </>
  );
}