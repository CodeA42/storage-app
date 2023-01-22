import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from "class-validator";

export enum ProductCategory {
  stationery = "stationery",
  groceries = "groceries",
  materials = "materials",
}

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  purchasePrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  salePrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  count: number;

  @ApiProperty()
  @IsNotEmpty()
  category: ProductCategory;
}

export enum ProductOrderBy {
  name = "product.name",
  purchasePrice = "product.purchasePrice",
  salePrice = "product.salePrice",
  count = "product.count",
  category = "product.category",
  updatedAt = "product.updatedAt",
  createAd = "product.createAd",
}
