import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createForms, deleteForms, getAllForms,getAllFormReducido, getFormById, updateForms,updateEstado,updateFormsAnulacion } from '../controllers/formintController'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

//Middleware de JWT para ver si estamos autenticados
/*const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error en la autenticación: ', err)
            return res.status(403).json({ error: 'No tienes acceso a este recurso' })
        }
      next();
    })
}*/
// Middleware de autenticación
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error en la autenticación: ', err)
            return res.status(403).json({ error: 'No tienes acceso a este recurso' })
        }
        
        // Agregar el user_id al objeto req para que sea accesible en las rutas
        /*if (decoded && typeof decoded === 'object') {
            req.body.user_id = decoded.id; // El ID del usuario
            req.body.operador_id = decoded.operador_id; // El ID del operador
        }*/
            if (decoded && typeof decoded === 'object' && decoded.id) {
                req.body.user_id = decoded.id; // Asignamos el ID del usuario
            } else {
                return res.status(403).json({ error: 'Token inválido o expirado' });
            }
        next();
    })
}
router.post('/', authenticateToken, createForms)
router.get('/', authenticateToken, getAllForms)
router.get('/reducido', authenticateToken, getAllFormReducido)
router.get('/:id', authenticateToken, getFormById)
router.put('/:id', authenticateToken, updateForms)
router.put('/emitir/:id', authenticateToken, updateEstado)
router.put('/anular/:id', authenticateToken, updateFormsAnulacion)
router.delete('/:id', authenticateToken,deleteForms)

export default router;