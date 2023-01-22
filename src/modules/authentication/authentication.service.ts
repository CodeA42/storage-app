import { Inject, Injectable } from '@nestjs/common';
import User from 'src/modules/user/entities/user.entity';
import {
  AccessTokenResponseDto,
  LoginAuthDto,
  TokenUserDto,
  UserAuthDto,
} from 'src/modules/authentication/types/authentication.dto';
import {
  EmailExistsError,
  UsernameExistsError,
  WrongCredentialsError,
} from 'src/modules/authentication/types/authentication.errors';
import { UserNotFoundError } from 'src/modules/user/types/user.errors';
import { TokenService } from 'src/modules/authentication/token.service';
import { BcryptService } from 'src/modules/bcrypt/bcrypt.service';
import { UserService } from '../user/user.service';

Injectable();
export class AuthenticationService {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(UserService)
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  async register(userAuthDto: UserAuthDto): Promise<{ id: string }> {
    try {
      await this.userService.findByEmailOrFail(userAuthDto.email);
      throw new EmailExistsError();
    } catch (e) {
      if (e instanceof UserNotFoundError) {
      } else if (e instanceof EmailExistsError) {
        throw e;
      } else {
        throw e;
      }
    }

    try {
      await this.userService.findByUsernameOrFail(userAuthDto.username);
      throw new UsernameExistsError();
    } catch (e) {
      if (e instanceof UserNotFoundError) {
      } else if (e instanceof UsernameExistsError) {
        throw e;
      } else {
        throw e;
      }
    }

    const user: User = await this.hashPaswordAndInsertUser(userAuthDto);
    return { id: user.id };
  }

  async login(
    loginAuthDto: LoginAuthDto,
    userAgent: string,
  ): Promise<[accessToken: string, refreshToken: string]> {
    let user: User;
    try {
      if (loginAuthDto.email) {
        user = await this.userService.findByEmailOrFail(loginAuthDto.email);
      }
      if (loginAuthDto.username) {
        user = await this.userService.findByUsernameOrFail(
          loginAuthDto.username,
        );
      }
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw new WrongCredentialsError();
      }
      throw e;
    }

    const tokenData: TokenUserDto = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    if (
      await this.bcryptService.comparePasswords(
        loginAuthDto.password,
        user.password,
      )
    ) {
      const accessToken: string =
        this.tokenService.generateAccessToken(tokenData);

      const refreshToken: string =
        this.tokenService.generateRefreshToken(tokenData);

      const exp: number = this.tokenService.getTokenExp(refreshToken);
      await this.tokenService.insertToken(
        refreshToken,
        exp,
        user.username,
        userAgent,
        user.id,
      );

      return [accessToken, refreshToken];
    }
    throw new WrongCredentialsError();
  }

  refresh(user: TokenUserDto): AccessTokenResponseDto {
    const accessTokenDto = new AccessTokenResponseDto();
    accessTokenDto.accessToken = this.tokenService.generateAccessToken(user);
    return accessTokenDto;
  }

  async logout(token: string): Promise<void> {
    await this.tokenService.deleteToken(token);
    return;
  }

  async hashPaswordAndInsertUser(userAuthDto: UserAuthDto): Promise<User> {
    const hashedPassword = await this.bcryptService.hashPassword(
      userAuthDto.password,
    );

    return await this.userService.insertUser(
      userAuthDto.username,
      hashedPassword,
      userAuthDto.email,
    );
  }

  async logoutAll(userId: string) {
    await this.tokenService.deleteAllTokensFromUser(userId);
    await this.userService.updateLogoutTime(userId);
  }
}
