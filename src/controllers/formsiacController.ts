import { Request, Response } from "express";
import { prisma } from "../models/prismaClient";  
import { convertBigIntToString } from "../utils/convertBigInt";

export const getFormularioByNroFormulariosPDF = async (req: Request, res: Response): Promise<void> => {
    const nroFormulario = decodeURIComponent(req.params[0]);

    try {
        // 1. Buscar si es formExt
        const formext = await prisma.formExt.findFirst({
            where: { nro_formulario: nroFormulario,
                estado: { in: ['EMITIDO', 'VENCIDO'] } },
            include: {
                operador: { select: { razon_social: true, nit: true, nro_nim: true, tipo_nim_niar: true, id: true } },
                pais: { select: { nombre: true } },
                aduana: { select: { nombre: true, codigo_aduana: true } },
                minerales: { include: { mineral: { select: { nombre: true, sigla: true } } } },
                municipio_origen: { include: { municipios: { select: { municipio: true, codigo: true } } } },
                presentacion: { select: { nombre: true } }
            }
        });

        if (formext) {
            const response = {
                tipo_formulario: 'Formulario Externo',
                nro_formulario: formext.nro_formulario,
                fecha_emision: formext.fecha_creacion ? new Date(formext.fecha_creacion).toLocaleDateString('es-ES') : null,
                hora_emision: formext.fecha_creacion ? new Date(formext.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null,
                fecha_vencimiento: formext.fecha_vencimiento ? new Date(formext.fecha_vencimiento).toLocaleDateString('es-ES') : null,
                hora_vencimiento: formext.fecha_vencimiento ? new Date(formext.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null,
                razon_social: formext.operador?.razon_social,
                nit: formext.operador?.nit,
                nro_nim: formext.operador?.nro_nim,
                tipo_nim_niar: formext.operador?.tipo_nim_niar,
                operador_id: formext.operador?.id,
                m03: formext.m03_id,
                nro_factura_exportacion: formext.nro_factura_exportacion,
                laboratorio: formext.laboratorio,
                codigo_analisis: formext.codigo_analisis,
                acta_verificacion: formext.nro_formulario_tm,
                lote: formext.lote,
                presentacion: formext.presentacion?.nombre,
                merma: formext.merma,
                tara: formext.tara,
                humedad: formext.humedad,
                peso_neto: formext.peso_neto,
                peso_bruto_humedo: formext.peso_bruto_humedo,
                minerales: formext.minerales.map(m => ({
                    mineral: m.mineral?.nombre,
                    sigla: m.mineral?.sigla,
                    ley: m.ley,
                    unidad: m.unidad
                })),
                municipio_origen: formext.municipio_origen.map(m => ({
                    municipio_origen: m.municipios?.municipio,
                    codigo: m.municipios?.codigo
                })),
                comprador: formext.comprador,
                aduana: formext.aduana?.nombre,
                codigo_aduana: formext.aduana?.codigo_aduana,
                pais: formext.pais?.nombre,
                tipo_transporte: formext.tipo_transporte,
                conductor: formext.nom_conductor,
                placa: formext.placa,
                licencia: formext.licencia,
                observaciones: formext.observaciones,
                nro_vagon: formext.nro_vagon,
                empresa_ferrea: formext.empresa_ferrea,
                fecha_ferrea: formext.fecha_ferrea,
                hr_ferrea: formext.hr_ferrea,
                estado:formext.estado
            };

            res.status(200).json(convertBigIntToString(response));
            return;
        }

        // 2. Buscar como formInt si no se encontró como formExt
        const formint = await prisma.formInt.findFirst({
            where: { nro_formulario: nroFormulario,
                estado: { in: ['EMITIDO', 'VENCIDO'] } },
            include: {
                operador: { select: { razon_social: true, nit: true, nro_nim: true, tipo_nim_niar: true, id: true } },
                municipio: { select: { municipio: true, departamento: true } },
                minerales: { include: { mineral: { select: { nombre: true, sigla: true } } } },
                municipio_origen: { include: { municipios: { select: { municipio: true, codigo: true } } } },
                presentacion: { select: { nombre: true } }
            }
        });

        if (formint) {
            const response = {
                tipo_formulario: 'Formulario interno',
                nro_formulario: formint.nro_formulario,
                fecha_emision: formint.fecha_creacion ? new Date(formint.fecha_creacion).toLocaleDateString('es-ES') : null,
                hora_emision: formint.fecha_creacion ? new Date(formint.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null,
                fecha_vencimiento: formint.fecha_vencimiento ? new Date(formint.fecha_vencimiento).toLocaleDateString('es-ES') : null,
                hora_vencimiento: formint.fecha_vencimiento ? new Date(formint.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null,
                razon_social: formint.operador?.razon_social,
                nit: formint.operador?.nit,
                nro_nim: formint.operador?.nro_nim,
                tipo_nim_niar: formint.operador?.tipo_nim_niar,
                operador_id: formint.operador?.id,
                lote: formint.lote,
                presentacion: formint.presentacion?.nombre,
                merma: formint.merma,
                tara: formint.tara,
                humedad: formint.humedad,
                peso_neto: formint.peso_neto,
                cantidad: formint.cantidad,
                peso_bruto_humedo: formint.peso_bruto_humedo,
                minerales: formint.minerales.map(m => ({
                    mineral: m.mineral?.nombre,
                    sigla: m.mineral?.sigla,
                    ley: m.ley,
                    unidad: m.unidad
                })),
                municipio_origen: formint.municipio_origen.map(m => ({
                    municipio_origen: m.municipios?.municipio,
                    codigo: m.municipios?.codigo
                })),
                comprador: formint.des_comprador,
                municipio_destino: formint.municipio?.municipio,
                departamento_destino: formint.municipio?.departamento?.nombre,
                tipo_transporte: formint.tipo_transporte,
                conductor: formint.nom_conductor,
                placa: formint.placa,
                licencia: formint.licencia,
                observaciones: formint.observaciones,
                nro_vagon: formint.nro_vagon,
                empresa_ferrea: formint.empresa_ferrea,
                fecha_ferrea: formint.fecha_ferrea,
                hr_ferrea: formint.hr_ferrea,
                estado:formint.estado
            };

            res.status(200).json(convertBigIntToString(response));
            return;
        }
          // 2. Buscar como Sample si no se encontró como Sample
        const sample = await prisma.sample.findFirst({
            where: { nro_formulario: nroFormulario,
                estado: { in: ['APROBADO', 'FIRMADO'] } },
                include: {
                    operador: { select: { razon_social: true } }, 
                    responsabletm: { select: { nombre: true, apellidos: true } },
                    responsable_gador :{ select: {nombre: true, apellidos: true }},
                    senarecomtm: { select: { nombre: true, apellidos: true } },    
                    presentacion: { select: { nombre: true } },    
                    municipio :{ select: {municipio: true }},
                    minerales: {
                        include: {
                            mineral: { select: { sigla: true, nombre: true, id: true } }  
                        }
                    },
                    municipio_origen: {
                        include: {
                            municipios: { select: { municipio: true, id: true, departamento_id: true } }  
                        }
                    }
                }
        });
        if (sample) {
            const response = {
                tipo_formulario: 'Formulario de toma de muestra',
                nro_formulario: sample.nro_formulario,
                peso_neto: sample.peso_neto_total,
                lote: sample.lote,
                camiones: sample.nro_camiones,
                observaciones:sample.observaciones,
                lugar_verificacion:sample.lugar_verificacion,
                razon_social: sample.operador?.razon_social,
                municipio: sample.municipio?.municipio,
                responsable_muestra: sample.responsabletm?.nombre+" " +sample.responsabletm?.apellidos, 
                responsable_senarecom: sample.senarecomtm?.nombre+" " +sample.senarecomtm?.apellidos, 
                responsable_gador: sample.responsable_gador?.nombre+" " +sample.responsable_gador?.apellidos, 
                presentacion_id: sample.presentacion?.nombre,
                foto_link:sample.foto_link,
                humedad: sample.humedad,
                estado:sample.estado,      
                minerales: sample.minerales.map(m => ({
                    mineralId: m.mineral?.id,
                    sigla: m.mineral?.sigla,
                    ley: m.ley,
                    unidad: m.unidad
                })),
                municipio_origen: sample.municipio_origen.map(m => ({
                    municipio_origen_id: m.municipios?.id,
                    departemento_id: m.municipios?.departamento_id,
    
                })),
            };

            res.status(200).json(convertBigIntToString(response));
            return;
        }
        res.status(404).json({ error: 'El número de formulario no existe en el sistema SIDCOM' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
