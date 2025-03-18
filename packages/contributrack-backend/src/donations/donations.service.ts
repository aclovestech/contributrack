import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';

@Injectable()
export class DonationsService {
  constructor(private prismaService: PrismaService) {}

  create(createDonationDto: CreateDonationDto) {
    return this.prismaService.donation.create({ data: createDonationDto });
  }

  findAll() {
    return this.prismaService.donation.findMany();
  }

  findOne(id: string) {
    return this.prismaService.donation.findUnique({ where: { id } });
  }

  update(id: string, updateDonationDto: UpdateDonationDto) {
    return this.prismaService.donation.update({
      where: { id },
      data: updateDonationDto,
    });
  }

  remove(id: string) {
    return this.prismaService.donation.delete({ where: { id } });
  }
}
