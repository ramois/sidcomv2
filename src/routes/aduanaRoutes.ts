import express from 'express';
import { createAduana, deleteAduana,updateAduana,getAllAduana, getAduanaById } from '../controllers/aduanaController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_aduana'), createAduana)
router.get('/', authenticateToken,authorizePermission('view_aduana'), getAllAduana)
router.get('/:id', authenticateToken,authorizePermission('view_aduana_id'), getAduanaById)
router.put('/:id', authenticateToken,authorizePermission('update_aduana'), updateAduana)
router.delete('/:id', authenticateToken,authorizePermission('delete_aduana'),deleteAduana)

export default router;