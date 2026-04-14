import { MigrationInterface, QueryRunner } from "typeorm";

export class AServiceAccounts1775980698325 implements MigrationInterface {
    name = 'AServiceAccounts1775980698325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`service_accounts\` (\`serviceNumber\` varchar(50) NOT NULL, \`customerId\` int UNSIGNED NULL, \`planId\` int UNSIGNED NULL, \`routerCode\` varchar(50) NULL, \`ipAddress\` varchar(45) NULL, \`macAddress\` varchar(50) NULL, \`rateLimit\` varchar(50) NULL, \`addressList\` varchar(50) NULL, \`subscriptionDate\` datetime NULL, \`installationDate\` datetime NULL, \`isActive\` tinyint NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`serviceNumber\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`service_accounts\``);
    }

}
