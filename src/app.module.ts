//app.module.ts

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProjectsUsersModule } from './project-users/project-users.module';
import { EventsModule } from './events/events.module';
import { ProjectsModule } from './projects/projects.module';
import User from './users/entities/user.entity';
import Project from './projects/entities/project.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwtStrat';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constant';
import { ProjectUser } from './project-users/entities/project-users.entity';
import { Event } from './events/entities/events.entity';
import { RequestLoggerMiddleware } from './auth/logMiddleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project, ProjectUser, Event],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    ProjectsUsersModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}