import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class StayDto {
  @ApiProperty({
    example: '2025-05-01',
    description: 'Check-in date in YYYY-MM-DD format',
  })
  @IsDateString()
  checkIn: string;

  @ApiProperty({
    example: '2025-05-05',
    description: 'Check-out date in YYYY-MM-DD format',
  })
  @IsDateString()
  checkOut: string;
}

class OccupancyDto {
  @ApiProperty({ example: 1, description: 'Number of rooms' })
  @IsNumber()
  rooms: number;

  @ApiProperty({ example: 2, description: 'Number of adults' })
  @IsNumber()
  adults: number;

  @ApiProperty({ example: 0, description: 'Number of children' })
  @IsNumber()
  children: number;
}

class DestinationDto {
  @ApiProperty({
    example: 'PMI',
    description: 'Destination code (e.g. airport code or city code)',
  })
  @IsString()
  code: string;
}

class HotelsDto {
  @ApiProperty()
  hotel: string[];
}

export class HotelSearchDto {
  @ApiProperty({ type: StayDto })
  stay: StayDto;

  @ApiProperty({ type: [OccupancyDto] })
  @Type(() => OccupancyDto)
  occupancies: OccupancyDto[];

  @ApiProperty({ type: DestinationDto })
  destination: DestinationDto;

  @ApiProperty({ type: HotelsDto })
  hotels: HotelsDto;

  @ApiProperty({ example: 'ENG', description: 'Language code' })
  language: string;

  @ApiProperty({ example: 'EUR', description: 'Currency code' })
  currency: string;
}

export class HotelDetailsDto {
  @ApiProperty({ example: '1234', description: 'Hotelbeds hotel code' })
  @IsString()
  hotelCode: string;
}