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
exports.AServiceAccounts1775980698325 = void 0;
class AServiceAccounts1775980698325 {
    constructor() {
        this.name = 'AServiceAccounts1775980698325';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`service_accounts\` (\`serviceNumber\` varchar(50) NOT NULL, \`customerId\` int UNSIGNED NULL, \`planId\` int UNSIGNED NULL, \`routerCode\` varchar(50) NULL, \`ipAddress\` varchar(45) NULL, \`macAddress\` varchar(50) NULL, \`rateLimit\` varchar(50) NULL, \`addressList\` varchar(50) NULL, \`subscriptionDate\` datetime NULL, \`installationDate\` datetime NULL, \`isActive\` tinyint NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`serviceNumber\`)) ENGINE=InnoDB`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE \`service_accounts\``);
        });
    }
}
exports.AServiceAccounts1775980698325 = AServiceAccounts1775980698325;
//# sourceMappingURL=1775980698325-a-service-accounts.js.map