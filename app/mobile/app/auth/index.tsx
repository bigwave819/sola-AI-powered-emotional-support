import { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Button } from '@/src/components/ui/Button';
import { GoogleSignInButton } from '@/src/auth/GoogleSignInButton';
import { useAuthStore } from '@/src/auth/authStore';
import { useToastStore } from '@/src/ui-feedback/toastStore';
import { resetTo } from '@/src/navigation/resetTo';
import Constants from 'expo-constants';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const isExpoGo = Constants.appOwnership === 'expo';

  async function requestCode() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Failed to send code');
      }
      setStep('code');
    } catch (err: any) {
      useToastStore.getState().show(err.message || 'Could not send code. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        useToastStore.getState().show(data.message || 'Incorrect code.');
        return;
      }
      if (!data.accessToken || !data.refreshToken) {
        useToastStore.getState().show('Sign-in failed. Please try again.');
        return;
      }
      const status = await useAuthStore.getState().signIn({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
      });
      resetTo(status === 'ready' ? '/(tabs)' : '/onboarding/age-gate');
    } catch (err) {
      useToastStore.getState().show('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center p-6 gap-4 bg-background">
      <Text variant="headline">Sign in to Sola</Text>

      {!isExpoGo && <GoogleSignInButton />}

      {step === 'email' ? (
        <>
          <TextInput
            className="rounded-lg border border-border px-3.5 py-3 font-body text-base text-text-primary bg-surface-elevated"
            placeholder="Email address"
            placeholderTextColor="#6B6259"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            editable={!loading}
          />
          <Button label={loading ? 'Sending...' : 'Send code'} onPress={requestCode} disabled={loading || !email} />
        </>
      ) : (
        <>
          <Text variant="body">Enter the 6-digit code sent to {email}</Text>
          <TextInput
            className="rounded-lg border border-border px-3.5 py-3 font-body text-base text-text-primary bg-surface-elevated text-center text-xl tracking-widest"
            placeholder="123456"
            placeholderTextColor="#6B6259"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
          />
          <Button label={loading ? 'Verifying...' : 'Verify'} onPress={verifyCode} disabled={loading || code.length !== 6} />
          <Button label="Use a different email" variant="secondary" onPress={() => setStep('email')} />
        </>
      )}
    </View>
  );
}
