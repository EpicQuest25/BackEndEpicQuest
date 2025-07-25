import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class anyData {
  @ApiProperty()
  data: any;
}

export class FlightSearchDto {
  @ApiProperty({
    example: 'oneway',
    description: 'Trip type: oneway or roundtrip',
  })
  @IsString()
  @IsNotEmpty()
  tripType: string;

  @ApiProperty({
    example: 'DAC',
    description: 'Journey start airport code (e.g., DAC for Dhaka)',
  })
  @IsString()
  @IsNotEmpty()
  journeyfrom: string;

  @ApiProperty({
    example: 'JFK',
    description: 'Journey destination airport code (e.g., JFK for New York)',
  })
  @IsString()
  @IsNotEmpty()
  journeyto: string;

  @ApiProperty({ example: 1, description: 'Number of adult passengers' })
  @IsNumber()
  @IsNotEmpty()
  adult: number;

  @ApiProperty({ example: 0, description: 'Number of child passengers' })
  @IsNumber()
  @IsNotEmpty()
  child: number;

  @ApiProperty({ example: 0, description: 'Number of infant passengers' })
  @IsNumber()
  @IsNotEmpty()
  infant: number;

  @ApiProperty({
    example: 'economy',
    description: 'Cabin class: economy, business, etc.',
  })
  @IsString()
  @IsNotEmpty()
  cabinclass: string;

  @ApiProperty({
    example: '2025-06-15',
    description: 'Departure date in YYYY-MM-DD format',
  })
  @IsString()
  @IsNotEmpty()
  departuredate: string;

  @ApiPropertyOptional({
    example: '2025-06-25',
    description: 'Return date in YYYY-MM-DD format (only for roundtrip)',
  })
  @IsString()
  @IsOptional()
  returndate?: string;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email address for contact (optional)',
  })
  @IsString()
  @IsOptional()
  email?: string;
}

export class TravelerDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  emailAddress: string;

  @ApiProperty()
  countryCallingCode: string;

  @ApiProperty()
  phonenumber: string;

  @ApiPropertyOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  passportNumber?: string;

  @ApiPropertyOptional()
  passportExpireDate?: string;

  @ApiPropertyOptional()
  issuanceCountry?: string;

  @ApiPropertyOptional()
  validityCountry?: string;

  @ApiPropertyOptional()
  nationality?: string;
}

export class BookingDto {
  @ApiProperty({ type: [TravelerDto] })
  travellers: TravelerDto[];

  @ApiProperty()
  data: any;
}