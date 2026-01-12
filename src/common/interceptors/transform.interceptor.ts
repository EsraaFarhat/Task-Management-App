/**
 * Response Transformation Interceptor
 *
 * Wraps all successful responses in a consistent format.
 * This ensures all API responses have the same structure.
 *
 *  This only affects successful responses (2xx status codes)
 * Errors are handled by HttpExceptionFilter
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  /**
   * Intercepts and transforms the response
   *
   * @param context - Execution context
   * @param next - CallHandler to invoke route handler
   * @returns Observable with transformed response
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();

    // Execute the route handler and transform its return value
    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message: 'Success',
        data,
      })),
    );
  }
}
