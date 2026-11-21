import { clearAccessToken, getAccessToken } from "../utils/token";

// The Express API. Set NEXT_PUBLIC_ENDPOINT_URL in .env.local to point somewhere else.
// It is inlined into the browser bundle at build time.
const baseURL: string = `${process.env.NEXT_PUBLIC_ENDPOINT_URL || "http://localhost:4000"}/api`;

export type QueryParams = Record<string, string | number | null | undefined>;

export interface HttpResponseData<T> {
  status: number;
  data: T;
}

export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function buildURL(path: string, params?: QueryParams): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  }
  const queryString = query.toString();
  return `${baseURL}${path}${queryString ? `?${queryString}` : ""}`;
}

async function request<T>(
  method: string,
  path: string,
  { params, body }: { params?: QueryParams; body?: unknown } = {}
): Promise<HttpResponseData<T>> {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(buildURL(path, params), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    // fetch only rejects when no response came back, e.g. the API is down or blocked by CORS.
    throw new HttpError(0, "Cannot reach the API server. Check that the backend is running.");
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  // The token expired or the account was disabled. Go back to the login page, and return
  // to this page after logging in. A 401 without a token is a failed login, so it stays here.
  if (res.status === 401 && token) {
    clearAccessToken();
    if (!window.location.pathname.startsWith("/login")) {
      const next = window.location.pathname + window.location.search;
      window.location.assign(`/login?next=${encodeURIComponent(next)}`);
    }
  }

  if (!res.ok) {
    throw new HttpError(res.status, `Request failed with status ${res.status}`, data);
  }
  return { status: res.status, data: data as T };
}

// Same shape as an Axios instance, so services read the same way: Http.HttpService.get(...)
const HttpService = {
  get: <T>(path: string, options?: { params?: QueryParams }) => request<T>("GET", path, options),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, { body }),
  delete: <T = null>(path: string) => request<T>("DELETE", path),
};

const Http = {
  HttpService,
};

export default Http;
