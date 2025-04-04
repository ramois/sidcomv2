import express from 'express';
import { createProcedure, deleteProcedure, getAllProcedure, getProcedureById, updateProcedure } from '../controllers/procedureController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken,authorizePermission('create_procedure'), createProcedure)
router.get('/', authenticateToken,authorizePermission('view_procedure'), getAllProcedure)
router.get('/:id', authenticateToken,authorizePermission('view_procedure_id'), getProcedureById)
router.put('/:id', authenticateToken,authorizePermission('update_procedure'), updateProcedure)
router.delete('/:id', authenticateToken,authorizePermission('delete_procedure'),deleteProcedure)
export default router;
