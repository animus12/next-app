import { MigrationInterface, QueryRunner } from "typeorm";

export class UActiveRouter1775968005700 implements MigrationInterface {
    name = 'UActiveRouter1775968005700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`active_router\` ADD \`routerCode\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`active_router\` DROP COLUMN \`routerCode\``);
    }

}
