"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoNumbers = void 0;
const typeorm_1 = require("typeorm");
let AutoNumbers = class AutoNumbers extends typeorm_1.BaseEntity {
};
exports.AutoNumbers = AutoNumbers;
__decorate([
    (0, typeorm_1.PrimaryColumn)("varchar", { length: 10 }),
    __metadata("design:type", String)
], AutoNumbers.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 3 }),
    __metadata("design:type", String)
], AutoNumbers.prototype, "textPrefix", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 10 }),
    __metadata("design:type", String)
], AutoNumbers.prototype, "datePrefix", void 0);
__decorate([
    (0, typeorm_1.Column)("int"),
    __metadata("design:type", Number)
], AutoNumbers.prototype, "autoNoLength", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { unsigned: true }),
    __metadata("design:type", Number)
], AutoNumbers.prototype, "lastValue", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 500 }),
    __metadata("design:type", String)
], AutoNumbers.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 4 }),
    __metadata("design:type", String)
], AutoNumbers.prototype, "currentYear", void 0);
exports.AutoNumbers = AutoNumbers = __decorate([
    (0, typeorm_1.Entity)("auto_numbers")
], AutoNumbers);
//# sourceMappingURL=auto-number.entity.js.map