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

