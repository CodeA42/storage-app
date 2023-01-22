import { DatabaseKeys } from 'src/@types/app.types';
import { DataSource } from 'typeorm';
import User from 'src/modules/user/entities/user.entity';

export const userRepositoryProvider = {
  provide: DatabaseKeys.USER_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  inject: [DatabaseKeys.DATA_SOURCE],
};
