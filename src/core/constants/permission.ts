// Permission codes the API checks (backend/src/auth/permissions.js).
export const PERMISSIONS = {
  CAR_VIEW: "car.view",
  CAR_CREATE: "car.create",
  CAR_UPDATE: "car.update",
  CAR_DELETE: "car.delete",
  USER_MANAGE: "user.manage",
  ROLE_MANAGE: "role.manage",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Headings for the permission groups in the role form
export const PERMISSION_MODULE_LABEL: Record<string, string> = {
  car: "Cars",
  user: "Users",
  role: "Roles",
};
