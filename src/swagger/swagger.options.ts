import { ApiResponseOptions } from '@nestjs/swagger';
export class SwaggerDoc {
  static defaultException: ApiResponseOptions = {
    description: 'Any oher error will throw the following.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
      },
    },
  };
  static unauthorizedResponse: ApiResponseOptions = {
    description:
      'Returned when the access token is invalid or the user has insufficient rights.',
    schema: {
      type: 'ExceptionDto',
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  };
  static missingJwtResponse: ApiResponseOptions = {
    description: 'No token no service',
    schema: {
      type: 'ExceptionDto',
      example: {
        statusCode: 400,
        message: 'Authentication token missing',
      },
    },
  };
}
