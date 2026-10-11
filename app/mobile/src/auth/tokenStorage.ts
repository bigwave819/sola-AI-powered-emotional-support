import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'sola_access_token';
const REFRESH_KEY = 'sola_refresh_token';

export const tokenStorage = {
  async save(accessToken: string, refreshToken: string) {
    console.log('[TOKEN] Saving tokens — accessToken:', accessToken ? `${accessToken.slice(0, 12)}...` : 'MISSING', '| refreshToken:', refreshToken ? 'present' : 'MISSING');
    await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
    console.log('[TOKEN] Tokens saved to SecureStore');
  },
  async getAccessToken() {
    const token = await SecureStore.getItemAsync(ACCESS_KEY);
    console.log('[TOKEN] getAccessToken →', token ? `${token.slice(0, 12)}...` : 'null');
    return token;
  },
  async getRefreshToken() {
    const token = await SecureStore.getItemAsync(REFRESH_KEY);
    console.log('[TOKEN] getRefreshToken →', token ? 'present' : 'null');
    return token;
  },
  async clear() {
    console.log('[TOKEN] Clearing tokens from SecureStore');
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};