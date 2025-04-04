import express from 'express';
import { createPresentacion, deletePresentacion, getAllPresentacion, getPresentacionById, updatePresentacion } from '../controllers/presentacionesController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_presentation'), createPresentacion)
router.get('/', authenticateToken,authorizePermission('view_presentation'), getAllPresentacion)
router.get('/:id', authenticateToken,authorizePermission('view_presentation_id'), getPresentacionById)
router.put('/:id', authenticateToken,authorizePermission('update_presentation'), updatePresentacion)
router.delete('/:id', authenticateToken,authorizePermission('delete_presentation'),deletePresentacion)
export default router;
