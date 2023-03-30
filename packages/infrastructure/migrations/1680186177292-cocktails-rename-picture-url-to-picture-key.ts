import { MigrationInterface, QueryRunner } from "typeorm";

export class cocktailsRenamePictureUrlToPictureKey1680186177292 implements MigrationInterface {
    name = 'cocktailsRenamePictureUrlToPictureKey1680186177292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cocktail" RENAME COLUMN "pictureUrl" TO "pictureKey"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cocktail" RENAME COLUMN "pictureKey" TO "pictureUrl"`);
    }

}
