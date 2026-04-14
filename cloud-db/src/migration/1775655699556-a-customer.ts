import { MigrationInterface, QueryRunner } from "typeorm";

export class ACustomer1775655699556 implements MigrationInterface {
    name = 'ACustomer1775655699556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`customers\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`firstName\` varchar(50) NULL, \`middleName\` varchar(50) NULL, \`lastName\` varchar(50) NULL, \`email\` varchar(100) NULL, \`address\` varchar(100) NULL, \`mobileNo\` varchar(20) NOT NULL, \`pin\` varchar(60) NULL, \`planId\` int UNSIGNED NULL, \`routerCode\` varchar(50) NULL, \`ipAddress\` varchar(45) NULL, \`macAddress\` varchar(50) NULL, \`subscriptionDate\` datetime NULL, \`installationDate\` datetime NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_CUSTOMER_MOBILE\` (\`mobileNo\`), UNIQUE INDEX \`IDX_348434b66fa855a501522eabb6\` (\`mobileNo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_348434b66fa855a501522eabb6\` ON \`customers\``);
        await queryRunner.query(`DROP INDEX \`IDX_CUSTOMER_MOBILE\` ON \`customers\``);
        await queryRunner.query(`DROP TABLE \`customers\``);
    }

}
