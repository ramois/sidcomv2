import { Request, Response } from "express";
const crypto = require('crypto');
import prisma from '../models/operator'
//import operator from "../models/operator";

/*
export const createOperators = async (req: Request, res: Response): Promise<void> => {
    try {
        const { razon_social, nit, nim_niar, nro_nim,fecha_exp_nim,tipo_operador, nro_personeria, nro_matricula_seprec, fecha_exp_seprec, tipo_doc_creacion, doc_creacion,
            dl_departamento,
            dl_municipio,
            dl_direccion,
            dl_ubicacion,
            correo_inst,
            tel_fijo,
            celular,
            celular_2,
            act_exploracion,
            act_comer_interna,
            act_comer_externa,
            act_industrializacion,
            act_tras_colas,
            act_explotacion,
            act_ben_concentracion,
            act_refinacion,
            act_fundicion,
            tipo_explotacion,
            denominacion_area,
            nro_codigo_unico,
            nro_cuadricula,
            municipio_origen,
            nro_ruex,
            verif_cert_liberacion,
            nro_res_ministerial,
            nombre_resp_for101,
            ci_resp_for101,
            celular_resp_for101,
            correo_resp_for101,
            nombre_resp_tmuestra,
            ci_resp_tmuestra,
            celular_resp_tmuestra,
            correo_resp_tmuestra } = req.body
        if (!razon_social) {
            res.status(400).json({ message: 'La razon social es obligatorio' })
            return
        }
        if (!nit) {
            res.status(400).json({ message: 'El nit es obligatorio' })
            return
        }
        //const hashedPassword = await hashPassword(password)
        const operator = await prisma.create(
            {
                data: {
                    razon_social,
                    nit,
                    nim_niar,
                    nro_nim,
                    fecha_exp_nim,
                    tipo_operador,
                    nro_personeria,
                    nro_matricula_seprec,
                    fecha_exp_seprec,
                    tipo_doc_creacion,
                    doc_creacion,
                    dl_departamento,
                    dl_municipio,
                    dl_direccion,
                    dl_ubicacion,
                    correo_inst,
                    tel_fijo,
                    celular,
                    celular_2,
                    act_exploracion,
                    act_comer_interna,
                    act_comer_externa,
                    act_industrializacion,
                    act_tras_colas,
                    act_explotacion,
                    act_ben_concentracion,
                    act_refinacion,
                    act_fundicion,
                    tipo_explotacion,
                    denominacion_area,
                    nro_codigo_unico,
                    nro_cuadricula,
                    municipio_origen,
                    nro_ruex,
                    verif_cert_liberacion,
                    nro_res_ministerial,
                    nombre_resp_for101,
                    ci_resp_for101,
                    celular_resp_for101,
                    correo_resp_for101,
                    nombre_resp_tmuestra,
                    ci_resp_tmuestra,
                    celular_resp_tmuestra,
                    correo_resp_tmuestra
                }
            }
        )
        res.status(201).json(operator)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('razon:social')) {
            res.status(400).json({ message: 'La razon social ingresado ya existe' })
        } else{
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
*/

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@$^*()-_<>[]';
export const createOperators = async (req: Request, res: Response): Promise<void> => {
    try {
        const { razon_social,
            act_ben_concentracion,  
            act_comer_externa,  
            act_comer_interna,  
            act_exploracion,  
            act_explotacion,  
            act_fundicion,  
            act_tostacion,  
            act_calcinacion,  
            act_industrializacion,  
            act_refinacion,  
            act_tras_colas,  
            denominacion_area,  
            dl_departamento,  
            dl_direccion,  
            dl_municipio,  
            dl_ubicacion,  
            doc_creacion,  
            fecha_exp_nim,  
            fecha_exp_seprec,  
            municipio_origen,  
            nro_codigo_unico,  
            nro_cuadricula,  
            nro_matricula_seprec,  
            nro_nim,  
            nro_personeria,  
            nro_res_ministerial,  
            nro_ruex,  
            correo_inst,  
            ofi_lat,  
            ofi_lon,  
            fax_op_min,  
            tel_fijo,  
            celular,  
            otro_celular,  
            tipo_doc_creacion,  
            tipo_explotacion,  
            tipo_operador,  
            verif_cert_liberacion,  
            nit,  
            nim_niar,  
            fecha_creacion,  
            fecha_actualizacion,  
            fecha_expiracion,  
            estado,  
            verificacion_toma_muestra,  
            comercio_interno_coperativa,  
            traslado_colas,  
            transbordo,  
            nit_link,  
            nim_link,  
            seprec_link,  
            doc_explotacion_link,  
            ruex_link,  
            resolucion_min_fundind_link,  
            personeria_juridica_link,  
            doc_creacion_estatal_link,  
            ci_link,  
            rep_nombre_completo,  
            rep_ci,  
            rep_departamento_id,  
            rep_municipio_id,  
            rep_direccion,  
            rep_telefono,  
            rep_celular,  
            rep_correo,  
            observaciones,
            } = req.body
        if (!razon_social) {
            res.status(400).json({ message: 'La razon social es obligatorio' })
            return
        }
        if (!nit) {
            res.status(400).json({ message: 'El nit es obligatorio' })
            return
        }
        //const hashedPassword = await hashPassword(password)
        const generateUniqueHash = async (): Promise<string> => {
            let hash: string = ''; // Inicializa hash como una cadena vacía
            let hashExists = true;
        
            // Intentamos generar un hash único
            while (hashExists) {
                hash = generateRandomString(16); // Genera un string aleatorio de 16 caracteres
                // Verificamos si el hash ya existe en la base de datos
                const existingOperator = await prisma.findUnique({
                    where: { hash }, // Aquí usamos el campo 'hash' de Prisma
                });
        
                // Si no existe, podemos usar este hash
                if (!existingOperator) {
                    hashExists = false;
                }
            }
            return hash; // Aquí 'hash' es garantizado que es un string
        };
        // Función para generar un string aleatorio basado en el conjunto de caracteres definido
        const generateRandomString = (length: number): string => {
            let result = '';
            const randomBytes = crypto.randomBytes(length);

            for (let i = 0; i < length; i++) {
                result += chars[randomBytes[i] % chars.length];
            }
            return result;
        };

        // Generamos un hash único
        const uniqueHash = await generateUniqueHash();
        const operator = await prisma.create(
            {
                data: {
            razon_social,
            act_ben_concentracion,  
            act_comer_externa,  
            act_comer_interna,  
            act_exploracion,  
            act_explotacion,  
            act_fundicion,
            act_tostacion,  
            act_calcinacion,  
            act_industrializacion,  
            act_refinacion,  
            act_tras_colas,  
            denominacion_area,  
            dl_departamento,  
            dl_direccion,  
            dl_municipio,  
            dl_ubicacion,  
            doc_creacion,  
            fecha_exp_nim,  
            fecha_exp_seprec,  
            municipio_origen,  
            nro_codigo_unico,  
            nro_cuadricula,  
            nro_matricula_seprec,  
            nro_nim,  
            nro_personeria,  
            nro_res_ministerial,  
            nro_ruex,  
            correo_inst,  
            ofi_lat,  
            ofi_lon,  
            fax_op_min,  
            tel_fijo,  
            celular,  
            otro_celular,  
            tipo_doc_creacion,  
            tipo_explotacion,  
            tipo_operador,  
            verif_cert_liberacion,  
            nit,  
            nim_niar,  
            fecha_creacion,  
            fecha_actualizacion,  
            fecha_expiracion,  
            estado,  
            verificacion_toma_muestra,  
            comercio_interno_coperativa,  
            traslado_colas,  
            transbordo,  
            nit_link,  
            nim_link,  
            seprec_link,  
            doc_explotacion_link,  
            ruex_link,  
            resolucion_min_fundind_link,  
            personeria_juridica_link,  
            doc_creacion_estatal_link,  
            ci_link,  
            rep_nombre_completo,  
            rep_ci,  
            rep_departamento_id,  
            rep_municipio_id,  
            rep_direccion,  
            rep_telefono,  
            rep_celular,  
            rep_correo,  
            observaciones,
            created_at: new Date(),  // Asignar fecha actual
            updated_at: new Date(),
            hash: uniqueHash, // Usamos el hash único generado
                }
            }
        )
        res.status(201).json(operator)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('razon:social')) {
            res.status(400).json({ message: 'La razon social ingresado ya existe' })
        } else{
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
export const getAllOperators = async (req: Request, res: Response): Promise<void> => {
    try {
        const operators = await prisma.findMany()
        res.status(200).json(operators);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getAllOperatorsSimple = async (req: Request, res: Response): Promise<void> => {
    try {
        const operators = await prisma.findMany({
            select: {
                id: true,
                razon_social: true
            }
        })
        res.status(200).json(operators)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}


export const getOperatorById= async (req: Request, res: Response): Promise<void> => {
    const operatorId = parseInt(req.params.id)
    try {
        const operator = await prisma.findUnique({
            where: {
                id: operatorId
            }
        })
        if (!operator) {
            res.status(404).json({ error: 'El operador minero no fue encontrado' })
            return
        }
        res.status(200).json(operator)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
/*export const getOperatorHash = async (req: Request, res: Response): Promise<void> => {
    const operatorHash = req.params.hash; 
    try {
        const operator = await prisma.findUnique({  
            where: { 
                hash: operatorHash  
            }
        });
        if (!operator) {
            res.status(404).json({ error: 'El operador minero no fue encontrado' });
            return;
        }
        res.status(200).json(operator);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
}*/
/*export const getOperatorHash = async (req: Request, res: Response): Promise<void> => {
    try {
        // Obtenemos el parámetro 'departamento_id' de la query string (si existe)
        const operadorhash = req.query.hash ? String(req.query.hash) : null;

        // Preparamos la consulta de Prisma
        const operador = await prisma.findMany({
            where: operadorhash ? { hash: operadorhash } : undefined, // Solo agregamos 'where' si 'departamento_id' está presente
        });
        // Respondemos con los municipios
        res.status(200).json(operador);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};*/
export const getOperatorHash = async (req: Request, res: Response): Promise<void> => {
    try {
        // Obtenemos el parámetro 'hash' de la query string
        const operadorhash = req.query.hash ? String(req.query.hash) : null;

        // Si no se pasa un hash en la query string, respondemos con un error
        if (!operadorhash) {
            // Respondemos con un error 400 si no se pasa el parámetro 'hash'
            res.status(404).json({ error: 'El operador minero no fue encontrado' });
            return;
        }

        // Realizamos la consulta en la base de datos con Prisma para buscar el operador por su 'hash'
        const operador = await prisma.findUnique({
            where: {
                hash: operadorhash, // Comparamos el hash en la base de datos
            },
        });

        // Si no se encuentra el operador, respondemos con un error 404
        if (!operador) {
            res.status(404).json({ error: 'Operador no encontrado' });
            return
        }

        // Si se encuentra, respondemos con los datos del operador y un código de éxito 200
        res.status(200).json(operador);

    } catch (error: any) {
        // Si hay un error inesperado, respondemos con un error 500
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const updateOperators = async (req: Request, res: Response): Promise<void> => {
    const operatorId = parseInt(req.params.id)
    const { 
        razon_social,
            act_ben_concentracion,  
            act_comer_externa,  
            act_comer_interna,  
            act_exploracion,  
            act_explotacion,  
            act_fundicion,  
            act_tostacion,  
            act_calcinacion,  
            act_industrializacion,  
            act_refinacion,  
            act_tras_colas,  
            denominacion_area,  
            dl_departamento,  
            dl_direccion,  
            dl_municipio,  
            dl_ubicacion,  
            doc_creacion,  
            fecha_exp_nim,  
            fecha_exp_seprec,  
            municipio_origen,  
            nro_codigo_unico,  
            nro_cuadricula,  
            nro_matricula_seprec,  
            nro_nim,  
            nro_personeria,  
            nro_res_ministerial,  
            nro_ruex,  
            correo_inst,  
            ofi_lat,  
            ofi_lon,  
            fax_op_min,  
            tel_fijo,  
            celular,  
            otro_celular,  
            tipo_doc_creacion,  
            tipo_explotacion,  
            tipo_operador,  
            verif_cert_liberacion,  
            nit,  
            nim_niar,  
            fecha_creacion,  
            fecha_actualizacion,  
            fecha_expiracion,  
            estado,  
            verificacion_toma_muestra,  
            comercio_interno_coperativa,  
            traslado_colas,  
            transbordo,  
            nit_link,  
            nim_link,  
            seprec_link,  
            doc_explotacion_link,  
            ruex_link,  
            resolucion_min_fundind_link,  
            personeria_juridica_link,  
            doc_creacion_estatal_link,  
            ci_link,  
            rep_nombre_completo,  
            rep_ci,  
            rep_departamento_id,  
            rep_municipio_id,  
            rep_direccion,  
            rep_telefono,  
            rep_celular,  
            rep_correo,  
            observaciones
     } = req.body
    try {

        let dataToUpdate: any = { ...req.body }
        dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (razon_social) {
            dataToUpdate.razon_social = razon_social;
        }
        
        if (act_ben_concentracion) {
            dataToUpdate.act_ben_concentracion = act_ben_concentracion;
        }
        
        if (act_comer_externa) {
            dataToUpdate.act_comer_externa = act_comer_externa;
        }
        
        if (act_comer_interna) {
            dataToUpdate.act_comer_interna = act_comer_interna;
        }
        
        if (act_exploracion) {
            dataToUpdate.act_exploracion = act_exploracion;
        }
        
        if (act_explotacion) {
            dataToUpdate.act_explotacion = act_explotacion;
        }
        
        if (act_fundicion) {
            dataToUpdate.act_fundicion = act_fundicion;
        }
        
        if (act_tostacion) {
            dataToUpdate.act_tostacion = act_tostacion;
        }
        
        if (act_calcinacion) {
            dataToUpdate.act_calcinacion = act_calcinacion;
        }
        
        if (act_industrializacion) {
            dataToUpdate.act_industrializacion = act_industrializacion;
        }
        
        if (act_refinacion) {
            dataToUpdate.act_refinacion = act_refinacion;
        }
        
        if (act_tras_colas) {
            dataToUpdate.act_tras_colas = act_tras_colas;
        }
        
        if (denominacion_area) {
            dataToUpdate.denominacion_area = denominacion_area;
        }
        
        if (dl_departamento) {
            dataToUpdate.dl_departamento = dl_departamento;
        }
        
        if (dl_direccion) {
            dataToUpdate.dl_direccion = dl_direccion;
        }
        
        if (dl_municipio) {
            dataToUpdate.dl_municipio = dl_municipio;
        }
        
        if (dl_ubicacion) {
            dataToUpdate.dl_ubicacion = dl_ubicacion;
        }
        
        if (doc_creacion) {
            dataToUpdate.doc_creacion = doc_creacion;
        }
        
        if (fecha_exp_nim) {
            dataToUpdate.fecha_exp_nim = fecha_exp_nim;
        }
        
        if (fecha_exp_seprec) {
            dataToUpdate.fecha_exp_seprec = fecha_exp_seprec;
        }
        
        if (municipio_origen) {
            dataToUpdate.municipio_origen = municipio_origen;
        }
        
        if (nro_codigo_unico) {
            dataToUpdate.nro_codigo_unico = nro_codigo_unico;
        }
        
        if (nro_cuadricula) {
            dataToUpdate.nro_cuadricula = nro_cuadricula;
        }
        
        if (nro_matricula_seprec) {
            dataToUpdate.nro_matricula_seprec = nro_matricula_seprec;
        }
        
        if (nro_nim) {
            dataToUpdate.nro_nim = nro_nim;
        }
        
        if (nro_personeria) {
            dataToUpdate.nro_personeria = nro_personeria;
        }
        
        if (nro_res_ministerial) {
            dataToUpdate.nro_res_ministerial = nro_res_ministerial;
        }
        
        if (nro_ruex) {
            dataToUpdate.nro_ruex = nro_ruex;
        }
        
        if (correo_inst) {
            dataToUpdate.correo_inst = correo_inst;
        }
        
        if (ofi_lat) {
            dataToUpdate.ofi_lat = ofi_lat;
        }
        
        if (ofi_lon) {
            dataToUpdate.ofi_lon = ofi_lon;
        }
        
        if (fax_op_min) {
            dataToUpdate.fax_op_min = fax_op_min;
        }
        
        if (tel_fijo) {
            dataToUpdate.tel_fijo = tel_fijo;
        }
        
        if (celular) {
            dataToUpdate.celular = celular;
        }
        
        if (otro_celular) {
            dataToUpdate.otro_celular = otro_celular;
        }
        
        if (tipo_doc_creacion) {
            dataToUpdate.tipo_doc_creacion = tipo_doc_creacion;
        }
        
        if (tipo_explotacion) {
            dataToUpdate.tipo_explotacion = tipo_explotacion;
        }
        
        if (tipo_operador) {
            dataToUpdate.tipo_operador = tipo_operador;
        }
        
        if (verif_cert_liberacion) {
            dataToUpdate.verif_cert_liberacion = verif_cert_liberacion;
        }
        
        if (nit) {
            dataToUpdate.nit = nit;
        }
        
        if (nim_niar) {
            dataToUpdate.nim_niar = nim_niar;
        }
        
        if (fecha_creacion) {
            dataToUpdate.fecha_creacion = fecha_creacion;
        }
        
        if (fecha_actualizacion) {
            dataToUpdate.fecha_actualizacion = fecha_actualizacion;
        }
        
        if (fecha_expiracion) {
            dataToUpdate.fecha_expiracion = fecha_expiracion;
        }
        
        if (estado) {
            dataToUpdate.estado = estado;
        }
        
        if (verificacion_toma_muestra) {
            dataToUpdate.verificacion_toma_muestra = verificacion_toma_muestra;
        }
        
        if (comercio_interno_coperativa) {
            dataToUpdate.comercio_interno_coperativa = comercio_interno_coperativa;
        }
        
        if (traslado_colas) {
            dataToUpdate.traslado_colas = traslado_colas;
        }
        
        if (transbordo) {
            dataToUpdate.transbordo = transbordo;
        }
        
        if (nit_link) {
            dataToUpdate.nit_link = nit_link;
        }
        
        if (nim_link) {
            dataToUpdate.nim_link = nim_link;
        }
        
        if (seprec_link) {
            dataToUpdate.seprec_link = seprec_link;
        }
        
        if (doc_explotacion_link) {
            dataToUpdate.doc_explotacion_link = doc_explotacion_link;
        }
        
        if (ruex_link) {
            dataToUpdate.ruex_link = ruex_link;
        }
        
        if (resolucion_min_fundind_link) {
            dataToUpdate.resolucion_min_fundind_link = resolucion_min_fundind_link;
        }
        
        if (personeria_juridica_link) {
            dataToUpdate.personeria_juridica_link = personeria_juridica_link;
        }
        
        if (doc_creacion_estatal_link) {
            dataToUpdate.doc_creacion_estatal_link = doc_creacion_estatal_link;
        }
        
        if (ci_link) {
            dataToUpdate.ci_link = ci_link;
        }
        
        if (rep_nombre_completo) {
            dataToUpdate.rep_nombre_completo = rep_nombre_completo;
        }
        
        if (rep_ci) {
            dataToUpdate.rep_ci = rep_ci;
        }
        
        if (rep_departamento_id) {
            dataToUpdate.rep_departamento_id = rep_departamento_id;
        }
        
        if (rep_municipio_id) {
            dataToUpdate.rep_municipio_id = rep_municipio_id;
        }
        
        if (rep_direccion) {
            dataToUpdate.rep_direccion = rep_direccion;
        }
        
        if (rep_telefono) {
            dataToUpdate.rep_telefono = rep_telefono;
        }
        
        if (rep_celular) {
            dataToUpdate.rep_celular = rep_celular;
        }
        
        if (rep_correo) {
            dataToUpdate.rep_correo = rep_correo;
        }
        
        if (observaciones) {
            dataToUpdate.observaciones = observaciones;
        }      
        const operator = await prisma.update({
            where: {
                id: operatorId
            },
            data: dataToUpdate
        })

        res.status(200).json(operator)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('razon_social')) {
            res.status(400).json({ error: 'La razon social ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('Operador minero no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteOperators = async (req: Request, res: Response): Promise<void> => {
    const operatorId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: operatorId
            }
        })

        res.status(200).json({
            message: `El operador minero con id: ${operatorId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Operador minero no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}