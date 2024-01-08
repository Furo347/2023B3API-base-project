// project.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { ProjectUser } from '../../project-users/entities/project-users.entity';
import User from '../../users/entities/user.entity';
@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  referringEmployeeId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'referringEmployeeId' })
  referringEmployee: User;

  @ManyToMany(() => ProjectUser, (projectUser) => projectUser.projectId)
  projectUsers: ProjectUser[];
}

export default Project;
