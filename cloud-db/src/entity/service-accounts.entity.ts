import { 
  BaseEntity, 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index,
	PrimaryColumn
} from "typeorm";


@Entity("service_accounts")
export class ServiceAccounts extends BaseEntity {
  @PrimaryColumn({ type: "varchar", length: 50 })
  serviceNumber: string; // Halimbawa: ACC-2026-0001

  @Column({ type: "int", unsigned: true, nullable: true })
  customerId: number; // Link sa Customers.id

  @Column({ type: "int", unsigned: true, nullable: true })
  planId: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  routerCode: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  macAddress: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  rateLimit: string; // Yung speed limit (nullable)

  @Column({ type: "varchar", length: 50, nullable: true })
  addressList: string; // IPOE-ACCEPT/EXPIRED

  @Column({ type: "datetime", nullable: true })
  subscriptionDate: Date;

  @Column({ type: "datetime", nullable: true })
  installationDate: Date;

  @Column({ type: "boolean", default: false, nullable: true})
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}