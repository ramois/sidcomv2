import express from 'express';
import { createOperators, deleteOperators, getAllOperators, getOperatorById, updateOperators, getAllOperatorsSimple, getOperatorHash } from '../controllers/operatorController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';
const router = express.Router();
router.get('/verificacion', getOperatorHash) // Ruta de acceso publico
router.post('/', authenticateToken,authorizePermission('create_operator'), createOperators)
router.get('/', authenticateToken,authorizePermission('view_operator'), getAllOperators)
router.get('/operators-simple', authenticateToken,authorizePermission('view_operator_reduced'), getAllOperatorsSimple)
router.get('/:id', authenticateToken,authorizePermission('view_operator_id'), getOperatorById)
router.put('/:id', authenticateToken,authorizePermission('update_operator'), updateOperators)
router.delete('/:id', authenticateToken,authorizePermission('delete_operator'),deleteOperators)
export default router;
/*import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createOperators, deleteOperators, getAllOperators, getOperatorById, updateOperators, getAllOperatorsSimple, getOperatorHash } from '../controllers/operatorController'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'
router.get('/verificacion', getOperatorHash)
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
router.post('/', authenticateToken, createOperators)
router.get('/', authenticateToken, getAllOperators)
router.get('/operators-simple', authenticateToken, getAllOperatorsSimple)
router.get('/:id', authenticateToken, getOperatorById)
router.put('/:id', authenticateToken, updateOperators)
router.delete('/:id', authenticateToken,deleteOperators)
export default router;*/