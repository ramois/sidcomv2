import express from 'express';
import { createOperators, deleteOperators, getAllOperators, getOperatorById, updateOperators, getAllOperatorsSimple, getOperatorHash } from '../controllers/operatorController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';
const router = express.Router();
router.get('/verificacion', getOperatorHash) // Ruta de acceso publico
router.post('/', authenticateToken,authorizePermission('create_operator'), createOperators)
router.get('/', authenticateToken,authorizePermission('view_operator'), getAllOperators)
router.get('/operators-simple', authenticateToken,authorizePermission('view_operator_reduced'), getAllOperatorsSimple)
router.get('/:id', authenticateToken,authorizePermission('view_operator_id'), getOperatorById)
router.put('/:id', authenticateToken,authorizePermission('update_operator'), updateOperators)
router.delete('/:id', authenticateToken,authorizePermission('delete_operator'),deleteOperators)
export default router;
