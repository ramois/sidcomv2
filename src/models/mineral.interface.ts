import { SampleMineral } from './samplemineral.interface';
 export interface Mineral {
    id: number;                // Identificador único, auto-incremental
    nombre: string;            // Nombre del mineral
    sigla: string;             // Sigla del mineral
    descripcion: string;      // Descripción del mineral
    estado: number;           // Estado del mineral (generalmente un valor entero)
    muestra: SampleMineral[]; // Relación con SampleMineral (múltiples registros posibles)
  }