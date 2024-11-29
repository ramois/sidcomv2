import { Request, Response } from "express";
import prisma from '../models/departamento'

export const createDepartamento = async (req: Request, res: Response): Promise<void> => {
    try {
        let { nombre,latitud, longitud} = req.body
        if (!nombre) {
            res.status(400).json({ message: 'El nombre del Departamento es obligatorio' })
            return
        }
        const departamento = await prisma.create(
            {
                data: {
                    nombre,
                    latitud,
                    longitud
                }
            }
        )
        res.status(201).json(departamento)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getAllDepartamento = async (req: Request, res: Response): Promise<void> => {
    try {
        const departamento = await prisma.findMany()
        res.status(200).json(departamento);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getDepartamentoById = async (req: Request, res: Response): Promise<void> => {
    const departamentoId = parseInt(req.params.id)
    try {
        const departamento = await prisma.findUnique({
            where: {
                id: departamentoId
            }
        })
        if (!departamento) {
            res.status(404).json({ error: 'El departamento no fue encontrado' })
            return
        }
        res.status(200).json(departamento)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateDepartamento = async (req: Request, res: Response): Promise<void> => {
    const departamentoId = parseInt(req.params.id)
    const { nombre,latitud,longitud } = req.body
    try {

        let dataToUpdate: any = { ...req.body }
        //dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (nombre) {
            dataToUpdate.nombre = nombre
        }
        if (latitud) {
            dataToUpdate.latitud = latitud
        }
        if (longitud) {
            dataToUpdate.delongitud =longitud
        }
        const departamento = await prisma.update({
            where: {
                id: departamentoId
            },
            data: dataToUpdate
        })

        res.status(200).json(departamento)
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Departamento no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteDepartamento = async (req: Request, res: Response): Promise<void> => {
    const departamentoId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: departamentoId
            }
        })

        res.status(200).json({
            message: `El departamento ${departamentoId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Departamento no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}