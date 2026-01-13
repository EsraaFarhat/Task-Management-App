import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationType } from '../../../common/constants';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Notification Entity
 *
 * Table: notifications
 *
 * Relationships:
 * - Many notifications belong to one user (who receives the notification)
 * - Many notifications belong to one task (what the notification is about)
 *
 * Use Cases:
 * - Notify user when assigned to a task
 * - Alert user when task is overdue
 * - Inform user of status changes on their tasks
 * - Real-time updates via WebSocket
 *
 */

@Entity('notifications')
export class Notification {
  /**
   * Primary Key - UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Notification Type
   *
   * Categorizes what kind of event triggered this notification
   *
   */
  @Column({
    type: 'enum',
    enum: NotificationType,
    nullable: false,
  })
  type: NotificationType;

  @Column({ type: 'text', nullable: false })
  message: string;

  /**
   * Read Status
   *
   * Tracks whether the user has seen/read the notification
   * Default: false (unread when created)
   *
   */
  @Column({ default: false })
  isRead: boolean;

  /**
   * Read At Timestamp
   *
   * When the notification was marked as read
   * Null if not yet read
   *
   */
  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  /**
   * Action URL (optional)
   *
   * Deep link to the relevant page in the frontend
   *
   */
  @Column({ nullable: true })
  actionUrl?: string;

  /**
   * Metadata (optional)
   *
   * Additional structured data about the notification
   * Stored as JSON in PostgreSQL
   *
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  /**
   * ─────────────────────────────────────────────────────────────
   * RELATIONSHIPS
   * ─────────────────────────────────────────────────────────────
   */

  /**
   * User ID - Foreign key to user who receives this notification
   */
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  /**
   * User - Who receives this notification
   *
   * Many-to-One: Many notifications → One user
   *
   */
  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE', // Delete notifications when user is deleted
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Task ID - Foreign key to task this notification is about
   *
   * Optional: Some notifications might not be task-related
   *
   */
  @Column({ type: 'uuid', nullable: true })
  taskId?: string;

  /**
   * Task - What this notification is about
   *
   * Many-to-One: Many notifications → One task
   *
   */
  @ManyToOne(() => Task, (task) => task.notifications, {
    onDelete: 'CASCADE', // Delete notifications when task is deleted
    eager: false,
    nullable: true,
  })
  @JoinColumn({ name: 'taskId' })
  task?: Task;

  /**
   * ─────────────────────────────────────────────────────────────
   * HELPER METHODS
   * ─────────────────────────────────────────────────────────────
   */

  /**
   * Mark notification as read
   *
   * Sets isRead to true and records when it was read
   */
  markAsRead(): void {
    this.isRead = true;
    this.readAt = new Date();
  }

  /**
   * Mark notification as unread
   *
   * Sets isRead to false and clears readAt timestamp
   */
  markAsUnread(): void {
    this.isRead = false;
    this.readAt = null;
  }

  /**
   * Check if notification is recent (created within last 24 hours)
   *
   * @returns true if notification is less than 24 hours old
   */
  get isRecent(): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    return this.createdAt > oneDayAgo;
  }

  /**
   * Get notification age in hours
   *
   * @returns number of hours since notification was created
   */
  get ageInHours(): number {
    const now = new Date();
    const diffMs = now.getTime() - this.createdAt.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60));
  }

  /**
   * Get relative time string (e.g., "2 hours ago", "3 days ago")
   *
   * @returns human-readable time ago string
   */
  get timeAgo(): string {
    const hours = this.ageInHours;

    if (hours < 1) {
      return 'Just now';
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}
