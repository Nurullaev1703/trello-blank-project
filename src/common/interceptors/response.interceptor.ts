import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const message = typeof data === 'string' ? data : data?.message || 'Success';
        const resultData = data?.data !== undefined ? data.data : (data?.message ? (Object.keys(data).length > 1 ? (({message: _m, ...rest}) => rest)(data) : null) : data);
        
        return {
          statusCode: context.switchToHttp().getResponse().statusCode || HttpStatus.OK,
          message: message,
          data: resultData === data && typeof data === 'string' ? null : resultData,
        };
      }),
    );
  }
}
