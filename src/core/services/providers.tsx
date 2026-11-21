"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../context/DataContext";
import { ThemeModeProvider } from "../context/ThemeContext";
import type { ThemeMode } from "../constants/theme";

export default function Providers({
  initialThemeMode,
  children,
}: {
  initialThemeMode: ThemeMode | null;
  children: ReactNode;
}) {
  return (
    <ThemeModeProvider initialMode={initialThemeMode}>
      <AuthProvider>
        <DataProvider>{children}</DataProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}
