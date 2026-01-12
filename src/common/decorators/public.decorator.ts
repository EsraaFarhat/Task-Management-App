import { SetMetadata } from '@nestjs/common';

/**
 * Public Decorator
 *
 * Marks a route as public (accessible without authentication).
 * By default, all routes will require authentication via JWT Guard.
 * Use this decorator to make specific routes public.
 *
 */

// Metadata key used to mark routes as public
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public decorator function
 * @returns Decorator that marks the route as public
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
