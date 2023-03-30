import { MigrationInterface, QueryRunner } from "typeorm";

export class cocktailsDecimalNote1680189346700 implements MigrationInterface {
    name = 'cocktailsDecimalNote1680189346700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cocktail" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "cocktail" ADD "note" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cocktail" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "cocktail" ADD "note" integer`);
    }

}
