"use client";

import Link from "next/link";
import { Badge, type MenuProps } from "antd";
import { useAuth } from "@/core/context/AuthContext";
import useCar from "@/core/hooks/useCar";
import useRegistration from "@/core/hooks/useRegistration";
import { mainMenu } from "@/core/router/menu";

// Turns mainMenu into antd Menu items, leaving out pages the user's role can't open.
export function useMenuItems(): MenuProps["items"] {
  const { hasPermission } = useAuth();
  const { counts } = useRegistration();
  const { goToFirstPage } = useCar();

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
          label: (
            <Link
              href={entry.path ?? "/"}
              className="menu-link"
              onClick={entry.key === "/" ? goToFirstPage : undefined}
            >
              {entry.label}
              {/* How many registrations are waiting. AppLayout loads the count. */}
              {entry.key === "/approvals" && <Badge count={counts.pending} size="small" />}
            </Link>
          ),
        })),
      },
    ];
  });
}

export const openMenuKeys = mainMenu.map((group) => group.key);
