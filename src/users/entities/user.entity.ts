//user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEmail, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ProjectUser} from '../../project-users/entities/project-users.entity'

export enum UserRole {
  Employee = 'Employee',
  Admin = 'Admin',
  ProjectManager = 'ProjectManager',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail({}, { message: "L'adresse e-mail n'est pas valide" })
  email: string;

  @Exclude()
  @Column({
    select: false
  })
  password: string;

  @Column({ default: UserRole.Employee })
  @IsOptional()
  role: UserRole;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.userId)
  projectUsers: ProjectUser[];
}

export default User;