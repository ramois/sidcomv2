import express from 'express';
import { createResponsableTM, deleteResponsableTM, getAllResponsableTMs, getResponsableTMById, getResponsableTMsByOperadorId, updateResponsableTM } from '../controllers/responsabletmController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_responsible'), createResponsableTM)
router.get('/', authenticateToken,authorizePermission('view_responsible'), getAllResponsableTMs)
router.get('/:id', authenticateToken,authorizePermission('view_responsible_id'), getResponsableTMById)
//router.get('/operadores/:id',getResponsableTMsByOperadorId)
router.get('/operador/:id', authenticateToken,authorizePermission('view_responsible_operator_id'), getResponsableTMsByOperadorId)
router.put('/:id', authenticateToken,authorizePermission('update_responsible'), updateResponsableTM)
router.delete('/:id', authenticateToken,authorizePermission('delete_responsible'),deleteResponsableTM)

export default router;
/*import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createResponsableTM, deleteResponsableTM, getAllResponsableTMs, getResponsableTMById, getResponsableTMsByOperadorId, updateResponsableTM } from '../controllers/responsabletmController'

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

router.post('/', authenticateToken, createResponsableTM)
router.get('/', authenticateToken, getAllResponsableTMs)
router.get('/:id', authenticateToken, getResponsableTMById)
router.get('/operador/:id', authenticateToken, getResponsableTMsByOperadorId)
router.put('/:id', authenticateToken, updateResponsableTM)
router.delete('/:id', authenticateToken,deleteResponsableTM)

export default router;*/