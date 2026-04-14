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
exports.Customers = void 0;
const typeorm_1 = require("typeorm");
let Customers = class Customers extends typeorm_1.BaseEntity {
};
exports.Customers = Customers;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", unsigned: true }),
    __metadata("design:type", Number)
], Customers.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "middleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100, nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Index)("IDX_CUSTOMER_MOBILE"),
    (0, typeorm_1.Column)({ type: "varchar", length: 20, unique: true, nullable: false }),
    __metadata("design:type", String)
], Customers.prototype, "mobileNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 60, nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "pin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", unsigned: true, nullable: true }),
    __metadata("design:type", Number)
], Customers.prototype, "planId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "routerCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 45, nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "macAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], Customers.prototype, "subscriptionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], Customers.prototype, "installationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Customers.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Customers.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Customers.prototype, "updatedAt", void 0);
exports.Customers = Customers = __decorate([
    (0, typeorm_1.Entity)("customers")
], Customers);
//# sourceMappingURL=customers.entity.js.map