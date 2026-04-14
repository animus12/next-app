import { MigrationInterface, QueryRunner } from "typeorm";

export class UMikrotik1775062080829 implements MigrationInterface {
    name = 'UMikrotik1775062080829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mikrotik\` ADD \`code\` varchar(10) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mikrotik\` DROP COLUMN \`code\``);
    }

}
