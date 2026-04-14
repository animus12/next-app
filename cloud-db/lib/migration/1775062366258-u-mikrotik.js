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
exports.UMikrotik1775062366258 = void 0;
class UMikrotik1775062366258 {
    constructor() {
        this.name = 'UMikrotik1775062366258';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`mikrotik\` ADD UNIQUE INDEX \`IDX_6c37b6e257811798e469c8d3f6\` (\`code\`)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`mikrotik\` DROP INDEX \`IDX_6c37b6e257811798e469c8d3f6\``);
        });
    }
}
exports.UMikrotik1775062366258 = UMikrotik1775062366258;
//# sourceMappingURL=1775062366258-u-mikrotik.js.map