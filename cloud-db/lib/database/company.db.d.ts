import { DataSource } from "typeorm";
import { Photo, AdminUser, Customers, BandwidthProfile, ActiveRouter, ServiceAccounts, AutoNumbers } from "../entity";
import { Mikrotik } from "../entity/mikrotik";
import { Plan } from "../entity/plan.entity";
export declare const dbEntities: (typeof Photo | typeof AdminUser | typeof Customers | typeof BandwidthProfile | typeof Plan | typeof ActiveRouter | typeof ServiceAccounts | typeof AutoNumbers | typeof Mikrotik)[];
export declare function dbConnection(): Promise<DataSource>;
//# sourceMappingURL=company.db.d.ts.map