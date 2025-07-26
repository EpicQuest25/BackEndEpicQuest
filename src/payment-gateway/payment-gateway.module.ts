import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentGatewayController } from './payment-gateway.controller';
import { PaymentGatewayService } from './payment-gateway.service';
import { Transaction } from '../transaction/entities/transaction.entity';
import { User } from '../user/entities/user.entity';
import { Agent } from '../agent/entities/agent.entity';
import { AdyenService } from './payment-gatewayList/adyenService';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Agent]),
  ],
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService, AdyenService],
  exports: [PaymentGatewayService, AdyenService],
})
export class PaymentGatewayModule {}