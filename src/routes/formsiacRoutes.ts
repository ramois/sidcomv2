import express from 'express';
import { getFormularioByNroFormulariosPDF} from '../controllers/formsiacController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';
const router = express.Router();
router.get('/nro_form/*', authenticateToken,authorizePermission('print_form_siac'), getFormularioByNroFormulariosPDF);
export default router;
