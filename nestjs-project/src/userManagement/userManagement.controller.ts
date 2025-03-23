// src/userManagement/user.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './userManagement.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/auth/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permissions.enum';

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Permissions(Permission.USERS_CREATE)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: UserEntity })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @Permissions(Permission.USERS_READ)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.', type: [UserEntity] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.Admin)
  @Permissions(Permission.USERS_READ)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.', type: UserEntity })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(Role.Admin)
  @Permissions(Permission.USERS_UPDATE)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: UserEntity })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(Role.Admin)
  @Permissions(Permission.USERS_DELETE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}