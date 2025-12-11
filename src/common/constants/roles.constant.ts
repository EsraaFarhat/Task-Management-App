/**
 * User Roles Constants
 *
 * These constants define the role-based access control (RBAC) system.
 * Used throughout the application for authorization checks.
 *
 * Role Hierarchy (from highest to lowest privilege):
 * 1. ADMIN - Full system access, can manage all users and tasks
 * 2. MANAGER - Can manage teams, assign tasks, view all team tasks
 * 3. MEMBER - Can manage own tasks, view assigned tasks
 *
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

/**
 * Array of all valid roles
 * For validation in DTOs
 */

export const ALL_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER];

/**
 * Role descriptions for documentation
 */
export const ROLE_DESCRIPTIONS = {
  [UserRole.ADMIN]: 'Full system access, can manage all users and tasks',
  [UserRole.MANAGER]: 'Can manage teams, assign tasks, view all team tasks',
  [UserRole.MEMBER]: 'Can manage own tasks, view assigned tasks',
};
