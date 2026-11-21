import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Prompt } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { THEME_COOKIE, type ThemeMode } from "@/core/constants/theme/mode";
import Providers from "@/core/services/providers";
import "@/styles/globals.css";

// Prompt covers both Thai and Latin.
const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: { default: "haupcar-management", template: "%s | haupcar-management" },
  description: "Record and manage company car information",
  icons: "/car.svg",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const saved = (await cookies()).get(THEME_COOKIE)?.value;
  const initialThemeMode: ThemeMode | null = saved === "light" || saved === "dark" ? saved : null;

  return (
    <html lang="en" data-theme={initialThemeMode ?? "light"} className={prompt.variable}>
      <body>
        {/* Collects Ant Design's CSS-in-JS styles during server rendering. */}
        <AntdRegistry>
          <Providers initialThemeMode={initialThemeMode}>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
