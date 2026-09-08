import { tokenStorage } from '@/src/auth/tokenStorage';

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function request(path: string, options: RequestInit = {}) {
  const accessToken = await tokenStorage.getAccessToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token expired — try refreshing once, then retry the original request.
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('Unauthorized');

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      await tokenStorage.clear();
      throw new Error('Session expired');
    }

    const refreshed = await refreshRes.json();
    await tokenStorage.save(refreshed.accessToken, refreshed.refreshToken);

    const retryRes = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshed.accessToken}`,
        ...options.headers,
      },
    });
    if (!retryRes.ok) {
      let body: any = {};
      try {
        body = await retryRes.json();
      } catch {
        // response wasn't JSON — fine, body stays {}
      }
      throw new ApiError(
        body.message || `Request failed: ${retryRes.status}`,
        retryRes.status,
        body.code,
      );
    }
    return retryRes.json();
  }

  if (!res.ok) {
    let body: any = {};
    try {
      body = await res.json();
    } catch {
      // response wasn't JSON — fine, body stays {}
    }
    throw new ApiError(
      body.message || `Request failed: ${res.status}`,
      res.status,
      body.code,
    );
  }
  return res.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body?: unknown) =>
    request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: (path: string, body?: unknown) =>
    request(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
};