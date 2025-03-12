import express from 'express';
import { createDepartamento, deleteDepartamento, getAllDepartamento, getDepartamentoById, updateDepartamento } from '../controllers/departamentoController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_departament'), createDepartamento)
router.get('/', authenticateToken,authorizePermission('view_departament'), getAllDepartamento)
router.get('/:id', authenticateToken,authorizePermission('view_departament_id'), getDepartamentoById)
router.put('/:id', authenticateToken,authorizePermission('update_departament'),updateDepartamento)
router.delete('/:id', authenticateToken,authorizePermission('delete_departament'),deleteDepartamento)
export default router;
/*
import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createDepartamento, deleteDepartamento, getAllDepartamento, getDepartamentoById, updateDepartamento } from '../controllers/departamentoController'

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
router.post('/', authenticateToken, createDepartamento)
router.get('/', authenticateToken, getAllDepartamento)
router.get('/:id', authenticateToken, getDepartamentoById)
router.put('/:id', authenticateToken, updateDepartamento)
router.delete('/:id', authenticateToken,deleteDepartamento)

export default router;*/