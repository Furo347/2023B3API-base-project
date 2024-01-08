// project-user.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectEntity } from '../../projects/entities/project.entity';

@Entity()
export class ProjectUserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

  @ManyToOne(() => User, user => user.projectUsers)
  user: User;

  @ManyToOne(() => ProjectEntity, project => project.projectUsers)
  project: ProjectEntity;
}
