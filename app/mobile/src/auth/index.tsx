import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { GoogleSignInButton } from '@/src/auth/GoogleSignInButton';
import { theme } from '@/src/theme';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function sendMagicLink() {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/magic-link/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  return (
    <View style={styles.container}>
      <Text variant="headline">Sign in to Sola</Text>

      <GoogleSignInButton />

      {sent ? (
        <Text variant="body">Check your email for a sign-in link.</Text>
      ) : (
        <Button label="Send magic link" onPress={sendMagicLink} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.space.lg,
    gap: theme.space.md,
    backgroundColor: theme.color.background,
  },
});