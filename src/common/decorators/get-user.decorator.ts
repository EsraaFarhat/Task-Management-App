import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * GetUser Decorator
 *
 * Extracts the authenticated user from the request object.
 * This user is attached to the request by the JWT strategy after successful authentication.
 *
 **/

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // Get the request object from the execution context
    const request = ctx.switchToHttp().getRequest();

    // Extract the user from the request (attached by JWT strategy)
    const user = request.user;

    // If a specific property is requested, return only that property
    // Otherwise, return the entire user object
    return data ? user?.[data] : user;
  },
);
