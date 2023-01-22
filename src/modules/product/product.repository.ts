import { Inject, Injectable } from "@nestjs/common";
import { DatabaseKeys } from "src/@types/app.types";
import { Repository } from "typeorm";
import Product from "./entities/product.entity";

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(
    @Inject(DatabaseKeys.USER_REPOSITORY) repository: Repository<Product>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
