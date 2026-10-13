import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  type TextProps,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { useHomeSummary } from '@/src/home/useHomeSummary';
import { displayName, useMe } from '@/src/user/useMe';
import { MOOD_SCALE } from '@/src/mood/moodScale';
import { useToastStore } from '@/src/ui-feedback/toastStore';
import {
  ArrowRightIcon,
  ChevronRightIcon,
  MessageIcon,
  SmileIcon,
  SproutIcon,
} from '@/src/components/ui/icons';

const FOREST = '#2F4A3E';
const LEAF = require('../../assets/onboarding/logo-leaf-gold.png');

// Hero photo. To use your own: put it at app\mobile\assets\home\hero.png,
// change the require below, and set HERO_ASPECT to its width / height.
const HERO = require('../../assets/onboarding/slide8-bg.png');
const HERO_ASPECT = 940 / 1672;
const HERO_FOCUS = 0.33; // how far down the photo the visible band starts (0 = top, 1 = bottom)

// Text that can never blow up the layout when the phone's font size is cranked up
function T(props: TextProps) {
  return <Text maxFontSizeMultiplier={1.2} {...props} />;
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning,' : h < 18 ? 'Good afternoon,' : 'Good evening,';
}

const isToday = (d: string | Date) => new Date(d).toDateString() === new Date().toDateString();

const enter = (i: number) => FadeInDown.duration(450).delay(70 * i);

const CARD = 'rounded-[18px] border border-black/[0.03] bg-card shadow-[0_2px_10px_rgba(60,45,25,0.06)]';

interface QuickActionProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function QuickAction({ icon: Icon, title, subtitle, onPress }: QuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      className={`min-h-[104px] flex-1 justify-between p-4 active:opacity-80 ${CARD}`}
      style={{ elevation: 1 }}
    >
      <Icon size={26} strokeWidth={1.4} color={FOREST} />
      <View>
        <T numberOfLines={2} className="font-body-medium text-[12.5px] leading-[17px] text-ink">
          {title}
        </T>
        <T numberOfLines={1} className="mt-0.5 font-body text-[10.5px] text-ink/50">
          {subtitle}
        </T>
      </View>
    </Pressable>
  );
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { data, refetch, isRefetching } = useHomeSummary();
  const { data: me } = useMe();

  const padX = 24 + Math.max(insets.left, insets.right);
  const compact = width < 360;
  const name = displayName(me);

  const heroW = width - padX * 2;
  const heroImgH = heroW / HERO_ASPECT;

  // Mood card
  const latest = data?.latestMood;
  const checkedInToday = !!latest && isToday(latest.createdAt);
  const moodLabel = latest ? MOOD_SCALE.find((m) => m.score === latest.score)?.label : undefined;
  const moodSubtitle =
    checkedInToday && moodLabel ? `Checked in today · ${moodLabel}` : 'How are you feeling today?';

  // Journaling
  const draftId: string | undefined = data?.continueJournal?.id;
  const startJournaling = () => router.push(draftId ? `/journal/${draftId}` : '/journal/new');

  // Quick actions
  const exercise = data?.suggestedExercise;
  const past = data?.resurfacedEntry;

  const openExercise = () => router.push(`/exercise/${exercise?.id ?? 'breathing-basic'}`);
  const openPastSelf = () => {
    if (past?.id) router.push(`/journal/${past.id}`);
    else
      useToastStore
        .getState()
        .show('Write a few entries first. Sola can bring them back after a week.');
  };

  return (
    <View className="flex-1 bg-paper">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: 28,
          paddingHorizontal: padX,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
            tintColor={FOREST}
            colors={[FOREST]}
            progressViewOffset={insets.top}
          />
        }
      >
        {/* Header */}
        <Animated.View entering={enter(0)} className="h-9 flex-row items-center justify-between">
          <Image source={LEAF} style={{ width: 28, height: 28, tintColor: FOREST }} resizeMode="contain" />
          <Pressable
            onPress={() => router.navigate('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            hitSlop={10}
            className="h-[34px] w-[34px] items-center justify-center rounded-full bg-forest/10"
          >
            <T className="font-display-medium text-[15px] text-forest">
              {(name || 'S').charAt(0).toUpperCase()}
            </T>
          </Pressable>
        </Animated.View>

        {/* Greeting */}
        <Animated.View entering={enter(1)} className="mt-7">
          <T className="font-body text-[15px] text-ink/55">{greeting()}</T>
          <T
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
            className="font-display text-ink"
            style={{ fontSize: compact ? 32 : 36, lineHeight: 42 }}
          >
            {name}
          </T>
          <T className="mt-1 font-body text-[13px] text-ink/55">Take a moment. You’re doing well.</T>
        </Animated.View>

        {/* Mood check-in */}
        <Animated.View entering={enter(2)} className="mt-6">
          <Pressable
            onPress={() => router.push('/mood/check-in')}
            accessibilityRole="button"
            accessibilityLabel={`Mood check-in. ${moodSubtitle}`}
            className={`flex-row items-center px-3.5 py-3 active:opacity-80 ${CARD}`}
            style={{ elevation: 1 }}
          >
            <View className="h-9 w-9 items-center justify-center rounded-full bg-ink/[0.07]">
              <SmileIcon size={20} strokeWidth={1.5} color="#4A473F" />
            </View>
            <View className="ml-3 flex-1">
              <T numberOfLines={1} className="font-body-medium text-[14px] text-ink">
                Mood Check-in
              </T>
              <T numberOfLines={1} className="mt-0.5 font-body text-[11.5px] text-ink/55">
                {moodSubtitle}
              </T>
            </View>
            <ChevronRightIcon size={16} strokeWidth={1.6} color="#8A857B" />
          </Pressable>
        </Animated.View>

        {/* Hero */}
        <Animated.View entering={enter(3)} className="mt-5">
          <Pressable
            onPress={startJournaling}
            accessibilityRole="button"
            accessibilityLabel={draftId ? 'Continue journaling' : 'Start journaling'}
            className="overflow-hidden rounded-[20px] bg-forest/20 active:opacity-90"
            style={{ aspectRatio: 1.9 }}
          >
            <Image
              source={HERO}
              style={{ position: 'absolute', left: 0, top: -heroImgH * HERO_FOCUS, width: heroW, height: heroImgH }}
            />
            <LinearGradient
              colors={['rgba(20,24,18,0.05)', 'rgba(20,24,18,0.58)']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View className="flex-1 justify-end p-[18px]">
              <T
                numberOfLines={2}
                className="mb-3 font-display text-white"
                style={{ fontSize: compact ? 19 : 22, lineHeight: compact ? 23 : 26 }}
              >
                {'A little progress\neach day adds up.'}
              </T>
              <View className="h-[34px] flex-row items-center self-start rounded-full bg-white px-3.5">
                <T className="font-body-medium text-[12.5px] text-ink">
                  {draftId ? 'Continue Journaling' : 'Start Journaling'}
                </T>
                <View className="ml-1.5">
                  <ArrowRightIcon size={14} strokeWidth={2} color="#2B2C24" />
                </View>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={enter(4)} className="mt-6">
          <T className="font-body-medium text-[14px] text-ink">Quick Actions</T>
          <View className="mt-3 flex-row gap-3">
            <QuickAction
              icon={SproutIcon}
              title="Mindful Exercise"
              subtitle={exercise?.durationMin ? `${exercise.durationMin} min` : '2–5 min'}
              onPress={openExercise}
            />
            <QuickAction
              icon={MessageIcon}
              title="Talk to Your Past Self"
              subtitle="Simple & powerful"
              onPress={openPastSelf}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}