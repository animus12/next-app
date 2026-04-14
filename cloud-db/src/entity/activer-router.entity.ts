import { Entity, PrimaryColumn, Column, UpdateDateColumn } from "typeorm";

@Entity('active_router')
export class ActiveRouter {
  @PrimaryColumn({ default: 1 }) 
  id: number;

  @Column()
  routerId: number;
	
	@Column()
  routerCode: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}