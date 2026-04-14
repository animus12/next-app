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
exports.ServiceAccounts = void 0;
const typeorm_1 = require("typeorm");
let ServiceAccounts = class ServiceAccounts extends typeorm_1.BaseEntity {
};
exports.ServiceAccounts = ServiceAccounts;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], ServiceAccounts.prototype, "serviceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", unsigned: true, nullable: true }),
    __metadata("design:type", Number)
], ServiceAccounts.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", unsigned: true, nullable: true }),
    __metadata("design:type", Number)
], ServiceAccounts.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], ServiceAccounts.prototype, "routerCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 45, nullable: true }),
    __metadata("design:type", String)
], ServiceAccounts.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], ServiceAccounts.prototype, "macAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], ServiceAccounts.prototype, "rateLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], ServiceAccounts.prototype, "addressList", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], ServiceAccounts.prototype, "subscriptionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], ServiceAccounts.prototype, "installationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false, nullable: true }),
    __metadata("design:type", Boolean)
], ServiceAccounts.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ServiceAccounts.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], ServiceAccounts.prototype, "updatedAt", void 0);
exports.ServiceAccounts = ServiceAccounts = __decorate([
    (0, typeorm_1.Entity)("service_accounts")
], ServiceAccounts);
//# sourceMappingURL=service-accounts.entity.js.map