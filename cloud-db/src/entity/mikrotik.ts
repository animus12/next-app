	import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

	@Entity("mikrotik")
	export class Mikrotik {
		@PrimaryGeneratedColumn()
		id: number;

		@Column({ type: "varchar", length: 100 })
		name: string;

		@Column({ type: "varchar", length: 255 })
		ipDomain: string;

		@Column({ type: "varchar", length: 50 })
		username: string;

		@Column({ type: "varchar", length: 255 })
		password: string;

		@Column({ type: "varchar", nullable: true })
		port: string;

		@Column({ type: "boolean",  nullable: true , default: false })
		status: boolean; // true = online, false = offline

		@Column({ type: "boolean",  nullable: true , default: false })
		isActive: boolean;

		@Column({ type: "varchar", length: 10, unique:true })
  	code: string;

		@CreateDateColumn()
		createdAt: Date;

		@UpdateDateColumn()
		updatedAt: Date;
	}