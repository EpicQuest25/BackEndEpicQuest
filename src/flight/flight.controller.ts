import { Controller, Post, Body, UseGuards, Get, Query, Headers } from '@nestjs/common';
import { AmadiousService } from './resorce/amadious.service';
import { FlightSearchDto, anyData, BookingDto } from './dto/flight.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AmadiousResorce } from './resorce/amadious.resorce';
import { CombinedUserAgentJwtGuard } from '../authentication/userAgent-jwtGuard.guard';

@Controller('flight')
export class FlightController {
  constructor(
    private readonly testService: AmadiousResorce,
    private readonly amadousService: AmadiousService,
  ) {}

  @Post('searchFlights')
  async searchFlights(@Body() data: FlightSearchDto): Promise<any> {
    return await this.amadousService.searchFlights(data);
  }

  @UseGuards(CombinedUserAgentJwtGuard)
  @Post('offerPrice')
  async offerPrice(@Body() data: anyData): Promise<any> {
    return await this.amadousService.offerPrice(data);
  }

  @UseGuards(CombinedUserAgentJwtGuard)
  @Post('bookFlight')
  async booking(@Body() data: BookingDto, @Headers() header: any): Promise<any> {
    return await this.amadousService.booking(data, header);
  }

  @UseGuards(CombinedUserAgentJwtGuard)
  @Get('CancelBooking')
  @ApiQuery({ name: 'bookingId', required: true, type: String })
  async cancelBooking(@Query('bookingId') bookingId: string): Promise<any> {
    return await this.amadousService.cancelBooking(bookingId);
  }
}