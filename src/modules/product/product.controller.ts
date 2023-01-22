import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthenticationGuard } from "src/modules/authentication/guards/authentication.guard";
import { Authentication } from "src/modules/authentication/decorators/authentication.decorator";
import { authType } from "src/modules/authentication/types/authentication.types";
import Product from "./entities/product.entity";
import { CreateProductDto, ProductOrderBy } from "./types/product.types";
import { ProductService } from "./product.service";
import { DeleteResult } from "typeorm";
import { Pagination } from "nestjs-typeorm-paginate";
import { ProductOrderByPipe } from "./pipes/product-order-by.pipe";
import { SortOrder } from "src/utils/types";

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

  @Delete("/:id")
  @Authentication(authType.accessToken)
  async deleteProduct(
    @Param("id", ParseUUIDPipe) productId: string
  ): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }

  @Get("/:id")
  @Authentication(authType.accessToken)
  async getProduct(
    @Param("id", ParseUUIDPipe) productId: string
  ): Promise<Product> {
    return this.productService.getProduct(productId);
  }

  @Get("/products")
  @Authentication(authType.accessToken)
  async getProducts(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("orderBy", ProductOrderByPipe)
    orderBy: ProductOrderBy = ProductOrderBy.name,
    @Query("order") order: SortOrder = "ASC"
  ): Promise<Pagination<Product>> {
    return this.productService.getProducts({ page, limit }, orderBy, order);
  }
}
