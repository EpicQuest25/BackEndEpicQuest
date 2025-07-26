import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { User } from '../user/entities/user.entity';
import { Agent } from '../agent/entities/agent.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Agent]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key_for_development',
      signOptions: { expiresIn: process.env.JWT_TIME + 's' || '86400s' },
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}