import { Request, Response, RequestHandler } from 'express';
import { prisma } from "../models/prismaClient"; 
import { convertBigIntToString } from "../utils/convertBigInt";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
// Configuración de Multer para almacenar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directorio donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
      // Accedemos a los campos nit y razon_social del formulario
      const nit = req.body.nit; // Asegúrate de que el nombre del campo sea correcto
      const razon_social = req.body.razon_social; // Asegúrate de que el nombre del campo sea correcto
  
      // Si nit o razon_social no están presentes, manejar el caso
      if (!nit || !razon_social) {
        return cb(new Error('Faltan los campos nit o razon_social'), ''); // Aquí es donde se soluciona el problema
      }
  
      // Limpiamos los valores para evitar caracteres no permitidos en el nombre del archivo
      const sanitizedNit = nit.replace(/[^\w\s]/gi, '_'); // Reemplaza caracteres no alfanuméricos
      const sanitizedRazonSocial = razon_social.replace(/[^\w\s]/gi, '_'); // Lo mismo para razon_social
  
      // Mapeamos los campos a un prefijo adecuado según el nombre del archivo
      const prefixMap: { [key: string]: string } = {
        'nit_link': `nit_${sanitizedRazonSocial}`,
        'nim_link': `nim_${sanitizedRazonSocial}`,
        'seprec_link': `seprec_${sanitizedRazonSocial}`,
        'doc_explotacion_link': `doc_explotacion_${sanitizedRazonSocial}`,
        'ruex_link': `ruex_${sanitizedRazonSocial}`,
        'resolucion_min_fundind_link': `resolucion_min_fundind_${sanitizedRazonSocial}`,
        'personeria_juridica_link': `personeria_juridica_${sanitizedRazonSocial}`,
        'doc_creacion_estatal_link': `doc_creacion_estatal_${sanitizedRazonSocial}`,
        'ci_link': `ci_${sanitizedRazonSocial}`
      };
  
      const prefix = prefixMap[file.fieldname] || `documento_generico_${sanitizedRazonSocial}`;
      let fileName = `${prefix}${path.extname(file.originalname)}`;
  
      // Verificar si el archivo ya existe, y agregar un sufijo si es necesario
      let filePath = path.join('uploads', fileName);
      let counter = 1;
      // Si el archivo ya existe, agregamos un sufijo (1), (2), ...
      while (fs.existsSync(filePath)) {
        fileName = `${prefix}(${counter})${path.extname(file.originalname)}`;
        filePath = path.join('uploads', fileName);
        counter++;
      }
  
      // Asignamos el nombre generado al archivo
      cb(null, fileName); // Llamada correcta con ambos argumentos (null y fileName)
    }
  });
  
// Middleware de Multer para manejar archivos
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Límite de tamaño de archivo de 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten archivos PDF.'));
    }
    // Si es PDF, acepta el archivo
    cb(null, true);
  }
}).fields([ // Definir los campos de los archivos que se esperan en el formulario
  { name: 'nit_link', maxCount: 1 },
  { name: 'nim_link', maxCount: 1 },
  { name: 'seprec_link', maxCount: 1 },
  { name: 'doc_explotacion_link', maxCount: 1 },
  { name: 'ruex_link', maxCount: 1 },
  { name: 'resolucion_min_fundind_link', maxCount: 1 },
  { name: 'personeria_juridica_link', maxCount: 1 },
  { name: 'doc_creacion_estatal_link', maxCount: 1 },
  { name: 'ci_link', maxCount: 1 }
]);
const storageUpdate = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directorio donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
      // Puedes obtener `razon_social` o algún otro identificador si es necesario
      const razon_social = req.body.razon_social || 'deault'//req.razon_social;  // Si no viene en la solicitud, usamos la razón social recuperada
      // Limpiar el valor para evitar caracteres no permitidos
      const sanitizedRazonSocial = razon_social.replace(/[^\w\s]/gi, '_');
      const prefix = `ci_${sanitizedRazonSocial}`;
  
      let fileName = `${prefix}${path.extname(file.originalname)}`;
  
      // Verificar si el archivo ya existe y agregar un sufijo si es necesario
      let filePath = path.join('uploads', fileName);
      let counter = 1;
      while (fs.existsSync(filePath)) {
        fileName = `${prefix}(${counter})${path.extname(file.originalname)}`;
        filePath = path.join('uploads', fileName);
        counter++;
      }
  
      cb(null, fileName);  // Llamada correcta con ambos argumentos (null y fileName)
    }
  });
  
  // Define storeUpdate para actualizar archivos (similar a tu `upload`)
  const storeUpdate = multer({
    storage: storageUpdate,
    limits: { fileSize: 50 * 1024 * 1024 }, // Límite de tamaño de archivo de 50MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Solo se permiten archivos PDF.'));
      }
      // Si es PDF, acepta el archivo
      cb(null, true);
    }
  }).fields([ // Define los campos de los archivos para la actualización
    { name: 'nit_link', maxCount: 1 },
    { name: 'nim_link', maxCount: 1 },
    { name: 'seprec_link', maxCount: 1 },
    { name: 'doc_explotacion_link', maxCount: 1 },
    { name: 'ruex_link', maxCount: 1 },
    { name: 'resolucion_min_fundind_link', maxCount: 1 },
    { name: 'personeria_juridica_link', maxCount: 1 },
    { name: 'doc_creacion_estatal_link', maxCount: 1 },
    { name: 'ci_link', maxCount: 1 }
  ]);
// Extender Request para incluir la propiedad 'files'
interface MulterFileRequest extends Request {
  files?: { [fieldname: string]: Express.Multer.File[] };  // Definir el tipo de `files` explícitamente
}

// Controlador para crear operadores
export const createOperators: RequestHandler<any, any, any, any, MulterFileRequest> = async (req, res): Promise<void> => {
  // Usamos el middleware de multer para manejar la carga de archivos
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // Manejo de errores específicos de Multer (tamaño de archivo, número de archivos, etc.)
      return res.status(400).json({ message: `Error de Multer: ${err.message}` });
    } else if (err) {
      // Manejo de otros errores (como el error del filtro de tipo de archivo)
      return res.status(400).json({ message: `Error al cargar los archivos: ${err.message}` });
    }
    try {
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
        dl_departamento_id,  
        dl_direccion,  
        dl_municipio_id,  
        doc_creacion,  
        fecha_exp_nim,  
        fecha_exp_seprec,  
        nro_matricula_seprec,  
        nro_nim,  
        nro_personeria,  
        nro_res_ministerial,  
        nro_ruex, 
        fecha_exp_ruex, 
        correo_inst,  
        ofi_lat,  
        ofi_lon,  
        fax_op_min,  
        tel_fijo,  
        celular,  
        otro_celular,  
        tipo_doc_creacion,  
        tipo_operador,  
        verif_cert_liberacion,  
        nit,  
        tipo_nim_niar,  
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
        arrendamientos,
        oficinas,
      } = req.body;
let arrendamientosParsed = arrendamientos || []; // Si es undefined o null, lo convierte en []
let oficinasParsed = oficinas || []; // Si es undefined o null, lo convierte en []

// Si arrendamientos es una cadena de texto, intentamos parsearlo como JSON
if (typeof arrendamientosParsed === 'string') {
  try {
    arrendamientosParsed = JSON.parse(arrendamientosParsed); // Convertir la cadena JSON en un array
  } catch (error) {
    return res.status(400).json({ message: 'El formato de arrendamientos no es válido' });
  }
}

// Si arrendamientosParsed no es un array, lo forzamos a ser un array vacío
if (!Array.isArray(arrendamientosParsed)) {
  arrendamientosParsed = [];
}

// Si oficinas es una cadena de texto, intentamos parsearlo como JSON
if (typeof oficinasParsed === 'string') {
  try {
    oficinasParsed = JSON.parse(oficinasParsed); // Convertir la cadena JSON en un array
  } catch (error) {
    return res.status(400).json({ message: 'El formato de oficinas no es válido' });
  }
}

// Si oficinasParsed no es un array, lo forzamos a ser un array vacío
if (!Array.isArray(oficinasParsed)) {
  oficinasParsed = [];
}
      // Verificación explícita de archivos
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const nitFile = files?.['nit_link']?.[0]?.path ?? null;
      const nimFile = files?.['nim_link']?.[0]?.path ?? null;
      const seprecFile = files?.['seprec_link']?.[0]?.path ?? null;
      const docExplotacionFile = files?.['doc_explotacion_link']?.[0]?.path ?? null;
      const ruexFile = files?.['ruex_link']?.[0]?.path ?? null;
      const resolucionFile = files?.['resolucion_min_fundind_link']?.[0]?.path ?? null;
      const personeriaFile = files?.['personeria_juridica_link']?.[0]?.path ?? null;
      const docCreacionFile = files?.['doc_creacion_estatal_link']?.[0]?.path ?? null;
      const ciFile = files?.['ci_link']?.[0]?.path ?? null;

      // Validaciones de campos obligatorios
      if (!razon_social) {
        return res.status(400).json({ message: 'La razón social es obligatoria' });
      }

      if (!nit) {
        return res.status(400).json({ message: 'El NIT es obligatorio' });
      }

    const dlMunicipio = req.body.dl_municipio_id ? parseInt(req.body.dl_municipio_id, 10) : null;
    const dlDepartamento = req.body.dl_departamento_id ? parseInt(req.body.dl_departamento_id, 10) : null;
    const parsenit = req.body.nit ? parseInt(req.body.nit, 10) : null;
    const parsenroResMinisterial = req.body.nro_res_ministerial ? parseInt(req.body.nro_res_ministerial, 10) : null;
    const parsecelular = req.body.celular ? parseInt(req.body.celular, 10) : null;
    const parseotroCelular = req.body.otro_celular ? parseInt(req.body.otro_celular, 10) : null;
    const paratipoDocCreacion = req.body.tipo_doc_creacion ? parseInt(req.body.tipo_doc_creacion, 10) : null;
    const paratipoOperador = req.body.tipo_operador ? parseInt(req.body.tipo_operador, 10) : null;
    const pararespDepartamento = req.body.rep_departamento_id ? parseInt(req.body.rep_departamento_id, 10) : null;
    const pararespMunicipio = req.body.rep_municipio_id ? parseInt(req.body.rep_municipio_id, 10) : null;
    const pararespCelular = req.body.rep_celular ? parseInt(req.body.rep_celular, 10) : null;

    // Parseo de los nuevos campos con valor por defecto 0 si no se envían
    const actBenConcentracion = req.body.act_ben_concentracion !== undefined ? parseInt(req.body.act_ben_concentracion, 10) : 0;
    const actComerExterna = req.body.act_comer_externa !== undefined ? parseInt(req.body.act_comer_externa, 10) : 0;
    const actComerInterna = req.body.act_comer_interna !== undefined ? parseInt(req.body.act_comer_interna, 10) : 0;
    const actExploracion = req.body.act_exploracion !== undefined ? parseInt(req.body.act_exploracion, 10) : 0;
    const actExplotacion = req.body.act_explotacion !== undefined ? parseInt(req.body.act_explotacion, 10) : 0;
    const actFundicion = req.body.act_fundicion !== undefined ? parseInt(req.body.act_fundicion, 10) : 0;
    const actTostacion = req.body.act_tostacion !== undefined ? parseInt(req.body.act_tostacion, 10) : 0;
    const actCalcinacion = req.body.act_calcinacion !== undefined ? parseInt(req.body.act_calcinacion, 10) : 0;
    const actIndustrializacion = req.body.act_industrializacion !== undefined ? parseInt(req.body.act_industrializacion, 10) : 0;
    const actRefinacion = req.body.act_refinacion !== undefined ? parseInt(req.body.act_refinacion, 10) : 0;
    const actTrasColas = req.body.act_tras_colas !== undefined ? parseInt(req.body.act_tras_colas, 10) : 0;

    const camposNumericos = [
        dlMunicipio,
        dlDepartamento,
        parsenit,
        parsenroResMinisterial,
        parsecelular,
        parseotroCelular,
        paratipoDocCreacion,
        paratipoOperador,
        pararespDepartamento,
        pararespMunicipio,
        pararespCelular,        
        actBenConcentracion,
        actComerExterna,
        actComerInterna,
        actExploracion,
        actExplotacion,
        actFundicion,
        actTostacion,
        actCalcinacion,
        actIndustrializacion,
        actRefinacion,
        actTrasColas
      ];
      
      // Validación usando un bucle
      for (const campo of camposNumericos) {
        if (campo !== null && isNaN(campo)) {
          return res.status(400).json({ message: 'Uno o más campos con valores numéricos son inválidos' });
        }
      }
      const parsedFechaExpNim = fecha_exp_nim ? new Date(fecha_exp_nim) : null;
      const parsedFechaExpSeprec = fecha_exp_seprec ? new Date(fecha_exp_seprec) : null;
      const parsedFechaExpRuex = fecha_exp_ruex ? new Date(fecha_exp_ruex) : null;
            // Validación de fechas
      if (parsedFechaExpNim && isNaN(parsedFechaExpNim.getTime())) {
          return res.status(400).json({ message: 'Fecha de expiración de NIM no es válida' });
      }
      if (parsedFechaExpSeprec && isNaN(parsedFechaExpSeprec.getTime())) {
          return res.status(400).json({ message: 'Fecha de expiración de SEPREC no es válida' });
      }
      if (parsedFechaExpRuex && isNaN(parsedFechaExpRuex.getTime())) {
          return res.status(400).json({ message: 'Fecha de expiración de RUEX no es válida' });
      }
      // Generación de un hash único para el operador
      const generateUniqueHash = async (): Promise<string> => {
          let hash: string = '';
          await prisma.$transaction(async (tx) => {
              let existingForm: any;  
              do {
                  hash = generateRandomString(32);  // Generar el hash aleatorio
                  existingForm = await tx.operator.findUnique({
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
      const uniqueHash = await generateUniqueHash();
      // Guardar los archivos cargados y sus rutas en la base de datos
      const operator = await prisma.operator.create({
        data: {
            razon_social,
            act_ben_concentracion:actBenConcentracion,  
            act_comer_externa:actComerExterna,  
            act_comer_interna:actComerInterna,  
            act_exploracion:actExploracion,  
            act_explotacion:actExplotacion,  
            act_fundicion:actFundicion,  
            act_tostacion:actTostacion,  
            act_calcinacion:actCalcinacion,  
            act_industrializacion:actIndustrializacion,  
            act_refinacion:actRefinacion,  
            act_tras_colas:actTrasColas,  
            dl_departamento_id:dlDepartamento,  
            dl_direccion,  
            dl_municipio_id:dlMunicipio, 
            doc_creacion,  
            fecha_exp_nim:parsedFechaExpNim,  
            fecha_exp_seprec:parsedFechaExpSeprec,  
            nro_matricula_seprec,  
            nro_nim,  
            nro_personeria,  
            nro_res_ministerial:parsenroResMinisterial,  
            nro_ruex,
            fecha_exp_ruex:parsedFechaExpRuex,  
            correo_inst,  
            ofi_lat,  
            ofi_lon,  
            fax_op_min,  
            tel_fijo,  
            celular:parsecelular,  
            otro_celular:parseotroCelular,  
            tipo_doc_creacion:paratipoDocCreacion,  
            tipo_operador:paratipoOperador,  
            verif_cert_liberacion,  
            nit:parsenit,  
            tipo_nim_niar,  
            fecha_creacion:new Date(),
            fecha_actualizacion:new Date(),  
            fecha_expiracion:new Date(new Date().setFullYear(new Date().getFullYear() + 1)),  
            estado: estado && estado.trim() !== "" ? estado : "ACTIVO", 
            verificacion_toma_muestra,  
            comercio_interno_coperativa,  
            traslado_colas,  
            transbordo,
            nit_link: nitFile,
            nim_link: nimFile,
            seprec_link: seprecFile,
            doc_explotacion_link: docExplotacionFile,
            ruex_link: ruexFile,
            resolucion_min_fundind_link: resolucionFile,
            personeria_juridica_link: personeriaFile,
            doc_creacion_estatal_link: docCreacionFile,
            ci_link: ciFile,
            rep_nombre_completo,
            rep_ci,
            rep_departamento_id:pararespDepartamento,
            rep_municipio_id:pararespMunicipio,
            rep_direccion,
            rep_telefono,
            rep_celular:pararespCelular,
            rep_correo,
            observaciones,
            created_at: new Date(),
            updated_at: new Date(),
            hash: uniqueHash,
        }
      });
        const arrendamientosData = arrendamientosParsed.map((arrendamiento: any) => ({
            operador_id: operator.id,
            codigo_unico: arrendamiento.codigo_unico ? parseInt(arrendamiento.codigo_unico, 10) : null,
            extension: arrendamiento.extension ? parseInt(arrendamiento.extension, 10) : null,
            unidad_extension: arrendamiento.unidad_extension ? parseInt(arrendamiento.unidad_extension, 10) : null,
            denominacion_area: arrendamiento.denominacion_area || null, // Puede ser null si el modelo lo permite
            departamento_id: arrendamiento.departamento_id ? parseInt(arrendamiento.departamento_id, 10) : null,
            municipio_id: arrendamiento.municipio_id ? parseInt(arrendamiento.municipio_id, 10) : 1, // Valor por defecto si es obligatorio
            tipo_explotacion: arrendamiento.tipo_explotacion || null, // También puede ser null si está permitido
        }));
        // Guardar los arrendamientos en la base de datos
        if (arrendamientosData.length > 0) {
            await prisma.arrendamiento.createMany({
            data: arrendamientosData,
            });
        }
        const oficinasData = oficinasParsed.map((oficina: any) => ({
            operador_id: operator.id,
            departamento_id: oficina.departamento_id ? parseInt(oficina.departamento_id, 10) : null,
            municipio_id: oficina.municipio_id ? parseInt(oficina.municipio_id, 10) : 1, // Valor por defecto si es obligatorio
            tipo: oficina.tipo || null,
            direccion: oficina.direccion || null,
            latitud: oficina.latitud || null,
            longitud: oficina.longitud || null,
        }));
        if (oficinasData.length > 0) {
            await prisma.oficinaOperator.createMany({
            data: oficinasData,
            });
        }
        res.status(200).json(convertBigIntToString({
            operador: operator,
            arrendamientos:arrendamientosData,
            oficinas: oficinasData
          }));
    } catch (error: any) {
      if (error?.code === 'P2002' && error?.meta?.target?.includes('razon_social')) {
        res.status(400).json({ message: 'La razón social ingresada ya existe' });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, por favor intente más tarde' });
      }
    }
  });
};
export const getAllOperators = async (req: Request, res: Response): Promise<void> => {
    try {
        const operators = await prisma.operator.findMany({
            include: {
                arrendamientos: true,
                oficinas:true,
            }
        });
        res.status(200).json(convertBigIntToString(operators));
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getAllOperatorsSimple = async (req: Request, res: Response): Promise<void> => {
    try {
        const operators = await prisma.operator.findMany({
            select: {
                id: true,
                razon_social: true
            }
        })
        res.status(200).json(convertBigIntToString(operators));
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}
export const getOperatorById= async (req: Request, res: Response): Promise<void> => {
    const operatorId = parseInt(req.params.id)
    try {
        const operator = await prisma.operator.findUnique({
            where: {
                id: operatorId
            },
            include: {
                arrendamientos: true,
                oficinas:true,
            }
        })
        if (!operator) {
            res.status(404).json({ error: 'El operador minero no fue encontrado' })
            return
        }
        res.status(200).json(convertBigIntToString(operator));
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

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
        const operador = await prisma.operator.findUnique({
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
        //res.status(200).json(operador);
        res.status(200).json(convertBigIntToString(operador));

    } catch (error: any) {
        // Si hay un error inesperado, respondemos con un error 500
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const updateOperators: RequestHandler<{ id: string }, any, any, any, MulterFileRequest> = async (req, res): Promise<void> => {
    storeUpdate(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: `Error de Multer: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ message: `Error al cargar los archivos: ${err.message}` });
        }  
      try {
        const { id } = req.params;
      const existingOperator = await prisma.operator.findUnique({
        where: { id: parseInt(id, 10) },
        select: { razon_social: true } // Solo traemos la razón social
      });

      if (!existingOperator) {
        return res.status(404).json({ message: 'Operador no encontrado' });
      }
          const {
          razon_social,
          act_ben_concentracion, act_comer_externa, act_comer_interna, act_exploracion,
          act_explotacion, act_fundicion, act_tostacion, act_calcinacion, act_industrializacion,
          act_refinacion, act_tras_colas, dl_departamento_id, dl_direccion, dl_municipio_id,
          doc_creacion, fecha_exp_nim, fecha_exp_seprec, nro_matricula_seprec, nro_nim,
          nro_personeria, nro_res_ministerial, nro_ruex, fecha_exp_ruex, correo_inst, ofi_lat,
          ofi_lon, fax_op_min, tel_fijo, celular, otro_celular, tipo_doc_creacion, tipo_operador,
          verif_cert_liberacion, nit, tipo_nim_niar, estado, verificacion_toma_muestra,
          comercio_interno_coperativa, traslado_colas, transbordo, rep_nombre_completo,
          rep_ci, rep_departamento_id, rep_municipio_id, rep_direccion, rep_telefono,
          rep_celular, rep_correo, observaciones
        } = req.body;
        const finalRazonSocial = razon_social || existingOperator.razon_social;
         const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const filePaths: any = {};
    const updateData: any = {};

    // Si hay archivos nuevos, actualizar sus rutas
    const fileFields = [
      'nit_link', 'nim_link', 'seprec_link', 'doc_explotacion_link', 'ruex_link',
      'resolucion_min_fundind_link', 'personeria_juridica_link', 'doc_creacion_estatal_link', 'ci_link'
    ];

    fileFields.forEach(field => {
      if (files?.[field]?.[0]?.path) {
        filePaths[field] = files[field][0].path;
      }
    });
  
        // Asignación de valores solo si están presentes
        if (razon_social) updateData.razon_social = razon_social;
        if (act_ben_concentracion) updateData.act_ben_concentracion = act_ben_concentracion;
        if (act_comer_externa) updateData.act_comer_externa = act_comer_externa;
        if (act_comer_interna) updateData.act_comer_interna = act_comer_interna;
        if (act_exploracion) updateData.act_exploracion = act_exploracion;
        if (act_explotacion) updateData.act_explotacion = act_explotacion;
        if (act_fundicion) updateData.act_fundicion = act_fundicion;
        if (act_tostacion) updateData.act_tostacion = act_tostacion;
        if (act_calcinacion) updateData.act_calcinacion = act_calcinacion;
        if (act_industrializacion) updateData.act_industrializacion = act_industrializacion;
        if (act_refinacion) updateData.act_refinacion = act_refinacion;
        if (act_tras_colas) updateData.act_tras_colas = act_tras_colas;
        if (dl_departamento_id) updateData.dl_departamento_id = parseInt(dl_departamento_id, 10);
        if (dl_municipio_id) updateData.dl_municipio_id = parseInt(dl_municipio_id, 10);
        if (doc_creacion) updateData.doc_creacion = doc_creacion;
        if (fecha_exp_nim) updateData.fecha_exp_nim = new Date(fecha_exp_nim);
        if (fecha_exp_seprec) updateData.fecha_exp_seprec = new Date(fecha_exp_seprec);
        if (nro_matricula_seprec) updateData.nro_matricula_seprec = nro_matricula_seprec;
        if (nro_nim) updateData.nro_nim = nro_nim;
        if (nro_personeria) updateData.nro_personeria = nro_personeria;
        if (nro_res_ministerial) updateData.nro_res_ministerial = nro_res_ministerial;
        if (nro_ruex) updateData.nro_ruex = nro_ruex;
        if (fecha_exp_ruex) updateData.fecha_exp_ruex = new Date(fecha_exp_ruex);
        if (correo_inst) updateData.correo_inst = correo_inst;
        if (ofi_lat) updateData.ofi_lat = ofi_lat;
        if (ofi_lon) updateData.ofi_lon = ofi_lon;
        if (fax_op_min) updateData.fax_op_min = fax_op_min;
        if (tel_fijo) updateData.tel_fijo = tel_fijo;
        if (celular) updateData.celular = parseInt(celular, 10);
        if (otro_celular) updateData.otro_celular = parseInt(otro_celular, 10);
        if (tipo_doc_creacion) updateData.tipo_doc_creacion = parseInt(tipo_doc_creacion, 10);
        if (tipo_operador) updateData.tipo_operador = parseInt(tipo_operador, 10);
        if (estado) updateData.estado = estado === "INACTIVO" ? "INACTIVO" : "ACTIVO";
        if (verificacion_toma_muestra) updateData.verificacion_toma_muestra = verificacion_toma_muestra;
        if (comercio_interno_coperativa) updateData.comercio_interno_coperativa = comercio_interno_coperativa;
        if (traslado_colas) updateData.traslado_colas = traslado_colas;
        if (transbordo) updateData.transbordo = transbordo;
        if (rep_nombre_completo) updateData.rep_nombre_completo = rep_nombre_completo;
        if (rep_ci) updateData.rep_ci = rep_ci;
        if (rep_departamento_id) updateData.rep_departamento_id = parseInt(rep_departamento_id, 10);
        if (rep_municipio_id) updateData.rep_municipio_id = parseInt(rep_municipio_id, 10);
        if (rep_direccion) updateData.rep_direccion = rep_direccion;
        if (rep_telefono) updateData.rep_telefono = rep_telefono;
        if (rep_celular) updateData.rep_celular = parseInt(rep_celular, 10);
        if (rep_correo) updateData.rep_correo = rep_correo;
        if (observaciones) updateData.observaciones = observaciones;
  
        // Combina los archivos y los valores a actualizar
        const updatedOperator = await prisma.operator.update({
          where: { id: parseInt(id, 10) },
          data: {
            ...updateData,
            ...filePaths,
            updated_at: new Date(),
          },
        });
        res.status(200).json(convertBigIntToString(updatedOperator));
        //res.status(200).json(updatedOperator);
      } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('razon_social')) {
          res.status(400).json({ error: 'La razón social ingresada ya existe' });
        } else if (error?.code === 'P2025') {
          res.status(404).json('Operador minero no encontrado');
        } else {
          console.log(error);
          res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
      }
    });
  };
export const updateOperatorsIdom = async (req: Request, res: Response): Promise<void> => {
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
            tipo_nim_niar,  
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
        
        if (tipo_nim_niar) {
            dataToUpdate.tipo_nim_niar = tipo_nim_niar;
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
        const operator = await prisma.operator.update({
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
        await prisma.operator.delete({
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
