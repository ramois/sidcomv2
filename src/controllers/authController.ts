import { Request, Response } from "express";
const crypto = require('crypto');
import { comparePasswords, hashPassword } from "../services/password.services";
import prisma from "../models/user";
import { generateToken, generateToken1 } from "../services/auth.services";
export const register = async(req: Request,res: Response): Promise<void>=>{
    let {email, password,nombre,apellidos,ci,celular,rol_id,operador_id,estado}=req.body
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

export const login = async (req: Request, res: Response): Promise<Response> => {  // Cambié void por Response
    const { email, password } = req.body;

    try {
        // Validaciones de entrada
        if (!email) {
            return res.status(400).json({ message: 'El email es obligatorio' });
        }
        if (!password) {
            return res.status(400).json({ message: 'El password es obligatorio' });
        }

        // Buscar el usuario en la base de datos
        const user = await prisma.findUnique({
            where: { email },
            include: {
                rol: {
                    include: {
                        rolPermissions: {
                            include: {
                                permission: true, // Incluir los permisos asociados al rol
                            },
                        },
                    },
                },
            },
        });

        // Si no se encuentra el usuario
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Si la contraseña del usuario es null
        if (user.password === null) {
            return res.status(401).json({ error: 'Contraseña del usuario no está definida' });
        }

        // Comparar las contraseñas
        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Usuario y contraseñas no coinciden' });
        }
        // Si el rol es "Amsix", solo devolver el token
        if (user.rol.nombre === 'Siac-rm') {
            const tokensiac = generateToken1(user);
            return res.status(200).json({ tokensiac });
        }
         // Obtener la estructura de permisos del rol del usuario
        const permissions = user.rol.rolPermissions.map((rolPermission) => ({
            id: rolPermission.permission.id,
            name: rolPermission.permission.name,
        }));

        // Crear la respuesta de usuario con los permisos y el token
        const data = {
            id: user.id,
            operador_id: user.operador_id,
            nombre_completo: user.nombre + ' ' + user.apellidos,
            token: generateToken(user), // Utilizar el token del usuario
            permissions: permissions,
        };
        // Enviar respuesta con los datos y el token
        return res.status(200).json({ data });
    } catch (error: any) {
        console.log('Error: ', error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
};
// login con un solo 
/*export const login = async (req: Request, res: Response): Promise<void> => {

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
        //const token = generateToken(user);
        const data = {
            id:user.id, 
            operador_id: user.operador_id,
            nombre_completo: user.nombre+' '+user.apellidos,
            token : generateToken(user),          
            permissions:
        };

        res.status(200).json({
            //token,
            data
        });

        //const token = generateToken(user)
        //res.status(200).json({ token } )


    } catch (error: any) {
        console.log('Error: ', error)
    }

}
export const checkEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        // Verificar si el email fue proporcionado
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' });
            return;
        }

        // Buscar si el email ya está registrado en la base de datos
        const user = await prisma.findUnique({
            where: { email },
        });

        // Si el usuario con ese email ya existe, retornar un mensaje de error
        if (user) {
            res.status(400).json({ message: 'El mail ingresado ya existe' });
        } else {
            // Si el email no existe, retornar un mensaje de éxito
            res.status(200).json({ message: 'El email está disponible' });
        }
    } catch (error: any) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al verificar el email' });
    }
};    */
       
export const checkEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        // Verificar si el email fue proporcionado
        if (!email) {
            res.status(400).json(false);  // Devuelve 'false' si no se proporciona el email
            return;
        }

        // Buscar si el email ya está registrado en la base de datos
        const user = await prisma.findUnique({  // Asegúrate de que el modelo se llama 'user' en tu prisma.schema
            where: { email },
        });

        // Si el usuario con ese email ya existe, retornar false
        if (user) {
            res.status(200).json(true);  // Devuelve 'false' si el email ya está registrado
        } else {
            // Si el email no existe, retornar true
            res.status(200).json(false);  // Devuelve 'true' si el email está disponible
        }
    } catch (error: any) {
        // Manejo de errores
        console.error(error);
        res.status(500).json(false);  // Devuelve 'false' si ocurre un error
    }
};