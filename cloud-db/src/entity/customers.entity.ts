import { 
  BaseEntity, 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index
} from "typeorm";

@Entity("customers")
export class Customers extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  firstName: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  middleName: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  lastName: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  email: string;

	@Column({ type: "varchar", length: 100, nullable: true })
  address: string;

  // LOGIN CREDENTIAL: Ang tanging NOT NULL
  @Index("IDX_CUSTOMER_MOBILE")
  @Column({ type: "varchar", length: 20, unique: true, nullable: false })
  mobileNo: string;

  // PIN: Naka-varchar 60 para sa hashing (e.g. bcrypt)
  @Column({ type: "varchar", length: 60, nullable: true })
  pin: string;

  // TECHNICAL & NETWORK
  @Column({ type: "int", unsigned: true, nullable: true })
  planId: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  routerCode: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  macAddress: string;

  // DATES WITH TIME
  @Column({ type: "datetime", nullable: true })
  subscriptionDate: Date;

  @Column({ type: "datetime", nullable: true })
  installationDate: Date;

  // STATUS: Default to Inactive
  @Column({ type: "boolean", default: false })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}