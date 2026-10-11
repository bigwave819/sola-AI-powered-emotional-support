import { useCallback, useRef, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SLIDES } from '@/src/onboarding/slides';
import { OnboardingSlide } from '@/src/onboarding/OnboardingSlide';

export default function Welcome() {
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const listRef = useRef<any>(null);
  const [index, setIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const onViewable = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const goNext = useCallback((i: number) => {
    listRef.current?.scrollToIndex({ index: Math.min(i + 1, SLIDES.length - 1), animated: true });
  }, []);

  return (
    <View className="flex-1 bg-cream">
      <StatusBar style={SLIDES[index].tone === 'dark' ? 'light' : 'dark'} />
      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s: (typeof SLIDES)[number]) => s.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_: unknown, i: number) => ({ length: width, offset: width * i, index: i })}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={viewConfig}
        initialNumToRender={2}
        windowSize={3}
        renderItem={({ item, index: i }: { item: (typeof SLIDES)[number]; index: number }) => (
          <OnboardingSlide
            slide={item}
            index={i}
            total={SLIDES.length}
            scrollX={scrollX}
            onNext={() => goNext(i)}
            onFinish={() => router.push('/auth')}
          />
        )}
      />
    </View>
  );
}