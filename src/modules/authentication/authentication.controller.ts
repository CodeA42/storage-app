import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  ParseUUIDPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/modules/authentication/guards/authentication.guard';
import {
  AccessTokenResponseDto,
  LoginAuthDto,
  TokenUserDto,
  UserAuthDto,
} from './types/authentication.dto';
import { authType } from './types/authentication.types';
import { UserIdResponseDto } from 'src/modules/user/types/user.dtos';
import { Authentication } from './decorators/authentication.decorator';
import { Cookies } from './decorators/cookies.decorator';
import {
  ApiAuthenticationController,
  ApiLogin,
  ApiLogout,
  ApiLogoutAll,
  ApiRefresh,
  ApiRegister,
} from './authentication.swagger';
import { User } from '../user/decorators/user.decorator';

@Controller('')
@ApiAuthenticationController()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/register')
  @ApiRegister()
  register(@Body() userAuthDto: UserAuthDto): Promise<UserIdResponseDto> {
    return this.authenticationService.register(userAuthDto);
  }

  @ApiLogin()
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Headers('user-agent') userAgent,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenResponseDto> {
    const [accessToken, refreshToken] = await this.authenticationService.login(
      loginAuthDto,
      userAgent,
    );
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @ApiRefresh()
  @HttpCode(201)
  @Get('refresh')
  @Authentication(authType.refreshToken)
  @UseGuards(AuthenticationGuard)
  refresh(@User() user: TokenUserDto): AccessTokenResponseDto {
    return this.authenticationService.refresh(user);
  }

  @ApiLogout()
  @Get('logout')
  @Authentication(authType.refreshToken)
  @UseGuards(AuthenticationGuard)
  async logout(
    @Cookies(authType.refreshToken) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.clearCookie(authType.refreshToken);
    this.authenticationService.logout(refreshToken);
  }

  @Get('logout-all')
  @ApiLogoutAll()
  @Authentication(authType.refreshToken)
  @UseGuards(AuthenticationGuard)
  async logoutAll(
    @User('id', ParseUUIDPipe) userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.clearCookie(authType.refreshToken);
    this.authenticationService.logoutAll(userId);
  }
}
