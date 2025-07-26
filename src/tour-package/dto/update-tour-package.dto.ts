import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';
import { CreateTourPackageDto } from './create-tour-package.dto';

export class UpdateTourPackageDto extends PartialType(CreateTourPackageDto) {
  @ApiPropertyOptional({
    description: 'Package status (active, inactive, etc.)',
    example: 'inactive',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Overview of the tour package',
    example: {
      title: 'Updated Adventure Tour',
      description: 'Experience the thrill of adventure in the mountains',
      duration: '7 days',
      groupSize: '10-15 people',
    },
  })
  @IsOptional()
  @IsObject()
  overView?: object;

  @ApiPropertyOptional({
    description: 'Objective of the tour package',
    example: {
      highlights: ['Mountain climbing', 'River rafting', 'Camping'],
      goals: ['Adventure', 'Team building', 'Nature exploration'],
    },
  })
  @IsOptional()
  @IsObject()
  objective?: object;

  @ApiPropertyOptional({
    description: 'Meta information for SEO',
    example: {
      title: 'Amazing Adventure Tour | Epic Quest',
      description: 'Experience the thrill of adventure in the mountains with Epic Quest',
      keywords: ['adventure', 'mountain', 'tour', 'epic quest'],
    },
  })
  @IsOptional()
  @IsObject()
  metaInfo?: object;

  @ApiPropertyOptional({
    description: 'Accommodation details',
    example: {
      hotels: ['Mountain View Hotel', 'Riverside Resort'],
      amenities: ['WiFi', 'Breakfast', 'Swimming pool'],
      roomTypes: ['Single', 'Double', 'Suite'],
    },
  })
  @IsOptional()
  @IsObject()
  accommodation?: object;
}