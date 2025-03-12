import { Request, Response } from "express";
import { prisma } from "../models/prismaClient"; 
export const createSenarecomTM = async (req: Request, res: Response): Promise<void> => {
    try {
        let { email,cargo,nombre,apellidos,ci,celular,estado} = req.body
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' })
            return
        }
        if (!apellidos) {
            res.status(400).json({ message: 'los apellidos es obligatorio' })
            return
        }
        const senarecomtm = await prisma.senarecomTM.create(
            {
                data: {
                    email,
                    nombre,
                    apellidos,
                    ci,
                    celular,
                    cargo,
                    estado,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }
        )
        res.status(201).json(senarecomtm)
    } catch (error: any) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getAllSenarecomTMs = async (req: Request, res: Response): Promise<void> => {
    try {
        const senarecomTMs = await prisma.senarecomTM.findMany()
        res.status(200).json(senarecomTMs);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getSenarecomTMById = async (req: Request, res: Response): Promise<void> => {
    const senarecomTMId = parseInt(req.params.id)
    try {
        const senarecomTM = await prisma.senarecomTM.findUnique({
            where: {
                id: senarecomTMId
            }
        })
        if (!senarecomTM) {
            res.status(404).json({ error: 'El Responsbale SENARECOM no fue encontrado' })
            return
        }
        res.status(200).json(senarecomTM)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateSenarecomTM = async (req: Request, res: Response): Promise<void> => {
    const senarecomTMId = parseInt(req.params.id)
    const { email, nombre,apellidos,ci,celular,cargo,estado } = req.body
    try {
        let dataToUpdate: any = { ...req.body }
        dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (email) {
            dataToUpdate.email = email
        }
        if (cargo) {
            dataToUpdate.cargo = cargo
        }
        if (nombre) {
            dataToUpdate.nombre = nombre
        }
        if (apellidos) {
            dataToUpdate.apellidos = apellidos
        }   
        if (ci) {
            dataToUpdate.ci = ci
        }
        if (celular) {
            dataToUpdate.celular = celular
        }
        if (estado) {
            dataToUpdate.estado = estado
        }
        const senarecomTM = await prisma.senarecomTM.update({
            where: {
                id: senarecomTMId
            },
            data: dataToUpdate
        })
        res.status(200).json(senarecomTM)
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Responsable SENARECOM no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
export const deleteSenarecomTM = async (req: Request, res: Response): Promise<void> => {
    const senarecomTMId = parseInt(req.params.id)
    try {
        await prisma.senarecomTM.delete({
            where: {
                id: senarecomTMId
            }
        })
        res.status(200).json({
            message: `El responsable SENARECOM ${senarecomTMId} ha sido eliminado`
        }).end()
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Responsable SENARECOM no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}