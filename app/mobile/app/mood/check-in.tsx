import { View, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { MOOD_SCALE, MOOD_TAGS } from '@/src/mood/moodScale';
import { useMoodCheckIn } from '@/src/mood/useMoodCheckIn';

export default function MoodCheckIn() {
  const [score, setScore] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [step, setStep] = useState<'mood' | 'tags' | 'done'>('mood');
  const { mutate, isPending, data } = useMoodCheckIn();

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function submit() {
    if (score === null) return;
    mutate(
      { score, tags: selectedTags },
      { onSuccess: () => setStep('done') },
    );
  }

  return (
    <View className="flex-1 bg-background p-6 justify-center gap-4">
      {step === 'mood' && (
        <>
          <Text variant="headline">How are you feeling?</Text>
          <ScrollView contentContainerClassName="gap-2">
            {MOOD_SCALE.map((opt) => (
              <Button
                key={opt.score}
                label={opt.label}
                variant={score === opt.score ? 'primary' : 'secondary'}
                onPress={() => setScore(opt.score)}
              />
            ))}
          </ScrollView>
          <Button
            label="Continue"
            onPress={() => setStep('tags')}
            disabled={score === null}
          />
        </>
      )}

      {step === 'tags' && (
        <>
          <Text variant="headline">What's contributing to this?</Text>
          <Text variant="caption">Optional — skip if you'd rather not say.</Text>
          <View className="flex-row flex-wrap gap-2">
            {MOOD_TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  className={`py-2 px-4 rounded-full border ${
                    selected ? 'bg-accent border-accent' : 'border-border'
                  }`}
                >
                  <Text className={selected ? 'text-surface-elevated' : 'text-text-primary'}>
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Button label={isPending ? 'Saving...' : 'Done'} onPress={submit} disabled={isPending} />
        </>
      )}

      {step === 'done' && (
        <>
          <Text variant="headline">Thanks for checking in.</Text>
          <Button
            label="Say more in your journal"
            onPress={() => {
              router.replace(`/journal/new?moodEntryId=${data?.id}`);
            }}
          />
          <Button label="Close" variant="secondary" onPress={() => router.back()} />
        </>
      )}
    </View>
  );
}