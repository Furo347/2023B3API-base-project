//events.controller.ts

import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UsePipes,
    Req,
    UseGuards,
    Get,
    Param,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { EventsService } from './events.service';
  import { CreateEventDto } from './dto/create-event.dto';
  import { AuthGuard } from '../auth/guard';
  import { ProjectsUsersService } from '../project-users/project-users.service';
  
  @Controller('events')
  export class EventsController {
    constructor(
      private readonly eventService: EventsService,
      private readonly projectUserService: ProjectsUsersService,
    ) {}
    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    create(@Body() createEventDto: CreateEventDto, @Req() req) {
      const userId = req.user.sub;
      return this.eventService.createEvent(userId, createEventDto);
    }
    @Get(':id')
    @UseGuards(AuthGuard)
    getEvent(@Param('id') event: string) {
      return this.eventService.getEvent(event);
    }
    @Get()
    @UseGuards(AuthGuard)
    getAll() {
      return this.eventService.getAll();
    }
    @UseGuards(AuthGuard)
    @Post('/:id/validate')
    async validateEvent(@Param('id') eventId: string, @Req() req) {
      try {
        if (req.user.role === 'Employee') {
          throw new UnauthorizedException();
        }
        const event = await this.eventService.getEvent(eventId);
        if (
          event.eventStatus === 'Accepted' ||
          event.eventStatus === 'Declined'
        ) {
          throw new ForbiddenException(
            'Ne peut pas modifier le statut d\'un événement validé ou refusé',
          );
        }
  
        if (req.user.role === 'ProjectManager') {
          const autorized = await this.projectUserService.managerDate(
            req.user.sub,
            event.date,
          );
  
  
  
          if (autorized == null) {
            throw new UnauthorizedException();
          }
          const update = await this.eventService.updateEvent(eventId);
          return update;
        }
        if (req.user.role == 'Admin') {
          const update = await this.eventService.updateEvent(eventId);
          return update;
        }
      } catch (error) {
        throw new UnauthorizedException('Evenement non trouvé');
      }
    }
    @UseGuards(AuthGuard)
    @Post('/:id/decline')
    async declineEvent(@Param('id') eventId: string, @Req() req) {
      try {
        if (req.user.role === 'Employee') {
          throw new UnauthorizedException();
        }
        const event = await this.eventService.getEvent(eventId);
        if (
          event.eventStatus === 'Accepted' ||
          event.eventStatus === 'Declined'
        ) {
          throw new ForbiddenException(
            'Impossible de modifier le statut d\'un événement validé ou refusé',
          );
        }
  
        if (req.user.role === 'ProjectManager') {
          const isAuthorized = await this.projectUserService.managerDate(
            req.user.sub,
            event.date,
          );
          if (isAuthorized == null) {
            throw new UnauthorizedException();
          }
          const update = await this.eventService.declineEvent(eventId);
          return update;
        }
        if (req.user.role == 'Admin') {
          const update = await this.eventService.declineEvent(eventId);
          return update;
        }
      } catch (error) {
        throw new UnauthorizedException('Evenement inconnu');
      }
    }
  }