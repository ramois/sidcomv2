import express from 'express';
import { createPermission, deletePermission, getAllPermission, getPermissionById, updatePermission } from '../controllers/permissionController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_permission'), createPermission)
router.get('/', authenticateToken,authorizePermission('view_permission'), getAllPermission)
router.get('/:id', authenticateToken,authorizePermission('view_permission_id'), getPermissionById)
router.put('/:id', authenticateToken,authorizePermission('update_permission'), updatePermission)
router.delete('/:id', authenticateToken,authorizePermission('delete_permission'),deletePermission)
export default router;
