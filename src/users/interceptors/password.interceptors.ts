import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../entities/user.entity';

@Injectable()
export class LoggingInterceptor implements NestInterceptor<User, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    return next
      .handle()
      .pipe(
        map((u: User) => {
            delete u.password
            return u
        }),
      );
  }
}