import { Gender, Role } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  full_name: string;

  @IsEnum(Gender, { each: true })
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  birthday: string;

  @IsEnum(Role, { each: true })
  @IsOptional()
  role: Role;

  @IsBoolean()
  @IsOptional()
  is_enabled: boolean;

  @IsBoolean()
  @IsOptional()
  status: boolean;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
