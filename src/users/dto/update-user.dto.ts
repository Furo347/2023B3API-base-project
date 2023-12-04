// update-user.dto.ts
import { IsString, IsOptional, IsEnum, IsEmail} from 'class-validator';

export class UpdateUserDto {
  @IsOptional() // Makes this field optional for updates
  @IsString()
  username?: string;

  @IsOptional() // Makes this field optional for updates
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional() // Makes this field optional for updates
  @IsString()
  password?: string;

  @IsOptional() // Makes this field optional for updates
  @IsEnum(['Employee', 'Admin', 'ProjectManager'])
  role?: 'Employee' | 'Admin' | 'ProjectManager';

}