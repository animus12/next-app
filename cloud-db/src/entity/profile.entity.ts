	import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("bandwidth_profile")
export class BandwidthProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 50 }) // Base rates are required
  downloadRate: string;

  @Column({ type: "varchar", length: 50 })
  uploadRate: string;

  // Burst: Pwedeng wala nito kung simpleng speed limit lang
  @Column({ type: "varchar", length: 50, nullable: true })
  dlBurstRate: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  ulBurstRate: string;

  // Burst Time: Pwedeng wala kung walang burst
  @Column({ type: "varchar", length: 50, nullable: true })
  dlBurstTime: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  ulBurstTime: string;

  // Threshold: Pwedeng wala
  @Column({ type: "varchar", length: 50, nullable: true })
  dlThresholdRate: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  ulThresholdRate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}