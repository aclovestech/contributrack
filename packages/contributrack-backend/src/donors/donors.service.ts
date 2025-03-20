import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { PaginationDto } from '../shared/dto/pagination.dto';

@Injectable()
export class DonorsService {
  constructor(private prismaService: PrismaService) {}

  async findAllDonors(user_id: string, paginationDto: PaginationDto) {
    const { page, pageSize, sort } = paginationDto;

    const [donors, totalCount] = await this.prismaService.$transaction([
      this.prismaService.donor.findMany({
        where: { user_id: user_id },
        orderBy: { name: sort },
        take: pageSize,
        skip: (page - 1) * pageSize,
        omit: { user_id: true, created_at: true, updated_at: true },
      }),
      this.prismaService.donor.count({ where: { user_id: user_id } }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      total_count: totalCount,
      total_pages: totalPages,
      current_page: page,
      page_size: pageSize,
      items: donors,
    };
  }

  async findDonor(user_id: string, id: string) {
    const [donor, totalDonations, lastDonation] =
      await this.prismaService.$transaction([
        this.prismaService.donor.findUnique({
          where: { user_id: user_id, id: id },
          omit: { user_id: true, created_at: true, updated_at: true },
        }),
        this.prismaService.donation.aggregate({
          where: { user_id: user_id, donor_id: id },
          _count: { _all: true },
          _sum: { amount: true },
        }),
        this.prismaService.donation.findFirst({
          where: { user_id: user_id, donor_id: id },
          orderBy: { date_received: 'desc' },
          select: {
            date_received: true,
          },
        }),
      ]);

    return {
      ...donor,
      donation_summary: {
        total_donations: totalDonations._count._all,
        total_amount: totalDonations._sum.amount,
        last_donation: lastDonation?.date_received,
      },
    };
  }

  async findDonorDonations(
    user_id: string,
    id: string,
    paginationDto: PaginationDto,
  ) {
    const { page, pageSize, sort } = paginationDto;

    const [donor, donations, totalCount] =
      await this.prismaService.$transaction([
        this.prismaService.donor.findUnique({
          where: { user_id: user_id, id: id },
          select: { id: true, name: true },
        }),
        this.prismaService.donation.findMany({
          where: { user_id: user_id, donor_id: id },
          orderBy: { date_received: sort },
          take: pageSize,
          skip: (page - 1) * pageSize,
          omit: {
            user_id: true,
            created_at: true,
            updated_at: true,
            donor_id: true,
          },
        }),
        this.prismaService.donation.count({
          where: { user_id: user_id, donor_id: id },
        }),
      ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      ...donor,
      donations: {
        total_count: totalCount,
        total_pages: totalPages,
        current_page: page,
        page_size: pageSize,
        items: donations,
      },
    };
  }

  async create(createDonorDto: CreateDonorDto, user_id: string) {
    return await this.prismaService.donor.create({
      data: { ...createDonorDto, user_id: user_id },
    });
  }

  async update(id: string, updateDonorDto: UpdateDonorDto, user_id: string) {
    return await this.prismaService.donor.update({
      where: { id: id, user_id: user_id },
      data: updateDonorDto,
    });
  }

  async remove(id: string, user_id: string) {
    return await this.prismaService.donor.delete({
      where: { id: id, user_id: user_id },
    });
  }
}
