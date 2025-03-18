import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Injectable()
export class DonationsService {
  constructor(private prismaService: PrismaService) {}

  create(createDonationDto: CreateDonationDto, user_id: string) {
    return this.prismaService.donation.create({
      data: { ...createDonationDto, user_id: user_id },
    });
  }

  findAll(user_id: string) {
    return this.prismaService.donation.findMany({
      where: { user_id: user_id },
    });
  }

  findOne(id: string, user_id: string) {
    return this.prismaService.donation.findUnique({
      where: { id: id, user_id: user_id },
    });
  }

  update(id: string, updateDonationDto: UpdateDonationDto, user_id: string) {
    return this.prismaService.donation.update({
      where: { id: id, user_id: user_id },
      data: updateDonationDto,
    });
  }

  remove(id: string, user_id: string) {
    return this.prismaService.donation.delete({
      where: { id: id, user_id: user_id },
    });
  }
}
