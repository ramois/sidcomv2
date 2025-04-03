import cron from 'node-cron';
import { prisma } from "../models/prismaClient"; 
// Esta tarea se ejecutará cada 15 minutos
cron.schedule('*/15 * * * *', async () => {
    try {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 4); // Fecha de 4 días atrás

        // Actualizar en una sola consulta todos los formularios "EMITIDO" a "VENCIDO"
        const resultado = await prisma.formCola.updateMany({
            where: {
                estado: 'EMITIDO',
                fecha_creacion: { lt: fechaLimite }
            },
            data: { estado: 'VENCIDO' }
        });

        if (resultado.count > 0) {
            console.log(`✅ ${resultado.count} Formularios de Cola han sido actualizados a 'VENCIDO'.`);
        } else {
            console.log('✅ No hay Formularios de Cola emitidos que hayan vencido.');
        }
    } catch (error) {
        console.error('❌ Error al actualizar Formularios de Cola vencidos:', error);
    }
});
