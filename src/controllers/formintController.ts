import { Request, Response } from "express";
import prisma from '../models/formint'
import { Decimal } from "@prisma/client/runtime/library";
export const createForms = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            id_operador,
            lotes,
            presentacion,
            cantidad,
            peso_neto,
            tara,
            humedad,
            merma,
            minerales,
            id_municipio_origen,
            des_tipo,
            des_comprador,
            des_planta,
            id_municipio_destino,
            tipo_transporte,
            placa,
            nom_conductor,
            licencia,
            nro_viajes,
            observaciones
        } = req.body;

        // Validar campos obligatorios
        if (id_operador === undefined || id_operador === null) {
            res.status(400).json({ message: 'El id_operador es obligatorio' });
            return;
        }

        // Crear un nuevo registro en la tabla FormExt
        const newForm = await prisma.create({
            data: {
                id_operador,
                lotes,
                presentacion,
                cantidad,
                peso_neto: new Decimal(peso_neto),
                tara,
                humedad,
                merma,
                minerales: {
                    create: minerales.map((mineral: any) => ({
                      mineral: {
                        connect: { id: mineral.mineralId },
                      },
                      ley: mineral.ley,
                      unidad: mineral.unidad,
                    })),
                },
                id_municipio_origen,
                des_tipo,
                des_comprador,
                des_planta,
                id_municipio_destino,
                tipo_transporte,
                placa,
                nom_conductor,
                licencia,
                nro_viajes,
                observaciones,
            },
            include: {
                minerales: true // Incluye la relación con Sample si es necesario
            }
        });

        res.status(201).json(newForm);
    } catch (error: any) {
        console.error(error);

        if (error?.code === 'P2002' && error?.meta?.target?.includes('id_operador')) {
            res.status(400).json({ message: 'El id_operador ya está en uso' });
        } else {
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const getAllForms = async (req: Request, res: Response): Promise<void> => {
    try {
        const formint = await prisma.findMany({
            include: { minerales: true }
    })
        res.status(200).json(formint);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getFormById = async (req: Request, res: Response): Promise<void> => {
    const formintId = parseInt(req.params.id)
    try {
        const formint = await prisma.findUnique({
            where: { id: formintId },
                   include: { minerales: true }
               
        })
        if (!formint) {
            res.status(404).json({ error: 'El formulario interno no fue encontrado' })
            return
        }
        res.status(200).json(formint)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const updateForms = async (req: Request, res: Response): Promise<void> => {
    const formId = parseInt(req.params.id)
    const {
        id_operador,
        lotes,
        presentacion,
        cantidad,
        peso_neto,
        tara,
        humedad,
        merma,
        minerales, // Añadido para manejar la relación minerales
        id_municipio_origen,
        des_tipo,
        des_comprador,
        des_planta,
        id_municipio_destino,
        tipo_transporte,
        placa,
        nom_conductor,
        licencia,
        nro_viajes,
        observaciones
    } = req.body

    try {
        // Datos a actualizar en el modelo FormInt
        let dataToUpdate: any = {
            id_operador,
            lotes,
            presentacion,
            cantidad,
            peso_neto,
            tara,
            humedad,
            merma,
            id_municipio_origen,
            des_comprador,
            des_tipo,
            des_planta,
            id_municipio_destino,
            tipo_transporte,
            placa,
            nom_conductor,
            licencia,
            nro_viajes,
            observaciones
        };

        // Actualizar el formulario
        const formint = await prisma.update({
            where: { id: formId },
            data: dataToUpdate
        });

        // Actualizar la relación minerales
        if (minerales && Array.isArray(minerales)) {
            // Primero eliminar las relaciones actuales
            await prisma.update({
                where: { id: formId },
                data: {
                    minerales: {
                        deleteMany: {} // Eliminar todas las relaciones actuales
                    }
                }
            });

            // Luego agregar las relaciones actualizadas
            await prisma.update({
                where: { id: formId },
                data: {
                    minerales: {
                        createMany: {
                            data: minerales.map(mineral => ({
                                mineralId: mineral.mineralId,
                                ley: mineral.ley,
                                unidad: mineral.unidad
                            }))
                        }
                    }
                }
            });
        }

        res.status(200).json(formint);
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'El email ingresado ya existe' });
        } else if (error?.code == 'P2025') {
            res.status(404).json('Formulario no encontrado');
        } else {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
}

/*
export const updateForms = async (req: Request, res: Response): Promise<void> => {
    const formId = parseInt(req.params.id)
    const { id_operador,
        lotes,
        presentacion,
        cantidad,
        peso_neto,
        tara,
        humedad,
        merma,
        //minerales,
        id_municipio_origen,
        des_tipo,
        des_comprador,
        des_planta,
        id_municipio_destino,
        tipo_transporte,
        placa,
        nom_conductor,
        licencia,
        nro_viajes,
        observaciones} = req.body
    try {

        let dataToUpdate: any = { ...req.body }

        if (id_operador) {
            
            dataToUpdate.id_operador = id_operador
        }
        if (lotes) {
            dataToUpdate.lotes = lotes
        }
        if (presentacion) {
            dataToUpdate.presentacion = presentacion
        }
        if (cantidad) {
            dataToUpdate.cantidad = cantidad
        }
        if (peso_neto) {
            dataToUpdate.peso_neto = peso_neto
        }
        if (tara) {
            dataToUpdate.tara = tara
        }
        if (humedad) {
            dataToUpdate.humedad = humedad
        }
        if (merma) {
            dataToUpdate.merma = merma
        }
        if (id_municipio_origen) {
            dataToUpdate.id_municipio_origen = id_municipio_origen
        }
        if (des_comprador) {
            dataToUpdate.des_comprador = des_comprador
        }
        if (des_tipo) {
            dataToUpdate.des_tipo = des_tipo
        }
        if (des_planta) {
            dataToUpdate.des_planta = des_planta
        }
        if (id_municipio_destino) {
            dataToUpdate.id_municipio_destino = id_municipio_destino
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
        if (nro_viajes) {
            dataToUpdate.nro_viajes = nro_viajes
        }
        if (observaciones) {
            dataToUpdate.observaciones = observaciones
        }
        const formint = await prisma.update({
            where: {
                id: formId
            },
            data: dataToUpdate
        })

        res.status(200).json(formint)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'El email ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('Formulario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
*/

export const deleteForms = async (req: Request, res: Response): Promise<void> => {
    const formintId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: formintId
            }
        })

        res.status(200).json({
            message: `El formulario Interno ${formintId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Formulario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}