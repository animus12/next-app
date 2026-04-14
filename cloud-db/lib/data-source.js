"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const company_db_1 = require("./database/company.db");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: '127.0.0.1', // palitan kung remote
    port: 3306,
    username: 'mark',
    password: 'animus',
    database: 'clouddb',
    synchronize: false, // ❌ wag sa production
    logging: false,
    entities: company_db_1.dbEntities,
    migrations: ['src/migration/*.ts'],
});
//# sourceMappingURL=data-source.js.map