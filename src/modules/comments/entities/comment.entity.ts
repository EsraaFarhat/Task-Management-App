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
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Comment Entity
 *
 * Table: comments
 *
 * Relationships:
 * - Many comments belong to one task (what the comment is about)
 * - Many comments belong to one user (who wrote the comment)
 * - One comment can have many replies (self-referencing relationship)
 * - Many comments belong to one parent comment (for nested replies)
 *
 */

@Entity('comments')
export class Comment {
  /**
   * Primary Key - UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  /**
   * Mentions
   *
   * Array of user IDs mentioned in this comment (@mentions)
   * Stored as UUID array
   *
   */
  @Column({ type: 'uuid', array: true, default: [] })
  mentions: string[];

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
   * Task ID - Foreign key to task this comment belongs to
   */
  @Column({ type: 'uuid', nullable: false })
  taskId: string;

  /**
   * Task - The task this comment is on
   *
   * Many-to-One: Many comments → One task
   *
   */
  @ManyToOne(() => Task, (task) => task.comments, {
    onDelete: 'CASCADE', // Delete comments when task is deleted
    eager: false,
  })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  /**
   * User ID - Foreign key to user who wrote this comment
   */
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  /**
   * User - Who wrote this comment
   *
   * Many-to-One: Many comments → One user
   *
   */
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE', // Delete comments when user is deleted
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * ─────────────────────────────────────────────────────────────
   * NESTED COMMENTS (REPLIES)
   * ─────────────────────────────────────────────────────────────
   *
   * Self-referencing relationship for nested comments
   * Allows comments to have replies
   */

  /**
   * Parent Comment ID - Foreign key to parent comment (if this is a reply)
   *
   * Null for top-level comments
   * UUID for replies
   *
   */
  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  /**
   * Parent Comment - The comment this is replying to
   *
   * Many-to-One: Many replies → One parent comment
   *
   * Self-referencing relationship (Comment → Comment)
   *
   */
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE', // Delete replies when parent comment is deleted
    eager: false,
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent?: Comment;

  /**
   * Replies - Comments that are replies to this comment
   *
   * One-to-Many: One comment → Many replies
   *
   */
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  /**
   * ─────────────────────────────────────────────────────────────
   * HELPER METHODS
   * ─────────────────────────────────────────────────────────────
   */

  /**
   * Mark comment as edited
   *
   * Called when content is updated
   */
  markAsEdited(): void {
    this.isEdited = true;
  }

  /**
   * Soft delete comment
   *
   * Marks comment as deleted without removing from database
   *
   * @param clearContent - Whether to clear the content or keep it
   */
  softDelete(clearContent: boolean = true): void {
    this.isDeleted = true;
    this.deletedAt = new Date();

    if (clearContent) {
      this.content = '[deleted]';
    }
  }

  /**
   * Restore deleted comment
   *
   * Unmarks comment as deleted
   * Note: Original content must be preserved for this to work
   */
  restore(): void {
    this.isDeleted = false;
    this.deletedAt = null;
  }

  /**
   * Check if this is a top-level comment
   *
   * @returns true if no parent (top-level), false if reply
   */
  get isTopLevel(): boolean {
    return !this.parentId;
  }

  /**
   * Check if this is a reply
   *
   * @returns true if has parent, false if top-level
   */
  get isReply(): boolean {
    return !!this.parentId;
  }

  /**
   * Check if comment has been edited
   *
   * @returns true if updatedAt is different from createdAt
   */
  get wasEdited(): boolean {
    return (
      this.isEdited || this.updatedAt.getTime() !== this.createdAt.getTime()
    );
  }

  /**
   * Get time since comment was created
   *
   * @returns human-readable time ago string
   */
  get timeAgo(): string {
    const now = new Date();
    const diffMs = now.getTime() - this.createdAt.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  }

  /**
   * Extract @mentions from content
   *
   * @returns array of mentioned usernames
   */
  extractMentions(): string[] {
    const mentionRegex = /@(\w+)/g;
    const matches = this.content.matchAll(mentionRegex);
    return Array.from(matches, (match) => match[1]);
  }
}
