import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from './entities/user.entity';
import { TokenEntity } from './entities/token.entity';
import { UserRepository } from './repositories/user.repository';
import { TokenRepository } from './repositories/token.repository';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'test-secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserRepository,
    TokenRepository,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    JwtService,
  ],
  exports: [AuthService, JwtAuthGuard, JwtModule, JwtService],
})
export class AuthModule {}