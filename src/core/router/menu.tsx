import type { ReactNode } from "react";
import { CarOutlined, SettingOutlined } from "@ant-design/icons";
import { PERMISSIONS, type PermissionCode } from "../constants/permission";

export interface MenuEntry {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  /** The user needs one of these to see the entry */
  permission?: PermissionCode[];
  children?: MenuEntry[];
}

// Sidebar menu groups and the pages in each.
// A group is hidden when the user can't open any of its pages.
export const mainMenu: MenuEntry[] = [
  {
    key: "fleet",
    label: "Fleet",
    icon: <CarOutlined />,
    children: [{ key: "/", label: "Cars", path: "/", permission: [PERMISSIONS.CAR_VIEW] }],
  },
  {
    key: "settings",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      { key: "/users", label: "Users", path: "/users", permission: [PERMISSIONS.USER_MANAGE] },
      { key: "/roles", label: "Roles", path: "/roles", permission: [PERMISSIONS.ROLE_MANAGE] },
    ],
  },
];

// The menu key for the current page, e.g. /cars/12/edit belongs to "/".
export function selectedMenuKey(pathname: string): string {
  const paths = mainMenu.flatMap((entry) => entry.children ?? [entry]).map((entry) => entry.key);
  return paths.find((key) => key !== "/" && pathname.startsWith(key)) ?? "/";
}
