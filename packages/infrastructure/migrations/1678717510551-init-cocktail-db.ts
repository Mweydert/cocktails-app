import { MigrationInterface, QueryRunner } from "typeorm";

export class initCocktailDb1678717510551 implements MigrationInterface {
    name = 'initCocktailDb1678717510551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cocktail" ("id" character varying NOT NULL, "name" character varying NOT NULL, "note" integer NOT NULL, CONSTRAINT "PK_2640ba026b49f47c99d3a3219c2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cocktail"`);
    }

}
