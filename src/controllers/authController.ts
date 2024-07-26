import { Request, Response } from "express";
const crypto = require('crypto');
import { comparePasswords, hashPassword } from "../services/password.services";
import prisma from "../models/user";
import { generateToken } from "../services/auth.services";


export const register = async(req: Request,res: Response): Promise<void>=>{
    let {email, password, id_operador,nombre,apellidos,ci,celular,rol,estado}=req.body
    try {
        //if (!email) throw new Error('el email es obligatorio')
        //if (!password) throw new Error('el password es obligatorio')
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        /*if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }*/
            if (id_operador !== null && !password) {
                // Generar una contraseña aleatoria si id_operador es diferente de null
               password = crypto.randomBytes(8).toString('hex'); // 16 caracteres hexadecimales
            }
       
        const hashedPassword = await hashPassword(password)

        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword,
                    id_operador,
                    nombre,
                    apellidos,
                    ci,
                    celular,
                    rol,
                    estado

                }
            }
        )

        const token = generateToken(user)
        res.status(201).json({ token })

    } catch (error: any) {

        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El mail ingresado ya existe' })
        }else{         
        console.log(error)
        res.status(500).json({ error: 'Hubo un error en el registro' })

        }
    }

}

export const login = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body

    try {

        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }

        const user = await prisma.findUnique({ where: { email } })
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }
        if (user.password === null) {
            res.status(401).json({ error: 'Contraseña del usuario no está definida' });
            return;
        }
        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Usuario y contraseñas no coinciden' })
        }

        const token = generateToken(user)
        res.status(200).json({ token })


    } catch (error: any) {
        console.log('Error: ', error)
    }

}
       
       
   