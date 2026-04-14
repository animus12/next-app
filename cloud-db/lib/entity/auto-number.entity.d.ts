import { BaseEntity } from "typeorm";
export declare class AutoNumbers extends BaseEntity {
    type: string;
    textPrefix: string;
    datePrefix: string;
    autoNoLength: number;
    lastValue: number;
    description: string;
    currentYear: string;
}
//# sourceMappingURL=auto-number.entity.d.ts.map