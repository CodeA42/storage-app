import { Inject, Injectable } from "@nestjs/common";
import { DatabaseKeys } from "src/@types/app.types";
import { Repository } from "typeorm";
import Product from "./entities/product.entity";
import { ProductNotFoundError } from "./types/product.errors";

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(
    @Inject(DatabaseKeys.USER_REPOSITORY) repository: Repository<Product>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findByIdOrFail(id: string): Promise<Product> {
    const product: Product = await this.findOne({
      where: { id },
    });
    if (product) return product;
    throw new ProductNotFoundError();
  }
}
