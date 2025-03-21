import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDonorDto {
  @IsString()
  @MinLength(2)
  @ApiProperty()
  name: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  phone_number?: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  @ApiProperty({ required: false })
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  @ApiProperty({ required: false })
  notes?: string;
}
