// src/userManagement/userManagement.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './userManagement.controller';
import { UserService } from './userManagement.service';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from '../auth/repositories/user.repository';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, RolesGuard, UserRepository],
  exports: [UserService],
})
export class UserManagementModule {}