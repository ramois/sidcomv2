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
/*import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createForms, deleteForms, getAllForms,getAllFormReducido, getFormById,getFormsByOperadorId, updateForms,updateEstado,updateFormsAnulacion } from '../controllers/formintController'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

// Middleware de autenticación
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error en la autenticación: ', err)
            return res.status(403).json({ error: 'No tienes acceso a este recurso' })
        }
            if (decoded && typeof decoded === 'object' && decoded.id) {
                req.body.user_id = decoded.id; // Asignamos el ID del usuario
            } else {
                return res.status(403).json({ error: 'Token inválido o expirado' });
            }
        next();
    })
}
router.post('/', authenticateToken, createForms)
router.get('/', authenticateToken, getAllForms)
router.get('/reducido', authenticateToken, getAllFormReducido)
router.get('/:id', authenticateToken, getFormById)
router.get('/operador/:id', authenticateToken, getFormsByOperadorId)
router.put('/:id', authenticateToken, updateForms)
router.put('/emitir/:id', authenticateToken, updateEstado)
router.put('/anular/:id', authenticateToken, updateFormsAnulacion)
router.delete('/:id', authenticateToken,deleteForms)

export default router;*/