import { Agent } from '../../agent/entities/agent.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class BookingIdEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gdsId: string;

  @Column()
  queuingOfficeId: string;

  @Column()
  epicQuestId: string;
}

@Entity()
export class SaveBooking {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  system: string;

  @Column()
  segment: number;

  @Column()
  offerId: string;

  @Column()
  bookingId: string;

  @Column()
  bookingDateTime: string;

  @Column()
  triptype: string;

  @Column()
  career: string;

  @Column()
  gdsPNR: string;

  @Column()
  airlinePNR: string;

  @Column()
  status: string;

  @Column()
  careerName: string;

  @Column()
  lastTicketTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  taxes: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netPrice: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column()
  farecurrency: string;

  @Column({ type: 'json' })
  pricebreakdown: any;

  @Column()
  godeparture: string;

  @Column()
  godepartureTime: string;

  @Column()
  godepartureDate: string;

  @Column()
  goarrival: string;

  @Column()
  goarrivalTime: string;

  @Column()
  goarrivalDate: string;

  @Column({ nullable: true })
  backdeparture: string;

  @Column({ nullable: true })
  backdepartureTime: string;

  @Column({ nullable: true })
  backdepartureDate: string;

  @Column({ nullable: true })
  backarrival: string;

  @Column({ nullable: true })
  backarrivalTime: string;

  @Column({ nullable: true })
  backarrivalDate: string;

  @Column()
  cabinClass: string;

  @Column()
  refundable: string;

  @Column({ type: 'json' })
  segments: any;

  @Column({ type: 'json', nullable: true })
  stopover: any;

  @Column({ type: 'json' })
  travellers: any;

  @ManyToOne(() => User, (user) => user.bookingSave, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user: User;

  @ManyToOne(() => Agent, (agent) => agent.bookingSave, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  agent: Agent;

  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedDate: Date;
}