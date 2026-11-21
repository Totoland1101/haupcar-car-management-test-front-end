"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Dropdown, Tag, Tooltip, theme, type MenuProps } from "antd";
import { DownOutlined, IdcardOutlined, LogoutOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "@/core/context/AuthContext";
import { useLayout } from "@/core/context/LayoutContext";
import { useThemeMode } from "@/core/context/ThemeContext";

interface HeaderProps {
  /** Shown on the left. The layout puts the burger menu here on mobile. */
  left?: ReactNode;
}

export default function Header({ left }: HeaderProps) {
  const router = useRouter();
  const { token } = theme.useToken();
  const { isMobile } = useLayout();
  const { mode, toggle } = useThemeMode();
  const { user, logout } = useAuth();
  const nextMode = mode === "dark" ? "light" : "dark";

  const items: MenuProps["items"] = [
    { key: "profile", icon: <IdcardOutlined />, label: "My profile" },
    { type: "divider" },
    { key: "signout", icon: <LogoutOutlined />, label: "Log out" },
  ];

  return (
    <div
      className={isMobile ? "container-header justify-between" : "container-header"}
      style={{ background: token.colorBgContainer }}
    >
      {left}
      <div className="action">
        <div className="action-flex" style={{ borderColor: token.colorBorder }}>
          <Tooltip title={`Switch to ${nextMode} mode`}>
            <Button
              type="text"
              shape="circle"
              aria-label={`Switch to ${nextMode} mode`}
              icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggle}
            />
          </Tooltip>
        </div>

        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items,
            onClick: ({ key }) => (key === "signout" ? logout() : router.push("/profile")),
          }}
        >
          <button type="button" className="profile" aria-label="Account menu" style={{ color: token.colorText }}>
            <Avatar icon={<UserOutlined />} style={{ width: 32, height: 32 }} />
            {!isMobile && (
              <>
                <div className="name">
                  {user?.name}
                  <div className="organization" style={{ color: token.colorTextSecondary }}>
                    {user?.username}
                  </div>
                </div>
                <div className="profile-meta">
                  <DownOutlined />
                  <Tag color="blue">{user?.role.name}</Tag>
                </div>
              </>
            )}
          </button>
        </Dropdown>
      </div>
    </div>
  );
}
