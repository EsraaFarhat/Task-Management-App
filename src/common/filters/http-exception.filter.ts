import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

/**
 * HTTP Exception Filter
 *
 * Catches all HTTP exceptions and formats them into a consistent response structure.
 * This ensures all errors follow the same format across the entire API.
 *
 **/
@Catch(HttpException) //Catches all HTTP exceptions
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  /**
   * Catches and handles HTTP exceptions
   *
   * @param exception - The HTTP exception that was thrown
   * @param host - ArgumentsHost provides access to request/response objects
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    // Get the HTTP context (request and response objects)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Get the status code from the exception
    const status = exception.getStatus();

    // Get the exception response
    const exceptionResponse = exception.getResponse();

    // Extract error message
    // NestJS validation errors return { message: string[], error: string, statusCode: number }
    // Manual throws return { message: string, statusCode: number }
    let message: string | string[];
    let errors: string[] | undefined;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;

      // If it's a validation error with an array of messages
      if (Array.isArray(responseObj.message)) {
        message = 'Validation failed';
        errors = responseObj.message;
      } else {
        // Single message error
        message = responseObj.message || exception.message;
      }
    } else {
      // Fallback to exception message
      message = exception.message;
    }

    // Build standardized error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(errors && { errors }), // Only include errors array if it exists
    };

    // Log the error for debugging
    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${
        Array.isArray(message) ? message.join(', ') : message
      }`,
    );

    // Send the formatted error response
    response.status(status).json(errorResponse);
  }
}
