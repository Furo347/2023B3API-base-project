//users.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Import Repository from TypeORM
import * as Argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    
      const newUser = this.userRepository.create({...createUserDto,
      password: await this.hashPassword(createUserDto.password)});
      const inserteddata=  await this.userRepository.save(newUser);
      return inserteddata;
    
  }


  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async hashPassword(password: string): Promise<string> {
    return Argon2.hash(password);
  }

  
  async getUserInfo(id: string): Promise<User | null> {
    console.log(id)
    return await this.userRepository.findOne({ where: { username: id }});
  }

  findAll() {
    return this.userRepository.find();
  }

}