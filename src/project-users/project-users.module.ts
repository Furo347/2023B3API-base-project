// project-users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Ajoute cette ligne
import { ProjectUsersService } from './project-users.service';
import { ProjectUsersController } from './project-users.controller';
import { ProjectUserEntity } from './entities/project-users.entity'; // Assure-toi que le chemin est correct

@Module({
  imports: [TypeOrmModule.forFeature([ProjectUserEntity])], // Ajoute cette ligne avec l'entité ProjectUserEntity
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService],
})
export class ProjectUsersModule {}
