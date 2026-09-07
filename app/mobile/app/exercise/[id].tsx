import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { api } from '@/src/api/client';

function BreathingOrb() {
  const scale = useSharedValue(1);

  useEffect(() => {
    // 4s inhale, 4s exhale — gentle, not urgent
    scale.value = withRepeat(
      withTiming(1.4, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="items-center justify-center h-64">
      <Animated.View className="w-32 h-32 rounded-full bg-accent-muted" style={style} />
    </View>
  );
}

export default function ExercisePlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [finished, setFinished] = useState(false);

  const { data: exercise } = useQuery({
    queryKey: ['exercise', id],
    queryFn: () => api.get(`/exercises/${id}`),
  });

  const complete = useMutation({
    mutationFn: () => api.post(`/exercises/${id}/complete`, { durationSeconds: secondsElapsed }),
  });

  useEffect(() => {
    if (!exercise || finished) return;

    const targetSeconds = exercise.durationMin * 60;
    const interval = setInterval(() => {
      setSecondsElapsed((s) => {
        const next = s + 1;
        if (next >= targetSeconds) {
          clearInterval(interval);
          setFinished(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [exercise]);

  useEffect(() => {
    if (finished) complete.mutate();
  }, [finished]);

  if (!exercise) return null;

  return (
    <View className="flex-1 bg-background p-6 justify-center items-center gap-6">
      <Text variant="headline">{exercise.title}</Text>
      <Text variant="body" className="text-center text-text-secondary">
        {exercise.description}
      </Text>

      {exercise.category === 'breathing' && <BreathingOrb />}

      {finished ? (
        <>
          <Text variant="bodyMedium">Nicely done.</Text>
          <Button label="Close" onPress={() => router.back()} />
        </>
      ) : (
        <Button label="End early" variant="secondary" onPress={() => setFinished(true)} />
      )}
    </View>
  );
}