//projects.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Project from './entities/project.entity';
import { ProjectsUsersModule } from '../project-users/project-users.module';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => ProjectsUsersModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [
    ProjectsController,

  ],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}