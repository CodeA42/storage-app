import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/filters/dto';
import { SwaggerDoc } from 'src/swagger/swagger.options';
import { UserIdResponseDto } from '../user/types/user.dtos';
import { AccessTokenResponseDto } from './types/authentication.dto';
import { authType } from './types/authentication.types';

export function ApiAuthenticationController() {
  return applyDecorators(
    ApiTags('Authentication'),
    ApiInternalServerErrorResponse(SwaggerDoc.defaultException),
  );
}

export function ApiRegister() {
  return applyDecorators(
    ApiCreatedResponse({
      description: 'User was created sucessfully',
      type: UserIdResponseDto,
    }),
    ApiConflictResponse({
      description: 'When either the email or username exists',
      schema: {
        type: 'ExceptionDto',
        example: {
          statusCode: 409,
          message: 'Email exists',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'Password must be 8 characters long contain at least one letter and number.',
          ],
          error: 'Bad request',
        },
      },
    }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiCreatedResponse({
      description:
        'Login was successfull. Access and Refresh tokens are sent via json for the access and cookie for the refresh.',
      type: AccessTokenResponseDto,
      headers: {
        'Set-Cookie': {
          schema: {
            type: 'String',
            description: 'The refresh token needed to get new access tokens',
            example: 'refreshToken={Refresh token goes here}; Path=/; HttpOnly',
          },
          description: 'The refresh token needed to get new access tokens',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          statusCode: 400,
          message: ['password must not be empty'],
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'When username, email or password are wrong',
      schema: {
        type: 'ExceptionDto',
        example: {
          statusCode: 403,
          message: 'Wrong credentials',
        },
      },
    }),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiCookieAuth(authType.refreshToken),
    ApiCreatedResponse({
      description:
        "Returned when the refreshToken has valid signature and hasn't expired.",
      type: AccessTokenResponseDto,
    }),
    ApiUnauthorizedResponse({
      description:
        'Returned when the refresh token has either invalid signature or when it has expired or when there is no refreshToken cookie.',
      schema: {
        type: 'ExceptionDto',
        example: {
          statusCode: 401,
          message: 'Session expired',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Despite valid token signature the user data is invalid',
      schema: {
        example: {
          statusCode: 400,
          message: ['username must not be empty'],
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiCookieAuth(authType.refreshToken),
    ApiOkResponse({ description: 'User logged out successfully' }),
    ApiUnauthorizedResponse({
      description: 'The refresh token is invalid.',
      schema: {
        type: 'ExceptionDto',
        example: {
          statusCode: 401,
          message: 'Session expired',
        },
      },
    }),
  );
}

export function ApiLogoutAll() {
  return applyDecorators(
    ApiCookieAuth(authType.refreshToken),
    ApiOkResponse({ description: 'Logged out from all devices' }),
    ApiUnauthorizedResponse({
      description: 'The refresh token is invalisd',
      type: ExceptionDto,
    }),
  );
}
