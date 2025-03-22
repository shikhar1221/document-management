// src/userManagement/dto/update-user.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {

  @ApiProperty({ example: ['admin'], description: 'The roles of the user', isArray: true })
  @IsNotEmpty()
  roles?: Role[];
}