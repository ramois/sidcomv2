import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user_id: number; // o string dependiendo de tu tipo de ID
    }
  }
}