import { Request, Response } from "express";
import { prisma } from "../models/prismaClient"; 
export const createPais = async (req: Request, res: Response): Promise<void> => {
    try {
        let { nombre,sigla,continente} = req.body
        if (!nombre) {
            res.status(400).json({ message: 'El nombre del pais es obligatorio' })
            return
        }
        if (!sigla) {
            res.status(400).json({ message: 'El departamento es obligatorio' })
            return
        }
        const pais = await prisma.pais.create(
            {
                data: {
                    nombre,
                    sigla,
                    continente,
                }
            }
        )
        res.status(201).json(pais)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('nombre')) {
            res.status(400).json({ message: 'El nombre ingresado ya existe' })
        } else{
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
export const getAllPais = async (req: Request, res: Response): Promise<void> => {
    try {
        const pais = await prisma.pais.findMany()
        res.status(200).json(pais);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getPaisById = async (req: Request, res: Response): Promise<void> => {
    const paisId = parseInt(req.params.id)
    try {
        const pais = await prisma.pais.findUnique({
            where: {
                id: paisId
            }
        })
        if (!pais) {
            res.status(404).json({ error: 'El pais no fue encontrado' })
            return
        }
        res.status(200).json(pais)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const updatePais = async (req: Request, res: Response): Promise<Response> => {
    const paisId = parseInt(req.params.id);
    let { id, ...dataToUpdate } = req.body; // Ignorar ID si lo envían en el body

    try {
        // Si no hay datos para actualizar, retornar error
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ error: "No hay datos para actualizar" });
        }

        const pais = await prisma.pais.update({
            where: { id: paisId },
            data: dataToUpdate
        });

        return res.status(200).json(pais);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return res.status(400).json({ 
                error: `El valor '${error.meta?.target?.join(', ')}' ya existe en la base de datos.` 
            });
        } else if (error?.code === 'P2025') {
            return res.status(404).json({ error: `No se encontró el país con ID: ${paisId}` });
        } else {
            console.error("Error inesperado:", error);
            return res.status(500).json({ error: 'Ocurrió un error inesperado. Intente más tarde.' });
        }
    }
};export const deletePais = async (req: Request, res: Response): Promise<void> => {
    const paisId = parseInt(req.params.id)
    try {
        await prisma.pais.delete({
            where: {
                id: paisId
            }
        })
        res.status(200).json({
            message: `El pais ${paisId} ha sido eliminado`
        }).end()
    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Pais no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}