import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsIn } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tradingName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  legalName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(15)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  businessRegisterNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  registeredCountry: string;
}

export class updateRole {
  @ApiProperty({
    description: 'The role of the user',
    enum: ['ACTIVE', 'REJECTED'],
    example: 'ACTIVE',
  })
  @IsIn(['ACTIVE', 'REJECTED'], {
    message: 'Role must be either "ACTIVE" or "REJECTED"',
  })
  status: string;

  @ApiProperty()
  @IsString()
  email: string;
}

export class addRolesToSupplier {
  @ApiProperty({ example: 'find_thesupplier' })
  role: string;

  @ApiProperty()
  supplierEmail: string;
}