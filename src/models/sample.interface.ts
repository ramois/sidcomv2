import { Operator } from './operator.interface';
import { SenarecomTM } from './senarecomtm.interface';
import { ResponsableTM } from './responsabletm.interface';
import { Municipio } from './municipio.interface';
import { User } from './user.interface';
import { SampleMineral } from './samplemineral.interface';
import { SampleMunicipio } from './samplemunicipio.interface';
import { SampleProcedimientoMuestra} from './sampleprocedimientomuestra.interface';
import { Decimal } from '@prisma/client/runtime/library';
import { Presentacion } from './presentacion.interface';
export interface Sample {
  id: number;
  user_id: number;
  operador_id: number;
  responsable_tdm_id?: number;
  responsable_tdm_senarecom_id?: number;
  responsable_tdm_gador_id?: User;
  nro_formulario: string;
  lugar_verificacion: string;
  ubicacion_lat: string;
  ubicacion_lon: string;
  departamento_id?: number;
  municipio_id: Municipio;
  lote: string;
  tipo_muestra: string;
  cantidad?: number;
  nro_camiones?: number;
  total_parcial?: Decimal;
  peso_neto_total: Decimal;
  peso_neto_parcial?: Decimal;
  observaciones?: string;
  hash: string;
  fecha_hora_tdm: Date;
  created_at: Date;
  updated_at: Date;
  fecha_aprobacion?: Date;
  fecha_firma?: Date;
  justificacion_anulacion?: string;
  humedad?: Decimal;
  foto_link?: string;
  operador: Operator;
  user: User;
  senarecomTM: SenarecomTM;
  responsableTM: ResponsableTM;
  presentacionTM: Presentacion;
  minerales: SampleMineral[];
  municipio_origen: SampleMunicipio[];
  procedimiento: SampleProcedimientoMuestra[];
}
  /*id: number;                        // Identificador único, auto-incremental
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
  municipio_origen: SampleMunicipio[];       // Relación con minerales (múltiples registros posibles)
  procedimiento: SampleProcedimientoMuestra[];       // Relación con minerales (múltiples registros posibles)
}*/
