import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveBooking } from './entity/bookingId.entiry';
import { User } from '../user/entities/user.entity';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Agent } from '../agent/entities/agent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaveBooking, User, Agent]), AuthenticationModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}