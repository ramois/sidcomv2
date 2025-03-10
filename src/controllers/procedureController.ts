import { Request, Response } from "express";
import { prisma } from "../models/prismaClient"; 

export const createProcedure = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            nombre,
            procedimiento
        } = req.body;
        if (!nombre || !procedimiento) {
            res.status(400).json({ error: 'El nombre y el procedimiento son obligatorios.' });
        }

        // Crear el procedimiento en la base de datos
        const procedimientoCreado = await prisma.procedimientoMuestra.create({
            data: {
                nombre,
                procedimiento
            }
        });
        res.status(201).json(procedimientoCreado);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
}


export const getAllProcedure = async (req: Request, res: Response): Promise<void> => {
    try {
        const procedures = await prisma.procedimientoMuestra.findMany()
        res.status(200).json(procedures);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getProcedureById = async (req: Request, res: Response): Promise<void> => {
    const procedureId = parseInt(req.params.id)
    try {
        const procedure = await prisma.procedimientoMuestra.findUnique({
            where: {
                id: procedureId
            }
        })
        if (!procedure) {
            res.status(404).json({ error: 'Procedimiento de Toma de muestra no fue encontrado' })
            return
        }
        res.status(200).json(procedure)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateProcedure = async (req: Request, res: Response): Promise<void> => {
    const procedureId = parseInt(req.params.id)
    const { nombre, procedimiento } = req.body
    try {
        let dataToUpdate: any = { ...req.body }
        //dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (nombre) {
            dataToUpdate.nombre = nombre
        }     
        if (procedimiento) {
            dataToUpdate.procedimiento =procedimiento
        }        
        const procedimientoactualizado = await prisma.procedimientoMuestra.update({
            where: {
                id: procedureId
            },
            data: dataToUpdate
        })
        res.status(200).json(procedimientoactualizado)
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Procedimiento no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
export const deleteProcedure = async (req: Request, res: Response): Promise<void> => {
    const procedureId = parseInt(req.params.id)
    try {
        await prisma.procedimientoMuestra.delete({
            where: {
                id: procedureId
            }
        })
        res.status(200).json({
            message: `El procedimiento ${procedureId} ha sido eliminado`
        }).end()
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('procedimiento no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}