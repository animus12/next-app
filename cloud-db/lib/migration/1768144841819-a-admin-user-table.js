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
exports.AAdminUserTable1768144841819 = void 0;
class AAdminUserTable1768144841819 {
    constructor() {
        this.name = 'AAdminUserTable1768144841819';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`admin_user\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`username\` varchar(50) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(50) NOT NULL, \`middleName\` varchar(50) NULL, \`lastName\` varchar(50) NOT NULL, \`role\` varchar(50) NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4d0392574f49340bb75a102b04\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX \`IDX_4d0392574f49340bb75a102b04\` ON \`admin_user\``);
            yield queryRunner.query(`DROP TABLE \`admin_user\``);
        });
    }
}
exports.AAdminUserTable1768144841819 = AAdminUserTable1768144841819;
//# sourceMappingURL=1768144841819-a-admin-user-table.js.map