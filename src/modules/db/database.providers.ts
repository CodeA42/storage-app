import { join } from "path";
import { getEnvFilePath } from "src/config/envFilePath";
import { database } from "src/config/types";
import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { DatabaseKeys } from "src/@types/app.types";
import User from "../user/entities/user.entity";
import Token from "../authentication/entities/token.entity";
import Product from "../product/entities/product.entity";

let dataSourceOptions: DataSourceOptions;

export const databaseProviders = [
  {
    provide: DatabaseKeys.DATA_SOURCE,
    imports: [],
    useFactory: async () => {
      const dataSource = getDataSource(false);

      return dataSource.initialize();
    },
    inject: [],
  },
];

export function getDataSource(isCli: boolean): DataSource {
  dotenv.config({ path: getEnvFilePath() });
  const migrationsLocation = isCli
    ? "src/modules/db/migrations/*.ts"
    : join(__dirname, "modules", "db", "migrations", "*.ts");

  dataSourceOptions = {
    type: "postgres",
    host: process.env[database.host],
    port: +process.env[database.port],
    username: process.env[database.username],
    password: process.env[database.password],
    database: process.env[database.name],
    entities: [User, Token, Product],
    migrations: [migrationsLocation],
  };

  return new DataSource(dataSourceOptions);
}

export const OrmConfig = getDataSource(true);
