import { useFonts, Fraunces_400Regular, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tokenStorage } from '@/src/auth/tokenStorage';
import { api } from '@/src/api/client';
import { useAuthStore } from '@/src/auth/authStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    async function checkAuth() {
      const accessToken = await tokenStorage.getAccessToken();

      if (!accessToken) {
        router.replace('/onboarding/welcome');
        setChecked(true);
        return;
      }

      try {
        const me = await api.get('/users/me');
        setSession(me.id);

        if (!me.onboardingCompleted) {
          router.replace('/onboarding/age-gate');
        } else {
          router.replace('/(tabs)');
        }
      } catch {
        await tokenStorage.clear();
        router.replace('/onboarding/welcome');
      } finally {
        setChecked(true);
      }
    }

    checkAuth();
  }, []);

  if (!checked) return null; // splash screen is still visible at this point

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate>
        <Slot />
      </AuthGate>
    </QueryClientProvider>
  );
}