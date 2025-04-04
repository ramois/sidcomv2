import express from 'express';
import { createResponsableTM, deleteResponsableTM, getAllResponsableTMs, getResponsableTMById, getResponsableTMsByOperadorId, updateResponsableTM } from '../controllers/responsabletmController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_responsible'), createResponsableTM)
router.get('/', authenticateToken,authorizePermission('view_responsible'), getAllResponsableTMs)
router.get('/:id', authenticateToken,authorizePermission('view_responsible_id'), getResponsableTMById)
//router.get('/operadores/:id',getResponsableTMsByOperadorId)
router.get('/operador/:id', authenticateToken,authorizePermission('view_responsible_operator_id'), getResponsableTMsByOperadorId)
router.put('/:id', authenticateToken,authorizePermission('update_responsible'), updateResponsableTM)
router.delete('/:id', authenticateToken,authorizePermission('delete_responsible'),deleteResponsableTM)

export default router;
