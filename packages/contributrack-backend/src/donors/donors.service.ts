import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';

@Injectable()
export class DonorsService {
  constructor(private prismaService: PrismaService) {}

  create(createDonorDto: CreateDonorDto, user_id: string) {
    return this.prismaService.donor.create({
      data: { ...createDonorDto, user_id: user_id },
    });
  }

  findAll(user_id: string) {
    return this.prismaService.donor.findMany({
      where: { user_id: user_id },
    });
  }

  findOne(id: string, user_id: string) {
    return this.prismaService.donor.findUnique({
      where: { id: id, user_id: user_id },
    });
  }

  update(id: string, updateDonorDto: UpdateDonorDto, user_id: string) {
    return this.prismaService.donor.update({
      where: { id: id, user_id: user_id },
      data: updateDonorDto,
    });
  }

  remove(id: string, user_id: string) {
    return this.prismaService.donor.delete({
      where: { id: id, user_id: user_id },
    });
  }
}
