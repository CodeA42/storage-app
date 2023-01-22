import { DatabaseKeys } from 'src/@types/app.types';
import { DataSource } from 'typeorm';
import Token from 'src/modules/authentication/entities/token.entity';

export const tokenProviders = [
  {
    provide: DatabaseKeys.TOKEN_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Token),
    inject: [DatabaseKeys.DATA_SOURCE],
  },
];
