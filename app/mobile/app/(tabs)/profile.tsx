import { Alert, Image, Pressable, ScrollView, Text, View, type ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { api } from '@/src/api/client';
import { tokenStorage } from '@/src/auth/tokenStorage';
import { useAuthStore } from '@/src/auth/authStore';
import { useOnboardingStore } from '@/src/onboarding/onboardingStore';
import { cancelDailyReminder } from '@/src/notifications/scheduler';
import { resetTo } from '@/src/navigation/resetTo';
import { useToastStore } from '@/src/ui-feedback/toastStore';
import {
  ChevronRightIcon,
  HelpIcon,
  LeafIcon,
  LogOutIcon,
  PencilIcon,
  SettingsIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
} from '@/src/components/ui/icons';

const FOREST = '#2F4A3E';
const CORAL = '#C4432F';
const MUTED = '#8A857B';

// To use a real photo: put it at app\mobile\assets\profile\avatar.png and replace null with:
//   require('../../assets/profile/avatar.png')
const AVATAR: ImageSourcePropType | null = null;

interface Me {
  id: string;
  email: string;
  preferredName: string | null;
}

function displayName(me?: Me) {
  if (me?.preferredName) return me.preferredName;
  const local = me?.email?.split('@')[0] ?? '';
  const words = local.replace(/[._-]+/g, ' ').trim();
  return words ? words.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Your profile';
}

function Avatar({ name }: { name: string }) {
  if (AVATAR) {
    return <Image source={AVATAR} className="h-[76px] w-[76px] rounded-full" />;
  }
  return (
    <View className="h-[76px] w-[76px] items-center justify-center rounded-full bg-forest/10">
      <Text className="font-display-medium text-[30px] text-forest">{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

interface RowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress: () => void;
  danger?: boolean;
  last?: boolean;
}

function Row({ icon: Icon, title, subtitle, onPress, danger, last }: RowProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" className="active:opacity-60">
      <View className="flex-row items-center px-5 py-[13px]">
        <Icon size={22} strokeWidth={1.5} color={danger ? CORAL : FOREST} />
        <View className="ml-[26px] flex-1">
          <Text className={`font-body-medium text-[14px] ${danger ? 'text-coral' : 'text-ink'}`}>{title}</Text>
          <Text className="mt-0.5 font-body text-[11px] text-ink/50">{subtitle}</Text>
        </View>
        <ChevronRightIcon size={16} strokeWidth={1.6} color={danger ? CORAL : MUTED} />
      </View>
      {!last && <View className="mx-5 h-px bg-ink/10" />}
    </Pressable>
  );
}

const CARD =
  'mx-6 rounded-[20px] border border-black/[0.03] bg-card shadow-[0_2px_10px_rgba(60,45,25,0.06)]';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const { data: me } = useQuery<Me>({
    queryKey: ['me'],
    queryFn: () => api.get('/users/me'),
  });

  const name = displayName(me);
  const soon = () => useToastStore.getState().show('Coming soon.');

  async function logout() {
    await tokenStorage.clear();
    await cancelDailyReminder().catch(() => {});
    useOnboardingStore.getState().reset();
    useAuthStore.getState().clearSession();
    queryClient.clear(); // so the next account never sees this one's cached data
    resetTo('/onboarding/welcome');
  }

  function confirmLogout() {
    Alert.alert('Log out?', 'You can sign back in anytime with your email.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <ScrollView
      className="flex-1 bg-paper"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6" style={{ paddingTop: insets.top + 6 }}>
        <Text className="font-display text-[26px] text-ink">Profile</Text>
        <Pressable
          hitSlop={12}
          onPress={() => router.push('/profile/notifications')}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <SettingsIcon size={22} strokeWidth={1.5} color={FOREST} />
        </Pressable>
      </View>

      {/* Identity */}
      <View className="mt-[30px] flex-row px-6">
        <Avatar name={name} />
        <View className="ml-[30px] flex-1 justify-center">
          <Text className="font-body-medium text-[17px] text-ink" numberOfLines={1}>
            {name}
          </Text>
          <Text className="mt-0.5 font-body text-[13px] text-ink/50" numberOfLines={1}>
            {me?.email ?? ' '}
          </Text>
          <Pressable
            onPress={soon}
            accessibilityRole="button"
            className="mt-2 h-[30px] flex-row items-center self-start rounded-full border border-black/[0.06] bg-card px-3"
          >
            <PencilIcon size={12} strokeWidth={1.8} color={FOREST} />
            <Text className="ml-1.5 font-body-medium text-[11px] text-ink">Edit Profile</Text>
          </Pressable>
        </View>
      </View>

      {/* Settings list */}
      <View className={`mt-[18px] ${CARD}`} style={{ elevation: 1 }}>
        <Row icon={UserIcon} title="Account Information" subtitle="Name, email, phone, etc." onPress={soon} />
        <Row
          icon={SettingsIcon}
          title="Preferences"
          subtitle="Mood, language, notifications"
          onPress={() => router.push('/profile/notifications')}
        />
        <Row
          icon={ShieldIcon}
          title="Privacy & Security"
          subtitle="Data, permissions, export"
          onPress={() => router.push('/profile/privacy')}
        />
        <Row
          icon={HelpIcon}
          title="Help & Support"
          subtitle="FAQs, contact us"
          onPress={() => router.push('/profile/safety')}
        />
        <Row icon={LeafIcon} title="About Sola" subtitle="Our mission and values" onPress={soon} last />
      </View>

      {/* Danger zone */}
      <View className={`mt-7 ${CARD}`} style={{ elevation: 1 }}>
        <Row
          icon={TrashIcon}
          title="Delete Account"
          subtitle="Permanently remove your account"
          onPress={() => router.push('/profile/privacy')}
          danger
        />
        <Row
          icon={LogOutIcon}
          title="Log Out"
          subtitle="Sign out from your account"
          onPress={confirmLogout}
          danger
          last
        />
      </View>
    </ScrollView>
  );
}