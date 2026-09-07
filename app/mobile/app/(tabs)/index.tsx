import { View, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Card } from '@/src/components/ui/Card';
import { GlassSurface } from '@/src/components/ui/GlassSurface';
import { useHomeSummary } from '@/src/home/useHomeSummary';

function greeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const { data, isLoading } = useHomeSummary();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text variant="body">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-6 gap-4">
      <Text variant="headline">
        {greeting(new Date().getHours())}
        {data?.greetingName ? `, ${data.greetingName}` : ''}.
      </Text>

      {data?.continueJournal ? (
        <Pressable onPress={() => router.push(`/journal/${data.continueJournal.id}`)}>
          <Card>
            <Text variant="caption">Continue where you left off</Text>
            <Text variant="body" className="mt-1">
              {data.continueJournal.bodyPreview}...
            </Text>
          </Card>
        </Pressable>
      ) : (
        <Pressable onPress={() => router.push('/journal/new')}>
          <Card>
            <Text variant="bodyMedium">Write today</Text>
            <Text variant="caption" className="mt-1">
              A few minutes is enough.
            </Text>
          </Card>
        </Pressable>
      )}

      {data?.latestMood && (
        <Card>
          <Text variant="caption">Last check-in</Text>
          <Text variant="bodyMedium" className="mt-1">
            {data.latestMood.score}/10
          </Text>
        </Card>
      )}

      {data?.resurfacedEntry && (
        <Pressable onPress={() => router.push(`/journal/${data.resurfacedEntry.id}`)}>
          <GlassSurface intensity="subtle">
            <Text variant="caption">From a while back</Text>
            <Text variant="body" className="mt-1">
              {data.resurfacedEntry.bodyPreview}...
            </Text>
          </GlassSurface>
        </Pressable>
      )}

      {data?.suggestedExercise && (
        <Pressable onPress={() => router.push(`/exercise/${data.suggestedExercise.id}`)}>
          <Card>
            <Text variant="caption">Take a moment</Text>
            <Text variant="bodyMedium" className="mt-1">
              {data.suggestedExercise.title} · {data.suggestedExercise.durationMin} min
            </Text>
          </Card>
        </Pressable>
      )}
    </ScrollView>
  );
}