import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { authType } from 'src/modules/authentication/types/authentication.types';
import { SwaggerDoc } from 'src/swagger/swagger.options';

export function ApiUserController() {
  return applyDecorators(
    ApiUnauthorizedResponse(SwaggerDoc.unauthorizedResponse),
    ApiInternalServerErrorResponse(SwaggerDoc.defaultException),
    ApiBearerAuth(authType.accessToken),
    ApiTags('User'),
  );
}

export function ApiGetUser() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Returns user data without password',
      schema: {
        example: {
          id: 'd72d96b9-34aa-456d-8289-cc135b1db8ac',
          username: 'mark',
          email: 'oh@hi.com',
          avatar: '9dc85a45-3fc3-4f0f-ae0e-9883b2156e7c.jpeg',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'User ID was was not in the correct format',
      schema: {
        example: {
          statusCode: 400,
          message: 'Validation failed (uuid  is expected)',
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'User not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'User not found',
        },
      },
    }),
  );
}

export function ApiChangePassword() {
  return applyDecorators(
    ApiOkResponse({ description: 'Password changed successfully' }),
    ApiForbiddenResponse({ description: 'Wrong password' }),
    ApiBearerAuth(authType.accessToken),
  );
}
