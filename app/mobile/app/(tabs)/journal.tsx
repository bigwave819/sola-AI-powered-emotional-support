import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, ScrollView, TextInput, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { LucideIcon } from 'lucide-react-native';
import { api } from '@/src/api/client';
import { useAuthStore } from '@/src/auth/authStore';
import { MOOD_SCALE } from '@/src/mood/moodScale';
import { useToastStore } from '@/src/ui-feedback/toastStore';
import { T } from '@/src/components/ui/T';
import {
  ChevronRightIcon,
  CloseIcon,
  ComposeIcon,
  FrownIcon,
  MehIcon,
  PlusIcon,
  SearchIcon,
  SmileIcon,
} from '@/src/components/ui/icons';

const FOREST = '#2F4A3E';
const MUTED = '#8A857B';

// Entries written without a linked check-in show that day's latest mood check-in.
// Set to false to show a mood only when it was linked to the entry directly.
const USE_SAME_DAY_MOOD = true;

interface JournalEntry {
  id: string;
  body: string;
  moodEntryId: string | null;
  aiReflectionText: string | null;
  createdAt: string;
}

interface MoodItem {
  id: string;
  score: number;
  createdAt: string;
}

interface Row {
  id: string;
  date: string;
  title: string;
  preview: string;
  moodScore: number | null;
  hasAi: boolean;
  searchText: string;
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'mood', label: 'Mood Check-ins' },
  { key: 'ai', label: 'AI Reflections' },
] as const;
type FilterKey = (typeof FILTERS)[number]['key'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dateLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const md = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  if (d.toDateString() === now.toDateString()) return `Today, ${md}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${md}`;
  return `${md}, ${d.getFullYear()}`;
}

function dayKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Entries have no title field, so the first sentence becomes the title
function toTitleAndPreview(body: string) {
  const text = (body ?? '').replace(/\r/g, '').trim();
  if (!text) return { title: 'Untitled entry', preview: '' };

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  let title = lines[0];
  let rest = lines.slice(1).join(' ');

  if (lines.length === 1) {
    const m = title.match(/^(.{8,70}?[.!?])\s+(.+)$/);
    if (m) {
      title = m[1];
      rest = m[2];
    }
  }

  title = title.replace(/[.!?…]+$/, '').trim();

  if (title.length > 56) {
    const cut = title.slice(0, 56);
    const sp = cut.lastIndexOf(' ');
    const at = sp > 24 ? sp : 56;
    rest = `${title.slice(at).trim()} ${rest}`.trim();
    title = `${title.slice(0, at).trim()}…`;
  }
  return { title, preview: rest };
}

function moodVisual(score: number): { Icon: LucideIcon; color: string } {
  if (score >= 8) return { Icon: SmileIcon, color: '#E08A3C' };
  if (score >= 6) return { Icon: SmileIcon, color: '#4E9A94' };
  if (score === 5) return { Icon: MehIcon, color: '#6B6A64' };
  return { Icon: FrownIcon, color: '#4A473F' };
}

// ---------- pieces ----------

function SkeletonRow({ first, last }: { first: boolean; last: boolean }) {
  const reduce = useReducedMotion();
  const o = useSharedValue(0.55);
  useEffect(() => {
    if (!reduce) o.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [reduce]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));

  return (
    <View
      className={`border-x border-black/[0.03] bg-card px-4 py-4 ${
        first ? 'rounded-t-[20px] border-t' : ''
      } ${last ? 'rounded-b-[20px] border-b' : ''}`}
    >
      <Animated.View style={style}>
        <View className="h-2.5 w-20 rounded-full bg-ink/[0.07]" />
        <View className="mt-2.5 h-3.5 w-3/4 rounded-full bg-ink/[0.09]" />
        <View className="mt-2 h-2.5 w-1/2 rounded-full bg-ink/[0.07]" />
      </Animated.View>
    </View>
  );
}

interface EntryRowProps {
  row: Row;
  index: number;
  count: number;
  onOpen: () => void;
  onLongPress: () => void;
}

function EntryRow({ row, index, count, onOpen, onLongPress }: EntryRowProps) {
  const first = index === 0;
  const last = index === count - 1;
  const visual = row.moodScore != null ? moodVisual(row.moodScore) : null;
  const moodLabel =
    row.moodScore != null ? MOOD_SCALE.find((m) => m.score === row.moodScore)?.label : undefined;

  return (
    <Animated.View
      entering={index < 8 ? FadeInDown.duration(380).delay(index * 45) : undefined}
      className={`border-x border-black/[0.03] bg-card ${first ? 'rounded-t-[20px] border-t' : ''} ${
        last ? 'rounded-b-[20px] border-b' : ''
      }`}
    >
      <Pressable
        onPress={onOpen}
        onLongPress={onLongPress}
        delayLongPress={450}
        accessibilityRole="button"
        accessibilityLabel={`${row.date}. ${row.title}.${moodLabel ? ` Mood: ${moodLabel}.` : ''}`}
        accessibilityHint="Opens this entry. Press and hold to delete."
        className="active:opacity-60"
      >
        <View className="min-h-[76px] flex-row items-center py-3.5 pl-4 pr-3">
          <View className="flex-1 pr-3">
            <T numberOfLines={1} className="font-body text-[10.5px] text-ink/50">
              {row.date}
            </T>
            <T numberOfLines={1} className="mt-1 font-body-medium text-[14px] text-ink">
              {row.title}
            </T>
            {row.preview ? (
              <T numberOfLines={1} className="mt-0.5 font-body text-[11.5px] text-ink/50">
                {row.preview}
              </T>
            ) : null}
          </View>

          {visual && (
            <View className="mr-1 w-[72px] items-center">
              <visual.Icon size={23} strokeWidth={1.5} color={visual.color} />
              <T numberOfLines={2} className="mt-1 text-center font-body text-[10px] leading-[13px] text-ink/55">
                {moodLabel}
              </T>
            </View>
          )}

          <ChevronRightIcon size={16} strokeWidth={1.6} color={MUTED} />
        </View>
        {!last && <View className="mx-4 h-px bg-ink/10" />}
      </Pressable>
    </Animated.View>
  );
}

function StateCard({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center rounded-[20px] border border-black/[0.03] bg-card px-6 py-10">
      <T className="text-center font-display text-[20px] text-ink">{title}</T>
      <T className="mt-2 text-center font-body text-[13px] leading-[19px] text-ink/55">{body}</T>
      {action && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          className="mt-5 h-11 items-center justify-center rounded-full bg-forest px-6 active:opacity-80"
        >
          <T className="font-body-medium text-[13.5px] text-white">{action}</T>
        </Pressable>
      ) : null}
    </View>
  );
}

// ---------- screen ----------

export default function JournalList() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const ready = useAuthStore((s) => s.status === 'ready');

  const [filter, setFilter] = useState<FilterKey>('all');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [pulling, setPulling] = useState(false);

  const padX = 24 + Math.max(insets.left, insets.right);

  const entriesQ = useQuery<JournalEntry[]>({
    queryKey: ['journal-list'],
    queryFn: () => api.get('/journal'),
    enabled: ready,
  });
  const moodsQ = useQuery<MoodItem[]>({
    queryKey: ['mood-history'],
    queryFn: () => api.get('/mood/history'),
    enabled: ready,
  });

  // Refresh whenever this tab comes back into focus (after writing an entry or a check-in)
  const firstFocus = useRef(true);
  const refetchEntries = entriesQ.refetch;
  const refetchMoods = moodsQ.refetch;
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      refetchEntries();
      refetchMoods();
    }, [refetchEntries, refetchMoods]),
  );

  const rows = useMemo<Row[]>(() => {
    const moods = moodsQ.data ?? [];
    const byId = new Map(moods.map((m) => [m.id, m.score]));
    const byDay = new Map<string, number>();
    for (const m of moods) {
      const k = dayKey(m.createdAt);
      if (!byDay.has(k)) byDay.set(k, m.score); // history is newest-first, so the first one is the latest
    }

    return (entriesQ.data ?? []).map((e) => {
      const { title, preview } = toTitleAndPreview(e.body);
      const linked = e.moodEntryId ? byId.get(e.moodEntryId) : undefined;
      const sameDay = USE_SAME_DAY_MOOD ? byDay.get(dayKey(e.createdAt)) : undefined;
      return {
        id: e.id,
        date: dateLabel(e.createdAt),
        title,
        preview,
        moodScore: linked ?? sameDay ?? null,
        hasAi: !!e.aiReflectionText,
        searchText: (e.body ?? '').toLowerCase(),
      };
    });
  }, [entriesQ.data, moodsQ.data]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const passFilter =
          filter === 'all' || (filter === 'mood' && r.moodScore != null) || (filter === 'ai' && r.hasAi);
        return passFilter && (!q || r.searchText.includes(q));
      }),
    [rows, filter, q],
  );

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/journal/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-list'] });
      queryClient.invalidateQueries({ queryKey: ['home-summary'] });
      queryClient.invalidateQueries({ queryKey: ['insights-weekly'] });
    },
    onError: () => useToastStore.getState().show('Could not delete that entry. Please try again.'),
  });

  function confirmDelete(row: Row) {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert('Delete this entry?', 'It will be permanently deleted and can’t be recovered.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => del.mutate(row.id) },
    ]);
  }

  async function onRefresh() {
    setPulling(true);
    await Promise.allSettled([refetchEntries(), refetchMoods()]);
    setPulling(false);
  }

  function newEntry() {
    Haptics.selectionAsync().catch(() => {});
    router.push('/journal/new');
  }

  function closeSearch() {
    setSearching(false);
    setQuery('');
  }

  const loading = entriesQ.isPending;
  const failed = entriesQ.isError && !entriesQ.data;

  return (
    <View className="flex-1 bg-paper" style={{ paddingTop: insets.top + 6 }}>
      {/* Header / search */}
      <View style={{ paddingHorizontal: padX }}>
        {searching ? (
          <View className="h-11 flex-row items-center rounded-full bg-ink/[0.06] pl-4 pr-2">
            <SearchIcon size={18} strokeWidth={1.6} color={MUTED} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCorrect={false}
              returnKeyType="search"
              maxLength={80}
              placeholder="Search your entries"
              placeholderTextColor={MUTED}
              accessibilityLabel="Search your entries"
              className="ml-2.5 flex-1 py-0 font-body text-[14px] text-ink"
            />
            <Pressable
              onPress={closeSearch}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Close search"
              className="h-8 w-8 items-center justify-center"
            >
              <CloseIcon size={18} strokeWidth={1.8} color={FOREST} />
            </Pressable>
          </View>
        ) : (
          <View className="h-11 flex-row items-center justify-between">
            <T className="font-display text-[26px] text-ink">Journal</T>
            <View className="flex-row items-center">
              <Pressable
                onPress={() => setSearching(true)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Search entries"
              >
                <SearchIcon size={22} strokeWidth={1.5} color={FOREST} />
              </Pressable>
              <Pressable
                onPress={newEntry}
                accessibilityRole="button"
                accessibilityLabel="New entry"
                hitSlop={6}
                className="ml-[18px] h-[34px] w-[34px] items-center justify-center rounded-full bg-forest active:opacity-80"
              >
                <PlusIcon size={18} strokeWidth={2.2} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ flexGrow: 0, marginTop: 14 }}
        contentContainerStyle={{ paddingHorizontal: padX, gap: 8 }}
      >
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setFilter(f.key);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              hitSlop={{ top: 6, bottom: 6 }}
              className={`h-8 items-center justify-center rounded-full px-3.5 ${
                active ? 'bg-forest' : 'bg-ink/[0.07]'
              }`}
            >
              <T
                numberOfLines={1}
                className={`font-body-medium text-[11.5px] ${active ? 'text-white' : 'text-ink/65'}`}
              >
                {f.label}
              </T>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* List */}
      <FlatList
        style={{ flex: 1 }}
        data={loading || failed ? [] : filtered}
        keyExtractor={(r) => r.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        windowSize={7}
        contentContainerStyle={{ paddingHorizontal: padX, paddingTop: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={pulling} onRefresh={onRefresh} tintColor={FOREST} colors={[FOREST]} />
        }
        renderItem={({ item, index }) => (
          <EntryRow
            row={item}
            index={index}
            count={filtered.length}
            onOpen={() => router.push(`/journal/${item.id}`)}
            onLongPress={() => confirmDelete(item)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <View>
              {[0, 1, 2, 3].map((i) => (
                <SkeletonRow key={i} first={i === 0} last={i === 3} />
              ))}
            </View>
          ) : failed ? (
            <StateCard
              title="Couldn’t load your journal"
              body="Check your connection and try again."
              action="Try again"
              onAction={() => refetchEntries()}
            />
          ) : rows.length === 0 ? (
            <StateCard
              title="Your journal is waiting"
              body="Write a few lines whenever you’re ready. No pressure, no perfect words."
              action="Start writing"
              onAction={newEntry}
            />
          ) : (
            <StateCard title="Nothing matches" body="Try another filter or a different search." />
          )
        }
      />

      {/* Compose */}
      {!searching && (
        <Pressable
          onPress={newEntry}
          accessibilityRole="button"
          accessibilityLabel="Write a new entry"
          className="absolute h-[52px] w-[52px] items-center justify-center rounded-full bg-forest shadow-[0_4px_8px_0_rgba(0,0,0,0.15)] active:opacity-85"
          style={{ right: padX, bottom: 20, elevation: 6 }}
        >
          <ComposeIcon size={22} strokeWidth={1.7} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
}