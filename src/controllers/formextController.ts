import { Request, Response } from "express";
import prisma from '../models/formext'
export const createForms = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            id_sample,
            m03,
            nro_factura_exportacion,
            laboratorio,
            cod_analisis,
            des_comprador,
            des_aduana,
            des_pais,
            tipo_transporte,
            placa,
            nom_conductor,
            licencia,
            observaciones
        } = req.body;

        // Validar campos obligatorios
        if (id_sample === undefined || id_sample === null) {
            res.status(400).json({ message: 'El id_sample es obligatorio' });
            return;
        }

        // Crear un nuevo registro en la tabla FormExt
        const newForm = await prisma.create({
            data: {
                id_sample,
                m03,
                nro_factura_exportacion,
                laboratorio,
                cod_analisis,
                des_comprador,
                des_aduana,
                des_pais,
                tipo_transporte,
                placa,
                nom_conductor,
                licencia,
                observaciones
            },
            include: {
                sample: true // Incluye la relación con Sample si es necesario
            }
        });

        res.status(201).json(newForm);
    } catch (error: any) {
        console.error(error);

        if (error?.code === 'P2002' && error?.meta?.target?.includes('id_sample')) {
            res.status(400).json({ message: 'El id_sample ya está en uso' });
        } else {
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const getAllForms = async (req: Request, res: Response): Promise<void> => {
    try {
        const formext = await prisma.findMany({
            include: { sample: {  include: { minerales: true }}},
        })
        res.status(200).json(formext);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getFormById = async (req: Request, res: Response): Promise<void> => {
    const formextId = parseInt(req.params.id)
    try {
         const formext = await prisma.findUnique({
            where: { id: formextId },
            include: { sample: {  include: { minerales: true }}},
          
        })
        if (!formext) {
            res.status(404).json({ error: 'El formulario externo no fue encontrado' })
            return
        }
        res.status(200).json(formext)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateForms = async (req: Request, res: Response): Promise<void> => {
    const formId = parseInt(req.params.id)
    const {  id_sample,
        m03,
        nro_factura_exportacion,
        laboratorio,
        cod_analisis,
        des_comprador,
        des_aduana,
        des_pais,
        tipo_transporte,
        placa,
        nom_conductor,
        licencia,
        observaciones} = req.body
    try {

        let dataToUpdate: any = { ...req.body }

        if (id_sample) {
            
            dataToUpdate.id_sample = id_sample
        }
        if (m03) {
            dataToUpdate.m03 = m03
        }
        if (nro_factura_exportacion) {
            dataToUpdate.nro_factura_exportacion = nro_factura_exportacion
        }
        if (laboratorio) {
            dataToUpdate.laboratorio = laboratorio
        }
        if (cod_analisis) {
            dataToUpdate.cod_analisis = cod_analisis
        }   
        if (des_comprador) {
            dataToUpdate.des_comprador = des_comprador
        }
        if (des_aduana) {
            dataToUpdate.des_aduana = des_aduana
        }
        if (des_pais) {
            dataToUpdate.des_pais = des_pais
        }
        if (tipo_transporte) {
            dataToUpdate.tipo_transporte = tipo_transporte
        }
        if (placa) {
            dataToUpdate.placa = placa
        }
        if (nom_conductor) {
            dataToUpdate.nom_conductor = nom_conductor
        }
        if (licencia) {
            dataToUpdate.licencia = licencia
        }
        if (observaciones) {
            dataToUpdate.observaciones = observaciones
        }
        const formext = await prisma.update({
            where: {
                id: formId
            },
            data: dataToUpdate
        })

        res.status(200).json(formext)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'El email ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteForms = async (req: Request, res: Response): Promise<void> => {
    const formextId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: formextId
            }
        })

        res.status(200).json({
            message: `El usuario ${formextId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}