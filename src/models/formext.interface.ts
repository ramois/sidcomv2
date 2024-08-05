import { Sample } from './sample.interface';
export interface FormExt {
  id: number; // Identificador único de FormExt
  id_sample: number; // Referencia al id de Sample
  m03: string; // Información adicional del tipo de muestra
  nro_factura_exportacion: number; // Número de factura de exportación
  laboratorio: string; // Nombre del laboratorio
  cod_analisis: number; // Código de análisis
  des_comprador: string; // Descripción del comprador
  des_aduana: string; // Descripción de la aduana
  des_pais: string; // Descripción del país
  tipo_transporte: string; // Tipo de transporte
  placa: string; // Placa del vehículo
  nom_conductor: string; // Nombre del conductor
  licencia: string; // Licencia del conductor
  observaciones?: string; // Observaciones adicionales (opcional)
  // Relación con Sample
  sample?: Sample; // Relación opcional con Sample
}