import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DonationsController],
  providers: [DonationsService],
  imports: [PrismaModule],
})
export class DonationsModule {}
