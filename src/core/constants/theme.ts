export type ThemeMode = "light" | "dark";

// Cookie that remembers light or dark mode. app/layout.tsx reads it, so the first paint
// already uses the right theme.
export const THEME_COOKIE = "haupcar-management-theme";
