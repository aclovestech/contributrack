import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';

@Injectable()
export class DonorsService {
  constructor(private prismaService: PrismaService) {}

  create(createDonorDto: CreateDonorDto) {
    return this.prismaService.donor.create({ data: createDonorDto });
  }

  findAll() {
    return this.prismaService.donor.findMany();
  }

  findOne(id: string) {
    return this.prismaService.donor.findUnique({ where: { id } });
  }

  update(id: string, updateDonorDto: UpdateDonorDto) {
    return this.prismaService.donor.update({
      where: { id },
      data: updateDonorDto,
    });
  }

  remove(id: string) {
    return this.prismaService.donor.delete({ where: { id } });
  }
}
