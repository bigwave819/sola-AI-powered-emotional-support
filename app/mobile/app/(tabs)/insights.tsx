import { View, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@/src/components/ui/Text';
import { Card } from '@/src/components/ui/Card';
import { api } from '@/src/api/client';

export default function Insights() {
  const { data, isLoading } = useQuery({
    queryKey: ['insights-weekly'],
    queryFn: () => api.get('/insights/weekly'),
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text variant="body">Loading...</Text>
      </View>
    );
  }

  const hasData = data?.journalCount > 0 || data?.moodTrend?.length > 0;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-6 gap-4">
      <Text variant="headline">This week</Text>

      {!hasData ? (
        <Card>
          <Text variant="body" className="text-text-secondary">
            Check in or write an entry to start seeing your patterns here.
          </Text>
        </Card>
      ) : (
        <>
          <View className="flex-row gap-3">
            <Card className="flex-1">
              <Text variant="caption">Current streak</Text>
              <Text variant="headlineLight" className="mt-1">
                {data.currentStreak} {data.currentStreak === 1 ? 'day' : 'days'}
              </Text>
            </Card>
            <Card className="flex-1">
              <Text variant="caption">Entries</Text>
              <Text variant="headlineLight" className="mt-1">
                {data.journalCount}
              </Text>
            </Card>
          </View>

          {data.averageMood !== null && (
            <Card>
              <Text variant="caption">Average mood</Text>
              <Text variant="headlineLight" className="mt-1">
                {data.averageMood}/10
              </Text>
            </Card>
          )}

          {data.topTags?.length > 0 && (
            <Card>
              <Text variant="caption">Coming up often</Text>
              <Text variant="body" className="mt-1">
                {data.topTags.join(', ')}
              </Text>
            </Card>
          )}
        </>
      )}
    </ScrollView>
  );
}