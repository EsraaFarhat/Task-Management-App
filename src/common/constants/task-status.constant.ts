/**
 * Task Status Constants
 *
 * Defines the lifecycle states of a task.
 * Tasks move through these states from creation to completion.
 *
 * Workflow:
 * TODO → IN_PROGRESS → IN_REVIEW → DONE
 *
 * Any status can also move to CANCELLED
 *
 */

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

/**
 * Array of all valid task statuses
 */

export const ALL_TASK_STATUSES = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
  TaskStatus.CANCELLED,
];

/**
 * Active status (task is not completed or cancelled)
 */
export const ACTIVE_TASK_STATUSES = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
];

/**
 * Completed status (task is finished)
 */
export const COMPLETED_TASK_STATUS = [TaskStatus.DONE, TaskStatus.CANCELLED];

/**
 * Status transition rules
 * Defines which statuses a task can transition to from its current status
 *
 */

export const STATUS_TRANSITIONS = {
  [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
  [TaskStatus.IN_PROGRESS]: [
    TaskStatus.IN_REVIEW,
    TaskStatus.TODO,
    TaskStatus.CANCELLED,
  ],
  [TaskStatus.IN_REVIEW]: [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.CANCELLED,
  ],
  [TaskStatus.DONE]: [], // Final state, cannot transition
  [TaskStatus.CANCELLED]: [], // Final state, cannot transition
};

/**
 * Status descriptions for documentation
 */
export const STATUS_DESCRIPTIONS = {
  [TaskStatus.TODO]: 'Task is created but not yet started',
  [TaskStatus.IN_PROGRESS]: 'Task is currently being worked on',
  [TaskStatus.IN_REVIEW]: 'Task is completed and under review',
  [TaskStatus.DONE]: 'Task is completed and approved',
  [TaskStatus.CANCELLED]: 'Task was cancelled and will not be completed',
};
