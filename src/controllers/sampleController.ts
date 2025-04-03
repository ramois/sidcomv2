import { Request, Response, RequestHandler } from 'express';
import { prisma } from "../models/prismaClient"; 
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';  
import { Decimal } from "@prisma/client/runtime/library"; // Asegúrate de tener esta importación si usas Decimal

const generateSampleNumber = async (): Promise<string> => {
    const currentYear = new Date().getFullYear().toString();

    // Usamos una transacción para asegurar que no haya condiciones de carrera
    const result = await prisma.$transaction(async (prisma) => {
        // Contar los formularios del año actual
        const totalForms = await prisma.sample.count({
            where: {
                nro_formulario: {
                    endsWith: `/${currentYear}`,
                },
            },
        });

        // Si no hay formularios este año, empezar con 1
        const nextNumber = totalForms === 0 ? 1 : totalForms + 1;
        // Ahora, retorna el número generado de forma segura
        return `TMG-${nextNumber}/${currentYear}`;
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
            existingForm = await tx.sample.findUnique({
                where: { hash },
            });
        } while (existingForm);  // Si existe el hash, volvemos a intentarlo
    });
    return hash;  // Devuelvo el hash único
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

// Función para crear una nueva muestra (Sample)
export const createSample = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const {
            operador_id,
            responsable_tdm_id,
            lote,
            tipo_muestra,
            presentacion_id,
            cantidad,
            nro_camiones,
            total_parcial,
            peso_neto_total,
            peso_neto_parcial,
            observaciones,
            lugar_verificacion,
            ubicacion_lat,
            ubicacion_lon,
            departamento_id,
            municipio_id,
            fecha_hora_tdm,
            justificacion_anulacion,
            minerales,
            municipio_origen,
            procedimiento,
            humedad,
            hash,
        } = req.body;

        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(400).json({ message: 'No se ha encontrado un usuario asociado al token' });
        }
        // Validar si el operador existe
        const operador = await prisma.operator.findUnique({
            where: { id: operador_id }
        });
        if (!operador) {
            return res.status(404).json({ message: "El operador con el ID proporcionado no existe." });
        }
        // Validar si el responsable está asociado al operador
        const responsableTDM = await prisma.responsableTM.findFirst({
            where: {
                id: responsable_tdm_id,
                operador_id: operador_id, // Asegurarse de que el responsable esté asociado al operador
                estado: 'ACTIVO', // Opcional, si solo quieres responsables activos
            }
        });

        if (!responsableTDM) {
            return res.status(404).json({ message: "El responsable de toma de muestra con el ID proporcionado no existe o no está asociado al operador." });
        }
        // Validar si el municipio existe
        const municipio = await prisma.municipios.findUnique({
            where: { id: municipio_id }
        });
        if (!municipio) {
            return res.status(404).json({ message: "El municipio con el ID proporcionado no existe." });
        }
        // Validar si la presentacion existe
        const presentacion = await prisma.presentacion.findUnique({
            where: { id: presentacion_id }
        });
        if (!presentacion) {
            return res.status(404).json({ message: "La presentacion con el ID proporcionado no existe." });
        }
        // Validar si los minerales existen
        if (minerales && Array.isArray(minerales) && minerales.length > 0) {
            const mineralIds = minerales.map((mineral: any) => mineral.mineralId);
            const mineralesExistentes = await prisma.mineral.findMany({
                where: {
                    id: { in: mineralIds },
                },
            });
            // Obtener los ids de los minerales existentes
            const mineralesExistentesIds = mineralesExistentes.map((mineral: any) => mineral.id);
            // Filtrar los minerales que no existen
            const mineralesNoExistentes = mineralIds.filter(id => !mineralesExistentesIds.includes(id));

            if (mineralesNoExistentes.length > 0) {
                return res.status(404).json({
                    message: `Los siguientes minerales no existen: ${mineralesNoExistentes.join(', ')}`,
                });
            }
        }
        // Validar si los municipios de origen existen
        if (municipio_origen && Array.isArray(municipio_origen) && municipio_origen.length > 0) {
            const municipioOrigenIds = municipio_origen.map((municipio: any) => municipio.id);
            const municipiosOrigenExistentes = await prisma.municipios.findMany({
                where: {
                    id: { in: municipioOrigenIds },
                },
            });

            // Obtener los ids de los municipios existentes
            const municipiosExistentesIds = municipiosOrigenExistentes.map((municipio: any) => municipio.id);
            // Filtrar los municipios que no existen
            const municipiosNoExistentes = municipioOrigenIds.filter(id => !municipiosExistentesIds.includes(id));

            if (municipiosNoExistentes.length > 0) {
                return res.status(404).json({
                    message: `Los siguientes municipios de origen no existen: ${municipiosNoExistentes.join(', ')}`,
                });
            }
        }
        // Generación de numero de formulario
        const newNroFormulario = await generateSampleNumber();
        // Generación de un hash único para el formulario toma de muestra
        const uniqueHash = await generateUniqueHash();
        // Crear el nuevo formulario Sample con el número generado
        const newSample = await prisma.sample.create({
            data: {
                user: {
                    connect: { id: user_id }
                },
                operador: {
                    connect: { id: operador_id }
                },
                nro_formulario: newNroFormulario,
                responsabletm: {
                    connect: { id: responsable_tdm_id }
                },
                lote,
                tipo_muestra,
                presentacion:{
                    connect: { id: presentacion_id }
                },
                cantidad,
                nro_camiones,
                total_parcial: total_parcial ? new Decimal(total_parcial) : undefined,
                peso_neto_total: new Decimal(peso_neto_total),
                peso_neto_parcial: peso_neto_parcial ? new Decimal(peso_neto_parcial) : undefined,
                observaciones,
                lugar_verificacion,
                ubicacion_lat,
                ubicacion_lon,
                departamento_id,
                municipio:{
                    connect: { id: municipio_id }
                },
                fecha_hora_tdm,
                justificacion_anulacion,
                humedad:humedad ? new Decimal(humedad) : undefined,
                created_at: new Date(),
                updated_at: new Date(),
                hash: uniqueHash,
                // Relacionar minerales, municipios y procedimientos
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
                procedimiento: {
                    create: procedimiento.map((proc: any) => ({
                        procedimientoId: proc.id,
                    })),
                },
            },
            include: {
                minerales: true,
                municipio_origen: true,
                procedimiento: true,
            },
        });

        return res.status(201).json(newSample);
    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'No se pudo encontrar un registro relacionado.' });
        }
        if (error.code === 'P2011') {
            return res.status(400).json({ error: 'Hay un problema con los datos proporcionados, revise los campos enviados.' });
        }
        return res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getAllSamples = async (req: Request, res: Response): Promise<void> => {
    try {
        const samples = await prisma.sample.findMany({
            include: { minerales: true,
                municipio_origen: true,
                procedimiento: true
            }
    })
        res.status(200).json(samples);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const getAllSampleReducido = async (req: Request, res: Response): Promise<void> => {
      try {
            const samples = await prisma.sample.findMany({
                select: {
                    id: true,
                    nro_formulario: true,
                    lugar_verificacion: true,
                    estado:true,
                    fecha_hora_tdm:true,
                    responsable_tdm_id:true,
                    operador_id:true,
                    operador: {
                        select: {
                            razon_social: true,  // Seleccionamos 'razon_social' del operador relacionado
                        }
                    }
                }
            });
            // Modificamos la respuesta para mover 'razon_social' al nivel superior
            const result = samples.map(item => ({
                ...item,
                razon_social: item.operador?.razon_social,  // Mover el campo 'razon_social' al nivel superior
                operador: undefined,  // Eliminamos el objeto 'operador' para no dejarlo en la respuesta
            }));
    
            res.status(200).json(result);  // Enviamos la respuesta con los datos modificados
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
};
    
export const getAllSampleOperatorReducido = async (req: Request, res: Response): Promise<void> => {
        const operadorId = parseInt(req.params.id); 
        try {
            // Verificar si el operador_id es un número válido
            if (isNaN(operadorId)) {
                res.status(400).json({ error: 'El operador_id debe ser un número válido' });
                return;
            }
    
            // Realizar la consulta para obtener los formularios filtrados por operador_id
            const samples = await prisma.sample.findMany({
                where: {
                    operador_id: operadorId, // Filtrar por operador_id
                },
                select: {
                    id: true,
                    nro_formulario: true,
                    lugar_verificacion: true,
                    fecha_hora_tdm:true,
                    responsable_tdm_id:true,
                    operador_id:true,
                    estado: true,
                    responsabletm: { // Aquí estamos accediendo a la relación responsableTM
                        select: {
                            nombre: true,
                            apellidos:true,
                            id:true,
                        }
                    },
                },
            });
            // Si no se encuentran formularios para el operador, devolver un mensaje adecuado
            if (samples.length === 0) {
                res.status(404).json({ error: `No se encontraron formularios de toma de muestra para el operador_id ${operadorId}` });
                return;
            }
            // Modificamos la respuesta para mover 'responsableTM' al nivel superior
            const result = samples.map(item => ({
                id: item.id,
                nro_formulario: item.nro_formulario,
                lugar_verificacion: item.lugar_verificacion,
                fecha_hora_tdm: item.fecha_hora_tdm,
                estado: item.estado,
                operador_id:item.operador_id,
                responsableTM_id:item.responsabletm?.id,
                responsableTM: item.responsabletm?.nombre+" "+item.responsabletm?.apellidos,  // Aquí devolvemos solo el nombre del responsable
            }));    
            // Retornar los formularios filtrados con los campos específicos
            res.status(200).json(result);
    
        } catch (error: any) {
            console.log(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
}; 
 
export const getSamplesByOperadorId = async (req: Request, res: Response): Promise<void> => {
    const operadorId = parseInt(req.params.id);
    try {
        // Verificar si el operador_id es un número válido
        if (isNaN(operadorId)) {
            res.status(400).json({ error: 'El operador_id debe ser un número válido' });
            return;
        }
        // Realizar la consulta para obtener los formularios filtrados por operador_id
        const samples = await prisma.sample.findMany({
            where: {
                operador_id: operadorId, // Filtrar por operador_id
            },
            include: {
                minerales: true,
                municipio_origen: true,
                procedimiento: true
            }
        });

        // Si no se encuentran formularios para el operador, devolver un mensaje adecuado
        if (samples.length === 0) {
            res.status(404).json({ error: `No se encontraron formularios de toma de muestra para el operador_id ${operadorId}` });
            return;
        }

        // Retornar los formularios filtrados
        res.status(200).json(samples);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getSamplesByResponsableTDMGadorId = async (req: Request, res: Response): Promise<void> => {
    const responsableTDMGadorId = parseInt(req.params.id);
    try {
        // Verificar si el responsable_tdm_gador_id es un número válido
        if (isNaN(responsableTDMGadorId)) {
            res.status(400).json({ error: 'El responsable_tdm_gador_id debe ser un número válido' });
            return;
        }

        // Realizar la consulta para obtener los formularios filtrados por responsable_tdm_gador_id
        const samples = await prisma.sample.findMany({
            where: {
                responsable_tdm_gador_id: responsableTDMGadorId, // Filtrar por responsable_tdm_gador_id
            },
            include: {
                minerales: true,
                municipio_origen: true,
                procedimiento: true,
                // Incluye el responsable_tdm_gador_id en la respuesta
            }
        });

        // Si no se encuentran formularios para el responsable_tdm_gador_id, devolver un mensaje adecuado
        if (samples.length === 0) {
            res.status(404).json({ error: `No se encontraron formularios de toma de muestra para responsable_tdm_gador_id ${responsableTDMGadorId}` });
            return;
        }

        // Retornar los formularios filtrados
        res.status(200).json(samples);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getSampleById = async (req: Request, res: Response): Promise<void> => {
    const sampleId = parseInt(req.params.id);
    // Si no es un número válido, responder con error 400
    if (isNaN(sampleId)) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }
    try {
        const sample = await prisma.sample.findUnique({
            where: {
                id: sampleId
            },
            include: {
                minerales: true,
                    municipio_origen: true,
                    procedimiento: true
            }
        });

        if (!sample) {
            res.status(404).json({ error: "Muestra no encontrada" });
            return;
        }

        res.json(sample);
    } catch (error) {
        console.error("Error en la consulta a Prisma:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};
/*
export const getSampleById= async (req: Request, res: Response): Promise<void> => {
    const sampleId = parseInt(req.params.id)
    try {
        const sample = await prisma.findUnique({
         where: { id: sampleId },
                include: { minerales: true,
                    municipio_origen: true,
                    procedimiento: true
                }
        })
        if (!sample) {
            res.status(404).json({ error: 'La muestra no fue encontrado' })
            return
        }
        res.status(200).json(sample)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}*/

export const getSampleByIdPDF = async (req: Request, res: Response): Promise<void> => {
    const sampleId = parseInt(req.params.id);
    try {
        const sample = await prisma.sample.findUnique({
            where: { id: sampleId },
            include: {
                operador: { select: { razon_social: true } }, 
                responsabletm: { select: { nombre: true, apellidos: true } },
                responsable_gador :{ select: {nombre: true, apellidos: true }},
                senarecomtm: { select: { nombre: true, apellidos: true } },    
                presentacion: { select: { nombre: true } },    
                municipio :{ select: {municipio: true }},
                minerales: {
                    include: {
                        mineral: { select: { nombre: true, sigla:true } }  
                    }
                },
                municipio_origen: {
                    include: {
                        municipios: { select: { municipio: true } }  
                    }
                },
                procedimiento: {
                    include: {
                        procedimientomuestra: { select: { nombre: true , procedimiento:true} }
                    }
                } 
            }
        });
        if (!sample) {
            res.status(404).json({ error: 'La muestra no fue encontrada' });
            return;
        }
        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const response = {
            id:sample.id,
            fecha_aprobacion: sample.fecha_aprobacion ? new Date(sample.fecha_aprobacion).toLocaleDateString('es-ES') : null,  
            hora_aprobacion: sample.fecha_aprobacion ? new Date(sample.fecha_aprobacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            fecha_firma: sample.fecha_firma ? new Date(sample.fecha_firma).toLocaleDateString('es-ES') : null,  
            hora_firma: sample.fecha_firma ? new Date(sample.fecha_firma).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : null, 
            peso_neto:sample.peso_neto_total,
            lote:sample.lote,
            camiones:sample.nro_camiones,
            estado:sample.estado,
            hash:sample.hash,
            observaciones:sample.observaciones,
            nro_formulario:sample.nro_formulario,
            lugar_verificacion:sample.lugar_verificacion,
            razon_social: sample.operador?.razon_social,
            municipio: sample.municipio?.municipio,
            responsable_muestra: sample.responsabletm?.nombre+" " +sample.responsabletm?.apellidos, 
            responsable_senarecom: sample.senarecomtm?.nombre+" " +sample.senarecomtm?.apellidos, 
            responsable_gador: sample.responsable_gador?.nombre+" " +sample.responsable_gador?.apellidos, 
            presentacion: sample.presentacion?.nombre,
            foto_link:sample.foto_link,
            humedad:sample.humedad,
            minerales: sample.minerales.map(m => ({
                mineral: m.mineral?.nombre,
                sigla: m.mineral?.sigla,
                ley: m.ley,
                unidad: m.unidad
            })),
            municipio_origen: sample.municipio_origen.map(m => ({
                municipio_origen: m.municipios?.municipio
            })),
            procedimiento: sample.procedimiento.map(p => ({
                nombre: p.procedimientomuestra?.nombre,
                procedimiento: p.procedimientomuestra?.procedimiento,   
            }))
        };
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getSampleByNroFormularioPDF = async (req: Request, res: Response): Promise<void> => {
    // Captura y decodifica todo lo que viene después de /print_nro_form/
    const nroFormulario = decodeURIComponent(req.params[0]); 
    const operadorId = parseInt(req.params.operador_id);
    //console.log("Nro Formulario:", nroFormulario);
    try {
        const sample = await prisma.sample.findFirst({
            where: { nro_formulario: nroFormulario,
                operador_id: operadorId 
             },
            include: {
                presentacion: { select: { nombre: true, id: true } },    
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

        if (!sample) {
            res.status(404).json({ error: 'El número de formulario y operador no fueron encontrados para una muestra' });
            return;
        }
        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const response = {
            id: sample.id,
            peso_neto: sample.peso_neto_total,
            lote: sample.lote,
            cantidad: sample.cantidad,
            humedad: sample.humedad,
            estado: sample.estado,
            nro_formulario: sample.nro_formulario,
            presentacion_id: sample.presentacion?.id,
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
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
export const getSampleByNroFormulariosPDF = async (req: Request, res: Response): Promise<void> => {
    // Captura y decodifica todo lo que viene después de /print_nro_form/
    const nroFormulario = decodeURIComponent(req.params[0]); 
    const operadorId = parseInt(req.params.operador_id);
    //console.log("Nro Formulario:", nroFormulario);
    try {
        const sample = await prisma.sample.findFirst({
            where: { nro_formulario: nroFormulario
             },
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

        if (!sample) {
            res.status(404).json({ error: 'El número de formulario de toma de muestra no existe en el sistema SIDCOM' });
            return;
        }
        // Modificar la respuesta para incluir los valores en lugar de solo los IDs
        const response = {
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
        res.status(200).json(response);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
const generateSamplesNumbers = async (estado: string): Promise<string> => {
    const currentYear = new Date().getFullYear().toString();
    const prefix = estado === "APROBADO" ? "TM-" : "TMG-";

    // Buscar todos los formularios del año actual con el prefijo correcto
    const forms = await prisma.sample.findMany({
        where: {
            nro_formulario: {
                startsWith: prefix,
                endsWith: `/${currentYear}`,
            },
        },
        select: { nro_formulario: true },
    });

    let maxNumber = 0;

    // Extraer el número más alto
    forms.forEach(form => {
        const match = form.nro_formulario.match(/^(TM|TMG)-(\d+)\/\d{4}$/);
        if (match) {
            const formNumber = parseInt(match[2], 10);
            maxNumber = Math.max(maxNumber, formNumber);
        }
    });

    let nextNumber = maxNumber + 1;
    let newFormNumber = `${prefix}${nextNumber}/${currentYear}`;

    // Verificar si el número ya existe, en caso afirmativo, incrementar el número
    while (await prisma.sample.findUnique({ where: { nro_formulario: newFormNumber } })) {
        nextNumber++;
        newFormNumber = `${prefix}${nextNumber}/${currentYear}`;
    }

    return newFormNumber;
};
// Configuración de Multer para almacenar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/sample'); // Directorio donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
      // Generamos un identificador aleatorio único
      const uniqueId = crypto.randomBytes(16).toString('hex');  // Genera 16 bytes de aleatoriedad en formato hexadecimal
  
      // Generamos el nombre del archivo único con la extensión original
      const fileName = `${uniqueId}${path.extname(file.originalname)}`;
  
      // Asignamos el nombre generado al archivo
      cb(null, fileName);
    }
  });
  // Middleware de Multer para manejar archivos
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // Límite de tamaño de archivo de 1MB
    fileFilter: (req, file, cb) => {
      // Validamos que el archivo sea una imagen (se puede ajustar a otros formatos si es necesario)
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Solo se permiten archivos de imagen.'));
      }
      cb(null, true); // Si la imagen es válida, la aceptamos
    }
  }).single('foto_link'); // Campo único de imagen: 'foto_link'

// Extender Request para incluir la propiedad 'files'
interface MulterFileRequest extends Request {
  files?: { [fieldname: string]: Express.Multer.File[] };  // Definir el tipo de `files` explícitamente
}
export const updateEstado: RequestHandler<any, any, any, { id: string }, MulterFileRequest> = async (req: AuthenticatedRequest, res) => {
    // Usamos el middleware de multer para manejar la carga del archivo
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // Manejo de errores específicos de Multer (tamaño de archivo, número de archivos, etc.)
            return res.status(400).json({ message: `Error de Multer: ${err.message}` });
        } else if (err) {
            // Manejo de otros errores (como el error del filtro de tipo de archivo)
            return res.status(400).json({ message: `Error al cargar los archivos: ${err.message}` });
        }

        try {
            const sampleId = parseInt(req.params.id);
            const { operador_id, estado, procedimiento, responsable_tdm_senarecom_id, responsable_tdm_id, observaciones } = req.body;
            const user_id = req.user?.id;
            const fotoLink = req.file ? req.file.path : null;

            if (!user_id) {
                return res.status(400).json({ message: 'No se ha encontrado un usuario asociado al token' });
            }

            // Primero, obtenemos el estado actual de la muestra
            const currentSample = await prisma.sample.findUnique({
                where: { id: sampleId },
                select: { estado: true },
            });

            if (!currentSample) {
                return res.status(404).json({ error: 'Formulario Toma de muestra no encontrado' });
            }

            // Verificamos el estado de la muestra
            if (currentSample.estado !== 'SOLICITADO') {
                return res.status(400).json({ error: 'La muestra debe estar en estado SOLICITADO para poder ser aprobada' });
            }
            // Validaciones de campos obligatorios
            if (!estado) {
                return res.status(400).json({ message: 'El estado es obligatorio' });
            }
            if (!procedimiento || !Array.isArray(procedimiento)) {
                return res.status(400).json({ message: 'El campo procedimiento es obligatorio y debe ser un array' });
            }
            if (!responsable_tdm_senarecom_id) {
                return res.status(400).json({ message: 'El id del responsable TDM Senarecom es obligatorio' });
            }
            if (!responsable_tdm_id) {
                return res.status(400).json({ message: 'El id del responsable TDM es obligatorio' });
            }

            // Validación de los valores permitidos para el estado
            const validStates = ['APROBADO'];
            if (!validStates.includes(estado)) {
                return res.status(400).json({ error: `El estado debe ser: ${validStates.join(', ')}` });
            }

            // Convertir id de responsable_tdm_id a número
            const idResponsableTM = parseInt(responsable_tdm_id, 10);
            const responsabletm = await prisma.responsableTM.findUnique({ where: { id: idResponsableTM } });
            if (!responsabletm) {
                return res.status(404).json({ error: 'El responsable TDM no existe' });
            }
            // Validar si el operador existe
            const idoperador = parseInt(operador_id, 10);
            const operador = await prisma.operator.findUnique({
                where: { id: idoperador }
            });
            if (!operador) {
                return res.status(404).json({ message: "El operador con el ID proporcionado no existe." });
            }
            // Validar si el responsable está asociado al operador
            const responsableTDM = await prisma.responsableTM.findFirst({
                where: {
                    id: idResponsableTM,
                    operador_id: idoperador, // Asegurarse de que el responsable esté asociado al operador
                    estado: 'ACTIVO', // Opcional, si solo quieres responsables activos
                }
            });
            if (!responsableTDM) {
                return res.status(404).json({ message: "El responsable de toma de muestra con el ID proporcionado no existe o no está asociado al operador." });
            }

            // Convertimos los valores de procedimiento a números
            const procedimientoIds = procedimiento.map((id: string) => parseInt(id, 10));

            // Obtener el procedimiento desde la base de datos y validación de su existencia
            const procedimientosExistentes = await prisma.procedimientoMuestra.findMany({
                where: { id: { in: procedimientoIds } },
            });
            if (procedimientosExistentes.length !== procedimientoIds.length) {
                return res.status(404).json({ message: 'Uno o más procedimientos no existen en la base de datos' });
            }

            // Convertir el id de responsable_tdm_senarecom_id a número
            const idSenarecomTM = parseInt(responsable_tdm_senarecom_id, 10);
            const senarecomtm = await prisma.senarecomTM.findUnique({ where: { id: idSenarecomTM } });

            if (!senarecomtm) {
                return res.status(404).json({ error: 'El responsable TDM Senarecom no existe' });
            }

            // Si el estado es "APROBADO", generamos un número de formulario (si aplica)
            let updatedNroFormulario: string | null = null;
            if (estado === 'APROBADO') {
                updatedNroFormulario = await generateSamplesNumbers(estado);
            }

            // Crear el objeto de datos para actualizar
            const dataToUpdate = {
                estado,
                nro_formulario: updatedNroFormulario || undefined,
                fecha_aprobacion: estado === 'APROBADO' ? new Date() : null,
                observaciones,
                foto_link: fotoLink,
                responsable_gador: { connect: { id: user_id } },
                procedimiento: {
                    create: procedimientoIds.map((procId) => ({
                        procedimientoId: procId,
                    })),
                },
                // Conectar responsable TDM Senarecom y TDM
                senarecomtm: { connect: { id: idSenarecomTM } },
                responsabletm: { connect: { id: idResponsableTM } },
            };

            // Actualizamos el estado de la muestra en la base de datos
            const sample = await prisma.sample.update({
                where: { id: sampleId },
                data: dataToUpdate,
            });
            // Respondemos con el estado actualizado
            return res.status(200).json({
                message: 'Formulario de toma de muestra actualizado correctamente',
                form: sample,
            });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error, por favor intente más tarde' });
        }
    });
};

  /*
/*
export const updateEstado = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const sampleId = parseInt(req.params.id);
    const { estado, procedimiento, responsable_tdm_senarecom_id, responsable_tdm_id,observaciones } = req.body; // Solo esperamos el estado en el cuerpo de la solicitud
    //const user_id = req.body.user_id;
    try {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(400).json({ message: 'No se ha encontrado un usuario asociado al token' });
        }
        // Primero, obtenemos el estado actual de la muestra
        const currentSample = await prisma.findUnique({
            where: { id: sampleId },
            select: { estado: true } // Solo seleccionamos el campo estado
        });

        // Verificamos si la muestra no fue encontrada (currentSample es null)
        if (!currentSample) {  
            return res.status(404).json({ error: 'Formulario Toma de muestra no encontrado' });
        }

        // Accedemos de manera segura a currentSample.estado
        if (currentSample.estado !== "SOLICITADO") {
            return res.status(400).json({ error: 'La muestra debe estar en estado SOLICITADO para poder ser aprobada' });
        }
        // Validación de los valores permitidos para el estado
        const validStates = ["APROBADO"];
        if (!validStates.includes(estado)) {
            return res.status(400).json({ error: `El estado debe ser: ${validStates.join(", ")}` });
        }
        // Validación para `responsable toma de muestra`
        const responsableTM = await ResponsableTM.findUnique({
            where: { id: responsable_tdm_id }
        });
        if (!responsableTM) {
            return res.status(404).json({ error: 'El responsable de toma de muestra no existe ' });
        }        
        // Validación para responsable toma de muestra (SenarecomTM)
        const senarecomTM = await SenarecomTM.findUnique({
            where: { id: responsable_tdm_senarecom_id }
        });
        if (!senarecomTM) {
            return res.status(404).json({ error: 'El responsable TDM Senarecom no existe' });
        }
        // Validación para los `procedimiento`
        const procedimientoIds = procedimiento.map((proc: any) => proc.id);
        const procedimientosExistentes = await Procedimientos.findMany({
            where: {
                id: { in: procedimientoIds }
            }
        });
        if (procedimientosExistentes.length !== procedimientoIds.length) {
            return res.status(404).json({ error: 'Uno o más procedimientos no existen en la base de datos' });
        }
        // Si el estado es "APROBADO", generamos el siguiente número de formulario con el prefijo "TM-"
        let updatedNroFormulario: string | null = null;
        if (estado === "APROBADO") {
            updatedNroFormulario = await generateSamplesNumbers(estado); // Generamos el número de formulario
        }

        // Datos a actualizar en el modelo Sample
        const dataToUpdate: any = {
            estado,
            nro_formulario: updatedNroFormulario || undefined, // Solo asignamos el nuevo número si se genera
            fecha_aprobacion: new Date(),
            responsable_tdm_gador_id: user_id,
            observaciones,
            procedimiento: {
                create: procedimiento.map((proc: any) => ({
                    procedimientoId: proc.id,
                })),
            },
            senarecomtm: {
                connect: { id: responsable_tdm_senarecom_id }
            },
        };

        // Actualizamos el formulario principal
        const sample = await prisma.update({
            where: { id: sampleId },
            data: dataToUpdate,
        });

        // Responder con el estado actualizado y el formulario modificado
        return res.status(200).json({
            message: 'Formulario de toma de muestra APROBADO',
            form: sample,
        });

    } catch (error: any) {
        // Manejo de errores según el tipo de error
        if (error?.code === 'P2003' && error?.meta?.target?.includes('Mineral')) {
             return res.status(400).json({ error: 'El Mineral no existe' });
        } else if (error?.code === 'P2025') {
           return res.status(404).json('Formulario no encontrado');
        } else if (error?.code === 'P2002') {
            console.error('Error P2002 - Meta:', error.meta);  // Para depurar y ver qué contiene `meta.target`
            
            // Revisar si `meta.target` es una cadena o un array
            if (typeof error?.meta?.target === 'string') {
                // Si es un solo campo en lugar de un array
                if (error?.meta?.target === 'sampleId') {
                 return   res.status(400).json({ error: 'La combinación de la muestra y el procedimiento ya existe' });
                } else {
                    return res.status(400).json({ error: 'Violación de restricción de unicidad en ' + error.meta.target });
                }
            } else if (Array.isArray(error?.meta?.target)) {
                // Si es un array, comprobar la presencia de los campos esperados
                if (error?.meta?.target.includes('sampleId') && error?.meta?.target.includes('procedimientoId')) {
                return    res.status(400).json({ error: 'La combinación de la muestra y el procedimiento ya existe' });
                } else {
                return    res.status(400).json({ error: 'Violación de restricción de unicidad en los campos: ' + error.meta.target.join(", ") });
                }
            } else {
                return res.status(400).json({ error: 'Violación de restricción de unicidad desconocida' });
            }
        } else {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};*/
export const updateSampleS = async (req: Request, res: Response): Promise<void> => {
    const sampleId = parseInt(req.params.id);
    const {
        operador_id,
        responsable_tdm_id,
        responsable_tdm_senarecom_id,
        procedimiento,
        observaciones,
    } = req.body;
    try {
        // Validar si el operador existe
        const operador = await prisma.operator.findUnique({
            where: { id: operador_id }
        });
        if (!operador) {
            res.status(404).json({ message: "El operador con el ID proporcionado no existe." });
        }
        // Validar si el responsable está asociado al operador
        const responsableTDM = await prisma.responsableTM.findFirst({
            where: {
                id: responsable_tdm_id,
                operador_id: operador_id, // Asegurarse de que el responsable esté asociado al operador
                estado: 'ACTIVO', // Opcional, si solo quieres responsables activos
            }
        });
        if (!responsableTDM) {
            res.status(404).json({ message: "El responsable de toma de muestra con el ID proporcionado no existe o no está asociado al operador." });
        }

        // Validar si los procedimientos existen
        if (procedimiento && Array.isArray(procedimiento) && procedimiento.length > 0) {
            const procedimientoIds = procedimiento.map((procedimiento: any) => procedimiento.procedimientoId);
            const procedimientosExistentes = await prisma.procedimientoMuestra.findMany({
                where: {
                    id: { in: procedimientoIds },
                },
            });

            // Obtener los ids de los procedimientos existentes
            const procedimientosExistentesIds = procedimientosExistentes.map((procedimiento: any) => procedimiento.id);
            // Filtrar los procedimientos que no existen
            const procedimientosNoExistentes = procedimientoIds.filter(id => !procedimientosExistentesIds.includes(id));

            if (procedimientosNoExistentes.length > 0) {
                    res.status(404).json({
                    message: `Los siguientes procedimientos no existen: ${procedimientosNoExistentes.join(', ')}`,
                });
            }
        }
        // Datos a actualizar en el modelo de toma de muestra
        let dataToUpdate: any = {
            operador_id,
            responsable_tdm_id,
            responsable_tdm_senarecom_id,
            observaciones,
            updated_at: new Date(), 
        };

        // Actualizamos el formulario principal
        const sample = await prisma.sample.update({
            where: { id: sampleId },
            data: dataToUpdate,
        });
        // Validación de existencia de procedimientos
        const procedimientoIds = procedimiento.map((proc: any) => proc.procedimientoId);
        const procedimientosExistentes = await prisma.procedimientoMuestra.findMany({
            where: {
                id: { in: procedimientoIds },
            },
        });

        if (procedimientosExistentes.length !== procedimientoIds.length) {
            res.status(404).json({ message: "Uno o más procedimientos proporcionados no existen." });
        }

        // Eliminar relaciones antiguas
        await prisma.sampleProcedimientoMuestra.deleteMany({
            where: { sampleId: sampleId }, // Usamos sampleId para eliminar las relaciones existentes
        });

        // Agregar las relaciones actualizadas
        await prisma.sampleProcedimientoMuestra.createMany({
            data: procedimiento.map((proc: any) => ({
                sampleId: sampleId,
                procedimientoId: proc.procedimientoId,
            })),
        });
       // Recuperar el formulario actualizado junto con los procedimientos
        const updatedForm = await prisma.sample.findUnique({
            where: { id: sampleId },
            include: {
                minerales: true,         
                municipio_origen: true,  
                procedimiento: true,    
            },
        });
        res.status(200).json(updatedForm);
    } catch (error: any) {
        if (error?.code === 'P2003' && error?.meta?.target?.includes('procedimiento')) {
            res.status(400).json({ error: 'El Procedimiento no existe' });
        } else if (error?.code === 'P2025') {
            res.status(404).json('Formulario no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};
export const updateSample = async (req: Request, res: Response): Promise<void> => {
    const sampleId = parseInt(req.params.id);
    const {
        operador_id,
        responsable_tdm_id,
        lote,
        tipo_muestra,
        presentacion_id,
        cantidad,
        nro_camiones,
        total_parcial,
        peso_neto_total,
        peso_neto_parcial,
        humedad,
        observaciones,
        lugar_verificacion,
        ubicacion_lat,
        ubicacion_lon,
        departamento_id,
        municipio_id,
        fecha_hora_tdm,
        minerales,
        municipio_origen
    } = req.body;

    try {
        // Validar si el operador existe
        const operador = await prisma.operator.findUnique({
            where: { id: operador_id }
        });
        if (!operador) {
            res.status(404).json({ message: "El operador con el ID proporcionado no existe." });
        }
        // Validar si el responsable está asociado al operador
        const responsableTDM = await prisma.responsableTM.findFirst({
            where: {
                id: responsable_tdm_id,
                operador_id: operador_id, // Asegurarse de que el responsable esté asociado al operador
                estado: 'ACTIVO', // Opcional, si solo quieres responsables activos
            }
        });
        if (!responsableTDM) {
            res.status(404).json({ message: "El responsable de toma de muestra con el ID proporcionado no existe o no está asociado al operador." });
        }
        // Validar si el municipio existe
        const municipio = await prisma.municipios.findUnique({
            where: { id: municipio_id }
        });
        if (!municipio) {
            res.status(404).json({ message: "El municipio con el ID proporcionado no existe." });
        }

        // Validar si los minerales existen
        if (minerales && Array.isArray(minerales)) {
            const mineralIds = minerales.map((mineral: any) => mineral.mineralId);
            const mineralesExistentes = await prisma.mineral.findMany({
                where: {
                    id: { in: mineralIds }
                }
            });
            if (mineralesExistentes.length !== mineralIds.length) {
                res.status(404).json({ message: "Uno o más minerales proporcionados no existen." });
            }
        }

        // Validar si los municipios de origen existen
        if (municipio_origen && Array.isArray(municipio_origen)) {
            const municipioOrigenIds = municipio_origen.map((municipio: any) => municipio.id);
            const municipiosOrigenExistentes = await prisma.municipios.findMany({
                where: {
                    id: { in: municipioOrigenIds }
                }
            });
            if (municipiosOrigenExistentes.length !== municipio_origen.length) {
                res.status(404).json({ message: "Uno o más municipios de origen no existen." });
            }
        }
        // Datos a actualizar en el modelo de toma de muestra
        let dataToUpdate: any = {
            operador_id,
            responsable_tdm_id,
            lote,
            tipo_muestra,
            presentacion_id,
            cantidad,
            nro_camiones,
            observaciones,
            lugar_verificacion,
            ubicacion_lat,
            ubicacion_lon,
            departamento_id,
            municipio_id,
            fecha_hora_tdm,
            updated_at: new Date(), // Actualización de la fecha
        };
        // Solo asignar los valores de tipo Decimal si se proporcionan
        if (total_parcial !== undefined && total_parcial !== null) {
            dataToUpdate.total_parcial = new Decimal(total_parcial);
        }
        if (peso_neto_total !== undefined && peso_neto_total !== null) {
            dataToUpdate.peso_neto_total = new Decimal(peso_neto_total);
        }
        if (peso_neto_parcial !== undefined && peso_neto_parcial !== null) {
            dataToUpdate.peso_neto_parcial = new Decimal(peso_neto_parcial);
        }
        if (humedad !== undefined && humedad !== null) {
            dataToUpdate.humedad = new Decimal(humedad);
        }
        // Actualizamos el formulario principal
        const sample = await prisma.sample.update({
            where: { id: sampleId },
            data: dataToUpdate,
        });
        // Actualizar la relación de minerales
        if (minerales && Array.isArray(minerales)) {
            // Validar si los minerales existen
            const mineralIds = minerales.map((mineral: any) => mineral.mineralId);
            const mineralesExistentes = await prisma.mineral.findMany({
                where: {
                    id: { in: mineralIds }
                }
            });
        
            // Verificar que todos los minerales existan
            if (mineralesExistentes.length !== mineralIds.length) {
                res.status(404).json({ message: "Uno o más minerales proporcionados no existen." });
            }
        
            // Primero eliminar las relaciones actuales de minerales
            await prisma.sampleMineral.deleteMany({
                where: { sampleId: sampleId },
            });
        
            // Luego agregar las relaciones actualizadas
            await prisma.sampleMineral.createMany({
                data: minerales.map((mineral: any) => ({
                    sampleId: sampleId, // Relacionamos con el sampleId
                    mineralId: mineral.mineralId, // Usamos mineralId para la relación
                    ley: mineral.ley,
                    unidad: mineral.unidad,
                })),
            });
        }
        if (municipio_origen && Array.isArray(municipio_origen)) {
            // Validar si los municipios de origen existen
            const municipioIds = municipio_origen.map((municipio: any) => municipio.id);
            const municipiosExistentes = await prisma.municipios.findMany({
                where: {
                    id: { in: municipioIds }
                }
            });
        
            // Verificar que todos los municipios existan
            if (municipiosExistentes.length !== municipioIds.length) {
                res.status(404).json({ message: "Uno o más municipios de origen no existen." });
            }
        
            // Primero eliminar las relaciones actuales de municipios de origen
            await prisma.sampleMunicipio.deleteMany({
                where: { sampleId: sampleId },
            });
        
            // Luego agregar las relaciones actualizadas
            await prisma.sampleMunicipio.createMany({
                data: municipio_origen.map((municipio: any) => ({
                    sampleId: sampleId,  // Relacionamos con el sampleId
                    municipioId: municipio.id, // Usamos municipioId para la relación
                })),
            });
        }
        // Recuperar el formulario actualizado junto con los minerales y municipios de origen
        const updatedForm = await prisma.sample.findUnique({
            where: { id: sampleId },
            include: {
                minerales: true,            // Incluir los minerales actualizados
                municipio_origen: true,     // Incluir los municipios de origen actualizados
            },
        });

        // Respondemos con el formulario actualizado
        res.status(200).json(updatedForm);

    } catch (error: any) {
        // Manejo de errores según el tipo de error
        if (error?.code === 'P2003' && error?.meta?.target?.includes('Mineral')) {
            res.status(400).json({ error: 'El Mineral no existe' });
        } else if (error?.code === 'P2025') {
            res.status(404).json('Formulario no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};
export const updateSamples = async (req: Request, res: Response): Promise<void> => {
    const sampleId = parseInt(req.params.id);
    const {
        operador_id,
        responsable_tdm_id,
        lote,
        tipo_muestra,
        presentacion_id,
        cantidad,
        nro_camiones,
        total_parcial,
        peso_neto_total,
        peso_neto_parcial,
        observaciones,
        lugar_verificacion,
        ubicacion_lat,
        ubicacion_lon,
        departamento_id,
        municipio_id,
        fecha_hora_tdm,
        minerales,
        municipio_origen
    } = req.body;

    try {
        // Validar si el operador existe
        const operador = await prisma.operator.findUnique({
            where: { id: operador_id }
        });
        if (!operador) {
            res.status(404).json({ message: "El operador con el ID proporcionado no existe." });
        }
        // Validar si el responsable está asociado al operador
        const responsableTDM = await prisma.responsableTM.findFirst({
            where: {
                id: responsable_tdm_id,
                operador_id: operador_id, // Asegurarse de que el responsable esté asociado al operador
                estado: 'ACTIVO', // Opcional, si solo quieres responsables activos
            }
        });
        if (!responsableTDM) {
            res.status(404).json({ message: "El responsable de toma de muestra con el ID proporcionado no existe o no está asociado al operador." });
        }
        // Validar si el municipio existe
        const municipio = await prisma.municipios.findUnique({
            where: { id: municipio_id }
        });
        if (!municipio) {
            res.status(404).json({ message: "El municipio con el ID proporcionado no existe." });
        }
        // Validar si los minerales existen
        if (minerales && Array.isArray(minerales)) {
            const mineralIds = minerales.map((mineral: any) => mineral.mineralId);
            const mineralesExistentes = await prisma.mineral.findMany({
                where: {
                    id: { in: mineralIds }
                }
            });
            if (mineralesExistentes.length !== mineralIds.length) {
                res.status(404).json({ message: "Uno o más minerales proporcionados no existen." });
            }
        }

        // Validar si los municipios de origen existen
        if (municipio_origen && Array.isArray(municipio_origen)) {
            const municipioOrigenIds = municipio_origen.map((municipio: any) => municipio.id);
            const municipiosOrigenExistentes = await prisma.municipios.findMany({
                where: {
                    id: { in: municipioOrigenIds }
                }
            });
            if (municipiosOrigenExistentes.length !== municipio_origen.length) {
                res.status(404).json({ message: "Uno o más municipios de origen no existen." });
            }
        }

        // Datos a actualizar en el modelo de toma de muestra
        let dataToUpdate: any = {
            operador_id,
            responsable_tdm_id,
            lote,
            tipo_muestra,
            presentacion_id,
            cantidad,
            nro_camiones,
            observaciones,
            lugar_verificacion,
            ubicacion_lat,
            ubicacion_lon,
            departamento_id,
            municipio_id,
            fecha_hora_tdm,
            updated_at: new Date(), // Actualización de la fecha
        };

        // Solo asignar los valores de tipo Decimal si se proporcionan
        if (total_parcial !== undefined && total_parcial !== null) {
            dataToUpdate.total_parcial = new Decimal(total_parcial);
        }
        if (peso_neto_total !== undefined && peso_neto_total !== null) {
            dataToUpdate.peso_neto_total = new Decimal(peso_neto_total);
        }
        if (peso_neto_parcial !== undefined && peso_neto_parcial !== null) {
            dataToUpdate.peso_neto_parcial = new Decimal(peso_neto_parcial);
        }

        // Actualizamos el formulario principal
        const sample = await prisma.sample.update({
            where: { id: sampleId },
            data: dataToUpdate,
        });
        if (minerales && Array.isArray(minerales)) {
            // Validar si los minerales existen
            const mineralIds = minerales.map((mineral: any) => mineral.mineralId);
            const mineralesExistentes = await prisma.mineral.findMany({
                where: {
                    id: { in: mineralIds }
                }
            });
        
            // Verificar que todos los minerales existan
            if (mineralesExistentes.length !== mineralIds.length) {
                res.status(404).json({ message: "Uno o más minerales proporcionados no existen." });
            }
        
            // Primero eliminar las relaciones actuales de minerales
            await prisma.sampleMineral.deleteMany({
                where: { sampleId: sampleId },
            });
        
            // Luego agregar las relaciones actualizadas
            await prisma.sampleMineral.createMany({
                data: minerales.map((mineral: any) => ({
                    sampleId: sampleId, // Relacionamos con el sampleId
                    mineralId: mineral.mineralId, // Usamos mineralId para la relación
                    ley: mineral.ley,
                    unidad: mineral.unidad,
                })),
            });
        }
        // Actualizar la relación con los municipios de origen
        if (municipio_origen && Array.isArray(municipio_origen)) {
            // Validar si los municipios de origen existen
            const municipioIds = municipio_origen.map((municipio: any) => municipio.id);
            const municipiosExistentes = await prisma.municipios.findMany({
                where: {
                    id: { in: municipioIds }
                }
            });

            // Verificar que todos los municipios existan
            if (municipiosExistentes.length !== municipioIds.length) {
                res.status(404).json({ message: "Uno o más municipios de origen no existen." });
            }

            // Primero eliminar las relaciones actuales de municipios de origen
            await prisma.sampleMunicipio.deleteMany({
                where: { sampleId: sampleId },
            });

            // Luego agregar las relaciones actualizadas
            await prisma.sampleMunicipio.createMany({
                data: municipio_origen.map((municipio: any) => ({
                    sampleId: sampleId,  // Aquí usamos sampleId como la clave foránea correcta
                    municipioId: municipio.id, // Relacionamos el municipio por su ID
                })),
            });
        }
        // Recuperar el formulario actualizado junto con los minerales y municipios de origen
        const updatedForm = await prisma.sample.findUnique({
            where: { id: sampleId },
            include: {
                minerales: true,            // Incluir los minerales actualizados
                municipio_origen: true,     // Incluir los municipios de origen actualizados
            },
        });
        // Respondemos con el formulario actualizado
        res.status(200).json(updatedForm);
    } catch (error: any) {
        // Manejo de errores según el tipo de error
        if (error?.code === 'P2003' && error?.meta?.target?.includes('Mineral')) {
            res.status(400).json({ error: 'El Mineral no existe' });
        } else if (error?.code === 'P2025') {
            res.status(404).json('Formulario no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};
export const requestSample = async (req: Request, res: Response): Promise<void> => {
    const sampleId = parseInt(req.params.id);
    const { estado } = req.body;  // Solo esperamos el nuevo estado para actualizar

    try {
        // Validación de los valores permitidos para el estado
        const validStates = ["SOLICITADO"];
        if (!validStates.includes(estado)) {
            res.status(400).json({ error: `El estado debe ser: ${validStates.join(", ")}` });
            return;  // Terminamos la ejecución si el estado no es válido
        }

        // Actualizar solo el campo estado
        const updatedSample = await prisma.sample.update({
            where: { id: sampleId },
            data: {
                estado,  // Solo actualizamos el estado
                updated_at: new Date(),  // Actualizamos la fecha de la última modificación
            },
        });

        // Responder con el formulario actualizado
        res.status(200).json(updatedSample);

    } catch (error: any) {
        // Manejo de errores
        if (error?.code === 'P2025') {
            res.status(404).json({ message: 'Formulario no encontrado' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};
export const signSample = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const sampleId = parseInt(req.params.id);
    const { estado } = req.body;  // Solo esperamos el nuevo estado para actualizar
    try {
        // Primero, obtenemos el estado actual de la muestra
        const currentSample = await prisma.sample.findUnique({
            where: { id: sampleId },
            select: { estado: true } // Solo seleccionamos el campo estado
        });     
        // Verificamos si la muestra no fue encontrada (currentSample es null)
        if (!currentSample) {  
            return res.status(404).json({ error: 'Formulario Toma de muestra no encontrado' });
        }
        // Accedemos de manera segura a currentSample.estado
        if (currentSample.estado !== "APROBADO") {
            return res.status(400).json({ error: 'La muestra debe estar en estado APROBADO para poder ser firmada' })}
            
        // Validación de los valores permitidos para el estado
        const validStates = ["FIRMADO"];
        if (!validStates.includes(estado)) {
            return res.status(400).json({ error: `El estado debe ser: ${validStates.join(", ")}` });
              // Terminamos la ejecución si el estado no es válido
        }
        // Actualizar solo el campo estado
        const updatedSample = await prisma.sample.update({
            where: { id: sampleId },
            data: {
                estado,  // Solo actualizamos el estado
                fecha_firma: new Date(),  // Actualizamos la fecha de la última modificación
            },
        });
        // Responder con el formulario actualizado
             return res.status(200).json(updatedSample);
    } catch (error: any) {
        // Manejo de errores
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: 'Formulario no encontrado' });
        } else {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};
export const annularSample = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const sampleId = parseInt(req.params.id);
    const { estado, justificacion_anulacion } = req.body;  // Recibimos los valores de 'estado' y 'justificacion_anulacion'

    try {
        // Validamos que ambos campos estén presentes
        if (!estado || !justificacion_anulacion) {
            return res.status(400).json({ error: 'Los campos estado y justificacion_anulacion son obligatorios' });
        }

        // Primero, obtenemos el estado actual de la muestra
        const currentSample = await prisma.sample.findUnique({
            where: { id: sampleId },
            select: { estado: true } // Solo seleccionamos el campo estado
        });

        // Verificamos si la muestra no fue encontrada (currentSample es null)
        if (!currentSample) {  
            return res.status(404).json({ error: 'Formulario Toma de muestra no encontrado' });
        }

        // Accedemos de manera segura a currentSample.estado
        if (currentSample.estado !== "GENERADO" && currentSample.estado !== "SOLICITADO") {
            return res.status(400).json({ error: 'La muestra solo se puede ANULAR si esta en estado GENERADO o SOLICITADO' });
        }

        // Validación de los valores permitidos para el estado
        const validStates = ["ANULADO"];
        if (!validStates.includes(estado)) {
            return res.status(400).json({ error: `El estado debe ser: ${validStates.join(", ")}` });
        }

        // Actualizar solo el campo estado y justificación de anulación
        const updatedSample = await prisma.sample.update({
            where: { id: sampleId },
            data: {
                estado,  // Solo actualizamos el estado
                justificacion_anulacion,  // Justificación de anulación
                updated_at: new Date(),  // Actualizamos la fecha de la última modificación
            },
        });

        // Responder con el formulario actualizado
        return res.status(200).json(updatedSample);
    } catch (error: any) {
        // Manejo de errores
        if (error?.code === 'P2025') {
            return res.status(404).json({ message: 'Formulario no encontrado' });
        } else {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};
export const deleteSamples = async (req: Request, res: Response): Promise<void> => {
    const operatorId = parseInt(req.params.id)
    try {
        await prisma.sample.delete({
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