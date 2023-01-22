import { Inject, Injectable } from '@nestjs/common';
import { DatabaseKeys } from 'src/@types/app.types';
import { Repository } from 'typeorm';
import User from './entities/user.entity';
import { UserNotFoundError } from './types/user.errors';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @Inject(DatabaseKeys.USER_REPOSITORY) repository: Repository<User>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByEmailOrFail(email: string): Promise<User | null> {
    const user: User = await this.findOne({
      where: {
        email,
      },
    });
    if (user) return user;
    throw new UserNotFoundError();
  }

  async findByUsernameOrFail(username: string): Promise<User | null> {
    const user: User = await this.findOne({
      where: {
        username,
      },
    });
    if (user) return user;
    throw new UserNotFoundError();
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user: User = await this.findOne({
      where: { id },
    });
    if (user) return user;
    throw new UserNotFoundError();
  }

  updateLogoutTime(userId: string) {
    return this.update({ id: userId }, { logout: Date.now().toString() });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    const user = await this.findByIdOrFail(userId);
    return await this.update(user.id, {
      password: hashedPassword,
    });
  }

  async insertUser(username: string, password: string, email: string) {
    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;

    return await this.save(user);
  }
}
