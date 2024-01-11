//project-users.controller.ts
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  ConflictException,
  Get,
  UnauthorizedException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsUsersService } from './project-users.service';
import { CreateProjectUserDto } from './dto/create-project-users.dto';
import { AuthGuard } from '../auth/guard';

@Controller('project-users')
export class ProjectUsersController {
  constructor(private readonly projectUserService: ProjectsUsersService) {}
  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(@Body() createProjectUserDto: CreateProjectUserDto, @Req() req) {
    if (req.user.role == 'Employee') {
      throw new UnauthorizedException('Accès refusé');
    }

    const existingProjectUser = await this.projectUserService.findByEmployee(createProjectUserDto);

    if (existingProjectUser !== null) {
      throw new ConflictException(
        "L'utilisateur possède déjà un projet sur les dates saisie.",
      );
    }
    const projectUser = await this.projectUserService.create(createProjectUserDto);
    if (projectUser !== null) {
      return projectUser;
    } else {
      throw new NotFoundException();
    }
  }
  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req) {
    if (req.user.role == 'Admin' || req.user.role == 'ProjectManager') {
      const projectsUser = this.projectUserService.findAll();
      if (projectsUser == null) {
          throw new NotFoundException();
      }
      return projectsUser;
  }
  else {
      const projetUser = this.projectUserService.findOneProject(req.user.sub);
      if (projetUser == null) {
          throw new UnauthorizedException('ProjectUser not found');
      }
      return projetUser;
  }
}
  @Get(':id')
  @UseGuards(AuthGuard)
  async findprojectUser(@Param('id') projectUserId: string, @Req() req) {
    const projectUsers = await this.projectUserService.findOne(projectUserId);
    if (projectUsers == null) {
      throw new UnauthorizedException('ProjectUser not found');
    }
    if (req.user.role == 'Admin' || req.user.role == 'ProjectManager') {
      return projectUsers;
    } else {
      if (projectUsers.userId === req.user.sub) {
        return projectUsers;
      }
    }
  }
}