/**
 * Task Priority Constants
 *
 * Defines the urgency/importance level of tasks.
 * Used for sorting and filtering tasks.
 *
 * Priority Levels (from lowest to highest):
 * LOW → MEDIUM → HIGH → URGENT
 *
 */

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Array of all valid task priorities
 */
export const ALL_TASK_PRIORITIES = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
  TaskPriority.URGENT,
];

/**
 * Numeric priority values for sorting
 * Higher number = higher priority
 */
export const PRIORITY_VALUES = {
  [TaskPriority.LOW]: 1,
  [TaskPriority.MEDIUM]: 2,
  [TaskPriority.HIGH]: 3,
  [TaskPriority.URGENT]: 4,
};

/**
 * Priority descriptions
 */
export const PRIORITY_DESCRIPTIONS = {
  [TaskPriority.LOW]: 'Can be done when time permits',
  [TaskPriority.MEDIUM]: 'Should be done in normal workflow',
  [TaskPriority.HIGH]: 'Important, should be prioritized',
  [TaskPriority.URGENT]: 'Critical, needs immediate attention',
};

/**
 * Priority colors (useful for frontend display)
 */
export const PRIORITY_COLORS = {
  [TaskPriority.LOW]: '#6B7280', // Gray
  [TaskPriority.MEDIUM]: '#3B82F6', // Blue
  [TaskPriority.HIGH]: '#F59E0B', // Orange
  [TaskPriority.URGENT]: '#EF4444', // Red
};
