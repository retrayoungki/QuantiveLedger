import { UserRole } from "./roles";

export type Permission = 
  | "view_dashboard"
  | "view_reports"
  | "manage_setup"
  | "manage_coa"
  | "approve_transactions"
  | "edit_financials"
  | "manage_users";

const ALL_PERMISSIONS: Permission[] = [
  "view_dashboard",
  "view_reports",
  "manage_setup",
  "manage_coa",
  "approve_transactions",
  "edit_financials",
  "manage_users"
];

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  "Super Admin": ALL_PERMISSIONS,
  "Direksi": ALL_PERMISSIONS,
  "Manager": ALL_PERMISSIONS,
  "Staff": ALL_PERMISSIONS
};

export const hasPermission = (role: UserRole | undefined, permission: Permission): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
};

export const canAccessModule = (role: UserRole | undefined, module: string): boolean => {
  return true; // Everyone can access everything
};
