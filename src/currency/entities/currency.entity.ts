import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  value: number;
}