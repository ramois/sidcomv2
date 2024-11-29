import { Request, Response } from "express";
import prisma from '../models/mineral'

export const createMineral = async (req: Request, res: Response): Promise<void> => {
    try {
        let { nombre,sigla,descripcion,tipo} = req.body
        if (!nombre) {
            res.status(400).json({ message: 'El nombre del mineral es obligatorio' })
            return
        }
        if (!sigla) {
            res.status(400).json({ message: 'la sigla es obligatoria' })
            return
        }
        if (!descripcion) {
            res.status(400).json({ message: 'El descripcion de mineral es obligatorio' })
            return
        }
        const mineral = await prisma.create(
            {
                data: {
                    nombre,
                    sigla,
                    descripcion,
                    tipo,
                }
            }
        )
        res.status(201).json(mineral)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('nombre')) {
            res.status(400).json({ message: 'El nombre de mineral ingresado ya existe' })
        } else{
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
export const getAllMineral = async (req: Request, res: Response): Promise<void> => {
        try {
            const minerales = await prisma.findMany()
            res.status(200).json(minerales);
        } catch (error: any) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
};
export const getMineralById = async (req: Request, res: Response): Promise<void> => {
    const mineralId = parseInt(req.params.id)
    try {
        const mineral = await prisma.findUnique({
            where: {
                id: mineralId
            }
        })
        if (!mineral) {
            res.status(404).json({ error: 'El mineral no fue encontrado' })
            return
        }
        res.status(200).json(mineral)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateMineral = async (req: Request, res: Response): Promise<void> => {
    const mineralId = parseInt(req.params.id)
    const { nombre,sigla,descripcion,tipo } = req.body
    try {

        let dataToUpdate: any = { ...req.body }
        //dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (nombre) {
            dataToUpdate.nombre = nombre
        }
        if (sigla) {
            dataToUpdate.sigla = sigla
        }
        if (descripcion) {
            dataToUpdate.dedescripcion =descripcion
        }
        if (tipo) {
            dataToUpdate.tipo = tipo
        }   
        const mineral = await prisma.update({
            where: {
                id: mineralId
            },
            data: dataToUpdate
        })

        res.status(200).json(mineral)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('nombre')) {
            res.status(400).json({ error: 'El nombre de mineral ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('mineral no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteMineral = async (req: Request, res: Response): Promise<void> => {
    const mineralId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: mineralId
            }
        })

        res.status(200).json({
            message: `El mineral ${mineralId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Mineral no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}