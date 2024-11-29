import { Operator } from './operator.interface';
import { User } from './user.interface';
import { FormIntMineral } from './formintmineral.interface';
import { FormIntMunicipio } from './formintmunicipio.interface';
import { Decimal } from '@prisma/client/runtime/library';
export interface Formint {
  id: number;
  user_id: number;
  operador_id: number;
  nro_formulario: string;
  lote: string;
  presentacion: number;
  cantidad?: number;
  peso_bruto_humedo: Decimal;
  peso_neto: Decimal; // Asegúrate de importar y usar la clase Decimal de la biblioteca adecuada
  tara?: number;
  humedad?: number;
  merma?: number;
  municipio_origen: FormIntMunicipio[];
  minerales: FormIntMineral[];
  des_tipo: string;
  des_comprador?: string;
  des_planta?: string;
  id_municipio_destino: number;
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
  estado: String;
  tara_volqueta?: Decimal;
  traslado_mineral?: String;
  nro_viajes?: number;
  created_at: Date;
  updated_at: Date;
  operador: Operator; // Relación con la entidad Operator
  user: User; //relacion con la entidad user
}
  /*id: number;
  id_operador: number;
  lotes: string;
  presentacion: number;
  cantidad?: number;
  peso_neto: Decimal; // Asegúrate de importar y usar la clase Decimal de la biblioteca adecuada
  tara?: number;
  humedad?: number;
  merma?: number;
  minerales: FormIntMineral[];
  id_municipio_origen: string;
  des_tipo: number;
  des_comprador?: string;
  des_planta?: string;
  id_municipio_destino: string;
  tipo_transporte: string;
  placa: string;
  nom_conductor: string;
  licencia: string;
  nro_viajes?: number;
  observaciones?: string;
  operador: Operator; // Relación con la entidad Operator*/