"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button, Layout, Tooltip, Typography, theme } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useThemeMode } from "@/core/context/ThemeContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { token } = theme.useToken();
  const { mode, toggle } = useThemeMode();
  const nextMode = mode === "dark" ? "light" : "dark";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        className="app-header"
        style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Link href="/" className="app-brand" style={{ color: token.colorText }}>
          <img src="/car.svg" alt="" width={28} height={28} />
          haupcar-management
        </Link>
        <Tooltip title={`Switch to ${nextMode} mode`}>
          <Button
            type="text"
            shape="circle"
            aria-label={`Switch to ${nextMode} mode`}
            icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggle}
          />
        </Tooltip>
      </Layout.Header>

      <Layout.Content>
        <div className="page">{children}</div>
      </Layout.Content>

      <Layout.Footer style={{ textAlign: "center" }}>
        <Typography.Text type="secondary">Company car registry</Typography.Text>
      </Layout.Footer>
    </Layout>
  );
}
