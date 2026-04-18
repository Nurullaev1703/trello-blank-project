import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const httpResponse = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // If the service returned a plain string — treat it as a status message
        if (typeof data === 'string') {
          return {
            statusCode: httpResponse.statusCode || HttpStatus.OK,
            message: data,
            data: null,
          };
        }

        // Otherwise wrap the whole payload in data
        return {
          statusCode: httpResponse.statusCode || HttpStatus.OK,
          message: 'Success',
          data: data ?? null,
        };
      }),
    );
  }
}
