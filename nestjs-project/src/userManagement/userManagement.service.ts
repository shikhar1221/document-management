// src/userManagement/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../auth/repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Role } from '../auth/roles.enum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
      roles: createUserDto.roles as Role[],
    });
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.userRepository.findOneById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.userRepository.updateUser(id, updateUserDto);
    return this.userRepository.findOneById(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.removeUser(id);
  }
}