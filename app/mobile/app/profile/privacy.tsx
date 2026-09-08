import { View, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useExportData } from '@/src/privacy/useExportData';
import { useDeleteAccount } from '@/src/privacy/useDeleteAccount';

export default function Privacy() {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const exportData = useExportData();
  const deleteAccount = useDeleteAccount();

  function handleFinalDelete() {
    deleteAccount.mutate(undefined, {
      onSuccess: () => router.replace('/onboarding/welcome'),
    });
  }

  return (
    <ScrollView className="flex-1 bg-background p-6" contentContainerClassName="gap-4">
      <Text variant="headline">Privacy</Text>

      <Card>
        <Text variant="bodyMedium">Export your data</Text>
        <Text variant="caption" className="mt-1">
          Download everything you've written — journal entries, mood history, preferences.
        </Text>
        <Button
          label={exportData.isPending ? 'Preparing...' : 'Export data'}
          variant="secondary"
          className="mt-3"
          onPress={() => exportData.mutate()}
          disabled={exportData.isPending}
        />
      </Card>

      <Card className="border-danger">
        <Text variant="bodyMedium">Delete account</Text>
        <Text variant="caption" className="mt-1">
          This permanently deletes your account and everything in it. This action is
          immediate and cannot be undone.
        </Text>

        {!confirmingDelete ? (
          <Button
            label="Delete my account"
            variant="secondary"
            className="mt-3"
            onPress={() => setConfirmingDelete(true)}
          />
        ) : (
          <View className="gap-2 mt-3">
            <Text variant="body">
              Are you sure? Your journal entries, mood history, and preferences will be
              permanently deleted right now.
            </Text>
            <Button
              label={deleteAccount.isPending ? 'Deleting...' : 'Yes, permanently delete'}
              onPress={handleFinalDelete}
              disabled={deleteAccount.isPending}
            />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => setConfirmingDelete(false)}
            />
          </View>
        )}
      </Card>
    </ScrollView>
  );
}