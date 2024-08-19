import { Operator } from './operator.interface';
import { FormIntMineral } from './formintmineral.interface';
import { Decimal } from '@prisma/client/runtime/library';
export interface Formint {
  id: number;
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
  operador: Operator; // Relación con la entidad Operator
}