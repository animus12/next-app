import { MigrationInterface, QueryRunner } from "typeorm";

export class AAdminUserTable1768144841819 implements MigrationInterface {
    name = 'AAdminUserTable1768144841819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`admin_user\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`username\` varchar(50) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(50) NOT NULL, \`middleName\` varchar(50) NULL, \`lastName\` varchar(50) NOT NULL, \`role\` varchar(50) NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4d0392574f49340bb75a102b04\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4d0392574f49340bb75a102b04\` ON \`admin_user\``);
        await queryRunner.query(`DROP TABLE \`admin_user\``);
    }

}
