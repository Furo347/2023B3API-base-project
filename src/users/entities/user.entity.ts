//user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
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

  @Column({unique :true})
  username!: string;

  @Column({unique :true})
  email!: string;

  @Column()
  password!: string;
 
  @Column({ default: UserRole.Employee })
  role: UserRole
}