/**
 * Notification Type Constants
 *
 * Defines the different types of notifications in the system.
 * Each type represents a specific event that triggers a notification.
 *
 */

export enum NotificationType {
  /**
   * Task was assigned to the user
   */
  TASK_ASSIGNED = 'TASK_ASSIGNED',

  /**
   * Task was unassigned from the user
   */
  TASK_UNASSIGNED = 'TASK_UNASSIGNED',

  /**
   * Task status was changed
   */
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',

  /**
   * Task priority was changed
   */
  TASK_PRIORITY_CHANGED = 'TASK_PRIORITY_CHANGED',

  /**
   * Task due date is approaching (reminder)
   */
  TASK_DUE_SOON = 'TASK_DUE_SOON',

  /**
   * Task is overdue
   */
  TASK_OVERDUE = 'TASK_OVERDUE',

  /**
   * New comment was added to a task user is involved with
   */
  TASK_COMMENTED = 'TASK_COMMENTED',

  /**
   * Task was completed
   */
  TASK_COMPLETED = 'TASK_COMPLETED',

  /**
   * User was mentioned in a comment
   */
  MENTIONED = 'MENTIONED',
}

/**
 * Array of all notification types
 */
export const ALL_NOTIFICATION_TYPES = [
  NotificationType.TASK_ASSIGNED,
  NotificationType.TASK_UNASSIGNED,
  NotificationType.TASK_STATUS_CHANGED,
  NotificationType.TASK_PRIORITY_CHANGED,
  NotificationType.TASK_DUE_SOON,
  NotificationType.TASK_OVERDUE,
  NotificationType.TASK_COMMENTED,
  NotificationType.TASK_COMPLETED,
  NotificationType.MENTIONED,
];

/**
 * Notification type descriptions
 */
export const NOTIFICATION_TYPE_DESCRIPTIONS = {
  [NotificationType.TASK_ASSIGNED]: 'You were assigned to a task',
  [NotificationType.TASK_UNASSIGNED]: 'You were unassigned from a task',
  [NotificationType.TASK_STATUS_CHANGED]: 'Task status was updated',
  [NotificationType.TASK_PRIORITY_CHANGED]: 'Task priority was updated',
  [NotificationType.TASK_DUE_SOON]: 'Task due date is approaching',
  [NotificationType.TASK_OVERDUE]: 'Task is overdue',
  [NotificationType.TASK_COMMENTED]: 'New comment on task',
  [NotificationType.TASK_COMPLETED]: 'Task was completed',
  [NotificationType.MENTIONED]: 'You were mentioned',
};

/**
 * Notification priority for UI display
 * Higher number = more important
 */
export const NOTIFICATION_PRIORITY = {
  [NotificationType.TASK_OVERDUE]: 5,
  [NotificationType.TASK_ASSIGNED]: 4,
  [NotificationType.MENTIONED]: 4,
  [NotificationType.TASK_DUE_SOON]: 3,
  [NotificationType.TASK_STATUS_CHANGED]: 2,
  [NotificationType.TASK_PRIORITY_CHANGED]: 2,
  [NotificationType.TASK_COMPLETED]: 2,
  [NotificationType.TASK_COMMENTED]: 1,
  [NotificationType.TASK_UNASSIGNED]: 1,
};
