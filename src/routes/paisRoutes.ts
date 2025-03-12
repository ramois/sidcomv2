import express from 'express';
import { createPais, deletePais,updatePais,getAllPais, getPaisById } from '../controllers/paisController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_country'), createPais)
router.get('/', authenticateToken,authorizePermission('view_country'), getAllPais)
router.get('/:id', authenticateToken,authorizePermission('view_country_id'), getPaisById)
router.put('/:id', authenticateToken,authorizePermission('update_country'), updatePais)
router.delete('/:id', authenticateToken,authorizePermission('delete_country'),deletePais)

export default router;