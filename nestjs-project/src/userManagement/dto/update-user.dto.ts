// src/userManagement/dto/update-user.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ example: ['admin'], description: 'The roles of the user', isArray: true })
  @IsNotEmpty()
  roles?: Role[];
}