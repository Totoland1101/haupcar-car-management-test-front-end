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
import { App as AntApp, ConfigProvider } from "antd";
import { buildTheme } from "../constants/theme/theme";
import { THEME_COOKIE, type ThemeMode } from "../constants/theme/mode";

interface ThemeModeContextProps {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextProps>({ mode: "light", toggle: () => {} });

// `initialMode` comes from the cookie. It is null on the first visit, which starts in
// light mode.
export function ThemeModeProvider({
  initialMode,
  children,
}: {
  initialMode: ThemeMode | null;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<ThemeMode>(initialMode ?? "light");

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.cookie = `${THEME_COOKIE}=${mode}; path=/; max-age=31536000; samesite=lax`;
  }, [mode]);

  const toggle = useCallback(() => setMode((m) => (m === "dark" ? "light" : "dark")), []);
  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider theme={buildTheme(mode)}>
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
