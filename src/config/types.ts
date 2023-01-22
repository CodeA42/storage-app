export enum database {
  type = 'DATABASE_TYPE',
  host = 'DATABASE_HOST',
  port = 'DATABASE_PORT',
  username = 'DATABASE_USERNAME',
  password = 'DATABASE_PASSWORD',
  name = 'DATABASE_NAME',
}

export enum server {
  port = 'SERVER_PORT',
  protocol = 'SERVER_PROTOCOL',
  host = 'SERVER_HOST',
}

export enum authentication {
  accessTokenSecret = 'ACCESS_TOKEN_SECRET',
  refreshTokenSecret = 'REFRESH_TOKEN_SECRET',
  accessTokenDuration = 'ACCESS_TOKEN_DURATION',
  refreshTokenDuration = 'REFRESH_TOKEN_DURATION',
  saltRounds = 'SALT_ROUNDS',
}
