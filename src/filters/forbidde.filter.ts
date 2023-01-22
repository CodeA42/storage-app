import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import GenericErrorFilter from './generic.filter';

@Catch()
export default class ForbiddenErrorFilter extends GenericErrorFilter {
  catch(err: any, host: ArgumentsHost) {
    const response = {
      statusCode: HttpStatus.FORBIDDEN,
      message: err.message,
    };

    super.catch(new HttpException(response, response.statusCode), host);
  }
}
