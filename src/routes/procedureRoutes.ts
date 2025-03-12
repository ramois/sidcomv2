import express from 'express';
import { createProcedure, deleteProcedure, getAllProcedure, getProcedureById, updateProcedure } from '../controllers/procedureController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_procedure'), createProcedure)
router.get('/', authenticateToken,authorizePermission('view_procedure'), getAllProcedure)
router.get('/:id', authenticateToken,authorizePermission('view_procedure_id'), getProcedureById)
router.put('/:id', authenticateToken,authorizePermission('update_procedure'), updateProcedure)
router.delete('/:id', authenticateToken,authorizePermission('delete_procedure'),deleteProcedure)
export default router;
/*import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createPermission, deletePermission, getAllPermission, getPermissionById, updatePermission } from '../controllers/permissionController'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'
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
router.post('/', authenticateToken, createPermission)
router.get('/', authenticateToken, getAllPermission)
router.get('/:id', authenticateToken, getPermissionById)
router.put('/:id', authenticateToken, updatePermission)
router.delete('/:id', authenticateToken,deletePermission)

export default router;*/