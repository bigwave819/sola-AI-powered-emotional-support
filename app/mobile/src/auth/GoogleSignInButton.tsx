import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Button } from '@/src/components/ui/Button';
import { useAuthStore } from './authStore';
import { resetTo } from '@/src/navigation/resetTo';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

export function GoogleSignInButton() {
  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
      scopes: ['openid', 'email', 'profile'],
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
      extraParams: { nonce: Math.random().toString(36).substring(2) },
      usePKCE: false,
    },
    discovery,
  );

  async function handleResponse() {
    console.log('[AUTH][GOOGLE] Auth response type:', response?.type);
    if (response?.type !== 'success') return;
    const idToken = response.params.id_token;
    console.log('[AUTH][GOOGLE] Got idToken:', idToken ? 'yes' : 'NO');
    if (!idToken) return;

    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      console.log('[AUTH][GOOGLE] Backend /auth/google status:', res.status);
      const data = await res.json();
      console.log('[AUTH][GOOGLE] Backend response:', JSON.stringify(data));

      const status = await useAuthStore.getState().signIn({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
      });
      console.log('[AUTH][GOOGLE] Session saved, redirecting via resetTo');
      resetTo(status === 'ready' ? '/(tabs)' : '/onboarding/age-gate');
    } catch (err) {
      console.error('[AUTH][GOOGLE] Sign-in flow failed:', err);
    }
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