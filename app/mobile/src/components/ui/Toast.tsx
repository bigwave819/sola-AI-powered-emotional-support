import { Pressable, View } from 'react-native';
import { useEffect } from 'react';
import { useToastStore } from '@/src/ui-feedback/toastStore';
import { Text } from './Text';

const AUTO_DISMISS_MS = 4000;

export function Toast() {
  const message = useToastStore((s) => s.message);
  const clear = useToastStore((s) => s.clear);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(clear, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [message, clear]);

  if (!message) return null;

  return (
    <View className="absolute bottom-8 left-0 right-0 px-6 items-center">
      <Pressable
        onPress={clear}
        className="bg-danger/10 border border-danger rounded-md p-3 max-w-[90%] items-center justify-center"
      >
        <Text variant="body" className="text-text-primary">
          {message}
        </Text>
      </Pressable>
    </View>
  );
}