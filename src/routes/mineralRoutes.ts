import express from 'express';
import { createMineral, deleteMineral, getAllMineral, getMineralById, updateMineral } from '../controllers/mineralController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_mineral'), createMineral)
router.get('/', authenticateToken,authorizePermission('view_mineral'), getAllMineral)
router.get('/:id', authenticateToken,authorizePermission('view_mineral_id'), getMineralById)
router.put('/:id', authenticateToken,authorizePermission('update_mineral'), updateMineral)
router.delete('/:id', authenticateToken,authorizePermission('delete_mineral'),deleteMineral)
export default router;
/*import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createMineral, deleteMineral, getAllMineral, getMineralById, updateMineral } from '../controllers/mineralController'

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
router.post('/', authenticateToken, createMineral)
router.get('/', authenticateToken, getAllMineral)
router.get('/:id', authenticateToken, getMineralById)
router.put('/:id', authenticateToken, updateMineral)
router.delete('/:id', authenticateToken,deleteMineral)
export default router;*/