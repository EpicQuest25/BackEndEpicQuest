import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Agent } from '../../agent/entities/agent.entity';

@Entity('transections')
export class Transection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  transectionId: string;

  @Column({ type: 'json', nullable: true })
  gatewayData: any;

  @Column({ nullable: true })
  paymentRiskType: string;

  @Column({ nullable: true })
  gatewayReferance: string;

  @Column({ nullable: true })
  gatewayid: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  amount: string;

  @Column({ nullable: true })
  updatedAmount: string;

  @Column({ nullable: true })
  previousAmount: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User | null;

  @ManyToOne(() => Agent, { nullable: true })
  @JoinColumn()
  agent: Agent | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}