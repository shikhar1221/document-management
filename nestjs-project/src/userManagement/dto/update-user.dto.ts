// src/userManagement/dto/update-user.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/roles.enum';

export class UpdateUserDto {
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  password?: string;

  @IsNotEmpty()
  roles?: Role[];
}