import {
  Controller,
  Req,
  Get,
  Post,
  UseGuards,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  registrationPassword = process.env.REGISTRATION_PASSWORD;

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Post('register')
  async register(
    @Body()
    createUserDto: CreateUserDto,
  ) {
    if (
      createUserDto.registrationPassword !== this.registrationPassword ||
      !this.registrationPassword
    ) {
      throw new UnauthorizedException();
    }

    return await this.authService.register(
      createUserDto.username,
      createUserDto.password,
    );
  }
}
