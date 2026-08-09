import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseException } from '../../database/database.errors';
import { ApiResponse } from '../interfaces/response.interface';
import { CustomLoggerService } from '../../logging/logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const requestId = (request as any).id as string;
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = null;

    require('fs').appendFileSync('error_log.txt', `\n--- Exception caught ---\n${exception instanceof Error ? exception.stack : JSON.stringify(exception)}\n--------------------\n`);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;
      
      message = exceptionResponse.message || exception.message;
      if (Array.isArray(exceptionResponse.message)) {
        message = 'Validation failed';
        details = exceptionResponse.message;
      }
    } else if (exception instanceof DatabaseException) {
      status = HttpStatus.BAD_REQUEST; 
      message = exception.message;
      details = (exception as any).originalError?.detail || null;
      this.logger.error(`Database Exception: ${exception.message}`, (exception as Error).stack);
      require('fs').appendFileSync('error_log.txt', `Database Exception: ${exception.message} \n ${(exception as Error).stack}\n\n`);
    } else if (exception instanceof Error) {
      // Don't leak message in production unless needed, but for now we send it
      message = exception.message;
      this.logger.error(`Unhandled Exception: ${exception.message}`, exception.stack);
      require('fs').appendFileSync('error_log.txt', `Unhandled Exception: ${exception.message} \n ${exception.stack}\n\n`);
    }

    const errorResponse: ApiResponse<null> = {
      success: false,
      timestamp: new Date().toISOString(),
      requestId,
      error: {
        code: status,
        message,
        details,
      },
    };

    response.status(status).json(errorResponse);
  }
}
