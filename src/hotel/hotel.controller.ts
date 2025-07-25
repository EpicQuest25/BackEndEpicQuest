import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotelbeds } from './resorce/hotelbeds.service';
import { HotelDetailsDto, HotelSearchDto } from './dto/hotelbedsDto';

@Controller('hotel')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelbedservice: Hotelbeds,
  ) {}

  @Post()
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelService.create(createHotelDto);
  }

  @Post('searchHotels')
  search(@Body() dto: HotelSearchDto) {
    return this.hotelbedservice.hotelsearch(dto);
  }

  @Get('hotelDetails')
  hotelDetails(@Query() data: HotelDetailsDto) {
    const code = data.hotelCode;
    return this.hotelbedservice.hoteldetails(code);
  }

  @Get()
  findOne() {
    return this.hotelbedservice.checkDestination();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.hotelService.update(+id, updateHotelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotelService.remove(+id);
  }
}