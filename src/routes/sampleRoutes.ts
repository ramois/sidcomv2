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

/*import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createSample , deleteSamples, getAllSamples,getSamplesByOperadorId, getSampleById, updateSamples,updateEstado} from '../controllers/sampleController'
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

//Middleware de JWT para ver si estamos autenticados
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
        
        // Agregar el user_id al objeto req para que sea accesible en las rutas
            if (decoded && typeof decoded === 'object' && decoded.id) {
                req.body.user_id = decoded.id; // Asignamos el ID del usuario
            } else {
                return res.status(403).json({ error: 'Token inválido o expirado' });
            }
        next();
    })
}
router.post('/', authenticateToken, createSample)
router.get('/', authenticateToken, getAllSamples)
router.get('/operador/:id', authenticateToken, getSamplesByOperadorId)
router.get('/:id', authenticateToken, getSampleById)
router.put('/:id', authenticateToken, updateSamples)
router.put('/aprobar/:id', authenticateToken, updateEstado)
router.delete('/:id', authenticateToken,deleteSamples)*/
/*const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
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

        next();

    })

}*/
/*router.post('/', authenticateToken, ()=>{return console.log('post')})
router.get('/', authenticateToken,  ()=>{return console.log('getAll')})
router.get('/:id', authenticateToken,  ()=>{return console.log('getByid')})
router.put('/:id', authenticateToken,  ()=>{return console.log('post')})
router.delete('/:id', authenticateToken, ()=>{return console.log('post')})*/
