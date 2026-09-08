import { View, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@/src/components/ui/Text';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { api } from '@/src/api/client';

export default function JournalList() {
  const { data, isLoading } = useQuery({
    queryKey: ['journal-list'],
    queryFn: () => api.get('/journal'),
  });

  return (
    <View className="flex-1 bg-background p-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text variant="headline">Journal</Text>
        <Button label="New" onPress={() => router.push('/journal/new')} />
      </View>

      {isLoading ? (
        <Text variant="body">Loading...</Text>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3"
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/journal/${item.id}`)}>
              <Card>
                <Text variant="caption">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <Text variant="body" className="mt-1">
                  {item.body.slice(0, 100)}
                </Text>
              </Card>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text variant="body" className="text-text-secondary">
              Nothing here yet.
            </Text>
          }
        />
      )}
    </View>
  );
}