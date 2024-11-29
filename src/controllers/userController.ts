import { Request, Response } from "express";
const crypto = require('crypto');
import { hashPassword } from "../services/password.services";
import prisma from '../models/user'


export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        let { email, password,operador_id,nombre,apellidos,ci,celular,rol_id,estado} = req.body
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        /*if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }*/
        //let password1 = req.body.password;

        if (operador_id !== null && !password) {
            // Generar una contraseña aleatoria si id_operador es diferente de null
           password = crypto.randomBytes(8).toString('hex'); // 16 caracteres hexadecimales
        }
        
        const hashedPassword = await hashPassword(password)
        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword,
                    nombre,
                    apellidos,
                    ci,
                    celular,
                    rol_id,
                    operador_id,
                    estado,
                    created_at: new Date()
                }
            }
        )
        res.status(201).json(user)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El mail ingresado ya existe' })
        } else{
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany()
        res.status(200).json(users);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        const user = await prisma.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            res.status(404).json({ error: 'El usuario no fue encontrado' })
            return
        }
        res.status(200).json(user)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    const { email, password,nombre,apellidos,ci,celular,rol_id,operador_id,estado } = req.body
    try {

        let dataToUpdate: any = { ...req.body }
        dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (password) {
            const hashedPassword = await hashPassword(password)
            dataToUpdate.password = hashedPassword
        }

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
        if (rol_id) {
            dataToUpdate.rol_id = rol_id
        }
        if (estado) {
            dataToUpdate.estado = estado
        }
        const user = await prisma.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        })

        res.status(200).json(user)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'El email ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: userId
            }
        })

        res.status(200).json({
            message: `El usuario ${userId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}