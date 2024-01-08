//user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { ProjectUserEntity } from '../../project-users/entities/project-users.entity'

export enum UserRole {
  Employee= 'Employee',
  Admin= 'Admin',
  ProjectManager= 'ProjectManager'
}
@Entity()
@Unique(['username','email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({unique: true})
  username!: string;

  @Column({unique :true})
  email!: string;

  @Column({ select: false })
  password!: string;
 
  @Column({ default: UserRole.Employee })
  role: UserRole

  @OneToMany(() => ProjectUserEntity, projectUser => projectUser.user)
  projectUsers: ProjectUserEntity[];
}