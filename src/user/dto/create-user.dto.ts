import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsPhoneNumber('RU')
  phone: string;

  @IsStrongPassword({ minLength: 6, minNumbers: 2, minSymbols: 1 })
  password: string;

  role: Role;
}
