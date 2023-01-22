import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export default class GenericErrorFilter implements ExceptionFilter {
  constructor(protected readonly httpAdapterHost: HttpAdapterHost) {}

  private readonly logger = new Logger('ErrorFilter');

  catch(err: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = err?.status || HttpStatus.INTERNAL_SERVER_ERROR;

    const response = err?.status
      ? err.getResponse()
      : this.internalServerError(err);

    httpAdapter.reply(ctx.getResponse(), response, httpStatus);
  }

  internalServerError(err: any) {
    this.logger.error(err);

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }
}
