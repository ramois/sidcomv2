import { User } from "../models/user.interface"
import jwt from 'jsonwebtoken'

const JWT_SECRET=process.env.JWT_SECRET || 'Default-secret'
// Asegúrate de que esta línea esté presente para exportar la función.
/*export const generateToken = (user: User): string => {
    return jwt.sign(
      {
        id: user.id,  // Incluye el ID de usuario en el token
        // otros campos del usuario si es necesario
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
  };
  */
 
export const generateToken=(user: User): string=>{
    //return jwt.sign({ id: user.id,email: user.email,nombre: user.nombre,apellidos: user.apellidos,ci:user.ci,celular:user.celular,rol_id:user.rol_id,operador_id: user.operador_id,estado:user.estado,created_at:user.created_at,updated_at:user.updated_at},JWT_SECRET,{expiresIn:'1h'})
    return jwt.sign({ 
        id: user.id,
        //email: user.email,
        //nombre: user.nombre,
        //apellidos: user.apellidos,
        //ci:user.ci,
        //celular:user.celular,
        //rol_id:user.rol_id,
        operador_id: user.operador_id,
        //estado:user.estado,
        //created_at:user.created_at,
        //updated_at:user.updated_at
    },JWT_SECRET,{expiresIn:'1d'})
}