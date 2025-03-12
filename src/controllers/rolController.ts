import { Request, Response } from "express";
import { prisma } from "../models/prismaClient"; 
export const createRol = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            nombre,
            permisos
        } = req.body;

        const rol = await prisma.rol.create({
            data: {
                nombre,
                created_at: new Date(),  // Asignar fecha actual
                updated_at: new Date(),
                rolPermissions: {
                    create: permisos.map((permisos: any) => ({
                        permission_id: permisos.id,
                    })),
                },
                },
                include: {
                    rolPermissions: true,
                }
            }
        )
        res.status(201).json(rol);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
}
export const getAllRol = async (req: Request, res: Response): Promise<void> => {
    try {
        const roles = await prisma.rol.findMany({ // Usa el nombre de tu modelo, aquí asumo que es `role`
            select: {
                id: true,
                nombre: true,
                rolPermissions: {
                    select: {
                        permission: {
                            select: {
                                id:true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        // Transformar el resultado para obtener el formato deseado
        const transformedRoles = roles.map(role => {
            const permissions = role.rolPermissions.map(rp => ({
                id: rp.permission.id,
                name: rp.permission.name
            }));
            return {
                id: role.id,
                nombre: role.nombre,
                permissions: permissions
            };
        });
        res.status(200).json(transformedRoles);
    } catch (error: any) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getRolById = async (req: Request, res: Response): Promise<void> => {
    const rolId = parseInt(req.params.id);
    try {
        const rol = await prisma.rol.findUnique({
            where: {
                id: rolId,
            },
            include: {
                rolPermissions: {
                    include: {
                        permission: {  // Incluir la relación con permisos
                            select: {  // Seleccionar solo los campos id y name del permiso
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!rol) {
            res.status(404).json({ error: 'El rol no fue encontrado' });
            return;
        }
        // Formateamos la respuesta para que los permisos estén en un array directo
        const formattedRol = {
            id: rol.id,
            nombre: rol.nombre,
            permissions: rol.rolPermissions.map(rp => ({
                id: rp.permission.id,
                name: rp.permission.name
            }))
        };
        res.status(200).json(formattedRol);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const updateRol = async (req: Request, res: Response): Promise<void> => {
    const rolId = parseInt(req.params.id); // Obtener el id del rol desde los parámetros de la URL
    const { nombre, permisos } = req.body; // Extraemos el nombre y permisos del body

    try {
        // Primero, armamos el objeto de datos a actualizar
        const dataToUpdate: any = {
            updated_at: new Date(),  // Fecha de actualización
        };

        // Si el nombre está presente en el cuerpo de la solicitud, lo añadimos a la actualización
        if (nombre) {
            dataToUpdate.nombre = nombre;
        }

        // Si se envían permisos, actualizamos la relación de permisos
        if (permisos && permisos.length > 0) {
            dataToUpdate.rolPermissions = {
                // Eliminar las relaciones actuales de permisos
                deleteMany: {}, 
                // Luego, agregar las relaciones actualizadas
                create: permisos.map((permiso: any) => ({
                    permission_id: permiso.id,  // Relacionamos el permiso con su id
                })),
            };
        }

        // Actualizamos el rol con los datos proporcionados
        const updatedRol = await prisma.rol.update({
            where: { id: rolId }, // Filtramos el rol por su id
            data: dataToUpdate,    // Solo enviamos los campos que hayan cambiado
            include: {
                rolPermissions: {
                    include: {
                        permission: true,  // Incluir los detalles del permiso
                    },
                },
            },
        });

        // Formateamos la respuesta para incluir los detalles del permiso
        const formattedRol = {
            id: updatedRol.id,
            nombre: updatedRol.nombre,
            permissions: updatedRol.rolPermissions.map((rolPermission: any) => ({
                id: rolPermission.permission.id,  // ID del permiso
                name: rolPermission.permission.name,  // Nombre del permiso
            })),
        };

        res.status(200).json(formattedRol);  // Devolvemos el rol con los permisos actualizados
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const deleteRol = async (req: Request, res: Response): Promise<void> => {
    const rolId = parseInt(req.params.id)
    try {
        await prisma.rol.delete({
            where: {
                id: rolId
            }
        })
        res.status(200).json({
            message: `El rol ${rolId} ha sido eliminado`
        }).end()
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('rol no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}