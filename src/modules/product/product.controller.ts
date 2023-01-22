import {
  Body,
  Controller,
  HttpCode,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AuthenticationGuard } from "src/modules/authentication/guards/authentication.guard";
import { Authentication } from "src/modules/authentication/decorators/authentication.decorator";
import { User } from "src/modules/user/decorators/user.decorator";
import { authType } from "src/modules/authentication/types/authentication.types";
import Product from "./entities/product.entity";
import { CreateProductDto } from "./types/product.types";
import { ProductService } from "./product.service";

@Controller("product")
@UseGuards(AuthenticationGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("/")
  @Authentication(authType.accessToken)
  createProduct(@Body() product: CreateProductDto): Promise<Product> {
    return this.productService.createProduct(product);
  }

  @HttpCode(200)
  @Put("/")
  @Authentication(authType.accessToken)
  async updateProduct(@Body() product: Partial<Product>): Promise<Product> {
    return this.productService.updateProduct(product);
  }

  @Put("/")
  @Authentication(authType.accessToken)
  async deleteProduct(@User("id", ParseUUIDPipe) productId: string) {
    return this.productService.deleteProduct(productId);
  }

  @Put("/")
  @Authentication(authType.accessToken)
  async getProduct(@User("id", ParseUUIDPipe) productId: string) {
    return this.productService.getProduct(productId);
  }
}
