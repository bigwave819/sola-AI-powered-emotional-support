import { View, ScrollView, Linking, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@/src/components/ui/Text';
import { Card } from '@/src/components/ui/Card';
import { api } from '@/src/api/client';

export default function SafetyResources() {
  const { data } = useQuery({
    queryKey: ['safety-resources'],
    queryFn: () => api.get('/safety/resources'),
  });

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-6 gap-4">
      <Text variant="headline">If you need support right now</Text>
      <Text variant="body" className="text-text-secondary">
        Sola isn't able to provide emergency help, but these resources can.
      </Text>

      {data?.map((resource: any) => (
        <Card key={resource.label}>
          <Text variant="bodyMedium">{resource.label}</Text>
          <Text variant="caption" className="mt-1">
            {resource.description}
          </Text>
        </Card>
      ))}

      <Pressable onPress={() => Linking.openURL('https://988lifeline.org')}>
        <Text variant="body" className="text-accent underline mt-2">
          Learn more at 988lifeline.org
        </Text>
      </Pressable>
    </ScrollView>
  );
}