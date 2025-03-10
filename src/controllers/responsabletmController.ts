import { Request, Response } from "express";
import { prisma } from "../models/prismaClient"; 
export const createResponsableTM = async (req: Request, res: Response): Promise<void> => {
    try {
        let { email,operador_id,nombre,apellidos,ci,celular,estado} = req.body
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' })
            return
        }
        if (!apellidos) {
            res.status(400).json({ message: 'los apellidos es obligatorio' })
            return
        }
        const responsabletm = await prisma.responsableTM.create(
            {
                data: {
                    email,
                    nombre,
                    apellidos,
                    ci,
                    celular,
                    operador_id,
                    estado,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }
        )
        res.status(201).json(responsabletm)
    } catch (error: any) {
        if (error?.code == 'P2003') {
            res.status(404).json('Operador minero no existe, ingreso uno valido')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const getAllResponsableTMs = async (req: Request, res: Response): Promise<void> => {
    try {
        const responsableTMs = await prisma.responsableTM.findMany()
        res.status(200).json(responsableTMs);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getResponsableTMsByOperadorId = async (req: Request, res: Response): Promise<void> => {
    const operadorId = parseInt(req.params.id);
    try {
        if (isNaN(operadorId)) {
            res.status(400).json({ error: 'El operador_id debe ser un número válido' });
            return;
        }
        const ResponsableTMs = await prisma.responsableTM.findMany({
            where: {
                operador_id: operadorId, // Filtrar por operador_id
            }
        });
        if (ResponsableTMs.length === 0) {
            res.status(404).json({ error: `No se encontraron responsables de toma de muestra para el operador_id ${operadorId}` });
            return;
        }
        // Retornar los formularios filtrados
        res.status(200).json(ResponsableTMs);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getResponsableTMById = async (req: Request, res: Response): Promise<void> => {
    const responsableTMId = parseInt(req.params.id)
    try {
        const responsableTM = await prisma.responsableTM.findUnique({
            where: {
                id: responsableTMId
            }
        })
        if (!responsableTM) {
            res.status(404).json({ error: 'El Responsbale de toma de muestras no fue encontrado' })
            return
        }
        res.status(200).json(responsableTM)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateResponsableTM = async (req: Request, res: Response): Promise<void> => {
    const responsableTMId = parseInt(req.params.id)
    const { email, nombre,apellidos,ci,celular,operador_id,estado } = req.body
    try {

        let dataToUpdate: any = { ...req.body }
        dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (email) {
            dataToUpdate.email = email
        }
        if (operador_id) {
            dataToUpdate.operador_id = operador_id
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
        const responsableTM = await prisma.responsableTM.update({
            where: {
                id: responsableTMId
            },
            data: dataToUpdate
        })
        res.status(200).json(responsableTM)
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Responsable de toma de muestras no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
export const deleteResponsableTM = async (req: Request, res: Response): Promise<void> => {
    const responsableTMId = parseInt(req.params.id)
    try {
        await prisma.responsableTM.delete({
            where: {
                id: responsableTMId
            }
        })
        res.status(200).json({
            message: `El responsable de toma de muestras ${responsableTMId} ha sido eliminado`
        }).end()
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Responsable de toma de muestras no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}