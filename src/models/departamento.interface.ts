import { Decimal } from '@prisma/client/runtime/library';
export interface Departamento {
    id: Number;
    nombre: String;
    latitud: Decimal;
    longitud: Decimal;
  }