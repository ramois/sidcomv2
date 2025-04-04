import express from 'express';
import { createMineral, deleteMineral, getAllMineral, getMineralById, updateMineral } from '../controllers/mineralController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_mineral'), createMineral)
router.get('/', authenticateToken,authorizePermission('view_mineral'), getAllMineral)
router.get('/:id', authenticateToken,authorizePermission('view_mineral_id'), getMineralById)
router.put('/:id', authenticateToken,authorizePermission('update_mineral'), updateMineral)
router.delete('/:id', authenticateToken,authorizePermission('delete_mineral'),deleteMineral)
export default router;
