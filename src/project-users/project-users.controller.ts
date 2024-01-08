//project-users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import {CreateProjectUsersDto} from './dto/create-project-users.dto'
import { ProjectUserEntity } from './entities/project-users.entity';

@Controller('project-users')
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) {}

  @Post()
  create(@Body() CreateProjectUsersDto: CreateProjectUsersDto) {
    return this.projectUsersService.create(CreateProjectUsersDto);
  }

  @Get()
  findAll(): Promise<ProjectUserEntity[]> {
    return this.projectUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProjectUserEntity | undefined> {
    return this.projectUsersService.findOne(+id);
  }
}