import { Injectable } from "@nestjs/common";
import Product from "./entities/product.entity";
import { ProductRepository } from "./product.repository";
import { CreateProductDto } from "./types/product.types";

@Injectable()
export class ProductService {
  constructor(private readonly userRepository: ProductRepository) {}

  createProduct(product: CreateProductDto): Promise<Product> {
    throw new Error("Method not implemented.");
  }

  updateProduct(product: Partial<Product>): Promise<Product> {
    throw new Error("Method not implemented.");
  }

  getProduct(id: string): Promise<Product> {
    throw new Error("Method not implemented.");
  }

  deleteProduct(id: string): Promise<Product> {
    throw new Error("Method not implemented.");
  }

  getProducts(): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
}
