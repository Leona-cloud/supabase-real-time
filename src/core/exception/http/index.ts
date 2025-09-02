import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationException } from '@/core/pipe/error';
import { isProdEnvironment } from '@/config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    console.log(exception);

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    switch (true) {
      case exception instanceof ValidationException: {
        const exceptionResponse = exception.getResponse();
        const responseBody = {
          success: false,
          message: 'Failed Validation',
          errors: exceptionResponse,
          stack: isProdEnvironment ? undefined : exception.stack,
        };
        return httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
      }

      default: {
        const responseBody = {
          success: false,
          message:
            httpStatus === 500 ? 'Something went wrong' : exception.message,
          stack: isProdEnvironment ? undefined : exception.stack,
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
      }
    }
  }
}
