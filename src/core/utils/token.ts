// The login token lives in localStorage, and HttpService sends it as a Bearer header.
const TOKEN_KEY = "access_token";

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage is blocked, so there is nothing to clear.
  }
}
