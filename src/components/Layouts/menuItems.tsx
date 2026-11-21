"use client";

import Link from "next/link";
import type { MenuProps } from "antd";
import { useAuth } from "@/core/context/AuthContext";
import { mainMenu } from "@/core/router/menu";

// Turns mainMenu into antd Menu items, leaving out pages the user's role can't open.
export function useMenuItems(): MenuProps["items"] {
  const { hasPermission } = useAuth();

  return mainMenu.flatMap((group) => {
    const children = (group.children ?? []).filter(
      (entry) => !entry.permission || entry.permission.some((code) => hasPermission(code))
    );
    if (!children.length) return [];
    return [
      {
        key: group.key,
        icon: group.icon,
        label: group.label,
        children: children.map((entry) => ({
          key: entry.key,
          label: <Link href={entry.path ?? "/"}>{entry.label}</Link>,
        })),
      },
    ];
  });
}

export const openMenuKeys = mainMenu.map((group) => group.key);
