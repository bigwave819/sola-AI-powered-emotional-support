import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { BookIcon, ChartIcon, HouseIcon, UserIcon } from './icons';

const FOREST = '#2F4A3E';
const MUTED = '#8A857B';

const TABS: Record<string, { label: string; Icon: LucideIcon }> = {
  index: { label: 'Home', Icon: HouseIcon },
  journal: { label: 'Journal', Icon: BookIcon },
  insights: { label: 'Insights', Icon: ChartIcon },
  profile: { label: 'Profile', Icon: UserIcon },
};

interface Props {
  state: any;
  descriptors: any;
  navigation: any;
}

export function FloatingTabBar({ state, navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-paper px-4" style={{ paddingTop: 6, paddingBottom: Math.max(insets.bottom, 10) }}>
      <View
        className="h-[62px] flex-row items-center rounded-[30px] bg-card px-2 shadow-[0_4px_16px_rgba(60,45,25,0.08)]"
        style={{ elevation: 3 }}
      >
        {state.routes.map((route: any, index: number) => {
          const cfg = TABS[route.name];
          if (!cfg) return null;

          const focused = state.index === index;
          const { Icon, label } = cfg;
          const isProfile = route.name === 'profile';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              Haptics.selectionAsync().catch(() => {});
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              className="flex-1 items-center justify-center"
            >
              {focused && isProfile ? (
                <View className="h-8 w-8 items-center justify-center rounded-full bg-forest">
                  <UserIcon size={17} strokeWidth={2} color="#FFFFFF" />
                </View>
              ) : (
                <Icon size={22} strokeWidth={focused ? 2.2 : 1.6} color={focused ? FOREST : MUTED} />
              )}
              <Text
                className={`mt-0.5 text-[10px] ${
                  focused ? 'font-body-semibold text-forest' : 'font-body text-ink/50'
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}