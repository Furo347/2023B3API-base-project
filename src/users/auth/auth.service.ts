//auth.service.ts
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
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async signIn(dto: LoginUserDto): Promise<string> {
    const user = await this.users.findByEmail(dto.email);
    
    if (!user || !(await Argon2.verify(user.password, dto.password))) {
      throw new UnauthorizedException();
    }

    return this.jwt.signAsync({ sub: user.id }, {})
  }

  async authFromToken(token: string): Promise<User | null> {
    const payload = await this.jwt.verifyAsync(token)

    if (payload && payload.sub) {
      const user = this.users.findById(payload.sub)

      if (user) return user
    }

    return null
  }
}