import { Request, Response } from "express";
import { prisma } from "../models/prismaClient";  
import { convertBigIntToString } from "../utils/convertBigInt";
import crypto from 'crypto';
import { Decimal } from "@prisma/client/runtime/library";
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const generateFormNumber = async (): Promise<string> => {
        const currentYear = new Date().getFullYear().toString();
        const result = await prisma.$transaction(async (prisma) => {
            // Contar los formularios del año actual
            const totalForms = await prisma.formCola.count({
                where: {
                    nro_formulario: {
                        endsWith: `/${currentYear}`,
                    },
                },
            });
            const nextNumber = totalForms === 0 ? 1 : totalForms + 1;
            return `G-${nextNumber}/${currentYear}`;
        });
        return result;
    };
// Función para generar un hash único
const generateUniqueHash = async (): Promise<string> => {
    let hash: string = '';
    await prisma.$transaction(async (tx) => {
        let existingForm: any;  
        do {
            hash = generateRandomString(32);  // Generar el hash aleatorio
            existingForm = await tx.formCola.findUnique({
                where: { hash },
            });
        } while (existingForm);  // Si existe el hash, volvemos a intentarlo
    });
    return hash; 
};
const generateRandomString = (length: number): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@$^*()-_<>[]';
    let result = '';
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % chars.length];
    }
    return result;
};

export const createForms = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const {
            operador_id,
            lote,
            peso_bruto_humedo,
            peso_neto,
            tipo_transporte,
            placa,
            nom_conductor,
            licencia,
            observaciones,
            nro_vagon,
            empresa_ferrea,
            fecha_ferrea,
            hr_ferrea,
            nro_viajes,
            justificacion_anulacion,
            destino,
            almacen,
            dique_cola,
            municipio_origen,
            municipio_destino,
            minerales,
        } = req.body;
        const user_id = req.user?.id;
        const tara = req.body.tara !== undefined && req.body.tara !== null ? new Decimal(req.body.tara) : null;
        if (!user_id) {
            return res.status(400).json({ message: 'No se ha encontrado un usuario asociado al token' });
        }
        // Verificar si el operador existe
        const operador = await prisma.operator.findUnique({
            where: { id: operador_id }
        });
        if (!operador) {
            return res.status(404).json({ error: 'El operador no es válido' });
        }
        const validarExistencia = async (ids: number[], modelo: any, nombre: string, res: any) => {
            if (!ids || !Array.isArray(ids) || ids.length === 0) return;
            const registrosExistentes = await modelo.findMany({
                where: { id: { in: ids } }
            });
            const existentesIds = registrosExistentes.map((item: any) => item.id);
            const noExistentes = ids.filter(id => !existentesIds.includes(id));
            if (noExistentes.length > 0) {
                return res.status(404).json({ message: `Los siguientes ${nombre} no existen: ${noExistentes.join(', ')}` });
            }
        };
        
        const validarDatos = async (req: any, res: any) => {
            const { municipio_origen, municipio_destino, minerales } = req.body;
            const municipioOrigenIds = municipio_origen?.map((m: any) => m.id) || [];
            const municipioDestinoIds = municipio_destino?.map((m: any) => m.id) || [];
            const mineralIds = minerales?.map((m: any) => m.mineralId) || [];
            await Promise.all([
                validarExistencia(municipioOrigenIds, prisma.municipios, "municipios de origen", res),
                validarExistencia(municipioDestinoIds, prisma.municipios, "municipios de destino", res),
                validarExistencia(mineralIds, prisma.mineral, "minerales", res)
            ]);
            return res.status(200).json({ message: "Validación exitosa" });
        };
        const newNroFormulario = await generateFormNumber();
        const uniqueHash = await generateUniqueHash();
        const newForm = await prisma.formCola.create({
            data: {
                user: {
                    connect: { id: user_id }
                },
                operador: {
                    connect: { id: operador_id }
                },
                nro_formulario: newNroFormulario,
                lote,
                peso_bruto_humedo: new Decimal(peso_bruto_humedo),
                peso_neto: new Decimal(peso_neto),
                tara:tara,
                minerales: {
                    create: minerales.map((mineral: any) => ({
                        mineral: { connect: { id: mineral.mineralId } }
                    })),
                },
                municipio_origen: {
                    create: municipio_origen.map((municipio: any) => ({
                        municipioId: municipio.id,
                    })),
                },
                municipio_destino: {
                    create: municipio_destino.map((municipio: any) => ({
                        municipioId: municipio.id,
                    })),
                },
                tipo_transporte,
                placa,
                nom_conductor,
                licencia,
                observaciones,
                justificacion_anulacion,
                nro_vagon,
                empresa_ferrea,
                fecha_ferrea: fecha_ferrea ? new Date(fecha_ferrea + "T00:00:00Z").toISOString() : null,
                hr_ferrea,
                nro_viajes,
                destino,
                almacen,
                dique_cola,
                created_at: new Date(),
                updated_at: new Date(),
                hash: uniqueHash,
            },
            include: {
                minerales: true,
                municipio_origen: true,
                municipio_destino: true,
            },
        });
        return res.status(201).json(newForm);
    } catch (error: any)  {
        console.error(error);
        // Manejo específico de errores de Prisma
        if (error.code === 'P2025' || error.code === 'P2003') {
            return res.status(404).json({ error: 'Uno o más minerales o municipios no existen en la base de datos.' });
        } else if (error.code === 'P2011') {
            return res.status(404).json({ error: 'El operador no es válido' });
        } else if (error.code === 'P2002') {
            return res.status(409).json({ error: 'El hash ya existe, por favor intente nuevamente.' });
        }
        // Error general en el servidor
        return res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getAllForms = async (req: Request, res: Response): Promise<void> => {
    try {
        const formcola = await prisma.formCola.findMany({
            include: { minerales: true,
                municipio_origen: true,
                municipio_destino: true
             }
    })
        res.status(200).json(formcola);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getFormsByOperadorId = async (req: Request, res: Response): Promise<void> => {
    const operadorId = parseInt(req.params.id);
    try {
        if (isNaN(operadorId)) {
            res.status(400).json({ error: 'El operador_id debe ser un número válido' });
            return;
        }
        const formcolas = await prisma.formCola.findMany({
            where: {
                operador_id: operadorId, 
            },
            include: {
                minerales: true,
                municipio_origen: true,
                municipio_destino: true
            }
        });
        if (formcolas.length === 0) {
            res.status(404).json({ error: `No se encontraron formularios para el operador_id ${operadorId}` });
            return;
        }
        res.status(200).json(formcolas);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getAllFormReducido = async (req: Request, res: Response): Promise<void> => {
    try {
        const formcola = await prisma.formCola.findMany({
            select: {
                id: true,
                operador_id: true,
                nro_formulario: true,
                fecha_creacion: true,
                estado: true,
                fecha_vencimiento: true,
                operador: {
                    select: {
                        razon_social: true, 
                    }
                }
            },
        });
        const result = formcola.map(item => ({
            ...item,
            razon_social: item.operador?.razon_social, 
            operador: undefined,  
        }));
        res.status(200).json(result);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getAllFormOperatorReducido = async (req: Request, res: Response): Promise<void> => {
    const operadorId = parseInt(req.params.id); 
    try {
        if (isNaN(operadorId)) {
            res.status(400).json({ error: 'El operador_id debe ser un número válido' });
            return;
        }
        const formcola = await prisma.formCola.findMany({
            where: {
                operador_id: operadorId,
            },
            select: {
                id: true,
                operador_id: true,
                nro_formulario: true,
                fecha_creacion: true,
                estado: true,
                fecha_vencimiento: true,
                operador: {
                    select: {
                        razon_social: true, 
                    }
                }
            }
        });
        if (formcola.length === 0) {
            res.status(404).json({ error: `No se encontraron formularios de colas para el operador_id ${operadorId}` });
            return;
        }
        const result = formcola.map(item => ({
            id: item.id,
            nro_formulario: item.nro_formulario,
            estado: item.estado,
            fecha_creacion: item.fecha_creacion,
            fecha_vencimiento: item.fecha_vencimiento,
            operador_id: item.operador_id,
            razon_social: item.operador?.razon_social,
        }));
        res.status(200).json(result);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getFormById = async (req: Request, res: Response): Promise<void> => {
    const formcolaId = parseInt(req.params.id)
    try {
        const formcola = await prisma.formCola.findUnique({
            where: { id: formcolaId
            },
                   include: { minerales: true,
                    municipio_origen: true,
                    municipio_destino: true
                    }
        })
        if (!formcola) {
            res.status(404).json({ error: 'El formulario de cola no fue encontrado' })
            return
        }
        res.status(200).json(formcola)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const updateForms = async (req: Request, res: Response): Promise<void> => {
    const formId = parseInt(req.params.id);
    const {
        operador_id,
        lote,
        peso_bruto_humedo,
        peso_neto,
        tipo_transporte,
        placa,
        tara,
        nom_conductor,
        licencia,
        observaciones,
        nro_vagon,
        empresa_ferrea,
        fecha_ferrea,
        hr_ferrea,
        nro_viajes,
        justificacion_anulacion,
        destino,
        almacen,
        dique_cola,
        municipio_origen,
        municipio_destino,
        minerales, // Municipio origen también actualizado
    } = req.body;

    try {
        // Validaciones para verificar si los registros existen
        const operador = await prisma.operator.findUnique({
            where: { id: operador_id },
        });
        if (!operador) {
            res.status(404).json({ error: 'El operador no existe' });
        }
        const validarExistencia = async (ids: number[], modelo: any, nombre: string, res: any) => {
            if (!ids || !Array.isArray(ids) || ids.length === 0) return;
            const registrosExistentes = await modelo.findMany({
                where: { id: { in: ids } }
            });
            const existentesIds = registrosExistentes.map((item: any) => item.id);
            const noExistentes = ids.filter(id => !existentesIds.includes(id));
            if (noExistentes.length > 0) {
                return res.status(404).json({ message: `Los siguientes ${nombre} no existen: ${noExistentes.join(', ')}` });
            }
        };
        
        const validarDatos = async (req: any, res: any) => {
            const { municipio_origen, municipio_destino, minerales } = req.body;
            const municipioOrigenIds = municipio_origen?.map((m: any) => m.id) || [];
            const municipioDestinoIds = municipio_destino?.map((m: any) => m.id) || [];
            const mineralIds = minerales?.map((m: any) => m.mineralId) || [];
            await Promise.all([
                validarExistencia(municipioOrigenIds, prisma.municipios, "municipios de origen", res),
                validarExistencia(municipioDestinoIds, prisma.municipios, "municipios de destino", res),
                validarExistencia(mineralIds, prisma.mineral, "minerales", res)
            ]);
            return res.status(200).json({ message: "Validación exitosa" });
        };

        // Datos a actualizar en el modelo FormCola
        let dataToUpdate: any = {};
            if (operador_id) dataToUpdate.operador_id = operador_id;
            if (lote) dataToUpdate.lote = lote;
            if (peso_bruto_humedo) dataToUpdate.peso_bruto_humedo = new Decimal(peso_bruto_humedo);
            if (peso_neto) dataToUpdate.peso_neto = new Decimal(peso_neto);
            if (tara) dataToUpdate.tara = new Decimal(tara);
            if (tipo_transporte) dataToUpdate.tipo_transporte = tipo_transporte;
            if (placa) dataToUpdate.placa = placa;
            if (nom_conductor) dataToUpdate.nom_conductor = nom_conductor;
            if (licencia) dataToUpdate.licencia = licencia;
            if (observaciones) dataToUpdate.observaciones = observaciones;
            if (justificacion_anulacion) dataToUpdate.justificacion_anulacion = justificacion_anulacion;
            if (nro_vagon) dataToUpdate.nro_vagon = nro_vagon;
            if (empresa_ferrea) dataToUpdate.empresa_ferrea = empresa_ferrea;
            if (fecha_ferrea) dataToUpdate.fecha_ferrea = fecha_ferrea;
            if (hr_ferrea) dataToUpdate.hr_ferrea = hr_ferrea;
            if (destino) dataToUpdate.destino = destino;
            if (almacen) dataToUpdate.almacen = almacen;
            if (dique_cola) dataToUpdate.dique_cola = dique_cola;
            if (nro_viajes) dataToUpdate.nro_viajes = nro_viajes;
            dataToUpdate.updated_at = new Date();
      
      
        // Actualizamos el formulario principal
        const formcola = await prisma.formCola.update({
            where: { id: formId },
            data: dataToUpdate,
        });
        // Si se enviaron minerales, actualizamos la relación
        if (minerales && Array.isArray(minerales) && minerales.length > 0) {
            await prisma.formCola.update({
                where: { id: formId },
                data: {
                    minerales: {
                        deleteMany: {}, // Eliminar todas las relaciones actuales de minerales
                        createMany: {
                            data: minerales.map((mineral: any) => ({
                                mineralId: mineral.mineralId
                            })),
                        },
                    },
                },
            });
        }
        // Si se enviaron municipios de origen, actualizamos la relación
        if (municipio_origen && Array.isArray(municipio_origen) && municipio_origen.length > 0) {
            await prisma.formCola.update({
                where: { id: formId },
                data: {
                    municipio_origen: {
                        deleteMany: {}, // Eliminar todas las relaciones actuales de municipios de origen
                        createMany: {
                            data: municipio_origen.map((municipio: any) => ({
                                municipioId: municipio.id,
                            })),
                        },
                    },
                },
            });
        }
        // Si se enviaron municipios de origen, actualizamos la relación
        if (municipio_destino && Array.isArray(municipio_destino) && municipio_destino.length > 0) {
            await prisma.formCola.update({
                where: { id: formId },
                data: {
                    municipio_destino: {
                        deleteMany: {}, // Eliminar todas las relaciones actuales de municipios de origen
                        createMany: {
                            data: municipio_destino.map((municipio: any) => ({
                                municipioId: municipio.id,
                            })),
                        },
                    },
                },
            });
        }
        // Recuperar el formulario actualizado junto con los minerales y municipios de origen
        const updatedForm = await prisma.formCola.findUnique({
            where: { id: formId },
            include: {
                minerales: true,       
                municipio_origen: true,
                municipio_destino: true,
            },
        });
        // Respondemos con el formulario actualizado
        res.status(200).json(updatedForm);
    } catch (error: any) {
        // Manejo de errores según el tipo de error
        if (error?.code === 'P2002' && error?.meta?.target?.includes('hash')) {
            res.status(400).json({ error: 'El hash ya existe' });
        } else if (error?.code === 'P2025') {
            res.status(404).json('Formulario no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};
export const getFormColaByIdPDF = async (req: Request, res: Response): Promise<void> => {
    const formcolaId = parseInt(req.params.id);
    try {
        const formcola = await prisma.formCola.findUnique({
            where: { 
                id: formcolaId
            },
            include: {
                operador: { select: { razon_social: true, nit:true,nro_nim:true, tipo_nim_niar:true, id:true} }, 
                minerales: {
                    include: {
                        mineral: { select: { nombre: true, sigla:true } }  
                    }
                },
                municipio_origen: {
                    include: {
                        municipios: { select: { municipio: true, codigo:true } }  
                    }
                },
                municipio_destino: {
                    include: {
                        municipios: { select: { municipio: true, codigo:true } }  
                    }
                }
            }
        });
        if (!formcola) {
            res.status(404).json({ error: 'Formulario de cola no fue encontrada' });
            return;
        }
        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const response = {
            id:formcola.id,
            nro_formulario:formcola.nro_formulario,
            fecha_emision: formcola.fecha_creacion ? new Date(formcola.fecha_creacion).toLocaleDateString('es-ES') : null,  
            hora_emision: formcola.fecha_creacion ? new Date(formcola.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_vencimiento: formcola.fecha_vencimiento ? new Date(formcola.fecha_vencimiento).toLocaleDateString('es-ES') : null,  
            hora_vencimiento: formcola.fecha_vencimiento ? new Date(formcola.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            razon_social: formcola.operador?.razon_social,
            nit: formcola.operador?.nit,
            nro_nim: formcola.operador?.nro_nim,
            operador_id: formcola.operador?.id,
            lote:formcola.lote,
            tara:formcola.tara,
            peso_neto:formcola.peso_neto,
            peso_bruto_humedo:formcola.peso_bruto_humedo,
            minerales: formcola.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla
            })),
            municipio_origen: formcola.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            municipio_destino: formcola.municipio_destino.map(m => ({
                municipio_destino: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            tipo_transporte:formcola.tipo_transporte,
            conductor:formcola.nom_conductor,
            placa:formcola.placa,
            licencia:formcola.licencia,
            observaciones:formcola.observaciones,
            estado:formcola.estado,
            hash:formcola.hash,
            nro_vagon:formcola.nro_vagon,
            empresa_ferrea:formcola.empresa_ferrea,
            fecha_ferrea:formcola.fecha_ferrea,
            hr_ferrea:formcola.hr_ferrea,
            destino:formcola.destino,
            almacen:formcola.almacen,
            dique_cola:formcola.dique_cola,
        };
         res.status(200).json(convertBigIntToString(response));
        //res.status(200).json(response);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getFormcolaByNroFormulariosPDF = async (req: Request, res: Response): Promise<void> => {
    // Captura y decodifica todo lo que viene después de /print_nro_form/
    const nroFormulario = decodeURIComponent(req.params[0]); 
    //console.log("Nro Formulario:", nroFormulario);
    try {
        const formcola = await prisma.formCola.findFirst({
            where: { nro_formulario: nroFormulario
             },
             include: {
                operador: { select: { razon_social: true, nit:true,nro_nim:true, tipo_nim_niar:true, id:true} }, 
                minerales: {
                    include: {
                        mineral: { select: { nombre: true, sigla:true } }  
                    }
                },
                municipio_origen: {
                    include: {
                        municipios: { select: { municipio: true, codigo:true } }  
                    }
                },
                municipio_destino: {
                    include: {
                        municipios: { select: { municipio: true, codigo:true } }  
                    }
                }
            }
        });

        if (!formcola) {
            res.status(404).json({ error: 'El número de formulario interno no existe en el sistema SIDCOM' });
            return;
        }
        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const response = {
            nro_formulario:formcola.nro_formulario,
            fecha_emision: formcola.fecha_creacion ? new Date(formcola.fecha_creacion).toLocaleDateString('es-ES') : null,  
            hora_emision: formcola.fecha_creacion ? new Date(formcola.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_vencimiento: formcola.fecha_vencimiento ? new Date(formcola.fecha_vencimiento).toLocaleDateString('es-ES') : null,  
            hora_vencimiento: formcola.fecha_vencimiento ? new Date(formcola.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            razon_social: formcola.operador?.razon_social,
            nit: formcola.operador?.nit,
            nro_nim: formcola.operador?.nro_nim,
            operador_id: formcola.operador?.id,
            lote:formcola.lote,
            tara:formcola.tara,
            peso_neto:formcola.peso_neto,
            peso_bruto_humedo:formcola.peso_bruto_humedo,
            minerales: formcola.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla
            })),
            municipio_origen: formcola.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            municipio_destino: formcola.municipio_destino.map(m => ({
                municipio_destino: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            tipo_transpote:formcola.tipo_transporte,
            conductor:formcola.nom_conductor,
            placa:formcola.placa,
            licencia:formcola.licencia,
            observacion:formcola.observaciones,
            estado:formcola.estado,
            hash:formcola.hash,
            nro_vagon:formcola.nro_vagon,
            empresa_ferrea:formcola.empresa_ferrea,
            fecha_ferrea:formcola.fecha_ferrea,
            hr_ferrea:formcola.hr_ferrea,
            destino:formcola.destino,
            almacen:formcola.almacen,
            dique_cola:formcola.dique_cola,
        };
        //res.status(200).json(response);
        res.status(200).json(convertBigIntToString(response));
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getFormColaHash = async (req: Request, res: Response): Promise<void> => {
    try {
        const formcolahash = req.query.hash ? String(req.query.hash) : null;
        if (!formcolahash) {
            res.status(404).json({ error: 'El Formulario de cola no fue encontrado' });
            return;
        }
        const formcola = await prisma.formCola.findUnique({
            where: { hash: formcolahash,
            },
            include: {
                operador: { select: { razon_social: true, nit:true,nro_nim:true, tipo_nim_niar:true, id:true} }, 
                minerales: {
                    include: {
                        mineral: { select: { nombre: true, sigla:true } }  
                    }
                },
                municipio_origen: {
                    include: {
                        municipios: { select: { municipio: true, codigo:true } }  
                    }
                },
                municipio_destino: {
                    include: {
                        municipios: { select: { municipio: true, codigo:true } }  
                    }
                }
            }
        });

        if (!formcola) {
            res.status(404).json({ error: 'Formulario de cola no fue encontrada' });
            return;
        }
        const formattedFormcola = {
            id:formcola.id,
            nro_formulario:formcola.nro_formulario,
            fecha_emision: formcola.fecha_creacion ? new Date(formcola.fecha_creacion).toLocaleDateString('es-ES') : null,  
            hora_emision: formcola.fecha_creacion ? new Date(formcola.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_vencimiento: formcola.fecha_vencimiento ? new Date(formcola.fecha_vencimiento).toLocaleDateString('es-ES') : null,  
            hora_vencimiento: formcola.fecha_vencimiento ? new Date(formcola.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            razon_social: formcola.operador?.razon_social,
            nit: formcola.operador?.nit,
            nro_nim: formcola.operador?.nro_nim,
            operador_id: formcola.operador?.id,
            lote:formcola.lote,
            tara:formcola.tara,
            peso_neto:formcola.peso_neto,
            peso_bruto_humedo:formcola.peso_bruto_humedo,
            minerales: formcola.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla
            })),
            municipio_origen: formcola.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            municipio_destino: formcola.municipio_destino.map(m => ({
                municipio_destino: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            tipo_transpote:formcola.tipo_transporte,
            conductor:formcola.nom_conductor,
            placa:formcola.placa,
            licencia:formcola.licencia,
            observacion:formcola.observaciones,
            estado:formcola.estado,
            hash:formcola.hash,
            nro_vagon:formcola.nro_vagon,
            empresa_ferrea:formcola.empresa_ferrea,
            fecha_ferrea:formcola.fecha_ferrea,
            hr_ferrea:formcola.hr_ferrea,
            destino:formcola.destino,
            almacen:formcola.almacen,
            dique_cola:formcola.dique_cola,
        };
        res.status(200).json(convertBigIntToString(formattedFormcola));
        //res.status(200).json(formattedFormcola);
    } catch (error: any) {
        console.error('Error al obtener FormCola por hash:', error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const updateFormsAnulacion = async (req: Request, res: Response): Promise<void> => {
    const formId = parseInt(req.params.id);
    const { justificacion_anulacion, estado } = req.body;

    // Verificar qué datos están recibiendo
    console.log("Datos recibidos:", req.body);

    try {
        const validStates = ["ANULADO"];
        if (!validStates.includes(estado)) {
            res.status(400).json({ error: `El estado debe ser : ${validStates.join(", ")}` });
            return;
        }

        if (estado === "ANULADO" && !justificacion_anulacion) {
            res.status(400).json({ error: "La justificación de anulación es obligatoria cuando el estado es 'ANULADO'" });
            return;
        }

        // Buscar el formulario antes de actualizarlo
        const existingForm = await prisma.formCola.findUnique({
            where: { id: formId }, // Aquí ya no necesitas usar prisma.formcola
        });
        if (!existingForm) {
            res.status(404).json({ error: 'Formulario no encontrado' });
            return;
        }

        console.log("Formulario encontrado:", existingForm);

        // Preparar los datos para la actualización
        const dataToUpdate: any = {
            estado,
            justificacion_anulacion,  // Se incluye la justificación si se recibe
            updated_at: new Date(),    // Se actualiza la fecha de modificación
        };

        console.log('Datos a actualizar:', dataToUpdate);
        const formCola = await prisma.formCola.update({ // Aquí es donde se hace el cambio
            where: { id: formId },
            data: dataToUpdate,
        });
        res.status(200).json({
            message: 'Formulario anulado correctamente',
            form: formCola, // Devolvemos el formulario actualizado
        });

    } catch (error: any) {
        console.error("Error al actualizar formulario:", error);

        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Formulario no encontrado' });
            return;
        } else {
            res.status(500).json({ error: 'Hubo un error al procesar la solicitud. Intente más tarde.' });
            return;
        }
    }
};
const generateFormNumbers = async (estado: string): Promise<string> => {
    const currentYear = new Date().getFullYear().toString();
    const prefix = estado === "EMITIDO" ? "C-" : "G-";

    return await prisma.$transaction(async (prisma) => {
        // Buscar todos los formularios existentes del año actual con el prefijo correcto
        const forms = await prisma.formCola.findMany({
            where: {
                nro_formulario: {
                    startsWith: prefix,
                    endsWith: `/${currentYear}`,
                },
            },
            select: { nro_formulario: true },
        });

        let maxNumber = 0;
        forms.forEach(form => {
            const match = form.nro_formulario.match(/^[CG]-(\d+)\/\d{4}$/);
            if (match) {
                const formNumber = parseInt(match[1], 10);
                maxNumber = Math.max(maxNumber, formNumber);
            }
        });

        let nextNumber = maxNumber + 1;
        let newFormNumber = `${prefix}${nextNumber}/${currentYear}`;

        // Evitar duplicados: Si ya existe, incrementar hasta encontrar uno disponible
        while (await prisma.formCola.findUnique({ where: { nro_formulario: newFormNumber } })) {
            nextNumber++;
            newFormNumber = `${prefix}${nextNumber}/${currentYear}`;
        }

        return newFormNumber;
    });
};
export const updateEstado = async (req: Request, res: Response): Promise<void> => {
    const formId = parseInt(req.params.id);
    const { estado } = req.body; // Solo esperamos el estado en el cuerpo de la solicitud

    try {
        const validStates = ["EMITIDO"];
        if (!validStates.includes(estado)) {
            res.status(400).json({ error: `El estado debe ser: ${validStates.join(", ")}` });
            return;
        }

        // Usamos una transacción para asegurar que todo se ejecute de manera atómica
        const result = await prisma.$transaction(async (prisma) => {
            // Buscar el formulario actual
            const form = await prisma.formCola.findUnique({
                where: { id: formId },
            });

            if (!form) {
                throw new Error('Formulario no encontrado');
            }

            // Si el estado es "EMITIDO", aseguramos que el formulario no esté ya en estado "EMITIDO"
            if (estado === "EMITIDO") {
                if (form.estado === "EMITIDO") {
                    throw new Error('El formulario ya está en estado EMITIDO.');
                }

                // Validamos si el formulario está en un estado válido para pasar a "EMITIDO" (por ejemplo, "GENERADO")
                if (form.estado !== "GENERADO") {
                    throw new Error(`El formulario solo puede pasar a estado 'EMITIDO' si está en estado 'GENERADO'. Estado actual: ${form.estado}`);
                }

                // Generamos el siguiente número de formulario con el prefijo "E-" solo si el estado es "EMITIDO"
                const updatedNroFormulario = await generateFormNumbers(estado);

                // Datos a actualizar en el formulario
                const fecha_creacion = new Date();
                const fecha_vencimiento = new Date(fecha_creacion);
                fecha_vencimiento.setDate(fecha_creacion.getDate() + 4); // Añadimos 4 días

                // Si han pasado más de 4 días desde la fecha de creación, actualizamos el estado a "VENCIDO"
                const dataToUpdate: any = {
                    estado,
                    nro_formulario: updatedNroFormulario,
                    fecha_creacion,
                    fecha_vencimiento,
                };

                if (new Date() > fecha_vencimiento) {
                    dataToUpdate.estado = "VENCIDO"; // Cambiamos el estado a VENCIDO
                }

                // Actualizamos el formulario con los nuevos datos
                const formcola = await prisma.formCola.update({
                    where: { id: formId },
                    data: dataToUpdate,
                });

                return formcola; // Devolvemos el formulario actualizado
            }

            // Si no es "EMITIDO", solo se actualiza el estado sin generar un nuevo número
            const dataToUpdate: any = { estado };
            const formcola = await prisma.formCola.update({
                where: { id: formId },
                data: dataToUpdate,
            });
            return formcola; // Devolvemos el formulario actualizado
        });
        // Responder con el estado actualizado y el formulario modificado
        res.status(200).json({
            message: 'Estado actualizado',
            form: result, // Devolvemos el formulario actualizado
        });

    } catch (error: any) {
        // Manejo de errores según el tipo de error
        if (error.message === 'Formulario no encontrado') {
            res.status(404).json({ error: 'Formulario no encontrado' });
        } else if (error.message === 'El formulario ya está en estado EMITIDO.') {
            res.status(400).json({ error: 'El formulario ya está en estado EMITIDO.' });
        } else if (error.message.includes("El formulario solo puede pasar")) {
            res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};


export const deleteForms = async (req: Request, res: Response): Promise<void> => {
    const formcolaId = parseInt(req.params.id)
    try {
        await prisma.formCola.delete({
            where: {
                id: formcolaId
            }
        })
        res.status(200).json({
            message: `El formulario Interno ${formcolaId} ha sido eliminado`
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