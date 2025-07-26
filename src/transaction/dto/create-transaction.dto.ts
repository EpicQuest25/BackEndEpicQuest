import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'The unique transaction ID',
    example: 'EPQT12345678',
  })
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @ApiPropertyOptional({
    description: 'Payment gateway data (if applicable)',
    example: { paymentMethod: 'cash', reference: '12345' },
  })
  @IsOptional()
  gatewayData?: any;

  @ApiPropertyOptional({
    description: 'Payment risk type',
    example: 'CASH_PAYMENT',
  })
  @IsOptional()
  @IsString()
  paymentRiskType?: string;

  @ApiPropertyOptional({
    description: 'Gateway reference (if applicable)',
    example: 'REF123456',
  })
  @IsOptional()
  @IsString()
  gatewayReferance?: string;

  @ApiPropertyOptional({
    description: 'Gateway ID (if applicable)',
    example: 'GW123456',
  })
  @IsOptional()
  @IsString()
  gatewayid?: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Transaction amount',
    example: '100.00',
  })
  @IsNotEmpty()
  @IsString()
  amount: string;

  @ApiPropertyOptional({
    description: 'Updated amount after transaction',
    example: '200.00',
  })
  @IsOptional()
  @IsString()
  updatedAmount?: string;

  @ApiPropertyOptional({
    description: 'Previous amount before transaction',
    example: '100.00',
  })
  @IsOptional()
  @IsString()
  previousAmount?: string;

  @ApiPropertyOptional({
    description: 'User ID (if transaction is associated with a user)',
    example: 1,
  })
  @IsOptional()
  userId?: number;

  @ApiPropertyOptional({
    description: 'Agent ID (if transaction is associated with an agent)',
    example: 1,
  })
  @IsOptional()
  agentId?: number;
}