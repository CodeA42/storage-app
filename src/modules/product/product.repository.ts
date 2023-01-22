import { Inject, Injectable } from "@nestjs/common";
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from "nestjs-typeorm-paginate";
import { DatabaseKeys } from "src/@types/app.types";
import { SortOrder } from "src/utils/types";
import { Repository } from "typeorm";
import Product from "./entities/product.entity";
import { ProductNotFoundError } from "./types/product.errors";
import { ProductOrderBy } from "./types/product.types";

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

  paginate(
    paginationOptions: IPaginationOptions = { page: 0, limit: 10 },
    orderBy: ProductOrderBy = ProductOrderBy.name,
    order: SortOrder = "ASC"
  ): Promise<Pagination<Product>> {
    const query = this.createQueryBuilder("product").orderBy(orderBy, order);

    return paginate(query, paginationOptions);
  }
}
