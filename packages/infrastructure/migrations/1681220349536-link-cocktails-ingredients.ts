import { MigrationInterface, QueryRunner } from "typeorm";

export class linkCocktailsIngredients1681220349536 implements MigrationInterface {
    name = 'linkCocktailsIngredients1681220349536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cocktail_ingredients_ingredient" ("cocktailId" character varying NOT NULL, "ingredientId" character varying NOT NULL, CONSTRAINT "PK_d8276881ed216b50096dc2d9df1" PRIMARY KEY ("cocktailId", "ingredientId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_46462ac5eca498d49c61facc73" ON "cocktail_ingredients_ingredient" ("cocktailId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eca49f0bbf426623c7dd360fdf" ON "cocktail_ingredients_ingredient" ("ingredientId") `);
        await queryRunner.query(`ALTER TABLE "cocktail_ingredients_ingredient" ADD CONSTRAINT "FK_46462ac5eca498d49c61facc73a" FOREIGN KEY ("cocktailId") REFERENCES "cocktail"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cocktail_ingredients_ingredient" ADD CONSTRAINT "FK_eca49f0bbf426623c7dd360fdff" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cocktail_ingredients_ingredient" DROP CONSTRAINT "FK_eca49f0bbf426623c7dd360fdff"`);
        await queryRunner.query(`ALTER TABLE "cocktail_ingredients_ingredient" DROP CONSTRAINT "FK_46462ac5eca498d49c61facc73a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eca49f0bbf426623c7dd360fdf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46462ac5eca498d49c61facc73"`);
        await queryRunner.query(`DROP TABLE "cocktail_ingredients_ingredient"`);
    }

}
