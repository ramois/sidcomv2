import { Request, Response } from "express";
import prisma from '../models/formint'
import { Decimal } from "@prisma/client/runtime/library";
/*export const createForms = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            user_id,
            operador_id,
            nro_formulario,
            lote,
            presentacion,
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
            nro_viajes
        } = req.body;
        //let user_id = req.user_id;  
        // Validar campos obligatorios
        if (operador_id === undefined || operador_id === null) {
            res.status(400).json({ message: 'El id_operador es obligatorio' });
            return;
        }
        const newForm = await prisma.create({
            data: {
              user_id,
              operador_id,
              nro_formulario,
              lote,
              presentacion,
              cantidad,
              peso_bruto_humedo: new Decimal(peso_bruto_humedo),
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
              municipio_origen: {
                create: municipio_origen.map((municipio: any) => ({
                  municipioId: municipio.id // Aquí se usa un valor válido
                }))
              },
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
              created_at: new Date(),
              updated_at: new Date(),
            },
            include: {
              minerales: true,
              municipio_origen: true, // Incluir también la relación con los municipios
            },
          });
        res.status(201).json(newForm);
    }/*catch (error: any) {
        console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        } 
    catch (error: any) {
        console.error(error);
        if (error.code === 'P2025' && error.code === 'P2003') {
            res.status(404).json({ error: 'Uno o más minerales y uno o más municipios no existen en la base de datos.' });
         } else
        if (error.code === 'P2025') {
           res.status(404).json({ error: 'Uno o más minerales no existen en la base de datos.' });
        }else if (error.code === 'P2003') {
           res.status(404).json({ error: 'Uno o más municipios no existen en la base de datos.' });
          }else {
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};*/


// Función para generar el número de formulario con transacción
const generateFormNumber = async (): Promise<string> => {
    const currentYear = new Date().getFullYear().toString(); // Obtener el año actual como string

    // Buscar todos los formularios con los prefijos 'G-', 'I-', 'A-' para el año actual
    const forms = await prisma.findMany({
        where: {
            nro_formulario: {
                contains: currentYear, // Buscar formularios que contienen el año
            },
        },
        orderBy: {
            nro_formulario: 'desc', // Ordenamos los formularios por el número de formulario de forma descendente
        },
    });

    // Verificar los formularios recuperados
    console.log('Formularios recuperados: ', forms); // Verificar qué estamos recuperando

    // Si no se encuentran formularios, comenzamos con el número 1
    if (forms.length === 0) {
        return `G-1/${currentYear}`;
    }

    // Variable para el mayor número de formulario encontrado
    let maxNumber = 0;

    // Recorrer todos los formularios para encontrar el mayor número
    forms.forEach(form => {
        // Extraemos el número después del prefijo (e.g., G-56/2024 -> 56)
        const numberPart = form.nro_formulario.split('-')[1].split('/')[0];

        const formNumber = parseInt(numberPart, 10);
        if (!isNaN(formNumber)) {
            maxNumber = Math.max(maxNumber, formNumber); // Encontramos el mayor número
        }
    });

    // Calculamos el siguiente número
    const nextNumber = maxNumber + 1;

    // Devolvemos el nuevo número de formulario con el prefijo 'G-' (puedes usar cualquier prefijo según lo necesites)
    return `G-${nextNumber}/${currentYear}`;
};
export const createForms = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {
            operador_id,
            lote,
            presentacion,
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
            nro_viajes
        } = req.body;

        const user_id = req.body.user_id;

        // Validar que el usuario esté presente en el token
        if (!user_id) {
            return res.status(400).json({ message: 'No se ha encontrado un usuario asociado al token' });
        }

        // Verificar si el operador existe
               // Verificar si el operador existe
         const newNroFormulario = await generateFormNumber();

        // Crear el nuevo formulario con el número generado
        const newForm = await prisma.create({
            data: {
                user: { // Conectamos el usuario
                    connect: { id: user_id }
                },
                operador: { // Conectamos el operador
                    connect: { id: operador_id }
                },
                nro_formulario: newNroFormulario,
                lote,
                presentacion,
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
                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                minerales: true,
                municipio_origen: true,
            },
        });

        return res.status(201).json(newForm);

    } catch (error: any) {
        console.error(error);

        if (error.code === 'P2025' || error.code === 'P2003') {
            return res.status(404).json({ error: 'Uno o más minerales o municipios no existen en la base de datos.' });
        } else if (error.code === 'P2011') {
            return res.status(404).json({ error: 'El operador no es válido' });
        } else {
            return res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

/*export const createForms = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {
            operador_id,
            lote,
            presentacion,
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
            nro_viajes
        } = req.body;

        const user_id = req.body.user_id;
       //const operador_id_from_token = req.body.operador_id;

        if (!user_id) {
            return res.status(400).json({ message: 'No se ha encontrado un usuario asociado al token' });
        }

        // Generamos el número de formulario usando la transacción
        const newNroFormulario = await generateFormNumber();

        // Crear el nuevo formulario con el número generado
        const newForm = await prisma.create({
            data: {
                user: { // Aquí establecemos la relación con el modelo User
                    connect: { id: user_id } // Conectamos el formulario al usuario con el user_id
                },
                operador_id,
                nro_formulario: newNroFormulario, // Usamos el número generado
                lote,
                presentacion,
                cantidad,
                peso_bruto_humedo: new Decimal(peso_bruto_humedo),
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
                municipio_origen: {
                    create: municipio_origen.map((municipio: any) => ({
                        municipioId: municipio.id,
                    })),
                },
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
                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                minerales: true,
                municipio_origen: true,
            },
        });

        return res.status(201).json(newForm);
    }   catch (error: any) {
        console.error(error);
        if (error.code === 'P2025' && error.code === 'P2003') {
           return res.status(404).json({ error: 'Uno o más minerales y uno o más municipios no existen en la base de datos.' });
         } else if (error.code === 'P2025') {
           return res.status(404).json({ error: 'Uno o más minerales no existen en la base de datos.' });
        
        }else if (error.code === 'P2011') {
            return res.status(404).json({ error: 'Operador no existen en la base de datos.' });
           }else if (error.code === 'P2003') {
           return res.status(404).json({ error: 'Uno o más municipios no existen en la base de datos.' });
          }
          else {
            return res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};
*/
export const getAllForms = async (req: Request, res: Response): Promise<void> => {
    try {
        const formint = await prisma.findMany({
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
export const getAllFormReducido = async (req: Request, res: Response): Promise<void> => {
    try {
        const formint = await prisma.findMany({
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
export const getFormById = async (req: Request, res: Response): Promise<void> => {
    const formintId = parseInt(req.params.id)
    try {
        const formint = await prisma.findUnique({
            where: { id: formintId },
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
        id_operador,
        lote,
        presentacion,
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
        // Datos a actualizar en el modelo FormInt
        let dataToUpdate: any = {
            id_operador,
            lote,
            presentacion,
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
        const formint = await prisma.update({
            where: { id: formId },
            data: dataToUpdate,
        });

        // Actualizar la relación de minerales
        if (minerales && Array.isArray(minerales)) {
            // Primero eliminar las relaciones actuales de minerales
            await prisma.update({
                where: { id: formId },
                data: {
                    minerales: {
                        deleteMany: {}, // Eliminar todas las relaciones actuales de minerales
                    },
                },
            });

            // Luego agregar las relaciones actualizadas
            await prisma.update({
                where: { id: formId },
                data: {
                    minerales: {
                        createMany: {
                            data: minerales.map((mineral: any) => ({
                                mineralId: mineral.mineralId, // Usar mineralId en lugar de mineral
                                ley: mineral.ley,
                                unidad: mineral.unidad,
                            })),
                        },
                    },
                },
            });
        // Actualizar la relación con los municipios de origen
        if (municipio_origen && Array.isArray(municipio_origen)) {
            // Primero eliminar las relaciones actuales de municipios de origen
            await prisma.update({
                where: { id: formId },
                data: {
                    municipio_origen: {
                        deleteMany: {}, // Eliminar todas las relaciones actuales de municipios de origen
                    },
                },
            });

            // Luego agregar las relaciones actualizadas
            await prisma.update({
                where: { id: formId },
                data: {
                    municipio_origen: {
                        create: municipio_origen.map((municipio: any) => ({
                            municipioId: municipio.id, // Relacionamos el municipio por su ID
                        })),
                    },
                },
            });
        }
        // Recuperar el formulario actualizado junto con los minerales y municipios de origen
        const updatedForm = await prisma.findUnique({
            where: { id: formId },
            include: {
                minerales: true,            // Incluir los minerales actualizados
                municipio_origen: true,     // Incluir los municipios de origen actualizados
            },
        });
        // Respondemos con el formulario actualizado
        res.status(200).json(updatedForm);

    } }catch (error: any) {
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
/*export const updateFormsAnulacion = async (req: Request, res: Response): Promise<void> => {
    const formId = parseInt(req.params.id);
    const {
                justificacion_anulacion,
// Municipio origen también actualizado
    } = req.body;

    try {
        // Datos a actualizar en el modelo FormInt
        let dataToUpdate: any = {
            //estado,
            justificacion_anulacion,
            updated_at: new Date(), // Actualización de la fecha
        };

        // Actualizamos el formulario principal
        const formint = await prisma.update({
            where: { id: formId },
            data: dataToUpdate,
        });

        // Respondemos con el formulario actualizado
        res.status(200).json("actualizado");

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
};*/
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
        const existingForm = await prisma.findUnique({
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
        const formInt = await prisma.update({ // Aquí es donde se hace el cambio
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



/*const generateFormNumbers = async (estado: string): Promise<string> => {
    const currentYear = new Date().getFullYear().toString(); // Obtener el año actual como string

    // Determinamos el prefijo en base al estado
    const prefix = estado === "EMITIDO" ? "I-" : "G-"; // Usamos "I-" si el estado es EMITIDO, "G-" si es otro estado

    // Buscar todos los formularios con el prefijo correspondiente ('G-' o 'I-') para el año actual
    const forms = await prisma.findMany({
        where: {
            nro_formulario: {
                startsWith: prefix, // Filtramos por el prefijo (G- o I-)
                contains: currentYear, // Aseguramos que el año también esté presente
            },
        },
        orderBy: {
            nro_formulario: 'desc', // Ordenamos por el número de formulario de forma descendente
        },
    });

    // Si no se encuentran formularios, comenzamos con el número 1
    if (forms.length === 0) {
        return `${prefix}1/${currentYear}`;
    }

    // Variable para el mayor número de formulario encontrado
    let maxNumber = 0;

    // Recorrer todos los formularios para encontrar el mayor número
    forms.forEach(form => {
        // Extraemos el número después del prefijo (e.g., G-56/2024 -> 56)
        const numberPart = form.nro_formulario.split('-')[1].split('/')[0];
        const formNumber = parseInt(numberPart, 10);
        if (!isNaN(formNumber)) {
            maxNumber = Math.max(maxNumber, formNumber); // Encontramos el mayor número
        }
    });

    // Calculamos el siguiente número
    const nextNumber = maxNumber + 1;

    // Devolvemos el nuevo número de formulario con el prefijo adecuado
    return `${prefix}${nextNumber}/${currentYear}`;
};*/
/*const generateFormNumbers = async (estado: string): Promise<string> => {
    const currentYear = new Date().getFullYear().toString(); // Obtener el año actual como string

    // Determinamos el prefijo en base al estado
    const prefix = estado === "EMITIDO" ? "I-" : "G-"; // Usamos "I-" si el estado es EMITIDO, "G-" si es otro estado

    // Buscar todos los formularios con el prefijo correspondiente ('G-' o 'I-') para el año actual
    const forms = await prisma.findMany({
        where: {
            nro_formulario: {
                startsWith: prefix, // Filtramos por el prefijo (G- o I-)
                contains: currentYear, // Aseguramos que el año también esté presente
            },
        },
    });

    // Contamos cuántos formularios existen con el prefijo y año
    const formCount = forms.length;

    // Si no se encuentran formularios, comenzamos con el número 1
    if (formCount === 0) {
        return `${prefix}1/${currentYear}`;
    }

    // El siguiente número será el siguiente en la secuencia
    const nextNumber = formCount + 1;

    // Devolvemos el nuevo número de formulario con el prefijo adecuado
    return `${prefix}${nextNumber}/${currentYear}`;
};*/
const generateFormNumbers = async (estado: string): Promise<string> => {
    const currentYear = new Date().getFullYear().toString(); // Obtener el año actual como string

    // Determinamos el prefijo en base al estado
    const prefix = estado === "EMITIDO" ? "I-" : "G-"; // Usamos "I-" si el estado es EMITIDO, "G-" si es otro estado

    // Buscar todos los formularios con el prefijo correspondiente ('G-' o 'I-') para el año actual
    const forms = await prisma.findMany({
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
};
/*export const updateForms = async (req: Request, res: Response): Promise<void> => {
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
*/
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