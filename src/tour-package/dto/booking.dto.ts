import { ApiProperty } from '@nestjs/swagger';

export class tourBookingDto {
  @ApiProperty({ example: 'PKG154151' })
  tourpackageId: string;

  @ApiProperty({ example: 'Hasibul Islam' })
  firstName: string;

  @ApiProperty({ example: 'Shaon' })
  lastName: string;

  @ApiProperty({ example: '155421' })
  phone: string;

  @ApiProperty({ example: '2025-05-05' })
  travelDate: string;

  @ApiProperty({ example: 'Need to add some people.Contact me imideately' })
  text: object;
}