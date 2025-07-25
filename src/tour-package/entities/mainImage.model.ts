import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TourPackage } from './tourPackage.model';

@Entity('main_image')
export class MainImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  index: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.mainImage)
  tourPackage: TourPackage;
}