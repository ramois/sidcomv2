import cron from 'node-cron';
import prisma from '../models/formext'

// Esta tarea se ejecutará cada 15 minutos
cron.schedule('*/15 * * * *', async () => {
    try {
        // Consultar todos los formularios con estado "EMITIDO" que tienen más de 4 días
        const formulariosEmitidos = await prisma.findMany({
            where: {
                estado: 'EMITIDO',
                fecha_creacion: {
                    lt: new Date(new Date().setDate(new Date().getDate() - 4)) // Fecha de 4 días atrás
                }
            }
        });

        // Si encontramos formularios emitidos que deben ser actualizados
        if (formulariosEmitidos.length > 0) {
            // Actualizar todos los formularios "EMITIDOS" a "VENCIDO"
            for (const formulario of formulariosEmitidos) {
                await prisma.update({
                    where: { id: formulario.id },
                    data: { estado: 'VENCIDO' }
                });
            }

            console.log(`Actualizados ${formulariosEmitidos.length} formularios a 'VENCIDO'.`);
        } else {
            console.log('No hay formularios externos emitidos que hayan vencido.');
        }
    } catch (error) {
        console.error('Error al actualizar formularios vencidos:', error);
    }
});
