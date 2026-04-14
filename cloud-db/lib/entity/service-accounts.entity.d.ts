import { BaseEntity } from "typeorm";
export declare class ServiceAccounts extends BaseEntity {
    serviceNumber: string;
    customerId: number;
    planId: number;
    routerCode: string;
    ipAddress: string;
    macAddress: string;
    rateLimit: string;
    addressList: string;
    subscriptionDate: Date;
    installationDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=service-accounts.entity.d.ts.map