import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { Agent } from './entities/agent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent]),
    AuthenticationModule,
    NotificationModule,
  ],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService, TypeOrmModule]
})
export class AgentModule {}