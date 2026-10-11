import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShapedPhoto } from './ShapedPhoto';
import type { SlideData } from './slides';

const LEAF = require('../../assets/onboarding/logo-leaf-gold.png');

interface Props {
  slide: SlideData;
  index: number;
  total: number;
  scrollX: SharedValue<number>;
  onNext: () => void;
  onFinish: () => void;
}

export function OnboardingSlide({ slide, index, total, scrollX, onNext, onFinish }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  const dark = slide.tone === 'dark';
  const isFinal = slide.kind === 'final';
  const controlsBottom = Math.max(insets.bottom, 20) + 8;

  // Text drifts + fades with the swipe (opacity only if reduced motion is on)
  const textStyle = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(scrollX.value, input, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateX: reduceMotion
            ? 0
            : interpolate(scrollX.value, input, [width * 0.25, 0, -width * 0.25], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <View style={{ width, height }} className={`overflow-hidden ${dark ? 'bg-[#241810]' : 'bg-cream'}`}>
      {/* ---------- ART ---------- */}
      {slide.kind === 'fullbleed' && (
        <>
          <Image source={slide.image} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />
        </>
      )}

      {slide.kind === 'shaped' && slide.shape && (
        <ShapedPhoto
          source={slide.image}
          shape={slide.shape}
          top={slide.top ?? 0}
          height={slide.regionHeight ?? 1}
          focus={slide.focus}
          clipId={`clip-${slide.id}`}
        />
      )}

      {slide.kind === 'fade' && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: height * (slide.regionHeight ?? 0.66),
          }}
        >
          <Image source={slide.image} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <LinearGradient
            colors={['#241810', 'rgba(36,24,16,0)']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%' }}
          />
        </View>
      )}

      {isFinal && (
        <>
          <Image source={slide.image} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(246,238,227,0.7)', 'rgba(246,238,227,0)']}
            locations={[0, 0.4]}
            style={StyleSheet.absoluteFill}
          />
        </>
      )}

      {/* ---------- LOGO + TEXT ---------- */}
      <Animated.View
        pointerEvents="none"
        style={[{ paddingTop: insets.top + 28 }, textStyle]}
        className="absolute left-0 right-0 top-0 px-9"
      >
        <Image
          source={LEAF}
          style={{ width: 24, height: 24, tintColor: dark ? '#FFFFFF' : undefined }}
          resizeMode="contain"
        />
        <Text
          className={`mt-10 font-display ${isFinal ? 'text-center' : ''} ${
            dark ? 'text-white' : 'text-text-primary'
          }`}
          style={{ fontSize: index === 0 ? 44 : 32, lineHeight: index === 0 ? 48 : 38 }}
        >
          {slide.title}
        </Text>
        {slide.subtitle ? (
          <Text
            className={`mt-4 font-body text-[15px] leading-6 ${
              dark ? 'text-white/85' : 'text-text-primary/70'
            }`}
          >
            {slide.subtitle}
          </Text>
        ) : null}
      </Animated.View>

      {/* ---------- FINAL SLIDE: wordmark + buttons ---------- */}
      {isFinal && (
        <View style={{ bottom: controlsBottom + 67 }} className="absolute left-9 right-9 items-center">
          <Text className="font-display-medium text-[40px] leading-[44px] text-text-primary">Sola</Text>
          <Text className="mt-2.5 font-body text-[14px] text-text-primary/70">
            Reflect. Understand. Breathe.
          </Text>
          <Pressable
            onPress={onFinish}
            accessibilityRole="button"
            className="mt-14 h-[54px] w-full items-center justify-center rounded-full bg-ink"
          >
            <Text className="font-body-medium text-[15px] text-white">Create account</Text>
          </Pressable>
          <Pressable
            onPress={onFinish}
            accessibilityRole="button"
            className="mt-4 h-[54px] w-full items-center justify-center rounded-full border border-ink/60"
          >
            <Text className="font-body-medium text-[15px] text-ink">Sign in</Text>
          </Pressable>
        </View>
      )}

      {/* ---------- PAGE COUNTER + ARROW ---------- */}
      <View
        pointerEvents="box-none"
        style={{ bottom: controlsBottom }}
        className="absolute left-9 right-6 flex-row items-end justify-between"
      >
        <Text
          className={`font-body text-[12px] tracking-[1px] ${dark ? 'text-white/80' : 'text-ink/55'}`}
        >
          {index + 1} / {total}
        </Text>

        {!isFinal && (
          <Pressable
            onPress={onNext}
            accessibilityRole="button"
            accessibilityLabel="Next"
            className={`h-12 w-12 items-center justify-center rounded-full ${
              dark ? 'border-[1.5px] border-white/90 bg-black/15' : 'bg-ink'
            }`}
          >
            <ArrowRight size={20} strokeWidth={1.5} color="#FFFFFF" />
          </Pressable>
        )}
      </View>
    </View>
  );
}