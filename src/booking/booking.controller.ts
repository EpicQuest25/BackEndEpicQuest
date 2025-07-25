import { Controller, Get, Query, Headers, Param, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiQuery } from '@nestjs/swagger';
import { CombinedUserAgentJwtGuard } from '../authentication/userAgent-jwtGuard.guard';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('manageBooking')
  @ApiQuery({ name: 'bookingId', required: true, type: String })
  async manageBooking(@Query('bookingId') bookingId: string) {
    return await this.bookingService.findOne(bookingId);
  }

  @Get('allbooking')
  async allBooking() {
    return await this.bookingService.findAll();
  }

  @Get('/:bookingStatus')
  @UseGuards(CombinedUserAgentJwtGuard)
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findUserWithBookings(
    @Headers() header: any,
    @Param('bookingStatus') bookingStatus: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    return this.bookingService.findUserWithBookings(header, bookingStatus, pageNumber, limitNumber);
  }
}