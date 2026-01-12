import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging Interceptor
 * 
 * Logs all incoming HTTP requests and outgoing responses.
 
 * Logs:
 * - Request: Method, URL, timestamp
 * - Response: Status code, execution time
 */

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Intercepts HTTP requests and logs them
   *
   * @param context - Execution context containing request metadata
   * @param next - CallHandler to invoke the route handler
   * @returns Observable that completes after route handler
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Record the start time
    const now = Date.now();

    // Log the incoming request
    this.logger.log(`${method} ${url}...`);

    // Call next.handle() to execute to the route handler
    // then() executes after the route handler completes
    return next.handle().pipe(
      tap({
        // On successful response
        next: () => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const executionTime = Date.now() - now;

          this.logger.log(
            `${method} ${url} - Status: ${statusCode} - ${executionTime}ms`,
          );
        },
        // On error response
        error: (error) => {
          const executionTime = Date.now() - now;
          this.logger.error(
            `${method} ${url} - Error: ${error.message} - ${executionTime}ms`,
          );
        },
      }),
    );
  }
}
