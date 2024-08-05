import { Request, Response } from "express";
//import { hashPassword } from "../services/password.services";
import prisma from '../models/sample'
import { Decimal } from "@prisma/client/runtime/library";
//import operator from "../models/operator";

export const createSamples = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            ubi_geografica,
            lugar_verificacion,
            id_operador,
            responsable,
            lotes,
            tipo_muestra,
            presentacion,
            sacos,
            camiones,
            peso_neto,
            peso_parcial,
            id_municipio,
            senerecom,
            tipo_agranel,
            tipo_emsacado,
            tipo_lingotes,
            tipo_sal,
            tipo_otr,
            observaciones,
            estado,
            minerales
        } = req.body;

        const sample = await prisma.create({
            data: {
                ubi_geografica,
                lugar_verificacion,
                id_operador,
                responsable,
                lotes,
                tipo_muestra,
                presentacion,
                sacos,
                camiones,
                peso_neto: new Decimal(peso_neto),
                peso_parcial: new Decimal(peso_parcial),
                id_municipio,
                senerecom,
                tipo_agranel,
                tipo_emsacado,
                tipo_lingotes,
                tipo_sal,
                tipo_otr,
                observaciones,
                estado,
                minerales: {
                  create: minerales.map((mineral: any) => ({
                    mineral: {
                      connect: { id: mineral.mineralId },
                    },
                    ley: mineral.ley,
                    unidad: mineral.unidad,
                  })),
                },
            }
        });

        res.status(201).json(sample);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
}

export const getAllSamples = async (req: Request, res: Response): Promise<void> => {
    try {
        const samples = await prisma.findMany({
            include: { minerales: true }
    })
        res.status(200).json(samples);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getSampleById= async (req: Request, res: Response): Promise<void> => {
    const sampleId = parseInt(req.params.id)
    try {
        const sample = await prisma.findUnique({
         where: { id: sampleId },
                include: { minerales: true }
            
        })
        if (!sample) {
            res.status(404).json({ error: 'La muestra no fue encontrado' })
            return
        }
        res.status(200).json(sample)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateSamples = async (req: Request, res: Response): Promise<void> => {
    const operatorId = parseInt(req.params.id)
    const { razon_social, nit,nim_niar } = req.body
    try {

        let dataToUpdate: any = { ...req.body }

        if (razon_social) {
            //const hashedPassword = await hashPassword(password)
            dataToUpdate.password = razon_social
        }

        if (nit) {
            dataToUpdate.email = nit
        }
        if (nim_niar) {
            dataToUpdate.email = nim_niar
        }

        const operator = await prisma.update({
            where: {
                id: operatorId
            },
            data: dataToUpdate
        })

        res.status(200).json(operator)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('razon_social')) {
            res.status(400).json({ error: 'La razon social ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('Muestra no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteSamples = async (req: Request, res: Response): Promise<void> => {
    const operatorId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: operatorId
            }
        })

        res.status(200).json({
            message: `El operador minero con id: ${operatorId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Operador minero no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}