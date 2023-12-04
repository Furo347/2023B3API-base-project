//users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  UseInterceptors, createParamDecorator, ExecutionContext
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Public} from './auth/auth.guard';
import  {Request as ExpressRequest} from 'express'
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authservice: AuthService,
  ) {}

  @Public()
  @Post('auth/sign-up')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post('auth/login')
  async login(@Body() dto: LoginUserDto): Promise<{ access_token: string }> {
    const access_token = await this.authservice.signIn(dto)
    return { access_token }
  }
  
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('/me')
  async getMyUserInfo(@Request() req: ExpressRequest): Promise<User> {
    return req.user as User;
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User>{
    const user= await this.usersService.getUserInfo(id);
    if(!user) throw new NotFoundException();
    return user;
  }
}