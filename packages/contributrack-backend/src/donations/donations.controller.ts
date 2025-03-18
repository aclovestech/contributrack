import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('donations')
@UseGuards(JwtAuthGuard)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  create(
    @Body() createDonationDto: CreateDonationDto,
    @User('id') user_id: string,
  ) {
    return this.donationsService.create(createDonationDto, user_id);
  }

  @Get()
  findAll(@User('id') user_id: string) {
    return this.donationsService.findAll(user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('id') user_id: string) {
    return this.donationsService.findOne(id, user_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDonationDto: UpdateDonationDto,
    @User('id') user_id: string,
  ) {
    return this.donationsService.update(id, updateDonationDto, user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') user_id: string) {
    return this.donationsService.remove(id, user_id);
  }
}
