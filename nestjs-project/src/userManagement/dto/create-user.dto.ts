// src/userManagement/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../../auth/roles.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  roles: Role[];
}
