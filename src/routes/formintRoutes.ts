import express from 'express';
import { createForms, deleteForms, getAllForms,getAllFormReducido,getFormintHash,getAllFormOperatorReducido,getFormIntByIdPDF,getFormintByNroFormulariosPDF, getFormById,getFormsByOperadorId, updateForms,updateEstado,updateFormsAnulacion } from '../controllers/formintController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';
const router = express.Router();
router.get('/verificacion', getFormintHash) // Ruta de acceso publico
router.post('/', authenticateToken,authorizePermission('create_formint'), createForms)
router.get('/', authenticateToken,authorizePermission('view_formint'), getAllForms)
router.get('/reducido', authenticateToken,authorizePermission('view_formint_reduced'), getAllFormReducido)
router.get('/operador/reducido/:id', authenticateToken,authorizePermission('view_formint_operator_reduced'), getAllFormOperatorReducido);
router.get('/:id', authenticateToken,authorizePermission('view_formint_id'), getFormById)
router.get('/print/:id', authenticateToken,authorizePermission('print_formint_id'), getFormIntByIdPDF);
router.get('/nro_form/*', authenticateToken,authorizePermission('print_formint_form'), getFormintByNroFormulariosPDF);
router.get('/operador/:id', authenticateToken,authorizePermission('formint_operator'), getFormsByOperadorId)
router.put('/:id', authenticateToken,authorizePermission('update_formint'), updateForms)
router.put('/emitir/:id', authenticateToken,authorizePermission('issue_formint'), updateEstado)
router.put('/anular/:id', authenticateToken,authorizePermission('annular_formint'), updateFormsAnulacion)
router.delete('/:id', authenticateToken,authorizePermission('delete_formint'),deleteForms)
export default router;
