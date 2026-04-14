"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbEntities = void 0;
exports.dbConnection = dbConnection;
const typeorm_1 = require("typeorm");
const entity_1 = require("../entity");
const mikrotik_1 = require("../entity/mikrotik");
const plan_entity_1 = require("../entity/plan.entity");
exports.dbEntities = [
    entity_1.Photo,
    entity_1.AdminUser,
    entity_1.Customers,
    mikrotik_1.Mikrotik,
    entity_1.BandwidthProfile,
    plan_entity_1.Plan,
    entity_1.ActiveRouter,
    entity_1.ServiceAccounts,
    entity_1.AutoNumbers
];
let dataSource;
function dbConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (dataSource === null || dataSource === void 0 ? void 0 : dataSource.isInitialized) {
            return dataSource;
        }
        dataSource = new typeorm_1.DataSource({
            type: "mysql",
            host: "127.0.0.1",
            port: 3306,
            username: "mark",
            password: "animus",
            database: "clouddb",
            synchronize: false,
            logging: false,
            entities: exports.dbEntities,
        });
        try {
            yield dataSource.initialize();
            console.log("DB Connected ✅");
            return dataSource;
        }
        catch (error) {
            console.error("DB Connection Failed ❌", error);
            throw error;
        }
    });
}
//# sourceMappingURL=company.db.js.map