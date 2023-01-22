import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import GenericErrorFilter from './filters/generic.filter';
import { ConfigService } from '@nestjs/config';
import { server } from './config/types';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { authType } from './modules/authentication/types/authentication.types';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GenericErrorFilter(httpAdapter));

  setupDocumentation(app, configService);

  await app.listen(configService.get<number>(server.port) || 3000);
}

function setupDocumentation(
  app: INestApplication,
  configService: ConfigService<unknown, boolean>,
) {
  const config = new DocumentBuilder()
    .setTitle('Rent-a-car API')
    .setDescription('Coursework Aleksandar Velichkov F.N. 1901321002')
    .addServer(
      `${configService.get<string>(
        server.protocol,
      )}://${configService.get<string>(
        server.host,
      )}:${configService.get<number>(server.port)}`,
    )
    .addCookieAuth(
      authType.refreshToken,
      {
        description: 'Session key to regenerate access keys.',
        type: 'apiKey',
        in: 'Cookie',
        scheme: 'String',
      },
      authType.refreshToken,
    )
    .addBearerAuth(
      {
        type: 'apiKey',
        description: 'Session access key to identify user session.',
        name: 'accessToken',
        in: 'Authorization Header',
        bearerFormat: 'Bearer ${accessToken}',
      },
      authType.accessToken,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./swagger.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);
}

bootstrap();
