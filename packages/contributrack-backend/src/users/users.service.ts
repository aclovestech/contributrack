import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  findUserByUsername(username: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { username: username },
    });
  }
}
