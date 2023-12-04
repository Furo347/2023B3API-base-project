//login-user.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}