import { Request, Response } from "express";
//import { hashPassword } from "../services/password.services";
import prisma from '../models/operator'
//import operator from "../models/operator";


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

export const getAllOperators = async (req: Request, res: Response): Promise<void> => {
    try {
        const operators = await prisma.findMany()
        res.status(200).json(operators);
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

export const updateOperators = async (req: Request, res: Response): Promise<void> => {
    const operatorId = parseInt(req.params.id)
    const { razon_social, nit,nim_niar,nro_personeria,nro_matricula_seprec,fecha_exp_seprec,tipo_doc_creacion,doc_creacion } = req.body
    try {

        let dataToUpdate: any = { ...req.body }

        if (razon_social) {
            //const hashedPassword = await hashPassword(password)
            dataToUpdate.razon_social = razon_social
        }

        if (nit) {
            dataToUpdate.nit = nit
        }
        if (nim_niar) {
            dataToUpdate.nim_niar = nim_niar
        }
        if (nro_personeria) {
            dataToUpdate.nro_personeria = nro_personeria
        }
        if (nro_matricula_seprec) {
            dataToUpdate.nro_matricula_seprec = nro_matricula_seprec
        }
        if (fecha_exp_seprec) {
            dataToUpdate.fecha_exp_seprec = fecha_exp_seprec
        }
        if (tipo_doc_creacion) {
            dataToUpdate.tipo_doc_creacion = tipo_doc_creacion
        }
        if (doc_creacion) {
            dataToUpdate.doc_creacion = doc_creacion
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