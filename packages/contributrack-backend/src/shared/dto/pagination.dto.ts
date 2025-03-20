import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === 0 ? 10 : Number(value)))
  pageSize: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value === 0 ? 1 : Number(value)))
  page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? 'asc' : String(value)))
  sort: 'asc' | 'desc' = 'asc';
}
