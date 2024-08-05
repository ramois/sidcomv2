import { Decimal } from '@prisma/client/runtime/library';
import { SampleMineral } from './samplemineral.interface';
export interface Sample {
  id: number;                        // Identificador único, auto-incremental
  fecha_emision: Date;               // Fecha y hora de emisión
  ubi_geografica: string;            // Ubicación geográfica
  lugar_verificacion: string;        // Lugar de verificación
  id_operador: number;               // Identificador del operador
  responsable: string;              // Responsable de la muestra
  lotes: string;                    // Lotes asociados
  tipo_muestra: number;             // Tipo de muestra (puede ser un ID o enumeración)
  presentacion: number;             // Presentación (puede ser un ID o enumeración)
  sacos: number;                    // Cantidad de sacos
  camiones: number;                 // Cantidad de camiones
  peso_neto: Decimal;               // Peso neto (Decimal para manejar precisión)
  peso_parcial: Decimal;            // Peso parcial (Decimal para manejar precisión)
  id_municipio: number;             // Identificador del municipio
  senerecom: string;               // Información sobre SENARECOM
  tipo_agranel?: number;            // Tipo de agranel (opcional, valor por defecto 0)
  tipo_emsacado?: number;           // Tipo de emsacado (opcional, valor por defecto 0)
  tipo_lingotes?: number;           // Tipo de lingotes (opcional, valor por defecto 0)
  tipo_sal?: number;                // Tipo de sal (opcional, valor por defecto 0)
  tipo_otr?: number;                // Tipo de otro (opcional, valor por defecto 0)
  observaciones?: string;           // Observaciones adicionales (opcional)
  estado: number;                   // Estado (generalmente un valor entero)
  minerales: SampleMineral[];       // Relación con minerales (múltiples registros posibles)
}
