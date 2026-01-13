import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../../../common/constants';
import { Comment } from '../../../modules/comments/entities/comment.entity';
import { Notification } from '../../../modules/notifications/entities/notification.entity';
import { Task } from '../../../modules/tasks/entities/task.entity';

/**
 * User Entity
 *
 * Table: users
 *
 * Relationships:
 * - One user can create many tasks (one-to-many)
 * - One user can be assigned to many tasks (one-to-many)
 * - One user can create many comments (one-to-many)
 * - One user can receive many notifications (one-to-many)
 *
 * Security:
 * - Password is hashed before saving (BeforeInsert/BeforeUpdate hooks)
 * - Password is excluded from JSON responses (@Exclude decorator)
 * - Email is unique (prevents duplicate accounts)
 *
 */

@Entity('users')
export class User {
  /**
   * Primary Key - UUID
   *
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Email - Unique identifier for login
   *
   * Constraints:
   * - Unique: No two users can have the same email
   * - Not nullable: Email is required
   * - Indexed: Fast lookups during login
   */
  @Column({ unique: true, nullable: false })
  email: string;

  /**
   * Password - Hashed password
   *
   * This field stores the HASHED password, not plain text.
   * - Hashed with bcrypt before saving
   * - Excluded from JSON responses
   * - Never send to the client
   *
   * Security:
   * - Minimum 8 characters (enforced in DTO)
   * - Must contain uppercase, lowercase, number, special char (enforced in DTO)
   */
  @Column({ nullable: false })
  @Exclude() // Never include password in API responses
  password: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  /**
   * User Role - For authorization
   *
   * Possible values: ADMIN, MANAGER, MEMBER
   * Default: MEMBER (least privileged)
   *
   * Used by RolesGuard to check permissions
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  /**
   * Account Status
   *
   * Allows admins to deactivate users without deleting their data.
   * Inactive users cannot log in.
   */
  @Column({ default: true })
  isActive: boolean;

  /**
   * Profile Picture URL (optional)
   *
   * Stores URL to user's profile picture (uploaded to S3/Cloudinary)
   * Nullable: Not all users have profile pictures
   */
  @Column({ nullable: true })
  avatarUrl?: string;

  /**
   * Created At - Timestamp when user was created
   *
   * Automatically set by TypeORM when entity is first saved
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Updated At - Timestamp when user was last updated
   *
   * Automatically updated by TypeORM when entity is modified
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * ─────────────────────────────────────────────────────────────
   * RELATIONSHIPS
   * ─────────────────────────────────────────────────────────────
   *
   */

  /**
   * Tasks created by this user
   *
   * One user can create many tasks
   * Relationship: User (1) ←→ (Many) Tasks
   *
   * Foreign key: task.creatorId references user.id
   */
  @OneToMany(() => Task, (task) => task.creator)
  createdTasks: Task[];

  /**
   * Tasks assigned to this user
   *
   * One user can be assigned to many tasks
   * Relationship: User (1) ←→ (Many) Tasks
   *
   * Foreign key: task.assigneeId references user.id
   */
  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  /**
   * Comments created by this user
   *
   * One user can create many comments
   * Relationship: User (1) ←→ (Many) Comments
   */
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  /**
   * Notifications received by this user
   *
   * One user can receive many notifications
   * Relationship: User (1) ←→ (Many) Notifications
   */
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  /**
   * ─────────────────────────────────────────────────────────────
   * LIFECYCLE HOOKS
   * ─────────────────────────────────────────────────────────────
   */

  /**
   * Before Insert Hook
   *
   * Runs automatically before a new user is saved to the database.
   * Used to hash the password before storing it.
   *
   */
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      const bcrypt = await import('bcrypt');
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  /**
   * Before Update Hook
   *
   * Runs automatically before an existing user is updated.
   * Hashes the password ONLY if it was changed.
   *
   */
  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    // Only hash if password was actually changed
    if (this.password && !this.password.startsWith('$2b$')) {
      //! $2b$ is the bcrypt hash prefix
      const bcrypt = await import('bcrypt');
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  /**
   * ─────────────────────────────────────────────────────────────
   * HELPER METHODS
   * ─────────────────────────────────────────────────────────────
   */

  /**
   * Get full name
   *
   * Convenience method to get user's full name
   * Not stored in database, computed on the fly
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Validate password
   *
   * Compares a plain text password with the hashed password.
   * Used during login to verify credentials.
   *
   * @param plainPassword - The password to validate
   * @returns true if password matches, false otherwise
   */
  async validatePassword(plainPassword: string): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    return bcrypt.compare(plainPassword, this.password);
  }
}
