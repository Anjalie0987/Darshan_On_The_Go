import { Request } from 'express';

export interface RequestContext extends Request {
  id: string; // The X-Request-Id injected by middleware
  user?: any; // The authenticated user object (to be defined in Auth phase)
}
