import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";
import { ProductOrderBy } from "../types/product.types";

@Injectable()
export class ProductOrderByPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, _metadata: ArgumentMetadata) {
    // Gets string value from SortByField enum
    return ProductOrderBy[value as keyof typeof ProductOrderBy];
  }
}
