import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiPropertyOptional({
    description: 'Updated amount after transaction',
    example: '200.00',
  })
  @IsOptional()
  @IsString()
  updatedAmount?: string;

  @ApiPropertyOptional({
    description: 'Payment risk type',
    example: 'REFUNDED',
  })
  @IsOptional()
  @IsString()
  paymentRiskType?: string;
}