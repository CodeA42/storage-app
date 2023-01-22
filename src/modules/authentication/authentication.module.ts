import { Global, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { tokenProviders } from './entities/token.providers';
import { TokenService } from './token.service';
import { DatabaseModule } from '../db/database.module';

@Global()
@Module({
  imports: [BcryptModule, UserModule, ConfigModule, DatabaseModule],
  providers: [AuthenticationService, ...tokenProviders, TokenService],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, TokenService],
})
export class AuthenticationModule {}
