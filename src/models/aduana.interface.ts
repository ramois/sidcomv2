import { Decimal } from "@prisma/client/runtime/library";
export interface Aduana {
    id: number;
    nombre: string;
    codigo_aduana: string;
    longitud: Decimal;
    latitud: Decimal;
    estado: string;
}