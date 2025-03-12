import express from 'express';
import { createSenarecomTM, deleteSenarecomTM, getAllSenarecomTMs, getSenarecomTMById,updateSenarecomTM } from '../controllers/senarecomtmController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/',authenticateToken,authorizePermission('create_senarecom'),createSenarecomTM)
router.get('/',authenticateToken,authorizePermission('view_senarecom'), getAllSenarecomTMs)
router.get('/:id',authenticateToken,authorizePermission('view_senarecom_id'), getSenarecomTMById)
router.put('/:id',authenticateToken,authorizePermission('update_senarecom'),updateSenarecomTM)
router.delete('/:id',authenticateToken,authorizePermission('delete_senarecom'),deleteSenarecomTM)

export default router;
/*import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createSenarecomTM, deleteSenarecomTM, getAllSenarecomTMs, getSenarecomTMById,updateSenarecomTM } from '../controllers/senarecomtmController'

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
router.post('/', authenticateToken, createSenarecomTM)
router.get('/', authenticateToken, getAllSenarecomTMs)
router.get('/:id', authenticateToken, getSenarecomTMById)
router.put('/:id', authenticateToken, updateSenarecomTM)
router.delete('/:id', authenticateToken,deleteSenarecomTM)
export default router;*/
