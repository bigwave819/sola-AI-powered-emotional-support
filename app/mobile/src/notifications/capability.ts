import Constants from 'expo-constants';
import { Platform } from 'react-native';

// expo-notifications import/usage crashes on Android when running
// inside Expo Go (SDK 53+), even for local-only notification features.
// This detects that specific environment so we can skip loading the
// module entirely there, and fall back gracefully. Works fine on iOS
// Expo Go and on any real dev/production build on either platform.
export function isNotificationsSupported(): boolean {
  const isExpoGo = Constants.appOwnership === 'expo';
  const isAndroid = Platform.OS === 'android';
  return !(isExpoGo && isAndroid);
}
