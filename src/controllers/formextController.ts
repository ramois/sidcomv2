import { Request, Response } from "express";
import { prisma } from "../models/prismaClient";
import { convertBigIntToString } from "../utils/convertBigInt";
import crypto from 'crypto';
import { Decimal } from "@prisma/client/runtime/library";
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

/*// Función para generar el número de formulario con transacción
const generateFormNumber = async (): Promise<string> => {
    const currentYear = new Date().getFullYear().toString(); // Obtener el año actual como string
    // Buscar todos los formularios con los prefijos 'G-', 'I-', 'A-' para el año actual
    const forms = await prisma.formExt.findMany({
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
*/
const generateFormNumber = async (): Promise<string> => {
    const currentYear = new Date().getFullYear().toString();
    const result = await prisma.$transaction(async (prisma) => {
        // Contar los formularios del año actual
        const totalForms = await prisma.formExt.count({
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
            existingForm = await tx.formExt.findUnique({
                where: { hash },
            });
        } while (existingForm);  // Si existe el hash, volvemos a intentarlo
    });

    return hash;  // Devuelvo el hash único
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
            m03_id,
            nro_factura_exportacion,
            laboratorio,
            codigo_analisis,
            nro_formulario_tm,
            lote,
            presentacion_id,
            cantidad,
            peso_bruto_humedo,
            peso_neto,
            municipio_origen,
            minerales,
            comprador,
            aduana_id,
            pais_destino_id,
            tipo_transporte,
            placa,
            nom_conductor,
            licencia,
            observaciones,
            nro_vagon,
            empresa_ferrea,
            fecha_ferrea,
            tara_volqueta,
            hr_ferrea,
        } = req.body;
        const user_id = req.user?.id;
        const humedad = req.body.humedad !== undefined && req.body.humedad !== null ? new Decimal(req.body.humedad) : null;
        const merma = req.body.merma !== undefined && req.body.merma !== null ? new Decimal(req.body.merma) : null;    
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
        // Validar si el Pais existe
        const pais = await prisma.pais.findUnique({
            where: { id: pais_destino_id }
        });
        if (!pais) {
            return res.status(404).json({ message: "El Pais con el ID proporcionado no existe." });
        }
        // Validar si la aduna existe
        const aduana = await prisma.aduana.findUnique({
            where: { id: aduana_id }
        });
        if (!aduana) {
            return res.status(404).json({ message: "La Aduana con el ID proporcionado no existe." });
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

        // Validar si el pais de destino existe
        const paisDestino = await prisma.pais.findUnique({
            where: { id: pais_destino_id }
        });

        if (!paisDestino) {
            return res.status(404).json({ message: "El pais de destino no existe." });
        }
        const presentacion = await prisma.presentacion.findUnique({
            where: { id: presentacion_id }
        });
        if (!presentacion) {
            return res.status(404).json({ message: "La presentacion de destino no existe." });
        }
        // Generación del número de formulario
        const newNroFormulario = await generateFormNumber();
        // Generar un hash único para el formulario
        const uniqueHash = await generateUniqueHash();
        // Crear el nuevo formulario
        const newForm = await prisma.formExt.create({
            data: {
                user: {
                    connect: { id: user_id }
                },
                operador: {
                    connect: { id: operador_id }
                },
                presentacion: {
                    connect: { id: presentacion_id }
                },
                nro_formulario: newNroFormulario,
                m03_id,
                nro_factura_exportacion,
                laboratorio,
                codigo_analisis,
                nro_formulario_tm,
                lote,
                cantidad,
                peso_bruto_humedo: new Decimal(peso_bruto_humedo),
                peso_neto: new Decimal(peso_neto),
                tara: tara,
                humedad: humedad,
                merma: merma,
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
                comprador,
                aduana:{
                    connect: { id: aduana_id}
                },
                pais:{
                    connect: { id: pais_destino_id }
                },
                tipo_transporte,
                placa,
                nom_conductor,
                licencia,
                observaciones,
                nro_vagon,
                empresa_ferrea,
                fecha_ferrea,
                hr_ferrea,
                tara_volqueta,
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
        const formext = await prisma.formExt.findMany({
            include: { minerales: true,
                municipio_origen: true
             }
    })
        res.status(200).json(formext);
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
        const formexts = await prisma.formExt.findMany({
            where: {
                operador_id: operadorId, // Filtrar por operador_id
            },
            include: {
                minerales: true,
                municipio_origen: true
            }
        });
        // Si no se encuentran formularios para el operador, devolver un mensaje adecuado
        if (formexts.length === 0) {
            res.status(404).json({ error: `No se encontraron formularios para el operador_id ${operadorId}` });
            return;
        }
        // Retornar los formularios filtrados
        res.status(200).json(formexts);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getAllFormReducido = async (req: Request, res: Response): Promise<void> => {
    try {
        const formext = await prisma.formExt.findMany({
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
        // Modificar la respuesta para mover 'razon_social' al nivel superior
        const result = formext.map(item => ({
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
export const getAllFormextOperatorReducido = async (req: Request, res: Response): Promise<void> => {
    const operadorId = parseInt(req.params.id); 
    try {
        // Verificar si el operador_id es un número válido
        if (isNaN(operadorId)) {
            res.status(400).json({ error: 'El operador_id debe ser un número válido' });
            return;
        }

        // Filtrar por operador_id
        const formint = await prisma.formExt.findMany({
            where: {
                operador_id: operadorId
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
    const formextId = parseInt(req.params.id)
    try {
        const formext = await prisma.formExt.findUnique({
            where: { id: formextId },
                   include: { minerales: true,
                    municipio_origen: true
                    }
        });
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
export const updateForms = async (req: Request, res: Response): Promise<Response | void> => {
    const formId = parseInt(req.params.id);
    const {
        operador_id,
        m03_id,
        nro_factura_exportacion,
        laboratorio,
        codigo_analisis,
        nro_formulario_tm,
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
        comprador,
        aduana_id,
        pais_destino_id,
        tipo_transporte,
        placa,
        nom_conductor,
        licencia,
        observaciones,
        nro_vagon,
        empresa_ferrea,
        fecha_ferrea,
        hr_ferrea,
        tara_volqueta,
    } = req.body;

    try {
        // Validaciones para verificar si los registros existen (si es necesario)
        if (operador_id) {
            const operador = await prisma.operator.findUnique({
                where: { id: operador_id },
            });
            if (!operador) {
                return res.status(404).json({ error: 'El operador no existe' });
            }
        }

        if (pais_destino_id) {
            const paisDestino = await prisma.pais.findUnique({
                where: { id: pais_destino_id },
            });
            if (!paisDestino) {
                return res.status(404).json({ error: 'El País de destino no existe' });
            }
        }

        if (aduana_id) {
            const aduana = await prisma.aduana.findUnique({
                where: { id: aduana_id },
            });
            if (!aduana) {
                return res.status(404).json({ error: 'La Aduana ingresada no existe' });
            }
        }
        if (presentacion_id) {
            const presentacion = await prisma.presentacion.findUnique({
                where: { id: presentacion_id },
            });
            if (!presentacion) {
                return res.status(404).json({ error: 'La presentacion ingresada no existe' });
            }
        }
        // Construcción dinámica de `dataToUpdate`
        //let dataToUpdate: any = { updated_at: new Date() };
        // Definir el tipo para campos
        type Campos = {
            //operador_id?: any;
            m03_id?: any;
            nro_factura_exportacion?: any;
            laboratorio?: any;
            codigo_analisis?: any;
            nro_formulario_tm?: any;
            lote?: any;
            cantidad?: any;
            peso_bruto_humedo?: Decimal | undefined;
            peso_neto?: Decimal | undefined;
            tara?: Decimal | undefined;
            humedad?: Decimal | undefined;
            merma?: Decimal | undefined;
            tipo_transporte?: any;
            placa?: any;
            comprador?: any;
            nom_conductor?: any;
            licencia?: any;
            observaciones?: any;
            nro_vagon?: any;
            empresa_ferrea?: any;
            fecha_ferrea?: any;
            hr_ferrea?: any;
            tara_volqueta?: any;
        };
        
        // Definir el tipo para campos con firma de índice
        const campos: Campos = {
            //operador_id,
            m03_id,
            nro_factura_exportacion,
            laboratorio,
            codigo_analisis,
            nro_formulario_tm,
            lote,
            //presentacion,
            cantidad,
            peso_bruto_humedo: peso_bruto_humedo ? new Decimal(peso_bruto_humedo) : undefined,
            peso_neto: peso_neto ? new Decimal(peso_neto) : undefined,
            tara: tara ? new Decimal(tara) : undefined,
            humedad:humedad ? new Decimal(humedad) : undefined,
            merma:humedad ? new Decimal(humedad) : undefined,
            tipo_transporte,
            placa,
            comprador,
            nom_conductor,
            licencia,
            observaciones,
            nro_vagon,
            empresa_ferrea,
            fecha_ferrea,
            hr_ferrea,
            tara_volqueta,
        };
        
        // Construcción dinámica de dataToUpdate
        let dataToUpdate: any = { updated_at: new Date() };
        
        Object.keys(campos).forEach((key: string) => {
            const campoValue = campos[key as keyof Campos]; // Asegura que la clave sea válida
            if (campoValue !== undefined) {
            dataToUpdate[key] = campoValue;
            }
        });
                // Agregar relaciones solo si están presentes
        if (operador_id) {
            dataToUpdate.operador = {
                connect: { id: operador_id }
            };
        }
        // Agregar relaciones solo si están presentes
        if (aduana_id) {
            dataToUpdate.aduana = {
                connect: { id: aduana_id }
            };
        }

        if (pais_destino_id) {
            dataToUpdate.pais = {
                connect: { id: pais_destino_id }
            };
        }
        if (presentacion_id) {
            dataToUpdate.presentacion = {
                connect: { id: presentacion_id }
            };
        }

        // Actualizamos el formulario principal
        const updatedForm = await prisma.formExt.update({
            where: { id: formId },
            data: dataToUpdate,
        });
        // Primero, eliminamos todos los minerales asociados a ese FormExt
        await prisma.formExtMineral.deleteMany({
            where: { formExtId: formId },
        });
        if (minerales && Array.isArray(minerales)) {
            await prisma.formExtMineral.createMany({
                data: minerales.map((mineral: any) => ({
                    formExtId: formId,  // Clave foránea a FormExt
                    mineralId: mineral.mineralId,  // Clave foránea a Mineral
                    ley: new Decimal(mineral.ley), // Convertimos a Decimal si es necesario
                    unidad: mineral.unidad,
                })),
            });
        }
        // ✅ Primero, eliminamos todos los municipios asociados a ese FormExt
        await prisma.formExtMunicipio.deleteMany({
            where: { formExtId: formId },
        });

        // ✅ Luego, insertamos los nuevos municipios
        if (municipio_origen && Array.isArray(municipio_origen)) {
            await prisma.formExtMunicipio.createMany({
                data: municipio_origen.map((municipio: any) => ({
                    formExtId: formId,  // Clave foránea a FormExt
                    municipioId: municipio.id, // Clave foránea a Municipio
                })),
            });
        }
        // Recuperar el formulario actualizado
        const finalForm = await prisma.formExt.findUnique({
            where: { id: formId },
            include: {
                minerales: true,
                municipio_origen: true,
            },
        });
        res.status(200).json(finalForm);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getFormExtByIdPDF = async (req: Request, res: Response): Promise<void> => {
    const formextId = parseInt(req.params.id);
    try {
        const formext = await prisma.formExt.findUnique({
            where: { id: formextId },
            include: {
                operador: { select: { razon_social: true, nit:true,nro_nim:true, tipo_nim_niar:true, id:true} }, 
                pais :{ select: {nombre: true }},
                aduana:{select:{nombre:true, codigo_aduana:true}},
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
                presentacion :{ select: {nombre: true }}    
            }
        });

        if (!formext) {
            res.status(404).json({ error: 'Formulario externo no fue encontrada' });
            return;
        }

        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const response = {
            id:formext.id,
            nro_formulario:formext.nro_formulario,
            fecha_emision: formext.fecha_creacion ? new Date(formext.fecha_creacion).toLocaleDateString('es-ES') : null,  
            hora_emision: formext.fecha_creacion ? new Date(formext.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_vencimiento: formext.fecha_vencimiento ? new Date(formext.fecha_vencimiento).toLocaleDateString('es-ES') : null,  
            hora_vencimiento: formext.fecha_vencimiento ? new Date(formext.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            razon_social: formext.operador?.razon_social,
            nit: formext.operador?.nit,
            nro_nim: formext.operador?.nro_nim,
            tipo_nim_niar: formext.operador?.tipo_nim_niar,
            operador_id: formext.operador?.id,
            m03:formext.m03_id,
            nro_factura_exportacion:formext.nro_factura_exportacion,
            laboratorio:formext.laboratorio,
            codigo_analisis:formext.codigo_analisis,
            acta_verificacion:formext.nro_formulario_tm,
            lote:formext.lote,
            presentacion:formext.presentacion?.nombre,
            merma:formext.merma,
            tara:formext.tara,
            humedad:formext.humedad,
            peso_neto:formext.peso_neto,
            peso_bruto_humedo:formext.peso_bruto_humedo,
            minerales: formext.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla,
                ley: m.ley,
                unidad: m.unidad
            })),
            municipio_origen: formext.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            comprador:formext.comprador,
            aduana: formext.aduana?.nombre,
            codigo_aduana: formext.aduana?.codigo_aduana,
            pais:formext.pais?.nombre,
            tipo_transporte:formext.tipo_transporte,
            conductor:formext.nom_conductor,
            placa:formext.placa,
            licencia:formext.licencia,
            observaciones:formext.observaciones,
            estado:formext.estado,
            hash:formext.hash,
            nro_vagon:formext.nro_vagon,
            empresa_ferrea:formext.empresa_ferrea,
            fecha_ferrea:formext.fecha_ferrea,
            hr_ferrea:formext.hr_ferrea,
            tara_volqueta:formext.tara_volqueta,          
        };
        //res.status(200).json(response);
        res.status(200).json(convertBigIntToString(response));
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getFormextByNroFormulariosPDF = async (req: Request, res: Response): Promise<void> => {
    // Captura y decodifica todo lo que viene después de /print_nro_form/
    const nroFormulario = decodeURIComponent(req.params[0]); 
    //console.log("Nro Formulario:", nroFormulario);
    try {
        const formext = await prisma.formExt.findFirst({
            where: { nro_formulario: nroFormulario
             },
             include: {
                operador: { select: { razon_social: true, nit:true,nro_nim:true, tipo_nim_niar:true, id:true} }, 
                pais :{ select: {nombre: true }},
                aduana:{select:{nombre:true, codigo_aduana:true}},
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
                presentacion :{ select: {nombre: true }}    
            }
        });

        if (!formext) {
            res.status(404).json({ error: 'El número de formulario externo no existe en el sistema SIDCOM' });
            return;
        }
        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const response = {
            nro_formulario:formext.nro_formulario,
            fecha_emision: formext.fecha_creacion ? new Date(formext.fecha_creacion).toLocaleDateString('es-ES') : null,  
            hora_emision: formext.fecha_creacion ? new Date(formext.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_vencimiento: formext.fecha_vencimiento ? new Date(formext.fecha_vencimiento).toLocaleDateString('es-ES') : null,  
            hora_vencimiento: formext.fecha_vencimiento ? new Date(formext.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            razon_social: formext.operador?.razon_social,
            nit: formext.operador?.nit,
            nro_nim: formext.operador?.nro_nim,
            tipo_nim_niar: formext.operador?.tipo_nim_niar,
            operador_id: formext.operador?.id,
            m03:formext.m03_id,
            nro_factura_exportacion:formext.nro_factura_exportacion,
            laboratorio:formext.laboratorio,
            codigo_analisis:formext.codigo_analisis,
            acta_verificacion:formext.nro_formulario_tm,
            lote:formext.lote,
            presentacion:formext.presentacion?.nombre,
            merma:formext.merma,
            tara:formext.tara,
            humedad:formext.humedad,
            peso_neto:formext.peso_neto,
            peso_bruto_humedo:formext.peso_bruto_humedo,
            minerales: formext.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla,
                ley: m.ley,
                unidad: m.unidad
            })),
            municipio_origen: formext.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            comprador:formext.comprador,
            aduana: formext.aduana?.nombre,
            codigo_aduana: formext.aduana?.codigo_aduana,
            pais:formext.pais?.nombre,
            tipo_transporte:formext.tipo_transporte,
            conductor:formext.nom_conductor,
            placa:formext.placa,
            licencia:formext.licencia,
            observaciones:formext.observaciones,
            nro_vagon:formext.nro_vagon,
            empresa_ferrea:formext.empresa_ferrea,
            fecha_ferrea:formext.fecha_ferrea,
            hr_ferrea:formext.hr_ferrea,
            tara_volqueta:formext.tara_volqueta, 
        };
        //res.status(200).json(response);
        res.status(200).json(convertBigIntToString(response));
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getFormextHash = async (req: Request, res: Response): Promise<void> => {
    try {
        const formexthash = req.query.hash ? String(req.query.hash) : null;
        if (!formexthash) {
            res.status(404).json({ error: 'El Formulario interno no fue encontrado' });
            return;
        }
        // Consulta de datos con Prisma
        const formext = await prisma.formExt.findUnique({
            where: { hash: formexthash },
            include: {
                operador: { select: { razon_social: true, nit:true,nro_nim:true, tipo_nim_niar:true, id:true} }, 
                pais :{ select: {nombre: true }},
                aduana:{select:{nombre:true, codigo_aduana:true}},
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
                presentacion :{ select: {nombre: true }}    
            }
        });

        if (!formext) {
            res.status(404).json({ error: 'Formulario externo no fue encontrada' });
            return;
        }

        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const formattedFormext = {
            id:formext.id,
            nro_formulario:formext.nro_formulario,
            fecha_emision: formext.fecha_creacion ? new Date(formext.fecha_creacion).toLocaleDateString('es-ES') : null,  
            hora_emision: formext.fecha_creacion ? new Date(formext.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_vencimiento: formext.fecha_vencimiento ? new Date(formext.fecha_vencimiento).toLocaleDateString('es-ES') : null,  
            hora_vencimiento: formext.fecha_vencimiento ? new Date(formext.fecha_vencimiento).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            razon_social: formext.operador?.razon_social,
            nit: formext.operador?.nit,
            nro_nim: formext.operador?.nro_nim,
            tipo_nim_niar: formext.operador?.tipo_nim_niar,
            operador_id: formext.operador?.id,
            m03:formext.m03_id,
            nro_factura_exportacion:formext.nro_factura_exportacion,
            laboratorio:formext.laboratorio,
            codigo_analisis:formext.codigo_analisis,
            acta_verificacion:formext.nro_formulario_tm,
            lote:formext.lote,
            presentacion:formext.presentacion?.nombre,
            merma:formext.merma,
            tara:formext.tara,
            humedad:formext.humedad,
            peso_neto:formext.peso_neto,
            peso_bruto_humedo:formext.peso_bruto_humedo,
            minerales: formext.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla,
                ley: m.ley,
                unidad: m.unidad
            })),
            municipio_origen: formext.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio,
                codigo:m.municipios?.codigo,
            })),
            comprador:formext.comprador,
            aduana: formext.aduana?.nombre,
            codigo_aduana: formext.aduana?.codigo_aduana,
            pais:formext.pais?.nombre,
            tipo_transpote:formext.tipo_transporte,
            conductor:formext.nom_conductor,
            placa:formext.placa,
            licencia:formext.licencia,
            observacion:formext.observaciones,
            estado:formext.estado,
            hash:formext.hash,
            nro_vagon:formext.nro_vagon,
            empresa_ferrea:formext.empresa_ferrea,
            fecha_ferrea:formext.fecha_ferrea,
            hr_ferrea:formext.hr_ferrea,
            tara_volqueta:formext.tara_volqueta,          
        };
        res.status(200).json(convertBigIntToString(formattedFormext));
        //res.status(200).json(formattedFormext);
    } catch (error: any) {
        console.log(error);
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
        const existingForm = await prisma.formExt.findUnique({
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
        const formExt = await prisma.formExt.update({ // Aquí es donde se hace el cambio
            where: { id: formId },
            data: dataToUpdate,
        });

        // Respuesta exitosa
        res.status(200).json({
            message: 'Formulario anulado correctamente',
            form: formExt, // Devolvemos el formulario actualizado
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

/*const generateFormNumbers = async (estado: string): Promise<string> => {
    const currentYear = new Date().getFullYear().toString(); // Obtener el año actual como string

    // Determinamos el prefijo en base al estado
    const prefix = estado === "EMITIDO" ? "E-" : "G-"; // Usamos "E-" si el estado es EMITIDO, "G-" si es otro estado

    // Buscar todos los formularios con el prefijo correspondiente ('G-' o 'E-') para el año actual
    const forms = await prisma.formExt.findMany({
        where: {
            nro_formulario: {
                startsWith: prefix, // Filtramos por el prefijo (G- o E-)
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
};*/
const generateFormNumbers = async (estado: string): Promise<string> => {
    const currentYear = new Date().getFullYear().toString();
    const prefix = estado === "EMITIDO" ? "E-" : "G-";

    return await prisma.$transaction(async (prisma) => {
        // Buscar todos los formularios existentes del año actual con el prefijo correcto
        const forms = await prisma.formExt.findMany({
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
            const match = form.nro_formulario.match(/^[EG]-(\d+)\/\d{4}$/);
            if (match) {
                const formNumber = parseInt(match[1], 10);
                maxNumber = Math.max(maxNumber, formNumber);
            }
        });

        let nextNumber = maxNumber + 1;
        let newFormNumber = `${prefix}${nextNumber}/${currentYear}`;

        // Evitar duplicados: Si ya existe, incrementar hasta encontrar uno disponible
        while (await prisma.formExt.findUnique({ where: { nro_formulario: newFormNumber } })) {
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
            const form = await prisma.formExt.findUnique({
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
                const formext = await prisma.formExt.update({
                    where: { id: formId },
                    data: dataToUpdate,
                });

                return formext; // Devolvemos el formulario actualizado
            }

            // Si no es "EMITIDO", solo se actualiza el estado sin generar un nuevo número
            const dataToUpdate: any = { estado };
            const formext = await prisma.formExt.update({
                where: { id: formId },
                data: dataToUpdate,
            });

            return formext; // Devolvemos el formulario actualizado
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
/*
//funcionaba hasta el 13/01/2025
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
        const dataToUpdate: any = {
            estado,
            nro_formulario: updatedNroFormulario || undefined, // Asignamos el nuevo número solo si lo generamos
            fecha_creacion: fecha_creacion,
            fecha_vencimiento: (() => {
                let fechaVenc = new Date(fecha_creacion); // Copia de la fecha de creación
                fechaVenc.setDate(fecha_creacion.getDate() + 4); // Añadimos 4 días
                return fechaVenc;
            })()
        };

        // Actualizamos el formulario principal
        const formint = await prisma.update({
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
};*/

export const deleteForms = async (req: Request, res: Response): Promise<void> => {
    const formintId = parseInt(req.params.id)
    try {
        await prisma.formExt.delete({
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