import { useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { tokenStorage } from '@/src/auth/tokenStorage';
import { useAuthStore } from '@/src/auth/authStore';

export default function VerifyMagicLink() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/magic-link/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        await tokenStorage.save(data.accessToken, data.refreshToken);
        setSession(data.userId);
        router.replace('/(tabs)');
      })
      .catch(() => router.replace('/auth/failed'));
  }, [token]);

  return null;
}