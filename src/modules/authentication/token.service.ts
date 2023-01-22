import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decode, Secret, sign } from 'jsonwebtoken';
import { DatabaseKeys } from 'src/@types/app.types';
import { authentication } from 'src/config/types';
import { Repository } from 'typeorm';
import Token from './entities/token.entity';
import { TokenUserDto } from './types/authentication.dto';

@Injectable()
export class TokenService {
  constructor(
    @Inject(DatabaseKeys.TOKEN_REPOSITORY)
    private readonly tokensRepository: Repository<Token>,
    private readonly configService: ConfigService,
  ) {}

  getTokenExp(token: string): number {
    const decoded: any = decode(token);
    return decoded.exp;
  }

  generateToken(
    user: TokenUserDto,
    key: Secret,
    expiresIn: string = this.configService.get(
      authentication.accessTokenDuration,
    ),
  ): string {
    return sign({ user }, key, { expiresIn: expiresIn });
  }

  generateAccessToken(user: TokenUserDto): string {
    return this.generateToken(
      user,
      this.configService.get(authentication.accessTokenSecret),
      this.configService.get(authentication.accessTokenDuration),
    );
  }

  generateRefreshToken(user: TokenUserDto): string {
    return this.generateToken(
      user,
      this.configService.get(authentication.refreshTokenSecret),
      this.configService.get(authentication.refreshTokenDuration),
    );
  }

  async deleteToken(token: string) {
    //TODO: check if deleted and throw error if token is not found
    return await this.tokensRepository.delete({ token });
  }

  async insertToken(
    token: string,
    exp: number,
    username: string,
    userAgent: string,
    userId: string,
  ) {
    const tokenEntity = new Token();
    tokenEntity.token = token;
    tokenEntity.exp = exp;
    tokenEntity.username = username;
    tokenEntity.userAgent = userAgent;
    tokenEntity.userId = userId;

    await this.tokensRepository.save(tokenEntity);
  }

  deleteAllTokensFromUser(userId: string) {
    return this.tokensRepository.delete({ userId });
  }
}
