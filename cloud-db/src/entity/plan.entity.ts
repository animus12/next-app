import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
	Index
} from "typeorm";

@Entity("plans")
export class Plan {
  @PrimaryGeneratedColumn("increment", { unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Column({ type: "int", nullable: true, unsigned: true })
  price: number;

  @Index("IDX_PROFILE_ID")
  @Column({ nullable: true, unsigned: true })
  profileId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}