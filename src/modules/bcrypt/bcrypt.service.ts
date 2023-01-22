import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, genSalt, hash } from 'bcrypt';
import { authentication } from 'src/config/types';

@Injectable()
export class BcryptService {
  constructor(private readonly configService: ConfigService) {}

  async comparePasswords(
    candidatePassword: string,
    password: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      compare(candidatePassword, password, (err: Error, match: boolean) =>
        err ? reject(err) : resolve(match),
      );
    });
  }

  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = +this.configService.get<string>(authentication.saltRounds);
      genSalt(salt, (err: Error, salt: any) => {
        if (err) return reject(err);
        hash(password, salt, (err: Error, hash: string) =>
          err ? reject(err) : resolve(hash),
        );
      });
    });
  }
}
