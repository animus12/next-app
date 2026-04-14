import { BaseEntity } from "typeorm";
export declare class Customers extends BaseEntity {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    address: string;
    mobileNo: string;
    pin: string;
    planId: number;
    routerCode: string;
    ipAddress: string;
    macAddress: string;
    subscriptionDate: Date;
    installationDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=customers.entity.d.ts.map