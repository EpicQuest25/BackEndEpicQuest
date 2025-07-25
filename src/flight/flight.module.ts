import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { AmadiousService } from './resorce/amadious.service';
import { AmadiousResorce } from './resorce/amadious.resorce';
import { AirportsModule } from '../airports/airports.module';
import { Agent } from '../agent/entities/agent.entity';
import { User } from '../user/entities/user.entity';
import { BookingIdEntity, SaveBooking } from '../booking/entity/bookingId.entity';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent, User, BookingIdEntity, SaveBooking]),
    AirportsModule,
    AuthenticationModule,
  ],
  controllers: [FlightController],
  providers: [FlightService, AmadiousService, AmadiousResorce],
})
export class FlightModule {}