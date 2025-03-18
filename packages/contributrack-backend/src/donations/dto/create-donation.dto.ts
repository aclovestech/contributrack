import { ApiProperty } from '@nestjs/swagger';
import { DonationType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsUUID } from 'class-validator';

export class CreateDonationDto {
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  date_received: Date;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  amount: number;

  @IsEnum(DonationType)
  @ApiProperty()
  donation_type: DonationType;

  @IsUUID()
  @ApiProperty()
  donor_id: string;
}
