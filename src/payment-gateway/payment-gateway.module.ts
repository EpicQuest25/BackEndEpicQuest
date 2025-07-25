import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentGatewayController } from './payment-gateway.controller';
import { PaymentGatewayService } from './payment-gateway.service';
import { Transection } from '../transection/entities/transection.entity';
import { User } from '../user/entities/user.entity';
import { Agent } from '../agent/entities/agent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transection, User, Agent]),
  ],
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService],
  exports: [PaymentGatewayService],
})
export class PaymentGatewayModule {}