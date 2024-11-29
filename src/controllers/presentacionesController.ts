import { Request, Response } from "express";
import prisma from '../models/presentacion'

export const createPresentacion= async (req: Request, res: Response): Promise<void> => {
    try {
        let { nombre,humedad, merma,cantidad} = req.body
        if (!nombre) {
            res.status(400).json({ message: 'El nombre de la presentacion es obligatoria' })
            return
        }
        const presentacion = await prisma.create(
            {
                data: {
                    nombre,
                    humedad,
                    merma,
                    cantidad
                }
            }
        )
        res.status(201).json(presentacion)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getAllPresentacion = async (req: Request, res: Response): Promise<void> => {
    try {
        const presentacion = await prisma.findMany()
        res.status(200).json(presentacion);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getPresentacionById = async (req: Request, res: Response): Promise<void> => {
    const presentacionId = parseInt(req.params.id)
    try {
        const presentacion = await prisma.findUnique({
            where: {
                id: presentacionId
            }
        })
        if (!presentacion) {
            res.status(404).json({ error: 'La presentacion no fue encontrado' })
            return
        }
        res.status(200).json(presentacion)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updatePresentacion = async (req: Request, res: Response): Promise<void> => {
    const presentacionId = parseInt(req.params.id)
    const { nombre,humedad,merma,cantidad } = req.body
    try {

        let dataToUpdate: any = { ...req.body }
        //dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (nombre) {
            dataToUpdate.nombre = nombre
        }
        if (humedad) {
            dataToUpdate.humedad = humedad
        }
        if (merma) {
            dataToUpdate.merma =merma
        }
        if (cantidad) {
            dataToUpdate.cantidad =cantidad
        }
        const presentacion = await prisma.update({
            where: {
                id: presentacionId
            },
            data: dataToUpdate
        })

        res.status(200).json(presentacion)
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Presentacion no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deletePresentacion = async (req: Request, res: Response): Promise<void> => {
    const presentacionId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: presentacionId
            }
        })

        res.status(200).json({
            message: `La presentacion ${presentacionId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Presentacion no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}