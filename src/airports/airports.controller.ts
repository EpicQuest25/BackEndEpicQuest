import { Controller, Get, Param } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Airports Module')
@Controller('admin/airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Get('/airport/:id')
  airport(@Param('id') id: string) {
    return this.airportsService.airportName(id);
  }

  @Get('/airline/:id')
  airline(@Param('id') id: string) {
    return this.airportsService.airlineName(id);
  }

  @Get('/airportData/:id')
  async airportCode(@Param('id') id: string) {
    return await this.airportsService.airportData(id);
  }
}