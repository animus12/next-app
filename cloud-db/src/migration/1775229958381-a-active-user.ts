import { MigrationInterface, QueryRunner } from "typeorm";

export class AActiveUser1775229958381 implements MigrationInterface {
    name = 'AActiveUser1775229958381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`active_router\` (\`id\` int NOT NULL DEFAULT '1', \`routerId\` int NOT NULL, \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`active_router\``);
    }

}
