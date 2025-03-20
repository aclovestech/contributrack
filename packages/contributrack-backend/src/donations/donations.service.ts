import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { DateRangeDto } from 'src/shared/dto/date-range.dto';

@Injectable()
export class DonationsService {
  constructor(private prismaService: PrismaService) {}

  async findAllDonations(user_id: string, paginationDto: PaginationDto) {
    const { page, pageSize, sort } = paginationDto;

    const [donations, totalCount] = await this.prismaService.$transaction([
      this.prismaService.donation.findMany({
        where: { user_id: user_id },
        orderBy: { date_received: sort },
        take: pageSize,
        skip: (page - 1) * pageSize,
        omit: { user_id: true, donor_id: true },
        include: { donor: { select: { id: true, name: true } } },
      }),
      this.prismaService.donation.count({ where: { user_id: user_id } }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      total_count: totalCount,
      total_pages: totalPages,
      current_page: page,
      page_size: pageSize,
      donations: donations,
    };
  }

  async findDonation(user_id: string, id: string) {
    return await this.prismaService.donation.findUnique({
      where: { user_id: user_id, id: id },
      omit: { user_id: true, donor_id: true },
      include: { donor: { select: { id: true, name: true } } },
    });
  }

  async findDonationSummary(user_id: string, dateRangeDto: DateRangeDto) {
    const { start, end } = dateRangeDto;

    let startDate = start;
    let endDate = end;

    if (startDate && endDate && startDate > endDate) {
      throw new Error('Start date cannot be greater than end date');
    }

    if (!startDate || !endDate) {
      const [firstDay, lastDay] = await this.prismaService.$transaction([
        this.prismaService.donation.findFirst({
          where: { user_id: user_id },
          orderBy: { date_received: 'asc' },
          select: { date_received: true },
        }),
        this.prismaService.donation.findFirst({
          where: { user_id: user_id },
          orderBy: { date_received: 'desc' },
          select: { date_received: true },
        }),
      ]);

      startDate = startDate || firstDay?.date_received;
      endDate = endDate || lastDay?.date_received;

      if (!startDate || !endDate) {
        throw new Error('Date range is not defined');
      }
    }

    const [
      totalDonations,
      totalTithes,
      totalMissionOfferings,
      totalDailySeeds,
      totalOthers,
    ] = await this.prismaService.$transaction([
      this.prismaService.donation.aggregate({
        where: {
          user_id: user_id,
          date_received: { gte: startDate, lte: endDate },
        },
        _count: { _all: true },
        _sum: { amount: true },
      }),
      this.prismaService.donation.aggregate({
        where: {
          user_id: user_id,
          donation_type: 'TITHES',
          date_received: { gte: startDate, lte: endDate },
        },
        _count: { _all: true },
        _sum: { amount: true },
      }),
      this.prismaService.donation.aggregate({
        where: {
          user_id: user_id,
          donation_type: 'MISSION_OFFERING',
          date_received: { gte: startDate, lte: endDate },
        },
        _count: { _all: true },
        _sum: { amount: true },
      }),
      this.prismaService.donation.aggregate({
        where: {
          user_id: user_id,
          donation_type: 'DAILY_SEED',
          date_received: { gte: startDate, lte: endDate },
        },
        _count: { _all: true },
        _sum: { amount: true },
      }),
      this.prismaService.donation.aggregate({
        where: {
          user_id: user_id,
          donation_type: 'OTHER',
          date_received: { gte: startDate, lte: endDate },
        },
        _count: { _all: true },
        _sum: { amount: true },
      }),
    ]);

    const summaryByType = [
      {
        donation_type: 'TITHES',
        count: totalTithes._count._all,
        total_amount: totalTithes._sum.amount?.toFixed(2),
      },
      {
        donation_type: 'MISSION_OFFERING',
        count: totalMissionOfferings._count._all,
        total_amount: totalMissionOfferings._sum.amount?.toFixed(2),
      },
      {
        donation_type: 'DAILY_SEED',
        count: totalDailySeeds._count._all,
        total_amount: totalDailySeeds._sum.amount?.toFixed(2),
      },
      {
        donation_type: 'OTHER',
        count: totalOthers._count._all,
        total_amount: totalOthers._sum.amount?.toFixed(2),
      },
    ];

    return {
      date_range: {
        start: startDate,
        end: endDate,
      },
      total_donations: totalDonations._count._all,
      total_amount: totalDonations._sum.amount?.toFixed(2),
      summary_by_type: summaryByType,
    };
  }

  async create(user_id: string, createDonationDto: CreateDonationDto) {
    return await this.prismaService.donation.create({
      data: { ...createDonationDto, user_id: user_id },
    });
  }

  async update(
    user_id: string,
    id: string,
    updateDonationDto: UpdateDonationDto,
  ) {
    return await this.prismaService.donation.update({
      where: { id: id, user_id: user_id },
      data: updateDonationDto,
    });
  }

  async remove(user_id: string, id: string) {
    return await this.prismaService.donation.delete({
      where: { id: id, user_id: user_id },
    });
  }
}
