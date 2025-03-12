import { Operator } from './operator.interface';
import { User } from './user.interface';
import { Presentacion } from './presentacion.interface';
import { FormExtMineral } from './formextmineral.interface';
import { FormExtMunicipio } from './formextmunicipio.interface';
import { Decimal } from '@prisma/client/runtime/library';
import { Pais } from './pais.interface';
export interface Formint {
  id: number;
  user_id: number;
  operador_id: number;
  nro_formulario: string;
  m03_id: string;
  nro_factura_exportacion: string;
  laboratorio: string;
  codigo_analisis: string;
  nro_formulario_tm: string;
  lote: string;
  presentacion_id: number;
  cantidad?: number;
  peso_bruto_humedo: Decimal;
  peso_neto: Decimal; // Asegúrate de importar y usar la clase Decimal de la biblioteca adecuada
  tara?: number;
  humedad?: number;
  merma?: number;
  municipio_origen: FormExtMunicipio[];
  minerales: FormExtMineral[];
  comprador: string;
  aduana_id: number;
  pais_destino_id: number;
  tipo_transporte: string;
  placa: string;
  nom_conductor: string;
  licencia: string;
  observaciones?: string;
  fecha_creacion?: Date;
  fecha_vencimiento?: Date;
  justificacion_anulacion?: String;
  nro_vagon?: String;
  empresa_ferrea?: String;
  fecha_ferrea?: Date;
  hr_ferrea?: String;
  tara_volqueta?: Decimal;
  estado: String;
  hash: String;
  created_at: Date;
  updated_at: Date;
  presentacion: Presentacion;
  pais: Pais;
  operador: Operator; // Relación con la entidad Operator
  user: User; //relacion con la entidad user
}