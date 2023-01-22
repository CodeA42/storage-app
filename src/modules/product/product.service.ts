import { Injectable } from "@nestjs/common";
import { DeleteResult } from "typeorm";
import Product from "./entities/product.entity";
import { ProductRepository } from "./product.repository";
import { CreateProductDto } from "./types/product.types";

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  createProduct(product: CreateProductDto): Promise<Product> {
    return this.productRepository.save(product);
  }

  updateProduct(product: Partial<Product>): Promise<Product> {
    return this.productRepository.save(product);
  }

  getProduct(id: string): Promise<Product> {
    return this.productRepository.findByIdOrFail(id);
  }

  deleteProduct(id: string): Promise<DeleteResult> {
    return this.productRepository.delete(id);
  }

  getProducts(): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
}
