import { Departamento } from './departamento.interface'
export interface Municipio {
    id: Number;
    municipio: String;
    provincia: String  | null;
    departamento_id: Number;
    codigo: string;
    departamento?: Departamento; // Relación opcional con Departamento
}