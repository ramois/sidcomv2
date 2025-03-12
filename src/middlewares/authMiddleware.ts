import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

// Extender la interfaz Request para incluir la propiedad 'user'
export interface AuthenticatedRequest extends Request {
  user?: User;  // La propiedad 'user' es opcional y será de tipo 'User' que proviene de Prisma
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error en la autenticación: ', err);
      return res.status(403).json({ error: 'No tienes acceso a este recurso' });
    }

    // Asignar el usuario al req.user después de decodificar el token
    req.user = decoded as User;

    next();
  });
};
