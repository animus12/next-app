import { BaseEntity } from "typeorm";
export declare class AdminUser extends BaseEntity {
    id: number;
    username: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
    role: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=admin-user.entity.d.ts.map