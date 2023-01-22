import { Injectable } from '@nestjs/common';
import User from 'src/modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { WrongCredentialsError } from '../authentication/types/authentication.errors';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { UserRepository } from './user.repository';
import { NewPasswordDto } from './types/user.dtos';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  async getUserWithoutPassword(id: string): Promise<User> {
    const user: User = await this.userRepository.findByIdOrFail(id);
    delete user.password;
    return user;
  }

  async changePassword(
    userId: string,
    password: NewPasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findByIdOrFail(userId);
    if (await bcrypt.compare(password.oldPassword, user.password)) {
      const hashedPassword = await this.bcryptService.hashPassword(
        password.newPassword,
      );

      await this.userRepository.updatePassword(userId, hashedPassword);
    } else {
      throw new WrongCredentialsError();
    }
  }

  findByIdOrFail(userId: string) {
    return this.userRepository.findByIdOrFail(userId);
  }

  findByUsernameOrFail(username: string) {
    return this.userRepository.findByUsernameOrFail(username);
  }

  findByEmailOrFail(email: string) {
    return this.userRepository.findByEmailOrFail(email);
  }

  insertUser(username: string, password: string, email: string) {
    return this.userRepository.insertUser(username, password, email);
  }

  updateLogoutTime(userId: string) {
    return this.userRepository.updateLogoutTime(userId);
  }
}
