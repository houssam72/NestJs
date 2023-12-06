import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request-response time');
    console.log('Hi from middleware!');

    res.on('finish', () => console.log('Request-response time'));
    next();
  }
}
