import express from 'express';
import { createForms, deleteForms, getAllForms,getAllFormReducidoCooperativa,getFormintHash,getAllFormOperatorReducido,getFormIntByIdPDF, getFormById,getFormsByOperadorId, updateForms,updateEstado,updateFormsAnulacion } from '../controllers/formintCooperativaController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';
const router = express.Router();
router.get('/verificacion', getFormintHash) // Ruta de acceso publico
router.post('/', authenticateToken,authorizePermission('create_formcooperativa'), createForms)
router.get('/', authenticateToken,authorizePermission('view_formcooperativa'), getAllForms)
router.get('/reducido', authenticateToken,authorizePermission('view_formcooperativa_reduced'), getAllFormReducidoCooperativa)
router.get('/operador/reducido/:id', authenticateToken,authorizePermission('view_formcooperativa_operator_reduced'), getAllFormOperatorReducido);
router.get('/:id', authenticateToken,authorizePermission('view_formcooperativa_id'), getFormById);
router.get('/print/:id', authenticateToken,authorizePermission('print_formcooperativa_id'), getFormIntByIdPDF);
router.get('/operador/:id', authenticateToken,authorizePermission('formcooperativa_operator'), getFormsByOperadorId);
router.put('/:id', authenticateToken,authorizePermission('update_formcooperativa'), updateForms);
router.put('/emitir/:id', authenticateToken,authorizePermission('issue_formcooperativa'), updateEstado);
router.put('/anular/:id', authenticateToken,authorizePermission('annular_formcooperativa'), updateFormsAnulacion);
router.delete('/:id', authenticateToken,authorizePermission('delete_formcoopetativa'),deleteForms);
export default router;
