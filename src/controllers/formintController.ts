import { Request, Response } from "express";
import { prisma } from "../models/prismaClient";  
import crypto from 'crypto';
import { Decimal } from "@prisma/client/runtime/library";
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// Función para generar el número de formulario con transacción
const generateFormNumber = async (): Promise<string> => {
    const currentYear = new Date().getFullYear().toString(); // Obtener el año actual como string

    // Buscar todos los formularios con los prefijos 'G-', 'I-', 'A-' para el año actual
    const forms = await prisma.formInt.findMany({
        where: {
            nro_formulario: {
                contains: currentYear, // Buscar formularios que contienen el año
            },
        },
        orderBy: {
            nro_formulario: 'desc', // Ordenamos los formularios por el número de formulario de forma descendente
        },
    });
    // Si no se encuentran formularios, comenzamos con el número 1
    if (forms.length === 0) {
        return `G-1/${currentYear}`;
    }
    // Variable para el mayor número de formulario encontrado
    let maxNumber = 0;
    // Recorrer todos los formularios para encontrar el mayor número
    forms.forEach(form => {
        const numberPart = form.nro_formulario.split('-')[1].split('/')[0];
        const formNumber = parseInt(numberPart, 10);
        if (!isNaN(formNumber)) {
            maxNumber = Math.max(maxNumber, formNumber); // Encontramos el mayor número
        }
    });
    // Calculamos el siguiente número
    const nextNumber = maxNumber + 1;
    return `G-${nextNumber}/${currentYear}`;
};

// Función para generar un hash único
const generateUniqueHash = async (): Promise<string> => {
    let hash: string = '';
    let hashExists = true;

    while (hashExists) {
        hash = generateRandomString(16);
        const existingForm = await prisma.formInt.findUnique({
            where: { hash }
        });

        if (!existingForm) {
            hashExists = false;
        }
    }
    return hash;
};

// Función para generar un string aleatorio
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
            presentacion_id,
            cantidad,
            peso_bruto_humedo,
            peso_neto,
            tara,
            humedad,
            merma,
            municipio_origen,
            minerales,
            des_tipo,
            des_comprador,
            des_planta,
            id_municipio_destino,
            tipo_transporte,
            placa,
            nom_conductor,
            licencia,
            observaciones,
            justificacion_anulacion,
            nro_vagon,
            empresa_ferrea,
            fecha_ferrea,
            hr_ferrea,
            tara_volqueta,
            traslado_mineral,
            nro_viajes,
        } = req.body;

        const user_id = req.user?.id;

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
        // Validar si los municipios de origen existen
        if (municipio_origen && Array.isArray(municipio_origen) && municipio_origen.length > 0) {
            const municipioOrigenIds = municipio_origen.map((municipio: any) => municipio.id);
            const municipiosOrigenExistentes = await prisma.municipios.findMany({
                where: {
                    id: { in: municipioOrigenIds }
                }
            });

            // Comprobar si todos los municipios existen
            const municipiosExistentesIds = municipiosOrigenExistentes.map((municipio: any) => municipio.id);
            const municipiosNoExistentes = municipioOrigenIds.filter(id => !municipiosExistentesIds.includes(id));

            if (municipiosNoExistentes.length > 0) {
                return res.status(404).json({ message: `Los siguientes municipios de origen no existen: ${municipiosNoExistentes.join(', ')}` });
            }
        }

        // Validar si los minerales existen
        if (minerales && Array.isArray(minerales) && minerales.length > 0) {
            const mineralIds = minerales.map((mineral: any) => mineral.mineralId);
            const mineralesExistentes = await prisma.mineral.findMany({
                where: {
                    id: { in: mineralIds }
                }
            });

            // Comprobar si todos los minerales existen
            const mineralesExistentesIds = mineralesExistentes.map((mineral: any) => mineral.id);
            const mineralesNoExistentes = mineralIds.filter(id => !mineralesExistentesIds.includes(id));

            if (mineralesNoExistentes.length > 0) {
                return res.status(404).json({ message: `Los siguientes minerales proporcionados no existen: ${mineralesNoExistentes.join(', ')}` });
            }
        }

        // Validar si el municipio de destino existe
        const municipioDestino = await prisma.municipios.findUnique({
            where: { id: id_municipio_destino }
        });
        if (!municipioDestino) {
            return res.status(404).json({ message: "El municipio de destino no existe." });
        }
        // Validar si la presentacion existe
        const presentacion = await prisma.presentacion.findUnique({
            where: { id: presentacion_id }
        });
        if (!presentacion) {
            return res.status(404).json({ message: "La presentacion con el ID proporcionado no existe." });
        }
        // Generación del número de formulario
        const newNroFormulario = await generateFormNumber();
        // Generar un hash único para el formulario
        const uniqueHash = await generateUniqueHash();
        // Crear el nuevo formulario
        const newForm = await prisma.formInt.create({
            data: {
                user: {
                    connect: { id: user_id }
                },
                operador: {
                    connect: { id: operador_id }
                },
                nro_formulario: newNroFormulario,
                lote,
                presentacion: {
                    connect: { id: presentacion_id }
                },
                municipio: {
                    connect: { id: id_municipio_destino }
                },
                cantidad,
                peso_bruto_humedo: new Decimal(peso_bruto_humedo),
                peso_neto: new Decimal(peso_neto),
                tara,
                humedad,
                merma,
                minerales: {
                    create: minerales.map((mineral: any) => ({
                        mineral: { connect: { id: mineral.mineralId } },
                        ley: new Decimal(mineral.ley),
                        unidad: mineral.unidad,
                    })),
                },
                municipio_origen: {
                    create: municipio_origen.map((municipio: any) => ({
                        municipioId: municipio.id,
                    })),
                },
                des_tipo,
                des_comprador,
                des_planta,
                tipo_transporte,
                placa,
                nom_conductor,
                licencia,
                observaciones,
                justificacion_anulacion,
                nro_vagon,
                empresa_ferrea,
                fecha_ferrea: fecha_ferrea ? new Date(fecha_ferrea).toISOString() : null,
                hr_ferrea,
                tara_volqueta,
                traslado_mineral,
                nro_viajes,
                created_at: new Date(),
                updated_at: new Date(),
                hash: uniqueHash,
            },
            include: {
                minerales: true,
                municipio_origen: true,
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
        const formint = await prisma.formInt.findMany({
            where: {
                traslado_mineral: {
                    equals: null
                }
            },
            include: { minerales: true,
                municipio_origen: true
             }
    })
        res.status(200).json(formint);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getFormsByOperadorId = async (req: Request, res: Response): Promise<void> => {
    // Obtener el operador_id desde los parámetros de la ruta
    const operadorId = parseInt(req.params.id);

    try {
        // Verificar si el operador_id es un número válido
        if (isNaN(operadorId)) {
            res.status(400).json({ error: 'El operador_id debe ser un número válido' });
            return;
        }

        // Realizar la consulta para obtener los formularios filtrados por operador_id
        const formints = await prisma.formInt.findMany({
            where: {
                operador_id: operadorId, // Filtrar por operador_id
        
                    traslado_mineral: {
                        equals: null
                    }
            },
            include: {
                minerales: true,
                municipio_origen: true
            }
        });

        // Si no se encuentran formularios para el operador, devolver un mensaje adecuado
        if (formints.length === 0) {
            res.status(404).json({ error: `No se encontraron formularios para el operador_id ${operadorId}` });
            return;
        }

        // Retornar los formularios filtrados
        res.status(200).json(formints);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getAllFormReducido = async (req: Request, res: Response): Promise<void> => {
    try {
        const formint = await prisma.formInt.findMany({
            select: {
                id: true,
                operador_id: true,
                nro_formulario: true,
                fecha_creacion: true,
                estado: true,
                fecha_vencimiento: true,
                operador: {
                    select: {
                        razon_social: true, // Seleccionamos 'razon_social' del operador relacionado
                    }
                }
            },
            where: {
                traslado_mineral: {
                    equals: null
                }
            }
        });

        // Modificar la respuesta para mover 'razon_social' al nivel superior
        const result = formint.map(item => ({
            ...item,
            razon_social: item.operador?.razon_social,  // Mover el campo 'razon_social' al nivel superior
            operador: undefined,  // Eliminamos el objeto 'operador' para no dejarlo en la respuesta
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
        // Verificar si el operador_id es un número válido
        if (isNaN(operadorId)) {
            res.status(400).json({ error: 'El operador_id debe ser un número válido' });
            return;
        }

        // Filtrar por operador_id
        const formint = await prisma.formInt.findMany({
            where: {
                operador_id: operadorId,
                    traslado_mineral: {
                        equals: null
                }
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
                        razon_social: true, // Seleccionamos 'razon_social' del operador relacionado
                    }
                }
            }
        });

        // Si no se encuentran formularios para el operador, devolver un mensaje adecuado
        if (formint.length === 0) {
            res.status(404).json({ error: `No se encontraron formularios de toma de muestra para el operador_id ${operadorId}` });
            return;
        }
        // Modificamos la respuesta para mover 'razon_social' al nivel superior
        const result = formint.map(item => ({
            id: item.id,
            nro_formulario: item.nro_formulario,
            estado: item.estado,
            fecha_creacion: item.fecha_creacion,
            fecha_vencimiento: item.fecha_vencimiento,
            operador_id: item.operador_id,
            razon_social: item.operador?.razon_social,
        }));

        // Retornar los formularios filtrados con los campos específicos
        res.status(200).json(result);

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getFormById = async (req: Request, res: Response): Promise<void> => {
    const formintId = parseInt(req.params.id)
    try {
        const formint = await prisma.formInt.findUnique({
            where: { id: formintId, 
                traslado_mineral: {
                    equals: null
                }
            },
                   include: { minerales: true,
                    municipio_origen: true
                    }
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
    const formId = parseInt(req.params.id);
    const {
        operador_id,
        lote,
        presentacion_id,
        cantidad,
        peso_bruto_humedo,
        peso_neto,
        tara,
        humedad,
        merma,
        minerales,
        des_tipo,
        des_comprador,
        des_planta,
        id_municipio_destino,
        tipo_transporte,
        placa,
        nom_conductor,
        licencia,
        observaciones,
        justificacion_anulacion,
        nro_vagon,
        empresa_ferrea,
        fecha_ferrea,
        hr_ferrea,
        tara_volqueta,
        traslado_mineral,
        nro_viajes,
        municipio_origen, // Municipio origen también actualizado
    } = req.body;

    try {
        // Validaciones para verificar si los registros existen
        const operador = await prisma.operator.findUnique({
            where: { id: operador_id },
        });
        if (!operador) {
            res.status(404).json({ error: 'El operador no existe' });
        }

        const municipioDestino = await prisma.municipios.findUnique({
            where: { id: id_municipio_destino },
        });
        if (!municipioDestino) {
            res.status(404).json({ error: 'El municipio de destino no existe' });
        }
        // Validar municipios de origen (si existen todos)
        if (municipio_origen && Array.isArray(municipio_origen) && municipio_origen.length > 0) {
            const municipiosNoExistentes = [];
            for (const municipio of municipio_origen) {
                const municipioExistente = await prisma.municipios.findUnique({
                    where: { id: municipio.id },
                });
                if (!municipioExistente) {
                    municipiosNoExistentes.push(municipio.id);
                }
            }
            if (municipiosNoExistentes.length > 0) {
                    res.status(404).json({
                    error: `Los siguientes municipios de origen no existen: ${municipiosNoExistentes.join(', ')}`,
                });
            }
        }

        // Validar minerales (si existen todos)
        if (minerales && Array.isArray(minerales) && minerales.length > 0) {
            const mineralesNoExistentes = [];
            for (const mineral of minerales) {
                const mineralExistente = await prisma.mineral.findUnique({
                    where: { id: mineral.mineralId },
                });
                if (!mineralExistente) {
                    mineralesNoExistentes.push(mineral.mineralId);
                }
            }
            if (mineralesNoExistentes.length > 0) {
                    res.status(404).json({
                    error: `Los siguientes minerales no existen: ${mineralesNoExistentes.join(', ')}`,
                });
            }
        }

        // Datos a actualizar en el modelo FormInt
        let dataToUpdate: any = {
            operador_id,
            lote,
            presentacion_id,
            cantidad,
            peso_bruto_humedo: new Decimal(peso_bruto_humedo), // Asegúrate de convertir números decimales si es necesario
            peso_neto: new Decimal(peso_neto),
            tara,
            humedad,
            merma,
            des_tipo,
            des_comprador,
            des_planta,
            id_municipio_destino,
            tipo_transporte,
            placa,
            nom_conductor,
            licencia,
            observaciones,
            justificacion_anulacion,
            nro_vagon,
            empresa_ferrea,
            fecha_ferrea,
            hr_ferrea,
            tara_volqueta,
            traslado_mineral,
            nro_viajes,
            updated_at: new Date(), // Actualización de la fecha
        };
        // Actualizamos el formulario principal
        const formint = await prisma.formInt.update({
            where: { id: formId },
            data: dataToUpdate,
        });
        // Actualizar la relación de minerales
        if (minerales && Array.isArray(minerales) && minerales.length > 0) {
            await prisma.formInt.update({
                where: { id: formId },
                data: {
                    minerales: {
                        deleteMany: {}, // Eliminar todas las relaciones actuales de minerales
                        createMany: {
                            data: minerales.map((mineral: any) => ({
                                mineralId: mineral.mineralId, // Usar mineralId en lugar de mineral
                                ley: new Decimal(mineral.ley), // Asegúrate de usar Decimal para la ley
                                unidad: mineral.unidad,
                            })),
                        },
                    },
                },
            });
        }
        // Actualizar la relación con los municipios de origen
        if (municipio_origen && Array.isArray(municipio_origen) && municipio_origen.length > 0) {
            await prisma.formInt.update({
                where: { id: formId },
                data: {
                    municipio_origen: {
                        deleteMany: {}, // Eliminar todas las relaciones actuales de municipios de origen
                        createMany: {
                            data: municipio_origen.map((municipio: any) => ({
                                municipioId: municipio.id, // Relacionamos el municipio por su ID
                            })),
                        },
                    },
                },
            });
        }

        // Recuperar el formulario actualizado junto con los minerales y municipios de origen
        const updatedForm = await prisma.formInt.findUnique({
            where: { id: formId },
            include: {
                minerales: true,            // Incluir los minerales actualizados
                municipio_origen: true,     // Incluir los municipios de origen actualizados
            },
        });
        // Respondemos con el formulario actualizado
        res.status(200).json(updatedForm);
    } catch (error: any) {
        // Manejo de errores según el tipo de error
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'El email ingresado ya existe' });
        } else if (error?.code === 'P2025') {
            res.status(404).json('Formulario no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};
export const getFormIntByIdPDF = async (req: Request, res: Response): Promise<void> => {
    const formintId = parseInt(req.params.id);
    try {
        const formint = await prisma.formInt.findUnique({
            where: { 
                id: formintId,
                traslado_mineral: {
                    equals: null
                }
            },
            include: {
                operador: { select: { razon_social: true, nit:true,nro_nim:true, tipo_nim_niar:true, id:true} }, 
                municipio :{ select: {municipio: true, departamento:true }},
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
                presentacion :{ select: {nombre: true}}    
            }
        });

        if (!formint) {
            res.status(404).json({ error: 'Formulario externo no fue encontrada' });
            return;
        }
        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const response = {
            id:formint.id,
            nro_formulario:formint.nro_formulario,
            fecha_emision: formint.fecha_creacion ? new Date(formint.fecha_creacion).toLocaleDateString('es-ES') : null,  
            hora_emision: formint.fecha_creacion ? new Date(formint.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_vencimiento: formint.fecha_vencimiento ? new Date(formint.fecha_vencimiento).toLocaleDateString('es-ES') : null,  
            hora_vencimiento: formint.fecha_vencimiento ? new Date(formint.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            razon_social: formint.operador?.razon_social,
            nit: formint.operador?.nit,
            nro_nim: formint.operador?.nro_nim,
            tipo_nim_niar: formint.operador?.tipo_nim_niar,
            operador_id: formint.operador?.id,
            lote:formint.lote,
            presentacion:formint.presentacion?.nombre,
            merma:formint.merma,
            tara:formint.tara,
            humedad:formint.humedad,
            peso_neto:formint.peso_neto,
            cantidad:formint.cantidad,
            peso_bruto_humedo:formint.peso_bruto_humedo,
            minerales: formint.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla,
                ley: m.ley,
                unidad: m.unidad
            })),
            municipio_origen: formint.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            comprador:formint.des_comprador,
            munipio_destino:formint.municipio?.municipio,
            departamento_destino:formint.municipio?.departamento?.nombre, 
            tipo_transpote:formint.tipo_transporte,
            tara_volqueta:formint.tara_volqueta,
            conductor:formint.nom_conductor,
            placa:formint.placa,
            licencia:formint.licencia,
            observacion:formint.observaciones,
            estado:formint.estado,
            hash:formint.hash,
            nro_vagon:formint.nro_vagon,
            empresa_ferrea:formint.empresa_ferrea,
            fecha_ferrea:formint.fecha_ferrea,
            hr_ferrea:formint.hr_ferrea,
        };
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getFormintByNroFormulariosPDF = async (req: Request, res: Response): Promise<void> => {
    // Captura y decodifica todo lo que viene después de /print_nro_form/
    const nroFormulario = decodeURIComponent(req.params[0]); 
    //console.log("Nro Formulario:", nroFormulario);
    try {
        const formint = await prisma.formInt.findFirst({
            where: { nro_formulario: nroFormulario
             },
             include: {
                operador: { select: { razon_social: true, nit:true,nro_nim:true, tipo_nim_niar:true, id:true} }, 
                municipio :{ select: {municipio: true, departamento:true }},
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
                presentacion :{ select: {nombre: true}}    
            }
        });

        if (!formint) {
            res.status(404).json({ error: 'El número de formulario interno no existe en el sistema SIDCOM' });
            return;
        }
        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const response = {
            nro_formulario:formint.nro_formulario,
            fecha_emision: formint.fecha_creacion ? new Date(formint.fecha_creacion).toLocaleDateString('es-ES') : null,  
            hora_emision: formint.fecha_creacion ? new Date(formint.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_vencimiento: formint.fecha_vencimiento ? new Date(formint.fecha_vencimiento).toLocaleDateString('es-ES') : null,  
            hora_vencimiento: formint.fecha_vencimiento ? new Date(formint.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            razon_social: formint.operador?.razon_social,
            nit: formint.operador?.nit,
            nro_nim: formint.operador?.nro_nim,
            tipo_nim_niar: formint.operador?.tipo_nim_niar,
            operador_id: formint.operador?.id,
            lote:formint.lote,
            presentacion:formint.presentacion?.nombre,
            merma:formint.merma,
            tara:formint.tara,
            humedad:formint.humedad,
            peso_neto:formint.peso_neto,
            cantidad:formint.cantidad,
            peso_bruto_humedo:formint.peso_bruto_humedo,
            minerales: formint.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla,
                ley: m.ley,
                unidad: m.unidad
            })),
            municipio_origen: formint.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            comprador:formint.des_comprador,
            munipio_destino:formint.municipio?.municipio,
            departamento_destino:formint.municipio?.departamento?.nombre, 
            tipo_transpote:formint.tipo_transporte,
            tara_volqueta:formint.tara_volqueta,
            conductor:formint.nom_conductor,
            placa:formint.placa,
            licencia:formint.licencia,
            observacion:formint.observaciones,
            nro_vagon:formint.nro_vagon,
            empresa_ferrea:formint.empresa_ferrea,
            fecha_ferrea:formint.fecha_ferrea,
            hr_ferrea:formint.hr_ferrea,
        };
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getFormintHash = async (req: Request, res: Response): Promise<void> => {
    try {
        const forminthash = req.query.hash ? String(req.query.hash) : null;
        if (!forminthash) {
            res.status(404).json({ error: 'El Formulario interno no fue encontrado' });
            return;
        }

        // Consulta de datos con Prisma
        const formint = await prisma.formInt.findUnique({
            where: { hash: forminthash,
                traslado_mineral: {
                equals: null
                }
            },
            include: {
                operador: { select: { razon_social: true, nit:true,nro_nim:true, tipo_nim_niar:true, id:true} }, 
                municipio :{ select: {municipio: true, departamento:true }},
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
                presentacion :{ select: {nombre: true}}    
            }
        });

        if (!formint) {
            res.status(404).json({ error: 'Formulario externo no fue encontrada' });
            return;
        }
        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const formattedFormint = {
            id:formint.id,
            nro_formulario:formint.nro_formulario,
            fecha_emision: formint.fecha_creacion ? new Date(formint.fecha_creacion).toLocaleDateString('es-ES') : null,  
            hora_emision: formint.fecha_creacion ? new Date(formint.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_vencimiento: formint.fecha_vencimiento ? new Date(formint.fecha_vencimiento).toLocaleDateString('es-ES') : null,  
            hora_vencimiento: formint.fecha_vencimiento ? new Date(formint.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            razon_social: formint.operador?.razon_social,
            nit: formint.operador?.nit,
            nro_nim: formint.operador?.nro_nim,
            tipo_nim_niar: formint.operador?.tipo_nim_niar,
            operador_id: formint.operador?.id,
            lote:formint.lote,
            presentacion:formint.presentacion?.nombre,
            merma:formint.merma,
            tara:formint.tara,
            humedad:formint.humedad,
            peso_neto:formint.peso_neto,
            cantidad:formint.cantidad,
            peso_bruto_humedo:formint.peso_bruto_humedo,
            minerales: formint.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla,
                ley: m.ley,
                unidad: m.unidad
            })),
            municipio_origen: formint.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            comprador:formint.des_comprador,
            munipio_destino:formint.municipio?.municipio,
            departamento_destino:formint.municipio?.departamento?.nombre, 
            tipo_transpote:formint.tipo_transporte,
            tara_volqueta:formint.tara_volqueta,
            conductor:formint.nom_conductor,
            placa:formint.placa,
            licencia:formint.licencia,
            observacion:formint.observaciones,
            estado:formint.estado,
            hash:formint.hash,
            nro_vagon:formint.nro_vagon,
            empresa_ferrea:formint.empresa_ferrea,
            fecha_ferrea:formint.fecha_ferrea,
            hr_ferrea:formint.hr_ferrea,
        };
        res.status(200).json(formattedFormint);
    } catch (error: any) {
        console.error('Error al obtener Formint por hash:', error);
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
        const existingForm = await prisma.formInt.findUnique({
            where: { id: formId }, // Aquí ya no necesitas usar prisma.formInt
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

        // Realizar la actualización usando el modelo directamente de prisma
        const formInt = await prisma.formInt.update({ // Aquí es donde se hace el cambio
            where: { id: formId },
            data: dataToUpdate,
        });

        // Respuesta exitosa
        res.status(200).json({
            message: 'Formulario anulado correctamente',
            form: formInt, // Devolvemos el formulario actualizado
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
    const currentYear = new Date().getFullYear().toString(); // Obtener el año actual como string

    // Determinamos el prefijo en base al estado
    const prefix = estado === "EMITIDO" ? "I-" : "G-"; // Usamos "I-" si el estado es EMITIDO, "G-" si es otro estado

    // Buscar todos los formularios con el prefijo correspondiente ('G-' o 'I-') para el año actual
    const forms = await prisma.formInt.findMany({
        where: {
            nro_formulario: {
                startsWith: prefix, // Filtramos por el prefijo (G- o I-)
                contains: currentYear, // Aseguramos que el año también esté presente
            },
        },
    });

    // Extraemos los números de formulario ya existentes para el año y prefijo correspondiente
    const existingNumbers = forms.map(form => {
        const numberPart = form.nro_formulario.split('-')[1].split('/')[0];
        return parseInt(numberPart, 10);
    });

    // Si no hay formularios, el siguiente número es 1
    if (existingNumbers.length === 0) {
        return `${prefix}1/${currentYear}`;
    }

    // Obtenemos el mayor número de formulario existente
    const maxNumber = Math.max(...existingNumbers);

    // El siguiente número será el siguiente en la secuencia
    const nextNumber = maxNumber + 1;

    // Devolvemos el nuevo número de formulario con el prefijo adecuado
    return `${prefix}${nextNumber}/${currentYear}`;
};
export const updateEstado = async (req: Request, res: Response): Promise<void> => {
    const formId = parseInt(req.params.id);
    const { estado } = req.body; // Solo esperamos el estado en el cuerpo de la solicitud

    try {
        // Validación de los valores permitidos para el estado
        const validStates = ["EMITIDO"];
        if (!validStates.includes(estado)) {
            res.status(400).json({ error: `El estado debe ser: ${validStates.join(", ")}` });
            return 
        }

        // Si el estado es "EMITIDO", generamos el siguiente número de formulario con el prefijo "I-"
        let updatedNroFormulario: string | null = null;

        if (estado === "EMITIDO") {
            // Generamos el siguiente número con el prefijo "I-" solo si el estado es EMITIDO
            updatedNroFormulario = await generateFormNumbers(estado); // Ahora solo pasamos el estado
        }

        // Datos a actualizar en el modelo FormInt
        const fecha_creacion = new Date();
        const fecha_vencimiento = new Date(fecha_creacion);
        fecha_vencimiento.setDate(fecha_creacion.getDate() + 4); // Añadimos 4 días

        const dataToUpdate: any = {
            estado,
            nro_formulario: updatedNroFormulario || undefined, // Asignamos el nuevo número solo si lo generamos
            fecha_creacion: fecha_creacion,
            fecha_vencimiento: fecha_vencimiento
        };

        // Si han pasado más de 4 días desde la fecha de creación, actualizamos el estado a "VENCIDO"
        if (new Date() > fecha_vencimiento) {
            dataToUpdate.estado = "VENCIDO"; // Cambiamos el estado a VENCIDO
        }

        // Actualizamos el formulario principal
        const formint = await prisma.formInt.update({
            where: { id: formId },
            data: dataToUpdate,
        });

        // Responder con el estado actualizado y el formulario modificado
        res.status(200).json({
            message: 'Estado actualizado',
            form: formint, // Devolvemos el formulario actualizado
        });

    } catch (error: any) {
        // Manejo de errores según el tipo de error
        if (error?.code === 'P2025') {
            res.status(404).json('Formulario no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const deleteForms = async (req: Request, res: Response): Promise<void> => {
    const formintId = parseInt(req.params.id)
    try {
        await prisma.formInt.delete({
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