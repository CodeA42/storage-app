import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/modules/authentication/guards/authentication.guard';
import { UserService } from 'src/modules/user/user.service';
import { Authentication } from 'src/modules/authentication/decorators/authentication.decorator';
import { User } from 'src/modules/user/decorators/user.decorator';
import { authType } from 'src/modules/authentication/types/authentication.types';
import { NewPasswordDto } from './types/user.dtos';
import {
  ApiChangePassword,
  ApiGetUser,
  ApiUserController,
} from './user.swagger';

@Controller('user')
@UseGuards(AuthenticationGuard)
@ApiUserController()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiGetUser()
  @Get('/:userId')
  @Authentication(authType.accessToken)
  getUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getUserWithoutPassword(userId);
  }

  @HttpCode(200)
  @ApiChangePassword()
  @Post('change-password')
  @Authentication(authType.accessToken)
  async changePassword(
    @User('id', ParseUUIDPipe) userId: string,
    @Body() password: NewPasswordDto,
  ) {
    return this.userService.changePassword(userId, password);
  }
}
