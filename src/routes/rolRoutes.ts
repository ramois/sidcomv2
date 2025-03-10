import express from 'express';
import { createRol, deleteRol, getAllRol, getRolById, updateRol } from '../controllers/rolController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_role'), createRol)
router.get('/', authenticateToken,authorizePermission('view_role'), getAllRol)
router.get('/:id', authenticateToken,authorizePermission('view_role_id'), getRolById)
router.put('/:id', authenticateToken,authorizePermission('update_role'), updateRol)
router.delete('/:id', authenticateToken,authorizePermission('delete_role'),deleteRol)

export default router;

/*import express, { NextFunction, Request, Response } from 'express'
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

router.post('/', authenticateToken, createRol)
router.get('/', authenticateToken, getAllRol)
router.get('/:id', authenticateToken, getRolById)
router.put('/:id', authenticateToken, updateRol)
router.delete('/:id', authenticateToken,deleteRol)

export default router;*/