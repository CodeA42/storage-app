import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BcryptModule } from "../bcrypt/bcrypt.module";
import { DatabaseModule } from "../db/database.module";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ConfigService, ProductService],
  exports: [ProductService],
})
export class UserModule {}
