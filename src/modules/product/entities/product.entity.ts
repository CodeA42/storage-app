import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ProductCategory } from "../types/product.types";

@Entity()
export default class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty()
  @Column({
    length: 24,
    unique: true,
  })
  name: string;

  @ApiProperty()
  @Column({
    type: "text",
    nullable: true,
  })
  description?: string;

  @ApiProperty()
  @Column({
    type: "text",
    nullable: true,
  })
  image?: string;

  @ApiProperty()
  @Column({
    type: "numeric",
  })
  purchasePrice: number;

  @ApiProperty()
  @Column({
    type: "numeric",
  })
  salePrice: number;

  @ApiProperty()
  @Column({
    type: "numeric",
  })
  count: number;

  @ApiProperty()
  @Column({
    type: "text",
  })
  category: ProductCategory;
}
