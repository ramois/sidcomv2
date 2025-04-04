import express from 'express';
import { createSample , deleteSamples, getAllSamples,getSamplesByOperadorId, getSampleById,getSampleByIdPDF,getSampleByNroFormularioPDF,getSampleByNroFormulariosPDF,getAllSampleOperatorReducido,annularSample, getAllSampleReducido, updateSamples,updateEstado,getSamplesByResponsableTDMGadorId,requestSample,signSample} from '../controllers/sampleController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/', authenticateToken, authorizePermission('create_sample'), createSample);
router.get('/', authenticateToken,authorizePermission('view_sample'), getAllSamples);
router.get('/reducido', authenticateToken,authorizePermission('view_sample_reduced'), getAllSampleReducido);
router.get('/operador/reducido/:id', authenticateToken,authorizePermission('view_sample_operator_reduced'), getAllSampleOperatorReducido);
router.get('/operador/:id', authenticateToken,authorizePermission('view_sample_operator'), getSamplesByOperadorId);
router.get('/gador/:id', authenticateToken,authorizePermission('view_sample_gador'), getSamplesByResponsableTDMGadorId);
router.get('/:id', authenticateToken,authorizePermission('view_sample_id'), getSampleById);
router.get('/print/:id', authenticateToken,authorizePermission('print_sample_id'), getSampleByIdPDF);
router.get('/print_nro_form/:nro_formulario(*)/:operador_id',authenticateToken,authorizePermission('print_sample_nro_form'),getSampleByNroFormularioPDF);
router.get('/nro_form/*', authenticateToken,authorizePermission('print_sample_form'), getSampleByNroFormulariosPDF);
router.put('/solicitar/:id', authenticateToken,authorizePermission('request_sample'), requestSample);
router.put('/anular/:id', authenticateToken,authorizePermission('annular_sample'), annularSample);
router.put('/firmar/:id', authenticateToken,authorizePermission('sign_sample'), signSample);
router.put('/:id', authenticateToken, authorizePermission('update_sample'), updateSamples);
router.put('/aprobar/:id', authenticateToken, authorizePermission('approve_sample'), updateEstado);
router.delete('/:id', authenticateToken, authorizePermission('delete_sample'), deleteSamples);
export default router;

