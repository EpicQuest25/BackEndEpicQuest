import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateTourPackageDto {
  @ApiProperty({
    description: 'Unique package ID',
    example: 'TOUR-12345',
  })
  @IsNotEmpty()
  @IsString()
  packageId: string;

  @ApiProperty({
    description: 'Package status (active, inactive, etc.)',
    example: 'active',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Package type (adventure, relaxation, etc.)',
    example: 'adventure',
  })
  @IsNotEmpty()
  @IsString()
  packageType: string;

  @ApiProperty({
    description: 'Overview of the tour package',
    example: {
      title: 'Amazing Adventure Tour',
      description: 'Experience the thrill of adventure in the mountains',
      duration: '7 days',
      groupSize: '10-15 people',
    },
  })
  @IsNotEmpty()
  @IsObject()
  overView: object;

  @ApiProperty({
    description: 'Objective of the tour package',
    example: {
      highlights: ['Mountain climbing', 'River rafting', 'Camping'],
      goals: ['Adventure', 'Team building', 'Nature exploration'],
    },
  })
  @IsNotEmpty()
  @IsObject()
  objective: object;

  @ApiProperty({
    description: 'Meta information for SEO',
    example: {
      title: 'Amazing Adventure Tour | Epic Quest',
      description: 'Experience the thrill of adventure in the mountains with Epic Quest',
      keywords: ['adventure', 'mountain', 'tour', 'epic quest'],
    },
  })
  @IsNotEmpty()
  @IsObject()
  metaInfo: object;

  @ApiProperty({
    description: 'Accommodation details',
    example: {
      hotels: ['Mountain View Hotel', 'Riverside Resort'],
      amenities: ['WiFi', 'Breakfast', 'Swimming pool'],
      roomTypes: ['Single', 'Double', 'Suite'],
    },
  })
  @IsNotEmpty()
  @IsObject()
  accommodation: object;

  @ApiProperty({
    description: 'Introduction details',
    example: {
      title: 'Welcome to the Amazing Adventure Tour',
      description: 'Get ready for the adventure of a lifetime',
      highlights: ['Scenic views', 'Expert guides', 'All-inclusive package'],
    },
  })
  @IsOptional()
  @IsObject()
  introduction?: object;

  @ApiProperty({
    description: 'Tour plans',
    example: [
      {
        day: 1,
        title: 'Arrival and Welcome',
        description: 'Arrive at the destination and check in to the hotel',
        activities: ['Welcome dinner', 'Orientation'],
      },
      {
        day: 2,
        title: 'Mountain Hiking',
        description: 'Hike up the mountain with expert guides',
        activities: ['Hiking', 'Picnic lunch', 'Photography'],
      },
    ],
  })
  @IsOptional()
  @IsObject()
  tourPlans?: object[];

  @ApiProperty({
    description: 'Visit place images',
    example: [
      {
        title: 'Mountain View',
        url: 'https://example.com/mountain.jpg',
        description: 'Scenic view of the mountain',
      },
      {
        title: 'River Rafting',
        url: 'https://example.com/river.jpg',
        description: 'Exciting river rafting experience',
      },
    ],
  })
  @IsOptional()
  @IsObject()
  visitPlaceImages?: object[];

  @ApiProperty({
    description: 'Main images',
    example: [
      {
        title: 'Tour Banner',
        url: 'https://example.com/banner.jpg',
        description: 'Main banner for the tour',
      },
    ],
  })
  @IsOptional()
  @IsObject()
  mainImages?: object[];
}