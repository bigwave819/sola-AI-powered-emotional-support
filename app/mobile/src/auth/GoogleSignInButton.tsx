import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Button } from '@/src/components/ui/Button';
import { tokenStorage } from './tokenStorage';
import { useAuthStore } from './authStore';
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export function GoogleSignInButton() {
  const setSession = useAuthStore((s) => s.setSession);

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
      scopes: ['openid', 'email', 'profile'],
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: { nonce: Math.random().toString(36).substring(2) },
    },
    discovery,
  );

  async function handleResponse() {
    if (response?.type !== 'success') return;
    const idToken = response.params.id_token;
    if (!idToken) return;

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    const data = await res.json();

    await tokenStorage.save(data.accessToken, data.refreshToken);
    setSession(data.userId);
    router.replace(data.isNewUser ? '/onboarding/age-gate' : '/(tabs)');
  }

  // fires once when the auth popup returns
  if (response?.type === 'success') handleResponse();

  return (
    <Button
      label="Continue with Google"
      onPress={() => promptAsync()}
      variant="secondary"
    />
  );
}