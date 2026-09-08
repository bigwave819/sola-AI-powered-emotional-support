import { View, ScrollView } from 'react-native';
import { useState } from 'react';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { scheduleDailyReminder, cancelDailyReminder } from '@/src/notifications/scheduler';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number) {
  const period = h < 12 ? 'AM' : 'PM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${period}`;
}

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState(true);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  async function toggleEnabled() {
    if (enabled) {
      await cancelDailyReminder();
      setEnabled(false);
    } else {
      setEnabled(true);
      if (selectedHour !== null) await scheduleDailyReminder(selectedHour, 0);
    }
  }

  async function selectHour(hour: number) {
    setSelectedHour(hour);
    if (enabled) await scheduleDailyReminder(hour, 0);
  }

  return (
    <ScrollView className="flex-1 bg-background p-6" contentContainerClassName="gap-4">
      <Text variant="headline">Reminders</Text>

      <Button
        label={enabled ? 'Reminders on' : 'Reminders off'}
        onPress={toggleEnabled}
      />

      {enabled && (
        <View className="gap-2">
          <Text variant="caption">Reminder time</Text>
          <ScrollView contentContainerClassName="gap-2">
            {HOURS.map((h) => (
              <Button
                key={h}
                label={formatHour(h)}
                variant={selectedHour === h ? 'primary' : 'secondary'}
                onPress={() => selectHour(h)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}