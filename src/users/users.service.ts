//users.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto, isUUID } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService, 
  ) {}
  async create(createUser: CreateUserDto) {
    const saltOrRounds = 10;
    const user = this.userRepository.create({
      ...createUser,
      password: await bcrypt.hash(createUser.password, saltOrRounds),
    });
    const insertedUser = await this.userRepository.save(user);
    delete insertedUser.password;
    return insertedUser;
  }

  async signIn(loginUserDto: loginUserDto) {
    const options: FindOneOptions<User> = {
      where: { email: loginUserDto.email },
      select: ['email', 'id', 'password', 'role' ]
    };
    const user = await this.userRepository.findOne(options);
    const match = await bcrypt.compare(loginUserDto.password, user.password);
    if (!match) {
      throw new UnauthorizedException(); 
    }
    const tokken = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(tokken),
    };
  }

  async findAll(): Promise<User[]> {
    const allUsers = await this.userRepository.find();
    for (const user of allUsers) {
      delete user.password;
    }
    return allUsers;
  }

  async returnUser(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('invalid UUID');
    }
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (user === null) {
      throw new NotFoundException(`le User avec l' ${id} est inconnue`);
    }
    delete user.password;
    return user;
  }
}