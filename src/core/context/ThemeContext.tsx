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
import { App as AntApp, ConfigProvider, theme } from "antd";
import { THEME_COOKIE, type ThemeMode } from "../constants/theme";

interface ThemeModeContextProps {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextProps>({ mode: "light", toggle: () => {} });

// `initialMode` comes from the cookie. It is null on the first visit.
export function ThemeModeProvider({
  initialMode,
  children,
}: {
  initialMode: ThemeMode | null;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<ThemeMode>(initialMode ?? "light");
  const dark = mode === "dark";

  // No saved choice yet, so follow the system setting.
  useEffect(() => {
    if (!initialMode && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      setMode("dark");
    }
  }, [initialMode]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.cookie = `${THEME_COOKIE}=${mode}; path=/; max-age=31536000; samesite=lax`;
  }, [mode]);

  const toggle = useCallback(() => setMode((m) => (m === "dark" ? "light" : "dark")), []);
  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#1d4ed8",
            borderRadius: 8,
            // --font-plex-thai is set by next/font in app/layout.tsx.
            fontFamily:
              "var(--font-plex-thai), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
          components: {
            Layout: {
              headerBg: dark ? "#141414" : "#ffffff",
              bodyBg: dark ? "#000000" : "#f4f6fa",
              footerBg: "transparent",
            },
          },
        }}
      >
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
