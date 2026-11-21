import type { Metadata } from "next";
import { cookies } from "next/headers";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { THEME_COOKIE, type ThemeMode } from "@/core/constants/theme";
import Providers from "@/core/services/providers";
import "@/styles/globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-thai",
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
    <html lang="en" data-theme={initialThemeMode ?? "light"} className={plexThai.variable}>
      <body>
        {/* Collects Ant Design's CSS-in-JS styles during server rendering. */}
        <AntdRegistry>
          <Providers initialThemeMode={initialThemeMode}>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
