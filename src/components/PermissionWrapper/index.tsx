"use client";

import type { ReactNode } from "react";
import type { PermissionCode } from "@/core/constants/permission";
import { useAuth } from "@/core/context/AuthContext";

interface PermissionWrapperProps {
  /** The user needs all of these */
  permission: PermissionCode | PermissionCode[];
  /** Shown instead of children when the user lacks a permission. Nothing by default. */
  fallback?: ReactNode;
  children: ReactNode;
}

// Hides buttons and pages the user's role doesn't allow. The API checks the same
// permissions, so this only keeps the UI tidy and doesn't secure anything by itself.
export default function PermissionWrapper({ permission, fallback = null, children }: PermissionWrapperProps) {
  const { hasPermission } = useAuth();
  const codes = Array.isArray(permission) ? permission : [permission];
  return <>{hasPermission(...codes) ? children : fallback}</>;
}
