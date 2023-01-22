import { MigrationInterface, QueryRunner } from "typeorm";

export class addProductsTable1674389477277 implements MigrationInterface {
    name = 'addProductsTable1674389477277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(24) NOT NULL, "description" text, "image" text, "purchasePrice" numeric NOT NULL, "salePrice" numeric NOT NULL, "count" numeric NOT NULL, "category" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
