import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { DatabaseModule } from '../db/database.module';
import { userRepositoryProvider } from './entities/user.providers';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [DatabaseModule, BcryptModule],
  controllers: [UserController],
  providers: [
    ConfigService,
    UserService,
    userRepositoryProvider,
    UserRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
