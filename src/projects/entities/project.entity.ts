// project.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProjectUserEntity } from '../../project-users/entities/project-users.entity';

@Entity()
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectName: string;

  @OneToMany(() => ProjectUserEntity, projectUser => projectUser.project)
  projectUsers: ProjectUserEntity[];

}
