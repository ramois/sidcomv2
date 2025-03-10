import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser,getAllUsersTodo,getUserByIdCompleto } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/',authenticateToken,authorizePermission('create_user'),createUser );
router.get('/',authenticateToken,authorizePermission('view_user'), getAllUsers);
router.get('/completo/:id',authenticateToken,authorizePermission('view_user_id'), getUserByIdCompleto);
router.get('/completo',authenticateToken,authorizePermission('view_user'),getAllUsersTodo );
router.get('/:id',authenticateToken,authorizePermission('view_user_id'), getUserById);
router.put('/:id',authenticateToken,authorizePermission('update_user'),updateUser);
router.delete('/:id',authenticateToken,authorizePermission('delete_user'),deleteUser);

export default router;

/*import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/userController'

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

router.post('/', authenticateToken, createUser)
router.get('/', authenticateToken, getAllUsers)
router.get('/:id', authenticateToken, getUserById)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken,deleteUser)

export default router;*/
