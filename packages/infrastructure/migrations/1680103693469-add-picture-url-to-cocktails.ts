import { MigrationInterface, QueryRunner } from "typeorm";

export class addPictureUrlToCocktails1680103693469 implements MigrationInterface {
    name = 'addPictureUrlToCocktails1680103693469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cocktail" ADD "pictureUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cocktail" DROP COLUMN "pictureUrl"`);
    }

}
