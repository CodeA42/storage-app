import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import GenericErrorFilter from './generic.filter';

@Catch()
export default class ConflictErrorFilter extends GenericErrorFilter {
  catch(err: any, host: ArgumentsHost) {
    const response = {
      statusCode: HttpStatus.CONFLICT,
      message: err.message,
    };

    super.catch(new HttpException(response, response.statusCode), host);
  }
}
