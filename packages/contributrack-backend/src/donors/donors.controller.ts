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
import { DonorsService } from './donors.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('donors')
@UseGuards(JwtAuthGuard)
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}

  @Post()
  create(@Body() createDonorDto: CreateDonorDto, @User('id') user_id: string) {
    return this.donorsService.create(createDonorDto, user_id);
  }

  @Get()
  findAll(@User('id') user_id: string) {
    return this.donorsService.findAll(user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('id') user_id: string) {
    return this.donorsService.findOne(id, user_id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDonorDto: UpdateDonorDto,
    @User('id') user_id: string,
  ) {
    return this.donorsService.update(id, updateDonorDto, user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') user_id: string) {
    return this.donorsService.remove(id, user_id);
  }
}
