import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createRol, deleteRol, getAllRol, getRolById, updateRol } from '../controllers/rolController'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

//Middleware de JWT para ver si estamos autenticados
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

        next();

    })

}
/*router.post('/', authenticateToken, ()=>{return console.log('post')})
router.get('/', authenticateToken,  ()=>{return console.log('getAll')})
router.get('/:id', authenticateToken,  ()=>{return console.log('getByid')})
router.put('/:id', authenticateToken,  ()=>{return console.log('post')})
router.delete('/:id', authenticateToken, ()=>{return console.log('post')})*/
router.post('/', authenticateToken, createRol)
router.get('/', authenticateToken, getAllRol)
router.get('/:id', authenticateToken, getRolById)
router.put('/:id', authenticateToken, updateRol)
router.delete('/:id', authenticateToken,deleteRol)

export default router;