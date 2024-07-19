import { Request, Response } from "express";
//import { hashPassword } from "../services/password.services";
import prisma from '../models/operator'
//import operator from "../models/operator";


export const createOperators = async (req: Request, res: Response): Promise<void> => {
    try {
        const { razon_social, nit, nim_niar } = req.body
        if (!razon_social) {
            res.status(400).json({ message: 'La razon social es obligatorio' })
            return
        }
        if (!nit) {
            res.status(400).json({ message: 'El nit es obligatorio' })
            return
        }
        //const hashedPassword = await hashPassword(password)
        const operator = await prisma.create(
            {
                data: {
                    razon_social,
                    nit,
                    nim_niar
                }
            }
        )
        res.status(201).json(operator)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('razon:social')) {
            res.status(400).json({ message: 'La razon social ingresado ya existe' })
        } else{
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const getAllOperators = async (req: Request, res: Response): Promise<void> => {
    try {
        const operators = await prisma.findMany()
        res.status(200).json(operators);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getOperatorById= async (req: Request, res: Response): Promise<void> => {
    const operatorId = parseInt(req.params.id)
    try {
        const operator = await prisma.findUnique({
            where: {
                id: operatorId
            }
        })
        if (!operator) {
            res.status(404).json({ error: 'El operador minero no fue encontrado' })
            return
        }
        res.status(200).json(operator)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateOperators = async (req: Request, res: Response): Promise<void> => {
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
            res.status(404).json('Operador minero no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteOperators = async (req: Request, res: Response): Promise<void> => {
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