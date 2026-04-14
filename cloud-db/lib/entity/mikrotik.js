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
exports.Mikrotik = void 0;
const typeorm_1 = require("typeorm");
let Mikrotik = class Mikrotik {
};
exports.Mikrotik = Mikrotik;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Mikrotik.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Mikrotik.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Mikrotik.prototype, "ipDomain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], Mikrotik.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Mikrotik.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
    __metadata("design:type", String)
], Mikrotik.prototype, "port", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Mikrotik.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Mikrotik.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, unique: true }),
    __metadata("design:type", String)
], Mikrotik.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Mikrotik.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Mikrotik.prototype, "updatedAt", void 0);
exports.Mikrotik = Mikrotik = __decorate([
    (0, typeorm_1.Entity)("mikrotik")
], Mikrotik);
//# sourceMappingURL=mikrotik.js.map