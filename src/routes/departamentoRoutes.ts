import express from 'express';
import { createDepartamento, deleteDepartamento, getAllDepartamento, getDepartamentoById, updateDepartamento } from '../controllers/departamentoController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_departament'), createDepartamento)
router.get('/', authenticateToken,authorizePermission('view_departament'), getAllDepartamento)
router.get('/:id', authenticateToken,authorizePermission('view_departament_id'), getDepartamentoById)
router.put('/:id', authenticateToken,authorizePermission('update_departament'),updateDepartamento)
router.delete('/:id', authenticateToken,authorizePermission('delete_departament'),deleteDepartamento)
export default router;
