import { MigrationInterface, QueryRunner } from "typeorm";

export class UMikrotik1775062366258 implements MigrationInterface {
    name = 'UMikrotik1775062366258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mikrotik\` ADD UNIQUE INDEX \`IDX_6c37b6e257811798e469c8d3f6\` (\`code\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mikrotik\` DROP INDEX \`IDX_6c37b6e257811798e469c8d3f6\``);
    }

}
