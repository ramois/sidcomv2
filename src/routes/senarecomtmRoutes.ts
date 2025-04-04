import express from 'express';
import { createSenarecomTM, deleteSenarecomTM, getAllSenarecomTMs, getSenarecomTMById,updateSenarecomTM } from '../controllers/senarecomtmController'
import { authenticateToken } from '../middlewares/authMiddleware';
import { authorizePermission } from '../middlewares/permissionMiddleware';

const router = express.Router();
router.post('/',authenticateToken,authorizePermission('create_senarecom'),createSenarecomTM)
router.get('/',authenticateToken,authorizePermission('view_senarecom'), getAllSenarecomTMs)
router.get('/:id',authenticateToken,authorizePermission('view_senarecom_id'), getSenarecomTMById)
router.put('/:id',authenticateToken,authorizePermission('update_senarecom'),updateSenarecomTM)
router.delete('/:id',authenticateToken,authorizePermission('delete_senarecom'),deleteSenarecomTM)

export default router;
