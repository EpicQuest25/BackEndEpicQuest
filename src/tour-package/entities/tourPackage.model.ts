import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Introduction } from './Introduction.model';
import { TourPlan } from './tourPlan.Model';
import { VisitPlaceImage } from './visitPlaceImage.model';
import { MainImage } from './mainImage.model';

@Entity('tourpackage')
export class TourPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  packageId: string;

  @Column()
  status: string;

  @Column()
  packageType: string;

  @Column('json', { nullable: false })
  overView: object;

  @Column('json', { nullable: false })
  objective: object;

  @Column('json', { nullable: false })
  metaInfo: object;

  @Column('json', { nullable: false })
  accommodation: object;

  @OneToOne(() => Introduction, (intro) => intro.tourPackage, {
    cascade: true,
  })
  introduction: Introduction;

  @OneToMany(() => TourPlan, (tourPlan) => tourPlan.tourPackage, {
    onDelete: 'CASCADE',
  })
  tourPlans: TourPlan[];

  @OneToMany(() => VisitPlaceImage, (visitPlaceImage) => visitPlaceImage.tourPackage, { 
    onDelete: 'CASCADE' 
  })
  visitPlaceImage: VisitPlaceImage[];

  @OneToMany(() => MainImage, (mainImage) => mainImage.tourPackage, {
    onDelete: 'CASCADE',
  })
  mainImage: MainImage[];
}