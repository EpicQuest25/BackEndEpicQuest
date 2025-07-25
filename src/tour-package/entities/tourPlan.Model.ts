import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TourPackage } from './tourPackage.model';

@Entity()
export class TourPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'json' })
  plan: object;

  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.tourPlans)
  tourPackage: TourPackage;
}