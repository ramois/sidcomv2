import { Request, Response } from "express";
import { prisma } from "../models/prismaClient"; 

export const createMunicipio = async (req: Request, res: Response): Promise<void> => {
    try {
        let { municipio,provincia,departamento_id,codigo} = req.body
        if (!municipio) {
            res.status(400).json({ message: 'El nombre del municipio es obligatorio' })
            return
        }
        if (!departamento_id) {
            res.status(400).json({ message: 'El departamento es obligatorio' })
            return
        }
        if (!codigo) {
            res.status(400).json({ message: 'El codigo es obligatorio' })
            return
        }
        const municipios = await prisma.municipios.create(
            {
                data: {
                    municipio,
                    provincia,
                    departamento_id,
                    codigo
                }
            }
        )
        res.status(201).json(municipios)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('codigo')) {
            res.status(400).json({ message: 'El codigo ingresado ya existe' })
        } else{
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}
export const getAllMunicipios = async (req: Request, res: Response): Promise<void> => {
    try {
        // Obtenemos el parámetro 'departamento_id' de la query string (si existe)
        const departamentoId = req.query.departamento_id ? Number(req.query.departamento_id) : null;

        // Preparamos la consulta de Prisma
        const municipios = await prisma.municipios.findMany({
            where: departamentoId ? { departamento_id: departamentoId } : undefined, // Solo agregamos 'where' si 'departamento_id' está presente
        });

        // Respondemos con los municipios
        res.status(200).json(municipios);
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};
/*export const getAllMunicipios = async (req: Request, res: Response): Promise<void> => {
    try {
        const municipios = await prisma.findMany()
        res.status(200).json(municipios);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}*/

export const getMunicipioById = async (req: Request, res: Response): Promise<void> => {
    const municipioId = parseInt(req.params.id)
    try {
        const municipios = await prisma.municipios.findUnique({
            where: {
                id: municipioId
            }
        })
        if (!municipios) {
            res.status(404).json({ error: 'El municipio no fue encontrado' })
            return
        }
        res.status(200).json(municipios)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
    }
}

export const updateMunicipio = async (req: Request, res: Response): Promise<void> => {
    const municipioId = parseInt(req.params.id)
    const { municipio,provincia,departamento_id,codigo } = req.body
    try {

        let dataToUpdate: any = { ...req.body }
        //dataToUpdate.updated_at = new Date(); // Fecha y hora actual
        if (municipio) {
            dataToUpdate.municipio = municipio
        }
        if (provincia) {
            dataToUpdate.provincia = provincia
        }
        if (departamento_id) {
            dataToUpdate.departamento_id =departamento_id
        }
        if (codigo) {
            dataToUpdate.codigo = codigo
        }   
        const municipios = await prisma.municipios.update({
            where: {
                id: municipioId
            },
            data: dataToUpdate
        })

        res.status(200).json(municipios)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('codigo')) {
            res.status(400).json({ error: 'El codigo ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('municipio no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteMunicipio = async (req: Request, res: Response): Promise<void> => {
    const municipioId = parseInt(req.params.id)
    try {
        await prisma.municipios.delete({
            where: {
                id: municipioId
            }
        })

        res.status(200).json({
            message: `El municipio ${municipioId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Municipio no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}