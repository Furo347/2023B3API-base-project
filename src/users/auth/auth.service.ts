import {
    Injectable,
    UnauthorizedException,
    Inject,
    forwardRef,
  } from '@nestjs/common';
  import { UsersService } from '../users.service';
  import { JwtService } from '@nestjs/jwt';
  import * as Argon2 from 'argon2';
  import { LoginUserDto } from '../dto/login-user.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
    ) {}
  
    async signIn(dto: LoginUserDto) {
      const user = await this.usersService.findByEmail(dto.email);
      
      if (!user || !(await Argon2.verify(user.password, dto.password))) {
        throw new UnauthorizedException();
      }
  
      const payload = { sub: user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }