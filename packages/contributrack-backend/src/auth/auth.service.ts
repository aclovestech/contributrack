import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUserByUsername(username);

    if (!user) {
      return null;
    }

    const isVerified = await this.verifyPassword(
      user.hashed_password,
      password,
    );

    if (user && isVerified) {
      return user;
    }

    return null;
  }

  login(user: User | undefined) {
    const payload = { username: user?.username, sub: user?.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, password: string): Promise<User | null> {
    const hashedPassword = await this.hashPassword(password);

    const user = this.prismaService.user.create({
      data: {
        username: username,
        hashed_password: hashedPassword,
      },
    });

    if (user === null) {
      return null;
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async verifyPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }
}
