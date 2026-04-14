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
exports.AProfile1775206258452 = void 0;
class AProfile1775206258452 {
    constructor() {
        this.name = 'AProfile1775206258452';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`bandwidth_profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`downloadRate\` varchar(50) NOT NULL, \`uploadRate\` varchar(50) NOT NULL, \`dlBurstRate\` varchar(50) NULL, \`ulBurstRate\` varchar(50) NULL, \`dlBurstTime\` varchar(50) NULL, \`ulBurstTime\` varchar(50) NULL, \`dlThresholdRate\` varchar(50) NULL, \`ulThresholdRate\` varchar(50) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE \`bandwidth_profile\``);
        });
    }
}
exports.AProfile1775206258452 = AProfile1775206258452;
//# sourceMappingURL=1775206258452-a-profile.js.map