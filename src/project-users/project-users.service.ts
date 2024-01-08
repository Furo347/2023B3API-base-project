// project-users.service.ts
import { Injectable } from '@nestjs/common';
import { CreateProjectUsersDto } from './dto/create-project-users.dto';
import { ProjectUserEntity } from './entities/project-users.entity';
import { Repository, Raw } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUserEntity)
    private readonly projectUserRepository: Repository<ProjectUserEntity>,
  ) {}

  async create(createProjectUsersDto: CreateProjectUsersDto): Promise<ProjectUserEntity> {
    const projectUser = this.projectUserRepository.create(createProjectUsersDto);
    return await this.projectUserRepository.save(projectUser);
  }

  async findAll(): Promise<ProjectUserEntity[]> {
    return await this.projectUserRepository.find({ relations: ['user', 'project'] });
  }

  async findOne(id: number): Promise<ProjectUserEntity | undefined> {
    return await this.projectUserRepository.findOne({
      where: { id: Raw(alias => `${alias} = ${id}`) },
      relations: ['user', 'project'],
    });
  }
}
