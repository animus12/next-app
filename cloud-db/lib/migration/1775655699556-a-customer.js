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
exports.ACustomer1775655699556 = void 0;
class ACustomer1775655699556 {
    constructor() {
        this.name = 'ACustomer1775655699556';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`customers\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`firstName\` varchar(50) NULL, \`middleName\` varchar(50) NULL, \`lastName\` varchar(50) NULL, \`email\` varchar(100) NULL, \`address\` varchar(100) NULL, \`mobileNo\` varchar(20) NOT NULL, \`pin\` varchar(60) NULL, \`planId\` int UNSIGNED NULL, \`routerCode\` varchar(50) NULL, \`ipAddress\` varchar(45) NULL, \`macAddress\` varchar(50) NULL, \`subscriptionDate\` datetime NULL, \`installationDate\` datetime NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_CUSTOMER_MOBILE\` (\`mobileNo\`), UNIQUE INDEX \`IDX_348434b66fa855a501522eabb6\` (\`mobileNo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX \`IDX_348434b66fa855a501522eabb6\` ON \`customers\``);
            yield queryRunner.query(`DROP INDEX \`IDX_CUSTOMER_MOBILE\` ON \`customers\``);
            yield queryRunner.query(`DROP TABLE \`customers\``);
        });
    }
}
exports.ACustomer1775655699556 = ACustomer1775655699556;
//# sourceMappingURL=1775655699556-a-customer.js.map