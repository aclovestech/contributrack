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
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { User } from 'src/decorators/user.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { DateRangeDto } from 'src/shared/dto/date-range.dto';

@Controller('donations')
@UseGuards(JwtAuthGuard)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get()
  async getAllDonations(
    @User('id') user_id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.donationsService.findAllDonations(user_id, paginationDto);
  }

  @Get('summary')
  async getDonationSummary(
    @User('id') user_id: string,
    @Query() dateRangeDto: DateRangeDto,
  ) {
    return await this.donationsService.findDonationSummary(
      user_id,
      dateRangeDto,
    );
  }

  @Get(':id')
  async getDonation(@User('id') user_id: string, @Param('id') id: string) {
    return await this.donationsService.findDonation(user_id, id);
  }

  @Post()
  async create(
    @User('id') user_id: string,
    @Body() createDonationDto: CreateDonationDto,
  ) {
    return await this.donationsService.create(user_id, createDonationDto);
  }

  @Patch(':id')
  async update(
    @User('id') user_id: string,
    @Param('id') id: string,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return await this.donationsService.update(user_id, id, updateDonationDto);
  }

  @Delete(':id')
  async remove(@User('id') user_id: string, @Param('id') id: string) {
    return await this.donationsService.remove(user_id, id);
  }
}
