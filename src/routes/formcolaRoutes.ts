import express from 'express';
import { createForms, deleteForms, getAllForms,getAllFormReducido,getFormColaHash,getAllFormOperatorReducido,getFormColaByIdPDF,getFormcolaByNroFormulariosPDF, getFormById,getFormsByOperadorId, updateForms,updateEstado,updateFormsAnulacion } from '../controllers/formcolaController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';
const router = express.Router();
router.get('/verificacion', getFormColaHash) // Ruta de acceso publico
router.post('/', authenticateToken,authorizePermission('create_formcola'), createForms)
router.get('/', authenticateToken,authorizePermission('view_formcola'), getAllForms)
router.get('/reducido', authenticateToken,authorizePermission('view_formcola_reduced'), getAllFormReducido)
router.get('/operador/reducido/:id', authenticateToken,authorizePermission('view_formcola_operator_reduced'), getAllFormOperatorReducido);
router.get('/:id', authenticateToken,authorizePermission('view_formcola_id'), getFormById)
router.get('/print/:id', authenticateToken,authorizePermission('print_formcola_id'), getFormColaByIdPDF);
router.get('/nro_form/*', authenticateToken,authorizePermission('print_formcola_form'), getFormcolaByNroFormulariosPDF);
router.get('/operador/:id', authenticateToken,authorizePermission('formcola_operator'), getFormsByOperadorId)
router.put('/:id', authenticateToken,authorizePermission('update_formcola'), updateForms)
router.put('/emitir/:id', authenticateToken,authorizePermission('issue_formcola'), updateEstado)
router.put('/anular/:id', authenticateToken,authorizePermission('annular_formcola'), updateFormsAnulacion)
router.delete('/:id', authenticateToken,authorizePermission('delete_formcola'),deleteForms)
export default router;
