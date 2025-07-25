import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AmountDto {
  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @IsNumber()
  value: number;
}

export class PaymentLinkRequestDto {
  @ApiProperty({ type: AmountDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AmountDto)
  amount: AmountDto;

  @ApiProperty()
  @IsString()
  reference: string;
}