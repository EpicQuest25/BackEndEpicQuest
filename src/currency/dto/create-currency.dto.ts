import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @ApiProperty()
  currency: string;

  @ApiProperty()
  value: number;
}