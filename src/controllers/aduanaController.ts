import { Request, Response } from "express";
import { prisma } from "../models/prismaClient"; // ✅ Importamos la instancia completa de Prisma
export const createAduana = async (req: Request, res: Response): Promise<void> => {
    try {
        let { nombre,codigo_aduana,longitud, latitud, estado} = req.body
        if (!nombre) {
            res.status(400).json({ message: 'El nombre de aduana es obligatorio' })
            return
        }
        if (!codigo_aduana) {
            res.status(400).json({ message: 'El codigo de Aduana  es obligatorio' })
            return
        }
        const aduana = await prisma.aduana.create(
            {
                data: {
                    nombre,
                    codigo_aduana,
                    longitud,
                    latitud,
                    estado,
                }
            }
        )
        res.status(201).json(aduana)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('nombre')) {
            res.status(400).json({ message: 'El nombre de Aduana ingresado ya existe' })
        } else{
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }finally {
        await prisma.$disconnect(); // ✅ Cierra la conexión
    }
}
export const getAllAduana = async (req: Request, res: Response): Promise<void> => {
    try {
        const aduana = await prisma.aduana.findMany()
        res.status(200).json(aduana);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getAduanaById = async (req: Request, res: Response): Promise<void> => {
    const aduanaId = parseInt(req.params.id)
    try {
        const aduana = await prisma.aduana.findUnique({
            where: {
                id: aduanaId
            }
        })
        if (!aduana) {
            res.status(404).json({ error: 'La Aduana no fue encontrado' })
            return
        }
        res.status(200).json(aduana)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const updateAduana = async (req: Request, res: Response): Promise<void> => {
    const aduanaId = parseInt(req.params.id)
    const { nombre,codigo_aduana,longitud,latitud, estado } = req.body
    try {

        let dataToUpdate: any = { ...req.body }
        //dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (nombre) {
            dataToUpdate.nombre = nombre
        }
        if (codigo_aduana) {
            dataToUpdate.codigo_aduana = codigo_aduana
        }
        if (longitud) {
            dataToUpdate.longitud =longitud
        }
        if (latitud) {
            dataToUpdate.latitud =latitud
        } 
        if (estado) {
            dataToUpdate.estado =estado
        }
        const aduana = await prisma.aduana.update({
            where: {
                id: aduanaId
            },
            data: dataToUpdate
        })

        res.status(200).json(aduana)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('nombre')) {
            res.status(400).json({ error: 'La Aduana ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('Aduana no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
export const deleteAduana = async (req: Request, res: Response): Promise<void> => {
    const aduanaId = parseInt(req.params.id)
    try {
        await prisma.aduana.delete({
            where: {
                id: aduanaId
            }
        })
        res.status(200).json({
            message: `La aduana ${aduanaId} ha sido eliminado`
        }).end()
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Aduana no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}