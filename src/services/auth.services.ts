import { User } from "../models/user.interface"
import jwt from 'jsonwebtoken'

const JWT_SECRET=process.env.JWT_SECRET || 'Default-secret'

export const generateToken=(user: User): string=>{
    return jwt.sign({ 
        id: user.id,
        operador_id: user.operador_id,
    },JWT_SECRET,{expiresIn:'1d'})
}
export const generateToken1 = (user: User): string => {
    return jwt.sign({ 
        id: user.id,
    }, JWT_SECRET);
}