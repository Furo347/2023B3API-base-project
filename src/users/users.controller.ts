//users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpException,
  HttpStatus,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoggingInterceptor } from './interceptors/password.interceptors';


@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authservice: AuthService,
  ) {}

  // Route de connexion des utilisateurs
  @Post('auth/sign-up')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
  
  //Route de login
  @Post('auth/login')
  async login(@Body() dto: LoginUserDto): Promise<{ access_token: string }> {
    return this.authservice.signIn(dto)
  }

  // Route pour obtenir la liste de tous les utilisateurs
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUserInfo(id);
  }
  // Route pour obtenir les informations personnelles de l'utilisateur connecté
  @Get('me')
  getMyUserInfo(@Request() req) {
    return this.usersService.getUserInfo(req.user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      // Check if the user with the given 'id' exists
      const existingUser = await this.usersService.getUserInfo(id);

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Update the user's properties based on the updateUserDto
      if (updateUserDto.username) {
        existingUser.username = updateUserDto.username;
      }
      // Update other properties as needed

      // Update the user in the database using the repository's update method
      await this.usersService.userRepository.update(id, existingUser);

      // Fetch the updated user from the database (optional, but recommended)
      const updatedUser = await this.usersService.getUserInfo(id);

      return updatedUser;
    } catch (error) {
      // Handle errors and return an appropriate response
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}