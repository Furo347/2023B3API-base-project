//create-user.dto.ts
import { IsString, IsOptional, IsEnum, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
   
  @IsString()
  username!: string;

  @IsNotEmpty() 
  @IsString()
  @IsEmail()
  email!: string;

  @IsNotEmpty() 
  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional() 
  @IsEnum(UserRole)
  role?: UserRole;

}