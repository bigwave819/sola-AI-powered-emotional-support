import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View, type LayoutChangeEvent } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/src/api/client';
import { useAuthStore } from '@/src/auth/authStore';
import { useToastStore } from '@/src/ui-feedback/toastStore';
import { T } from '@/src/components/ui/T';
import { CalendarIcon, InsightIcon } from '@/src/components/ui/icons';

const FOREST = '#2F4A3E';
const LINE = '#3F4A44';

type Period = 'week' | 'month';
type Cat = 'happy' | 'calm' | 'neutral' | 'sad';

const CATS: { key: Cat; label: string; color: string }[] = [
  { key: 'happy', label: 'Happy', color: '#5E8C73' },
  { key: 'calm', label: 'Calm', color: '#8DB3A3' },
  { key: 'neutral', label: 'Neutral', color: '#C8C3B7' },
  { key: 'sad', label: 'Sad', color: '#2E5A6E' },
];

// Same grouping the Journal screen uses: 8+ happy, 6-7 calm, 5 neutral, 4 or lower sad
function category(score: number): Cat {
  const r = Math.round(score);
  if (r >= 8) return 'happy';
  if (r >= 6) return 'calm';
  if (r === 5) return 'neutral';
  return 'sad';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CARD = 'rounded-[18px] border border-black/[0.03] bg-card shadow-[0_2px_10px_rgba(60,45,25,0.06)]';

interface MoodItem {
  id: string;
  score: number;
  tags: string[] | null;
  createdAt: string;
}

// ---------- data ----------

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// A rolling window of `count` days ending today (offset shifts it back in time)
function buildPeriod(items: MoodItem[], count: number, offset: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  for (let i = count - 1; i >= 0; i--) {
    days.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i - offset));
  }
  const index = new Map(days.map((d, i) => [dayKey(d), i]));

  const sum = new Array<number>(count).fill(0);
  const num = new Array<number>(count).fill(0);
  const tagCounts: Record<string, number> = {};
  let checkIns = 0;

  for (const m of items) {
    const i = index.get(dayKey(new Date(m.createdAt)));
    if (i === undefined) continue;
    sum[i] += m.score;
    num[i] += 1;
    checkIns += 1;
    for (const t of m.tags ?? []) tagCounts[t] = (tagCounts[t] ?? 0) + 1;
  }

  const values: (number | null)[] = sum.map((s, i) => (num[i] ? s / num[i] : null));
  return { days, values, checkIns, tagCounts };
}

function statsOf(values: (number | null)[]) {
  const present = values.filter((v): v is number => v != null);
  const counts: Record<Cat, number> = { happy: 0, calm: 0, neutral: 0, sad: 0 };
  present.forEach((v) => {
    counts[category(v)] += 1;
  });
  const avg = present.length ? present.reduce((a, b) => a + b, 0) / present.length : null;
  return { avg, counts, daysWithData: present.length };
}
type Stats = ReturnType<typeof statsOf>;

function badgeText(s: Stats): string | null {
  if (s.daysWithData === 0) return null;
  if (s.daysWithData < 2) return 'Just started';
  const ranked = CATS.map((c) => ({ ...c, n: s.counts[c.key] })).sort((a, b) => b.n - a.n);
  if (ranked[0].n === ranked[1].n) return 'Mixed moods';
  return ranked[0].key === 'sad' ? 'Mostly Low' : `Mostly ${ranked[0].label}`;
}

// Gentle, non-clinical wording. Only reports comparisons the data supports.
function insightText(period: Period, cur: Stats, prev: Stats, topTag: string | null): string {
  const span = period === 'week' ? 'this week' : 'this month';
  if (cur.daysWithData === 0) return 'Your insights will appear here after your first check-in.';
  if (cur.daysWithData < 3) return 'Check in a few more days and Sola will start showing your patterns.';

  let line: string;
  if (prev.avg != null && prev.daysWithData >= 2) {
    const diff = (cur.avg as number) - prev.avg;
    if (diff >= 0.5) line = `You’ve been more positive ${span}. Keep showing up for yourself.`;
    else if (diff <= -0.5) line = `${cap(span)} felt a little heavier. Go gently. Small moments of care still count.`;
    else line = `Your mood has been steady ${span}. Consistency is its own kind of progress.`;
  } else {
    line =
      (cur.avg as number) >= 6
        ? `You’ve had some brighter moments ${span}. Notice what helped.`
        : `Checking in ${span} is a kind way to understand yourself. Keep going.`;
  }
  return topTag ? `${line} “${topTag}” came up most often.` : line;
}

// ---------- chart geometry ----------

interface Pt {
  x: number;
  y: number;
  i: number;
}
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

function smoothPath(p: Pt[], lo: number, hi: number) {
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const t = 0.18;
    d += ` C ${p1.x + (p2.x - p0.x) * t} ${clamp(p1.y + (p2.y - p0.y) * t, lo, hi)}, ${
      p2.x - (p3.x - p1.x) * t
    } ${clamp(p2.y - (p3.y - p1.y) * t, lo, hi)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

// ---------- pieces ----------

const AnimatedRect = Animated.createAnimatedComponent(Rect);

function MoodChart({
  values,
  days,
  period,
  summary,
}: {
  values: (number | null)[];
  days: Date[];
  period: Period;
  summary: string;
}) {
  const reduce = useReducedMotion();
  const [w, setW] = useState(0);
  const reveal = useSharedValue(0);

  const H = 124;
  const PT = 10;
  const PB = 10;
  const plotH = H - PT - PB;
  const n = values.length;
  const key = values.map((v) => (v == null ? '-' : v.toFixed(1))).join(',');

  // Line draws in from left to right whenever the data or period changes
  useEffect(() => {
    if (!w) return;
    if (reduce) {
      reveal.value = 1;
      return;
    }
    reveal.value = 0;
    reveal.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [key, w, reduce]);

  const revealProps = useAnimatedProps(() => ({ width: w * reveal.value }));

  const slot = w / n;
  const xAt = (i: number) => (i + 0.5) * slot;
  const yAt = (s: number) => PT + ((10 - s) / 9) * plotH;

  const pts: Pt[] = values.flatMap((v, i) => (v == null ? [] : [{ x: xAt(i), y: yAt(v), i }]));

  // A gap of more than 3 days breaks the line, so it never implies a trend across missing data
  const segments: Pt[][] = [];
  for (const p of pts) {
    const last = segments[segments.length - 1];
    if (last && p.i - last[last.length - 1].i <= 3) last.push(p);
    else segments.push([p]);
  }

  const week = period === 'week';

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setW(Math.floor(e.nativeEvent.layout.width))}
      accessible
      accessibilityRole="image"
      accessibilityLabel={summary}
    >
      {w > 0 && (
        <>
          <Svg width={w} height={H}>
            <Defs>
              <ClipPath id="reveal">
                <AnimatedRect x={0} y={0} height={H} animatedProps={revealProps} />
              </ClipPath>
              <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={FOREST} stopOpacity={0.14} />
                <Stop offset="1" stopColor={FOREST} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {[0.2, 0.5, 0.8].map((f) => (
              <Line
                key={f}
                x1={0}
                x2={w}
                y1={PT + f * plotH}
                y2={PT + f * plotH}
                stroke="#2B2C24"
                strokeOpacity={0.06}
                strokeWidth={1}
              />
            ))}

            <G clipPath="url(#reveal)">
              {segments.map((seg, si) =>
                seg.length > 1 ? (
                  <G key={si}>
                    <Path
                      d={`${smoothPath(seg, PT, PT + plotH)} L ${seg[seg.length - 1].x} ${H} L ${seg[0].x} ${H} Z`}
                      fill="url(#area)"
                    />
                    <Path
                      d={smoothPath(seg, PT, PT + plotH)}
                      stroke={LINE}
                      strokeWidth={week ? 1.7 : 1.5}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </G>
                ) : null,
              )}
              {pts.map((p) => (
                <Circle key={p.i} cx={p.x} cy={p.y} r={week ? 3.2 : 2.2} fill={LINE} />
              ))}
            </G>
          </Svg>

          {week ? (
            <View className="mt-1.5 flex-row">
              {days.map((d, i) => (
                <View key={i} style={{ width: slot }} className="items-center">
                  <T numberOfLines={1} className="font-body text-[10px] text-ink/45">
                    {WEEKDAYS[d.getDay()]}
                  </T>
                </View>
              ))}
            </View>
          ) : (
            <View className="mt-1.5 h-4">
              {[0, 7, 14, 21, n - 1].map((i) => {
                const LW = 48;
                const left = clamp(xAt(i) - LW / 2, 0, Math.max(w - LW, 0));
                return (
                  <View key={i} style={{ position: 'absolute', left, width: LW }} className="items-center">
                    <T numberOfLines={1} className="font-body text-[10px] text-ink/45">
                      {`${MONTHS[days[i].getMonth()]} ${days[i].getDate()}`}
                    </T>
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}
    </View>
  );
}

function Donut({ counts, entries }: { counts: Record<Cat, number>; entries: number }) {
  const size = 104;
  const stroke = 13;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const mid = size / 2;
  const total = CATS.reduce((a, k) => a + counts[k.key], 0);

  let acc = 0;
  const segs = CATS.filter((k) => counts[k.key] > 0).map((k) => {
    const len = (counts[k.key] / total) * c;
    const gap = total > counts[k.key] ? 2.5 : 0; // a single category fills the whole ring
    const seg = { key: k.key, color: k.color, dash: Math.max(len - gap, 0.5), offset: acc };
    acc += len;
    return seg;
  });

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Mood breakdown from ${entries} ${entries === 1 ? 'entry' : 'entries'}`}
    >
      <Svg width={size} height={size}>
        <G rotation={-90} originX={mid} originY={mid}>
          <Circle cx={mid} cy={mid} r={r} stroke="#E8E2D6" strokeWidth={stroke} fill="none" />
          {segs.map((s) => (
            <Circle
              key={s.key}
              cx={mid}
              cy={mid}
              r={r}
              stroke={s.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${s.dash} ${c - s.dash}`}
              strokeDashoffset={-s.offset}
            />
          ))}
        </G>
      </Svg>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
        className="items-center justify-center px-5"
      >
        <T
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          className="font-display text-[26px] leading-[30px] text-ink"
        >
          {entries}
        </T>
        <T className="font-body text-[10px] text-ink/50">{entries === 1 ? 'entry' : 'entries'}</T>
      </View>
    </View>
  );
}

function Segmented({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const reduce = useReducedMotion();
  const [w, setW] = useState(0);
  const x = useSharedValue(0);
  const segW = w > 0 ? (w - 6) / 2 : 0;

  useEffect(() => {
    const target = value === 'week' ? 0 : segW;
    x.value = reduce ? target : withTiming(target, { duration: 220, easing: Easing.out(Easing.cubic) });
  }, [value, segW, reduce]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
      className="h-[38px] flex-row rounded-full bg-ink/[0.06] p-[3px]"
    >
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: 3, left: 3, bottom: 3, width: segW }, indicator]}
        className="rounded-full bg-forest"
      />
      {(['week', 'month'] as Period[]).map((p) => (
        <Pressable
          key={p}
          onPress={() => {
            if (p !== value) Haptics.selectionAsync().catch(() => {});
            onChange(p);
          }}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === p }}
          className="flex-1 items-center justify-center"
        >
          <T className={`font-body-medium text-[13px] ${value === p ? 'text-white' : 'text-ink/55'}`}>
            {p === 'week' ? 'Week' : 'Month'}
          </T>
        </Pressable>
      ))}
    </View>
  );
}

function Pulse({ className }: { className: string }) {
  const reduce = useReducedMotion();
  const o = useSharedValue(0.55);
  useEffect(() => {
    if (!reduce) o.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [reduce]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={style} className={className} />;
}

// ---------- screen ----------

export default function Insights() {
  const insets = useSafeAreaInsets();
  const ready = useAuthStore((s) => s.status === 'ready');
  const [period, setPeriod] = useState<Period>('week');
  const [pulling, setPulling] = useState(false);

  const padX = 24 + Math.max(insets.left, insets.right);

  const q = useQuery<MoodItem[]>({
    queryKey: ['mood-history-long'],
    queryFn: () => api.get('/mood/history?limit=400'),
    enabled: ready,
  });

  // Refresh when this tab comes back into focus (e.g. after a new check-in)
  const firstFocus = useRef(true);
  const refetch = q.refetch;
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      refetch();
    }, [refetch]),
  );

  const count = period === 'week' ? 7 : 30;

  const view = useMemo(() => {
    const items = q.data ?? [];
    const cur = buildPeriod(items, count, 0);
    const prev = buildPeriod(items, count, count);
    const curS = statsOf(cur.values);
    const prevS = statsOf(prev.values);
    const topTag =
      Object.entries(cur.tagCounts)
        .filter(([, num]) => num >= 2)
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      cur,
      curS,
      badge: badgeText(curS),
      insight: insightText(period, curS, prevS, topTag),
      summary: curS.avg == null
        ? 'No mood check-ins in this period.'
        : `Mood chart. ${curS.daysWithData} days with check-ins, average ${curS.avg.toFixed(1)} out of 10.`,
    };
  }, [q.data, count, period]);

  async function onRefresh() {
    setPulling(true);
    await refetch();
    setPulling(false);
  }

  const loading = q.isPending;
  const failed = q.isError && !q.data;
  const subtitle = period === 'week' ? 'Your mood this week' : 'Your mood this month';

  return (
    <View className="flex-1 bg-paper" style={{ paddingTop: insets.top + 6 }}>
      {/* Header */}
      <View style={{ paddingHorizontal: padX }} className="h-11 flex-row items-center justify-between">
        <T className="font-display text-[26px] text-ink">Insights</T>
        <Pressable
          onPress={() => useToastStore.getState().show('Custom date ranges are coming soon.')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Choose dates"
        >
          <CalendarIcon size={22} strokeWidth={1.5} color={FOREST} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: padX, paddingTop: 14, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={pulling} onRefresh={onRefresh} tintColor={FOREST} colors={[FOREST]} />
        }
      >
        <Segmented value={period} onChange={setPeriod} />

        {loading ? (
          <View className="mt-4 gap-4">
            <Pulse className="h-[218px] rounded-[18px] bg-ink/[0.06]" />
            <Pulse className="h-[156px] rounded-[18px] bg-ink/[0.06]" />
            <Pulse className="h-[84px] rounded-[18px] bg-ink/[0.06]" />
          </View>
        ) : failed ? (
          <View className={`mt-4 items-center px-6 py-10 ${CARD}`}>
            <T className="text-center font-display text-[20px] text-ink">Couldn’t load your insights</T>
            <T className="mt-2 text-center font-body text-[13px] leading-[19px] text-ink/55">
              Check your connection and try again.
            </T>
            <Pressable
              onPress={() => refetch()}
              accessibilityRole="button"
              className="mt-5 h-11 items-center justify-center rounded-full bg-forest px-6 active:opacity-80"
            >
              <T className="font-body-medium text-[13.5px] text-white">Try again</T>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Mood overview */}
            <Animated.View entering={FadeInDown.duration(420)} className={`mt-4 p-4 ${CARD}`}>
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <T numberOfLines={1} className="font-body-medium text-[14px] text-ink">
                    Mood Overview
                  </T>
                  <T numberOfLines={1} className="mt-0.5 font-body text-[11px] text-ink/50">
                    {subtitle}
                  </T>
                </View>
                {view.badge ? (
                  <View className="max-w-[48%] rounded-full border border-black/[0.06] bg-white px-3 py-1.5">
                    <T numberOfLines={1} className="font-body-medium text-[11px] text-ink">
                      {view.badge}
                    </T>
                  </View>
                ) : null}
              </View>

              <View className="mt-4">
                {view.cur.checkIns === 0 ? (
                  <View className="items-center py-8">
                    <T className="text-center font-body text-[13px] leading-[19px] text-ink/55">
                      Your mood chart will grow here as you check in.
                    </T>
                    <Pressable
                      onPress={() => router.push('/mood/check-in')}
                      accessibilityRole="button"
                      className="mt-4 h-10 items-center justify-center rounded-full bg-forest px-5 active:opacity-80"
                    >
                      <T className="font-body-medium text-[13px] text-white">Check in now</T>
                    </Pressable>
                  </View>
                ) : (
                  <Animated.View key={period} entering={FadeIn.duration(250)}>
                    <MoodChart
                      values={view.cur.values}
                      days={view.cur.days}
                      period={period}
                      summary={view.summary}
                    />
                  </Animated.View>
                )}
              </View>
            </Animated.View>

            {/* Mood breakdown */}
            <Animated.View entering={FadeInDown.duration(420).delay(70)} className={`mt-4 p-4 ${CARD}`}>
              <T numberOfLines={1} className="font-body-medium text-[14px] text-ink">
                Mood Breakdown
              </T>
              <View className="mt-4 flex-row items-center">
                <Animated.View key={period} entering={FadeIn.duration(350)}>
                  <Donut counts={view.curS.counts} entries={view.cur.checkIns} />
                </Animated.View>
                <View className="ml-6 flex-1">
                  {CATS.map((c, i) => {
                    const num = view.curS.counts[c.key];
                    return (
                      <View key={c.key} className={`flex-row items-center justify-between ${i > 0 ? 'mt-3' : ''}`}>
                        <View className="flex-1 flex-row items-center pr-2">
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.color }} />
                          <T numberOfLines={1} className="ml-2.5 font-body text-[12.5px] text-ink">
                            {c.label}
                          </T>
                        </View>
                        <T numberOfLines={1} className="font-body text-[11.5px] text-ink/50">
                          {num} {num === 1 ? 'day' : 'days'}
                        </T>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Animated.View>

            {/* Top insight */}
            <Animated.View
              entering={FadeInDown.duration(420).delay(140)}
              className={`mt-4 flex-row items-start p-4 ${CARD}`}
            >
              <View className="mt-0.5">
                <InsightIcon size={24} strokeWidth={1.4} color={FOREST} />
              </View>
              <View className="ml-3.5 flex-1">
                <T className="font-body-medium text-[13.5px] text-ink">Top Insight</T>
                <T className="mt-1 font-body text-[12px] leading-[18px] text-ink/60">{view.insight}</T>
              </View>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}