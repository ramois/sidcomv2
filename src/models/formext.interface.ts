import { Sample } from './sample.interface';
export interface FormExt {
  id: number; 
  id_sample: number;
  m03: string; 
  nro_factura_exportacion: number;
  laboratorio: string; 
  cod_analisis: number; 
  des_comprador: string; 
  des_aduana: string; 
  des_pais: string; 
  tipo_transporte: string; 
  placa: string; 
  nom_conductor: string; 
  licencia: string; 
  observaciones?: string;
  // Relación con Sample
  sample?: Sample; 
}