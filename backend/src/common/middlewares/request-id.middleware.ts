import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Generate a unique ID or use the one provided by an API Gateway/Load Balancer
    const requestId = req.headers['x-request-id'] || uuidv4();
    
    // Attach to request for interceptors/filters to use
    (req as any).id = requestId;
    
    // Send back to client
    res.setHeader('X-Request-Id', requestId);
    
    next();
  }
}
