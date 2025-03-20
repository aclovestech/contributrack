import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

export class DateRangeDto {
  @ApiProperty()
  @IsOptional()
  @IsDate()
  start: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  end: Date;
}
