// src/userManagement/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../../auth/enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: ['viewer'], description: 'The roles of the user', isArray: true })
  @IsNotEmpty()
  roles: Role[];
}
