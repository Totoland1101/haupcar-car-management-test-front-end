"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PermissionCode } from "../constants/permission";
import AuthService, { type AuthUser, type LoginResult } from "../services/auth";
import type { ServiceResponse } from "../utils/http_response";
import { clearAccessToken, getAccessToken, setAccessToken } from "../utils/token";

/** "error" means the API could not be reached, so we don't know yet whether the token is valid. */
export type AuthStatus = "loading" | "authenticated" | "anonymous" | "error";

interface AuthContextProps {
  user: AuthUser | null;
  status: AuthStatus;
  errorMessage: string | null;
  login: (username: string, password: string) => Promise<ServiceResponse<LoginResult>>;
  logout: () => void;
  /** True when the user has every listed permission */
  hasPermission: (...codes: PermissionCode[]) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    user: AuthUser | null;
    status: AuthStatus;
    errorMessage: string | null;
  }>({ user: null, status: "loading", errorMessage: null });

  // A saved token may have expired, so ask the API who it belongs to.
  useEffect(() => {
    if (!getAccessToken()) {
      setState({ user: null, status: "anonymous", errorMessage: null });
      return;
    }
    AuthService.me().then(({ success, data, error }) => {
      if (success) {
        setState({ user: data, status: "authenticated", errorMessage: null });
      } else if (error.status === 401) {
        // HttpService has already cleared the token.
        setState({ user: null, status: "anonymous", errorMessage: null });
      } else {
        setState({ user: null, status: "error", errorMessage: error.message });
      }
    });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await AuthService.login({ username, password });
    if (response.success) {
      setAccessToken(response.data.token);
      setState({ user: response.data.user, status: "authenticated", errorMessage: null });
    }
    return response;
  }, []);

  // A full page load clears every bit of the previous user's data held in memory.
  const logout = useCallback(() => {
    clearAccessToken();
    window.location.assign("/login");
  }, []);

  const hasPermission = useCallback(
    (...codes: PermissionCode[]) =>
      !!state.user && codes.every((code) => state.user!.permissions.includes(code)),
    [state.user]
  );

  const value = useMemo(
    () => ({ ...state, login, logout, hasPermission }),
    [state, login, logout, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextProps {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
