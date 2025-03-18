import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

// Wait for environment variables to be loaded first
async function getJwtModule() {
  await ConfigModule.envVariablesLoaded;
  return JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '10m' },
  });
}

@Module({
  imports: [UsersModule, PassportModule, getJwtModule(), PrismaModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
