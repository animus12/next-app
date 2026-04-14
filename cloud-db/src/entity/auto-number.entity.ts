import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";

@Entity("auto_numbers")
export class AutoNumbers extends BaseEntity {
  @PrimaryColumn("varchar", { length: 10 })
  type: string;

  @Column("varchar", { length: 3 })
  textPrefix: string;

  @Column("varchar", { length: 10 })
  datePrefix: string;

  @Column("int")
  autoNoLength: number;

  @Column("int", { unsigned: true })
  lastValue: number;

  @Column("varchar", { length: 500 })
  description: string;

  @Column("varchar", { length: 4 })
  currentYear: string;
}
