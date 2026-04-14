import { MigrationInterface, QueryRunner } from "typeorm";

export class AProfile1775206258452 implements MigrationInterface {
    name = 'AProfile1775206258452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`bandwidth_profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`downloadRate\` varchar(50) NOT NULL, \`uploadRate\` varchar(50) NOT NULL, \`dlBurstRate\` varchar(50) NULL, \`ulBurstRate\` varchar(50) NULL, \`dlBurstTime\` varchar(50) NULL, \`ulBurstTime\` varchar(50) NULL, \`dlThresholdRate\` varchar(50) NULL, \`ulThresholdRate\` varchar(50) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`bandwidth_profile\``);
    }

}
