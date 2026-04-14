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
exports.ActiveRouter = void 0;
const typeorm_1 = require("typeorm");
let ActiveRouter = class ActiveRouter {
};
exports.ActiveRouter = ActiveRouter;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ default: 1 }),
    __metadata("design:type", Number)
], ActiveRouter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ActiveRouter.prototype, "routerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActiveRouter.prototype, "routerCode", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ActiveRouter.prototype, "updatedAt", void 0);
exports.ActiveRouter = ActiveRouter = __decorate([
    (0, typeorm_1.Entity)('active_router')
], ActiveRouter);
//# sourceMappingURL=activer-router.entity.js.map