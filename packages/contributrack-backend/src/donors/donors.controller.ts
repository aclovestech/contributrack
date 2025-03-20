import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DonorsService } from './donors.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { User } from 'src/decorators/user.decorator';
import { PaginationDto } from '../shared/dto/pagination.dto';

@Controller('donors')
@UseGuards(JwtAuthGuard)
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Get()
  async getAllDonors(
    @User('id') user_id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.donorsService.findAllDonors(user_id, paginationDto);
  }

  @Get(':id')
  async getDonor(@User('id') user_id: string, @Param('id') id: string) {
    return await this.donorsService.findDonor(user_id, id);
  }

  @Get(':id/donations')
  async getDonorDonations(
    @User('id') user_id: string,
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.donorsService.findDonorDonations(
      user_id,
      id,
      paginationDto,
    );
  }

  @Post()
  async create(
    @Body() createDonorDto: CreateDonorDto,
    @User('id') user_id: string,
  ) {
    return await this.donorsService.create(createDonorDto, user_id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDonorDto: UpdateDonorDto,
    @User('id') user_id: string,
  ) {
    return await this.donorsService.update(id, updateDonorDto, user_id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User('id') user_id: string) {
    return await this.donorsService.remove(id, user_id);
  }
}
