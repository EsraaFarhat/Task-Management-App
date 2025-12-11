/**
 * WebSocket Event Names
 *
 * Centralizes all Socket.IO event names used for real-time communication.
 * Prevents typos and ensures consistency between client and server.
 *
 * Event Categories:
 * - Task Events: Real-time task updates
 * - Notification Events: User notifications
 * - Connection Events: Socket connection lifecycle
 *
 */

export enum SocketEvents {
  // Connection Events
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  ERROR = 'error',

  // Task Events - Broadcast to all connected clients
  TASK_CREATED = 'task:created',
  TASK_UPDATED = 'task:updated',
  TASK_DELETED = 'task:deleted',
  TASK_ASSIGNED = 'task:assigned',
  TASK_STATUS_CHANGED = 'task:status_changed',
  TASK_PRIORITY_CHANGED = 'task:priority_changed',

  // Notification Events - Sent to specific users
  NOTIFICATION_NEW = 'notification:new',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_DELETED = 'notification:deleted',

  // Comment Events
  COMMENT_ADDED = 'comment:added',
  COMMENT_UPDATED = 'comment:updated',
  COMMENT_DELETED = 'comment:deleted',

  // User Events
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
  USER_TYPING = 'user:typing',
}

/**
 * Event namespaces for organized Socket.IO rooms
 */
export const SocketNamespaces = {
  TASKS: '/tasks',
  NOTIFICATIONS: '/notifications',
  USERS: '/users',
};

/**
 * Room naming conventions
 * Used to organize WebSocket connections into logical groups
 */
export const SocketRooms = {
  /**
   * User-specific room (private notifications)
   * Format: user:{userId}
   */
  user: (userId: string) => `user:${userId}`,

  /**
   * Task-specific room (task updates)
   * Format: task:{taskId}
   */
  task: (taskId: string) => `task:${taskId}`,

  /**
   * Project-specific room (all tasks in a project)
   * Format: project:{projectId}
   */
  project: (projectId: string) => `project:${projectId}`,

  /**
   * Global room (broadcast to all users)
   */
  global: () => 'global',
};
