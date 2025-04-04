import express from 'express';
import { createForms, deleteForms, getAllForms,getAllFormReducido,getAllFormextOperatorReducido,getFormextHash,getFormExtByIdPDF,getFormextByNroFormulariosPDF, getFormById,getFormsByOperadorId, updateForms,updateEstado,updateFormsAnulacion } from '../controllers/formextController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';
const router = express.Router();
router.get('/verificacion', getFormextHash) // Ruta de acceso publico
router.post('/', authenticateToken,authorizePermission('create_formext'), createForms)
router.get('/', authenticateToken,authorizePermission('view_formext'), getAllForms)
router.get('/reducido', authenticateToken,authorizePermission('view_formext_reduced'), getAllFormReducido)
router.get('/operador/reducido/:id', authenticateToken,authorizePermission('view_formext_operator_reduced'), getAllFormextOperatorReducido);
router.get('/:id', authenticateToken,authorizePermission('view_formext_id'), getFormById)
router.get('/print/:id', authenticateToken,authorizePermission('print_formext_id'), getFormExtByIdPDF);
router.get('/nro_form/*', authenticateToken,authorizePermission('print_formext_form'), getFormextByNroFormulariosPDF);
router.get('/operador/:id', authenticateToken,authorizePermission('formext_operator'), getFormsByOperadorId)
router.put('/:id', authenticateToken,authorizePermission('update_formext'), updateForms)
router.put('/emitir/:id', authenticateToken,authorizePermission('issue_formext'), updateEstado)
router.put('/anular/:id', authenticateToken,authorizePermission('annular_formext'), updateFormsAnulacion)
router.delete('/:id', authenticateToken,authorizePermission('delete_formext'),deleteForms)
export default router;
