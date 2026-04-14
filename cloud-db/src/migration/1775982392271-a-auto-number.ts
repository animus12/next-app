import { MigrationInterface, QueryRunner } from "typeorm";

export class AAutoNumber1775982392271 implements MigrationInterface {
    name = 'AAutoNumber1775982392271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`auto_numbers\` (\`type\` varchar(10) NOT NULL, \`textPrefix\` varchar(3) NOT NULL, \`datePrefix\` varchar(10) NOT NULL, \`autoNoLength\` int NOT NULL, \`lastValue\` int UNSIGNED NOT NULL, \`description\` varchar(500) NOT NULL, \`currentYear\` varchar(4) NOT NULL, PRIMARY KEY (\`type\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`auto_numbers\``);
    }

}
