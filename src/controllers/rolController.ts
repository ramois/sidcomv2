import { Request, Response } from "express";
//import { hashPassword } from "../services/password.services";
import prisma from '../models/rol'

export const createRol = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            nombre
        } = req.body;

        const rol = await prisma.create({
            data: {
                nombre,
                created_at: new Date(),  // Asignar fecha actual
                updated_at: new Date()
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
        const roles = await prisma.findMany({
            select: {
                id: true,
                nombre: true
            }
        })
        res.status(200).json(roles)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getRolById = async (req: Request, res: Response): Promise<void> => {
    const rolId = parseInt(req.params.id)
    try {
        const rol = await prisma.findUnique({
            where: {
                id: rolId
            }
        })
        if (!rol) {
            res.status(404).json({ error: 'El rol no fue encontrado' })
            return
        }
        res.status(200).json(rol)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateRol = async (req: Request, res: Response): Promise<void> => {
    const rolId = parseInt(req.params.id)
    const { nombre } = req.body
    try {

        let dataToUpdate: any = { ...req.body }
        dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (nombre) {
            dataToUpdate.nombre = nombre
        }        
        const rol = await prisma.update({
            where: {
                id: rolId
            },
            data: dataToUpdate
        })

        res.status(200).json(rol)
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Rol no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteRol = async (req: Request, res: Response): Promise<void> => {
    const rolId = parseInt(req.params.id)
    try {
        await prisma.delete({
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