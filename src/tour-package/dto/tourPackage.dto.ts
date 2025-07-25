import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class IntroductionDTO {
  @ApiProperty({
    description: 'Main title of the tour',
    example: 'Explore the Mountains',
  })
  @IsString()
  mainTitle: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  minimumPerson: number;

  @ApiProperty({
    description: 'Subtitle of the tour',
    example: 'Adventure Awaits',
  })
  @IsString()
  subTitle: string;

  @ApiProperty({ description: 'Type of the trip', example: 'Adventure' })
  @IsString()
  tripType: string;

  @ApiProperty({ description: 'Duration of the journey', example: '7 Days' })
  @IsString()
  journeyDuration: string;

  @ApiProperty({
    description: 'Start date of the journey',
    example: '2025-01-01',
  })
  @IsDateString()
  journeyStartDate: string;

  @ApiProperty({
    description: 'End date of the journey',
    example: '2025-01-07',
  })
  @IsDateString()
  journeyEndDate: string;

  @ApiProperty({
    description: 'Locations for the journey',
    example: 'Kathmandu',
    required: false,
  })
  @IsString()
  journeyLocationCity: string;

  @ApiProperty({
    description: 'Locations for the journey',
    example: 'Nepal',
    required: false,
  })
  @IsString()
  journeyLocationCountry: string;

  @ApiProperty({ description: 'Total seats available', example: '30' })
  @IsString()
  totalSeat: string;

  @ApiProperty({
    description: 'Minimum age required for the tour',
    example: '12',
  })
  @IsString()
  minimumAge: string;

  @ApiProperty({
    description: 'Maximum age allowed for the tour',
    example: '60',
  })
  @IsString()
  maximumAge: string;

  @ApiProperty({ description: 'Price of the package', example: '500.00' })
  @IsString()
  packagePrice: string;

  @ApiProperty({ description: 'Whether airfare is included', example: true })
  @IsBoolean()
  withAirFare: boolean;

  @ApiProperty({
    description: 'Whether hotel accommodation is included',
    example: true,
  })
  @IsBoolean()
  withHotel: boolean;

  @ApiProperty({
    description: 'Type of package discount (e.g., percentage or fixed)',
    example: 'percentage',
    required: false,
  })
  @IsOptional()
  @IsString()
  packageDiscountType: string;

  @ApiProperty({
    description: 'Amount of package discount',
    example: '10',
    required: false,
  })
  @IsOptional()
  @IsString()
  packageDiscountAmount: string;
}

export class TourPlanDTO {
  @ApiProperty({ description: 'Title of the plan', example: 'Day 1: Arrival' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the plan',
    example: "Morning:\nPetronas Twin Towers: Start your trip with a visit to the iconic towers. Take photos at KLCC Park and go up to the Skybridge & Observation Deck.\nSuria KLCC Mall: Explore this luxury mall right under the towers.\n\nAfternoon:\nMerdeka Square: Visit the historic heart of colonial KL, including Sultan Abdul Samad Building.\nKuala Lumpur City Gallery: Learn about KL's past, present, and future through engaging exhibits.\n\nEvening:\nKL Tower (Menara Kuala Lumpur): Go up for a panoramic sunset view of the city skyline.\nDinner at Jalan Alor: Explore this famous food street with Malaysian and Asian street food delights.",
  })
  plan: object;
}

export class TourPackageDTO {
  @ApiProperty({ description: 'Type of the package', example: 'Family' })
  packageType: string;

  @ApiProperty({ example: 'InActive' })
  status: string;

  @ApiProperty({
    description: 'Overview of the package',
    example: {
      packageOverView: 'A fun family trip to the mountains.',
      packageInclude: ['Meals', 'Guide', 'Transport'],
      destinationDetails: ['KL Tower Observation Deck', 'Central Market'],
    },
  })
  overView: object;

  @ApiProperty({
    description: 'Objectives of the package',
    example: {
      inclusion: [
        'Hotel pick-up & drop-off',
        'Professional English-speaking guide',
        'Bottled water',
        'Entrance fees',
      ],
      exclusion: ['Personal shopping', 'Travel insurance', 'Tips & gratuities'],
      bookingPolicy: [
        '50% advance payment required',
        'Confirmation within 24 hours',
      ],
      refundPolicy: 'At FlyitSearch, we understand that travel plans may change. Our refund policy is designed to be fair and transparent:\n80% Refund: If the booking is canceled more than 21 days before the start of the tour or experience.\n50% Refund: If the cancellation occurs between 14 to 21 days prior to the tour.\n30% Refund: If the cancellation is made between 7 to 14 days before the tour begins.\nNo Refund: For cancellations made less than 7 days before the experience or tour starts.\n\nPlease Note:\nConvenience fees and insurance charges are non-refundable and will be deducted from the total refund amount.\nAll eligible refunds will be processed within five (5) working days of cancellation confirmation.\nFor further queries or assistance, please contact our customer support team.',
      cancellationPolicy: "To cancel any tour booked through FlyitSearch, travelers must send an email to flyitsearch@gmail.com, clearly mentioning the booking ID along with the reason for cancellation.\nIt is the traveler's responsibility to notify FlyitSearch of any cancellations at the earliest possible time.\n\nPlease note:\nEmail is the only valid method of submitting a cancellation request. Phone calls or direct communication with FlyitSearch team members will not be considered an official cancellation.\nThe timestamp of the email will be recorded as the official time of cancellation.\n\nIn case of extraordinary events—such as natural disasters, acts of God, or government-imposed restrictions—FlyitSearch may, at its discretion, offer either alternative travel dates or a full refund.\nIf the tour is cancelled by the tour operator due to unforeseen or unavoidable circumstances, travelers will be eligible for a full refund of the tour fee.\n\nPlease be aware:\nThis cancellation policy is subject to updates or modifications without prior notice. For the most current information, refer to the FlyitSearch website or your booking confirmation voucher/invoice.\nBookings made during blackout dates, public holidays, and major festivals are considered non-refundable and non-cancellable.\nIn the event of national emergencies, lockdowns, political unrest, or natural disasters, this policy may be adjusted accordingly.\nThis cancellation policy applies to all tour cancellations, regardless of the reason.\nAll eligible refunds will be processed within five (5) working days of cancellation confirmation.",
      travelTips: [
        "Wear light, breathable clothes - it's humid!",
        "Don't forget sunscreen and a hat",
        'Bring some cash for souvenirs at local markets',
        'Comfortable shoes are a must',
      ],
    },
  })
  objective: object;

  @ApiProperty({
    description: 'Meta information for SEO',
    example: {
      metaTitle: 'Family Trip to the Mountains',
      metaKeyword: ['Family', 'Mountains', 'Holiday'],
      metadescription: 'Plan your perfect family getaway to the mountains.',
    },
  })
  metaInfo: object;

  @ApiProperty({
    description: 'Accommodation details',
    example: { hotels: ['Hotel A', 'Hotel B'], nights: 5 },
  })
  accommodation: object;

  @ApiProperty({
    description: 'Introduction details for the package',
    type: () => IntroductionDTO,
  })
  introduction: IntroductionDTO;

  @ApiProperty({
    description: 'List of tour plans for the package',
    type: () => [TourPlanDTO],
  })
  @IsOptional()
  tourPlans: TourPlanDTO[];
}