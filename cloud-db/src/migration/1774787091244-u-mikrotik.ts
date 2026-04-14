import { MigrationInterface, QueryRunner } from "typeorm";

export class UMikrotik1774787091244 implements MigrationInterface {
    name = 'UMikrotik1774787091244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mikrotik\` CHANGE \`status\` \`status\` tinyint NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`mikrotik\` CHANGE \`isActive\` \`isActive\` tinyint NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mikrotik\` CHANGE \`isActive\` \`isActive\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`mikrotik\` CHANGE \`status\` \`status\` tinyint NOT NULL DEFAULT '0'`);
    }

}
