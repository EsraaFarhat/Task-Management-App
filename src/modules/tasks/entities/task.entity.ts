import { Notification } from 'src/modules/notifications/entities/notification.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskPriority, TaskStatus } from '../../../common/constants';
import { User } from '../../users/entities/user.entity';

/**
 * Task Entity
 *
 * Table: tasks
 *
 * Relationships:
 * - Many tasks belong to one creator (User) - who created the task
 * - Many tasks belong to one assignee (User) - who is responsible for the task
 * - One task can have many comments (one-to-many)
 * - One task can have many notifications (one-to-many)
 *
 * Status Workflow:
 * TODO → IN_PROGRESS → IN_REVIEW → DONE
 * (Any status can transition to CANCELLED)
 */

@Entity('tasks')
export class Task {
  /**
   * Primary Key - UUID
   *
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Task Status
   *
   * Current state of the task in the workflow
   * Default: TODO (new tasks start as not started)
   *
   * Possible values: TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED
   */
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  /**
   * Task Priority
   *
   * Urgency/importance level of the task
   * Default: MEDIUM (most tasks are medium priority)
   *
   * Possible values: LOW, MEDIUM, HIGH, URGENT
   *
   */
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  /**
   * Due Date
   *
   * Deadline for completing the task
   * Optional - not all tasks have deadlines
   *
   */
  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  /**
   * Estimated Hours
   *
   * How long the task is expected to take (in hours)
   * Optional field for project planning
   *
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  estimatedHours?: number;

  /**
   * Actual Hours
   *
   * How long the task actually took (in hours)
   * Optional - filled in when task is completed
   *
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  actualHours?: number;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * ─────────────────────────────────────────────────────────────
   * RELATIONSHIPS
   * ─────────────────────────────────────────────────────────────
   */

  /**
   * Creator ID - Foreign key to User who created this task
   *
   * Required: Every task must have a creator.
   */
  @Column({ type: 'uuid', nullable: false })
  creatorId: string;

  /**
   * Creator - User who created this task
   *
   * Many-to-One relationship: Many tasks → One user
   *
   * @ManyToOne: Defines the relationship type
   * () => User: The related entity (User)
   * (user) => user.createdTasks: How User relates back to Task
   *
   * @JoinColumn: Specifies which column is the foreign key
   * name: 'creatorId': The column name in the database
   *
   */
  @ManyToOne(() => User, (user) => user.createdTasks, {
    onDelete: 'CASCADE', // If creator is deleted, delete their tasks
    eager: false, // Don't automatically load creator (load manually when needed)
  })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  /**
   * Assignee ID - Foreign key to User assigned to this task
   *
   * Optional: Tasks can be unassigned (null)
   */
  @Column({ type: 'uuid', nullable: true })
  assigneeId?: string;

  /**
   * Assignee - User assigned to complete this task
   *
   * Many-to-One relationship: Many tasks → One user
   *
   * Nullable: A task can be unassigned (assignee = null)
   *
   */
  @ManyToOne(() => User, (user) => user.assignedTasks, {
    onDelete: 'SET NULL', // If assignee is deleted, unassign the task (don't delete task)
    eager: false,
    nullable: true,
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee?: User;

  /**
   * Notifications related to this task
   *
   * One-to-Many relationship: One task → Many notifications
   *
   * We'll uncomment this when we create the Notification entity
   */
  @OneToMany(() => Notification, (notification) => notification.task)
  notifications: Notification[];

  /**
   * ─────────────────────────────────────────────────────────────
   * HELPER METHODS
   * ─────────────────────────────────────────────────────────────
   */

  /**
   * Check if task is overdue
   *
   * A task is overdue if:
   * 1. It has a due date
   * 2. The due date is in the past
   * 3. The task is not completed (status !== DONE)
   *
   * @returns true if task is overdue, false otherwise
   */
  get isOverdue(): boolean {
    if (!this.dueDate || this.status === TaskStatus.DONE) {
      return false;
    }
    return new Date() > new Date(this.dueDate);
  }

  /**
   * Check if task is assigned
   *
   * @returns true if task has an assignee, false otherwise
   */
  get isAssigned(): boolean {
    return !!this.assigneeId;
  }

  /**
   * Check if task is completed
   *
   * @returns true if status is DONE, false otherwise
   */
  get isCompleted(): boolean {
    return this.status === TaskStatus.DONE;
  }

  /**
   * Get days until due date
   *
   * @returns number of days until due date (negative if overdue)
   *          null if no due date
   */
  get daysUntilDue(): number | null {
    if (!this.dueDate) {
      return null;
    }

    const now = new Date();
    const due = new Date(this.dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}
