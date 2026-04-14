import { MigrationInterface, QueryRunner } from "typeorm";

export class Firstdata1768067082744 implements MigrationInterface {
    name = 'Firstdata1768067082744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`photo\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`filename\` varchar(255) NOT NULL, \`views\` int NOT NULL, \`isPublished\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`photo\``);
    }

}
