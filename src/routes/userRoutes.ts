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

