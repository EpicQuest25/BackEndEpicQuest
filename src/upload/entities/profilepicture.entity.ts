import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class ProfilePicture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  link: string;

  @Column()
  size: number;

  @OneToOne(() => User, (user) => user.profilePicture, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}