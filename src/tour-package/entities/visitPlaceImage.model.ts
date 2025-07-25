import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TourPackage } from './tourPackage.model';

@Entity('visit_place_image')
export class VisitPlaceImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  index: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => TourPackage, (tourPackage) => tourPackage.visitPlaceImage)
  tourPackage: TourPackage;
}