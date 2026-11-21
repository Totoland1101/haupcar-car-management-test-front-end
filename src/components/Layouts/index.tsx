"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Button, Dropdown, Layout, Menu, Tooltip, Typography, theme, type MenuProps } from "antd";
import { LogoutOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { PERMISSIONS, type PermissionCode } from "@/core/constants/permission";
import { useAuth } from "@/core/context/AuthContext";
import { useThemeMode } from "@/core/context/ThemeContext";

const NAV: { href: string; label: string; permission: PermissionCode }[] = [
  { href: "/", label: "Cars", permission: PERMISSIONS.CAR_VIEW },
  { href: "/users", label: "Users", permission: PERMISSIONS.USER_MANAGE },
  { href: "/roles", label: "Roles", permission: PERMISSIONS.ROLE_MANAGE },
];

function activeNavKey(pathname: string) {
  return NAV.find((item) => item.href !== "/" && pathname.startsWith(item.href))?.href ?? "/";
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const { token } = theme.useToken();
  const pathname = usePathname();
  const { mode, toggle } = useThemeMode();
  const { user, hasPermission, logout } = useAuth();
  const nextMode = mode === "dark" ? "light" : "dark";

  const navItems: MenuProps["items"] = NAV.filter((item) => hasPermission(item.permission)).map((item) => ({
    key: item.href,
    label: <Link href={item.href}>{item.label}</Link>,
  }));

  const userMenu: MenuProps["items"] = [
    {
      key: "who",
      disabled: true,
      label: (
        <div>
          <Typography.Text strong>{user?.name}</Typography.Text>
          <br />
          <Typography.Text type="secondary">
            {user?.username} · {user?.role.name}
          </Typography.Text>
        </div>
      ),
    },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Log out" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        className="app-header"
        style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}
      >
        <Link href="/" className="app-brand" style={{ color: token.colorText }}>
          <img src="/car.svg" alt="" width={28} height={28} />
          <span className="app-brand-name">haupcar-management</span>
        </Link>

        <Menu
          className="app-nav"
          mode="horizontal"
          selectedKeys={[activeNavKey(pathname)]}
          items={navItems}
        />

        <div className="app-header-actions">
          <Tooltip title={`Switch to ${nextMode} mode`}>
            <Button
              type="text"
              shape="circle"
              aria-label={`Switch to ${nextMode} mode`}
              icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggle}
            />
          </Tooltip>
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={{ items: userMenu, onClick: ({ key }) => key === "logout" && logout() }}
          >
            <Button type="text" aria-label="Account menu" className="app-user-button">
              <Avatar size="small" icon={<UserOutlined />} />
              <span className="app-user-name">{user?.name}</span>
            </Button>
          </Dropdown>
        </div>
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
