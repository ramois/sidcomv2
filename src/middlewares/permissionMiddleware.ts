// src/middlewares/permissionMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const authorizePermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Acceder a `req.user` correctamente tipado
      const userId = (req as any).user?.id; 

      if (!userId) {
        return res.status(401).json({ error: 'No autorizado' });
      }
      // Obtener el rol del usuario y sus permisos desde la base de datos
      const userWithPermissions = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          rol: {
            include: {
              rolPermissions: {
                include: {
                  permission: true,  // Obtener los permisos asociados al rol
                },
              },
            },
          },
        },
      });

      if (!userWithPermissions) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar si el rol del usuario tiene el permiso requerido
      const hasPermission = userWithPermissions.rol.rolPermissions.some(
        (rolPermission) => rolPermission.permission.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
      }

      // Si tiene el permiso, proceder con la siguiente función
      next();
    } catch (error) {
      console.error('Error en la autorización de permisos: ', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
};
