import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tourBooking')
export class tourBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tourpackageId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  number: string;

  @Column()
  travelDate: string;

  @Column({ type: 'json', nullable: true })
  text: object;

  @Column()
  bookedBy: string;

  @Column()
  status: string;

  @Column()
  bookingId: string;

  @Column({ default: false })
  alerted: boolean;

  @Column({ nullable: true })
  actionBy: string;
}