import { ApiProperty } from '@nestjs/swagger';
import { DonationType } from '@prisma/client';
import { IsDate, IsEnum, IsNumber, IsUUID } from 'class-validator';

export class CreateDonationDto {
  @IsUUID()
  @ApiProperty()
  user_id: string;

  @IsDate()
  @ApiProperty()
  date_received: Date;

  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsEnum(DonationType)
  @ApiProperty()
  donation_type: DonationType;

  @IsUUID()
  @ApiProperty()
  donor_id: string;
}
