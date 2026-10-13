import '../global.css';
import { useEffect, useRef } from 'react';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Toast } from '@/src/components/ui/Toast';
import { useAuthStore } from '@/src/auth/authStore';
import { initPurchases } from '@/src/subscriptions/purchases';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Renders nothing. Routes once, AFTER the navigator exists and auth state is known.
function AuthGate() {
  const router = useRouter();
  const navState = useRootNavigationState();
  const status = useAuthStore((s) => s.status);
  const userId = useAuthStore((s) => s.userId);
  const routed = useRef(false);

  useEffect(() => {
    if (!navState?.key || status === 'loading' || routed.current) return;
    routed.current = true;
    router.replace(
      status === 'signedOut'
        ? '/onboarding/welcome'
        : status === 'onboarding'
          ? '/onboarding/age-gate'
          : '/(tabs)',
    );
    setTimeout(() => SplashScreen.hideAsync(), 80);
  }, [navState?.key, status]);

  useEffect(() => {
    if (userId) initPurchases(userId).catch((e: unknown) => console.warn('RevenueCat init failed', e));
  }, [userId]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_300Light,
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // starts in parallel with font loading
  useEffect(() => {
    useAuthStore.getState().bootstrap();
  }, []);

  if (!fontsLoaded) return null; // native splash stays up

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="mood" options={{ presentation: 'modal' }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
      <AuthGate />
      <Toast />
    </QueryClientProvider>
  );
}