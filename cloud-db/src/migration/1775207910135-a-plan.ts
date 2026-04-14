import { MigrationInterface, QueryRunner } from "typeorm";

export class APlan1775207910135 implements MigrationInterface {
    name = 'APlan1775207910135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`plans\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`price\` int UNSIGNED NULL, \`profileId\` int UNSIGNED NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_PROFILE_ID\` (\`profileId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_PROFILE_ID\` ON \`plans\``);
        await queryRunner.query(`DROP TABLE \`plans\``);
    }

}
