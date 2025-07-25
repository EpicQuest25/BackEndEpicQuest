import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  supplierId: string;

  @Column()
  tradingName: string;

  @Column()
  legalName: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  businessRegisterNumber: string;

  @Column()
  registeredCountry: string;

  @Column('text', { nullable: true })
  text: string;

  @Column()
  markuptype: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  markup: number;

  @Column()
  clientmarkuptype: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  clientmarkup: number;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date;

  @Column({ type: 'int', default: 0 })
  resetAttemptCount: number;

  @Column({ type: 'timestamp', nullable: true })
  resetAttemptTimestamp: Date;

  @Column({ nullable: true })
  actionBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedDate: Date;

  @OneToMany(() => Roles, (role) => role.supplier)
  roles: Roles[];
}

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleName: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.roles, {
    onDelete: 'CASCADE',
  })
  supplier: Supplier;
}