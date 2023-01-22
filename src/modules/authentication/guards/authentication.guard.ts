import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { authentication } from 'src/config/types';
import { TokenService } from 'src/modules/authentication/token.service';
import { JwtPayload } from 'src/modules/authentication/types';
import { SessionExpiredError } from '../types/authentication.errors';
import { UserService } from 'src/modules/user/user.service';
import { MissingTokenError } from '../types/authentication.errors';
import { authType } from '../types/authentication.types';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticationType = this.reflector.get<string>(
      'authentication',
      context.getHandler(),
    );

    let isAuthenticated = false;

    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const isRefreshToken = authenticationType === authType.refreshToken;

    try {
      const [token, secret] = this.getTokenAndSecret(req, isRefreshToken);

      const decodedToken = verify(token, secret) as JwtPayload;

      if (!(await this.isValidToken(decodedToken))) {
        if (isRefreshToken) {
          await this.tokenService.deleteToken(token);
          res.clearCookie(authType.refreshToken);
        }
        throw new SessionExpiredError();
      }

      req.user = decodedToken.user;
      isAuthenticated = true;
    } catch (e) {
      if (e instanceof SessionExpiredError) {
        throw e;
      }
      if (e instanceof JsonWebTokenError) {
        throw new MissingTokenError();
      }
      throw e;
    }

    return isAuthenticated;
  }

  getTokenAndSecret(req: Request, isRefreshToken: boolean): [string, string] {
    if (isRefreshToken) {
      return this.extractRefreshTokenAndSecret(req);
    } else {
      return this.extractAccessTokenAndSecret(req);
    }
  }

  extractAccessTokenAndSecret(req: Request): [string, string] {
    const secret = this.getSecret(authentication.accessTokenSecret);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    return [token, secret];
  }

  extractRefreshTokenAndSecret(req: Request): [string, string] {
    const secret = this.getSecret(authentication.refreshTokenSecret);
    const token = req.cookies?.[authType.refreshToken];
    return [token, secret];
  }

  getSecret(secret: string): string {
    return this.configService.get<string>(secret);
  }

  async isValidToken(data: JwtPayload): Promise<boolean> {
    const user = await this.userService.findByUsernameOrFail(
      data.user.username,
    );
    const lastLogout = user.logout || 0;

    if (lastLogout > data.iat * 1000) {
      return false;
    }

    return data.exp >= Math.floor(Date.now() / 1000);
  }
}
