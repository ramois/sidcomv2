import { Request, Response } from "express";
import { prisma } from "../models/prismaClient"; 
export const createPermission = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            name
        } = req.body;

        const permisos = await prisma.permission.create({
            data: {
                name,
                created_at: new Date(),  // Asignar fecha actual
                updated_at: new Date()
                }
            }
        )
        res.status(201).json(permisos);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
}

export const getAllPermission = async (req: Request, res: Response): Promise<void> => {
    try {
        const permisos = await prisma.permission.findMany({
            select: {
                id: true,
                name: true
            }
        })
        res.status(200).json(permisos)
    }catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getPermissionById = async (req: Request, res: Response): Promise<void> => {
    const permisionId = parseInt(req.params.id)
    try {
        const permiso = await prisma.permission.findUnique({
            where: {
                id: permisionId
            }
        })
        if (!permiso) {
            res.status(404).json({ error: 'El rol no fue encontrado' })
            return
        }
        res.status(200).json(permiso)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updatePermission = async (req: Request, res: Response): Promise<void> => {
    const permisionId = parseInt(req.params.id)
    const { name } = req.body
    try {
        let dataToUpdate: any = { ...req.body }
        dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (name) {
            dataToUpdate.name = name
        }        
        const permiso = await prisma.permission.update({
            where: {
                id: permisionId
            },
            data: dataToUpdate
        })

        res.status(200).json(permiso)
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Permiso no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deletePermission = async (req: Request, res: Response): Promise<void> => {
    const permissionId = parseInt(req.params.id)
    try {
        await prisma.permission.delete({
            where: {
                id: permissionId
            }
        })
        res.status(200).json({
            message: `El permiso ${permissionId} ha sido eliminado`
        }).end()
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('permiso no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}