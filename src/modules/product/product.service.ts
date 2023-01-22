import { Injectable } from "@nestjs/common";
import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { SortOrder } from "src/utils/types";
import { DeleteResult } from "typeorm";
import Product from "./entities/product.entity";
import { ProductRepository } from "./product.repository";
import { CreateProductDto, ProductOrderBy } from "./types/product.types";

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

  getProducts(
    paginationOptions: IPaginationOptions = { page: 1, limit: 10 },
    orderBy: ProductOrderBy = ProductOrderBy.name,
    order: SortOrder = "ASC"
  ): Promise<Pagination<Product>> {
    return this.productRepository.paginate(paginationOptions, orderBy, order);
  }
}
