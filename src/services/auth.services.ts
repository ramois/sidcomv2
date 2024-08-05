import { User } from "../models/user.interface"
import jwt from 'jsonwebtoken'

const JWT_SECRET=process.env.JWT_SECRET || 'Default-secret'
export const generateToken=(user: User): string=>{
    return jwt.sign({ id: user.id,email: user.email,id_operador: user.id_operador,nombre: user.nombre,apellidos: user.apellidos,ci:user.ci,celular:user.celular,rol:user.rol,estado:user.estado},JWT_SECRET,{expiresIn:'1h'})
}