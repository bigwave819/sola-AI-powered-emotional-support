import { View, ScrollView, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { ApiError } from '@/src/api/client';
import { Text } from '@/src/components/ui/Text';
import { useToastStore } from '@/src/ui-feedback/toastStore';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import {
    useJournalEntry,
    useCreateJournalEntry,
    useUpdateJournalEntry,
    useReflect,
    useFinalizeJournalEntry,
} from '@/src/journal/useJournal';

export default function JournalCompose() {
    const { id, moodEntryId } = useLocalSearchParams<{ id: string; moodEntryId?: string }>();
    const isNew = id === 'new';

    const [entryId, setEntryId] = useState<string | null>(isNew ? null : id);
    const [body, setBody] = useState('');
    const [reflectionText, setReflectionText] = useState<string | null>(null);
    const [safetyFlagged, setSafetyFlagged] = useState(false);

    const { data: existingEntry } = useJournalEntry(entryId ?? '');
    const createEntry = useCreateJournalEntry();
    const updateEntry = useUpdateJournalEntry();
    const reflect = useReflect();
    const finalize = useFinalizeJournalEntry();

    useEffect(() => {
        if (isNew && !entryId) {
            createEntry.mutate(moodEntryId, {
                onSuccess: (created) => setEntryId(created.id),
            });
        }
    }, []);

    useEffect(() => {
        if (existingEntry) {
            setBody(existingEntry.body);
            setReflectionText(existingEntry.aiReflectionText);
        }
    }, [existingEntry]);

    function handleReflect() {
        if (!entryId || !body.trim()) return;

        updateEntry.mutate(
            { id: entryId, body },
            {
                onSuccess: () => {
                    reflect.mutate(entryId, {
                        onSuccess: (result) => {
                            setReflectionText(result.reflectionText);
                            setSafetyFlagged(result.flaggedForSafety);
                        },
                        onError: (err: unknown) => {
                            if (err instanceof ApiError && err.code === 'AI_QUOTA_EXCEEDED') {
                                router.push('/paywall');
                            } else {
                                // Keep logging for debugging AND surface a user-facing toast.
                                console.error('Reflection failed', err);
                                useToastStore.getState().show('Something went wrong. Please try again.');
                            }
                        },
                    });
                },
            },
        );
    }

    function handleDone() {
        if (!entryId) return;
        updateEntry.mutate(
            { id: entryId, body },
            { onSuccess: () => finalize.mutate(entryId, { onSuccess: () => router.replace('/(tabs)') }) },
        );
    }

    return (
        <View className="flex-1 bg-background">
            <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
                <TextInput
                    multiline
                    value={body}
                    onChangeText={setBody}
                    placeholder="What's on your mind?"
                    placeholderTextColor="#6B6259"
                    className="font-body text-base text-text-primary min-h-[200px]"
                    textAlignVertical="top"
                />

                {reflectionText && (
                    <Card>
                        <Text variant="caption">Sola</Text>
                        <Text variant="body" className="mt-1">
                            {reflectionText}
                        </Text>
                    </Card>
                )}

                {safetyFlagged && (
                    <Card className="border-danger">
                        <Text variant="bodyMedium">If you're going through something difficult</Text>
                        <Text variant="body" className="mt-1">
                            You don't have to go through this alone.
                        </Text>
                        <Button
                            label="See support resources"
                            variant="secondary"
                            className="mt-2"
                            onPress={() => router.push('/profile/safety')}
                        />
                    </Card>
                )}
            </ScrollView>

            <View className="p-6 gap-2">
                <Button
                    label={reflect.isPending ? 'Reflecting...' : 'Reflect'}
                    onPress={handleReflect}
                    disabled={!body.trim() || reflect.isPending}
                />
                <Button label="Done" variant="secondary" onPress={handleDone} />
            </View>
        </View>
    );
}